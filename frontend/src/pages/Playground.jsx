import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TimelineCard from '../components/TimelineCard';
import ThreeScene from '../components/ThreeScene';
import socket from '../api/socketClient';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function Playground() {
  const [timelines, setTimelines] = useState([]);
  const [localTimelines, setLocalTimelines] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pl_local_timelines') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    axios.get(`${API}/timelines/`).then(r => setTimelines(r.data)).catch(() => setTimelines([]));
    socket.on('timeline-spawned', (data) => {
      setTimelines(prev => [data, ...prev]);
    });
    socket.on('timeline-updated', (data) => {
      setTimelines(prev => [data, ...prev.filter(t => t.id !== data.id)]);
    });
    return () => {
      socket.off('timeline-spawned');
      socket.off('timeline-updated');
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('pl_local_timelines', JSON.stringify(localTimelines));
  }, [localTimelines]);

  function spawnLocal(t) {
    setLocalTimelines(prev => [t, ...prev]);
  }

  function broadcastSpawn(t) {
    socket.emit('spawn-timeline', t);
  }

  // Combine and deduplicate timelines by ID
  const combined = [...localTimelines, ...timelines]
    .filter((timeline, index, arr) => 
      arr.findIndex(t => t.id === timeline.id) === index
    )
    .slice(0, 20);

  return (
    <div>
      <h2>Playground — Parallel Timelines</h2>
      <p className="small">Timelines below include both shared timelines and your local spawns. Click Visit to jump in.</p>

      <ThreeScene timelines={combined} />

      <h3 style={{marginTop:16}}>Timelines</h3>
      <div className="timeline-grid">
        {combined.map(t => (
          <TimelineCard key={t.id} timeline={t} onSpawnLocal={(tl) => { spawnLocal(tl); broadcastSpawn(tl); }}/>
        ))}
      </div>
    </div>
  );
}
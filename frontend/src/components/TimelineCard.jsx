import React from 'react';
import { Link } from 'react-router-dom';

export default function TimelineCard({ timeline, onSpawnLocal }) {
  const { id, name, owner, simulated } = timeline;
  return (
    <div className="timeline-card">
      <h3>{name}</h3>
      <div className="small">owner: {owner}</div>
      <div style={{marginTop:8}}>
        <div>multiplier: <strong>{simulated?.multiplier ?? '—'}</strong></div>
        <div className="small">emotional: {(simulated?.emotional ?? 0).toFixed(2)}</div>
      </div>

      <div className="controls">
        <Link to={`/visit/${id}`}><button>Visit</button></Link>
        <button onClick={() => onSpawnLocal(timeline)}>Spawn Locally</button>
      </div>
    </div>
  );
}
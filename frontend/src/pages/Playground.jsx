import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TimelineCard from '../components/TimelineCard';
import CharacterMascot from '../components/CharacterMascot';
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
    <div style={{background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)', minHeight: '100vh', padding: 20}}>
      <div style={{maxWidth: 1200, margin: '0 auto'}}>
        
        {/* Header Section */}
        <div style={{textAlign: 'center', marginBottom: 30, background: '#F5DEB3', border: '4px solid #8B4513', borderRadius: 20, padding: 30, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
          <h1 style={{fontSize: '3em', margin: 0, color: '#654321'}}>
            🌟 Timeline Playground 🌟
          </h1>
          <p style={{fontSize: '1.3em', color: '#654321', margin: '15px 0 20px 0'}}>
            Welcome to your magical world of parallel futures! Watch as your choices come to life in 3D!
          </p>
          
          {/* Stats Bar */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginTop: 20}}>
            <div style={{background: '#A0522D', border: '2px solid #8B4513', color: 'white', padding: '15px', borderRadius: 15, textAlign: 'center'}}>
              <div style={{fontSize: '2em', fontWeight: 'bold'}}>{combined.length}</div>
              <div style={{fontSize: '0.9em'}}>🎬 Total Adventures</div>
            </div>
            <div style={{background: '#DAA520', border: '2px solid #B8860B', color: 'white', padding: '15px', borderRadius: 15, textAlign: 'center'}}>
              <div style={{fontSize: '2em', fontWeight: 'bold'}}>{localTimelines.length}</div>
              <div style={{fontSize: '0.9em'}}>🏠 Your Stories</div>
            </div>
            <div style={{background: '#CD853F', border: '2px solid #A0522D', color: 'white', padding: '15px', borderRadius: 15, textAlign: 'center'}}>
              <div style={{fontSize: '2em', fontWeight: 'bold'}}>{timelines.length}</div>
              <div style={{fontSize: '0.9em'}}>👫 Shared Stories</div>
            </div>
            <div style={{background: '#D2691E', border: '2px solid #A0522D', color: 'white', padding: '15px', borderRadius: 15, textAlign: 'center'}}>
              <div style={{fontSize: '2em', fontWeight: 'bold'}}>
                {combined.length > 0 ? Math.round(combined.reduce((sum, t) => sum + (t.simulated?.multiplier || 1), 0) / combined.length * 10) / 10 : 0}
              </div>
              <div style={{fontSize: '0.9em'}}>⭐ Average Success</div>
            </div>
          </div>
        </div>

        {/* Character Showcase Section */}
        <div style={{background: '#F5DEB3', border: '4px solid #8B4513', borderRadius: 20, padding: 25, marginBottom: 25, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
          <div style={{textAlign: 'center', marginBottom: 20}}>
            <h2 style={{fontSize: '2em', margin: 0, color: '#654321'}}>
              🎭 Your Timeline Adventure Gallery
            </h2>
            <p style={{fontSize: '1.1em', color: '#654321', margin: '10px 0'}}>
              Watch your timelines come alive! Our magical friend shows you how awesome your choices are! ✨
            </p>
          </div>
          
          {combined.length > 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)',
              borderRadius: 15,
              padding: 30,
              minHeight: 300,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Floating background elements */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.2) 0%, transparent 50%)
                `,
                animation: 'float 6s ease-in-out infinite'
              }} />

              {/* Timeline Success Visualization */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: 15,
                marginBottom: 20,
                position: 'relative',
                zIndex: 2
              }}>
                {combined.slice(0, 8).map((timeline, i) => {
                  const success = timeline.simulated?.multiplier ?? 1;
                  const height = Math.max(40, Math.min(120, success * 40));
                  const getSuccessEmoji = (mult) => {
                    if (mult >= 2.5) return '🌟';
                    if (mult >= 2.0) return '🎉';
                    if (mult >= 1.5) return '😊';
                    if (mult >= 1.0) return '😐';
                    return '💪';
                  };
                  
                  return (
                    <div key={timeline.id} style={{textAlign: 'center'}}>
                      <div style={{
                        height: `${height}px`,
                        width: '60px',
                        background: `linear-gradient(to top, 
                          ${success >= 2.5 ? '#4caf50' : 
                            success >= 2.0 ? '#8bc34a' : 
                            success >= 1.5 ? '#ffc107' : 
                            success >= 1.0 ? '#ff9800' : '#f44336'}, 
                          ${success >= 2.5 ? '#81c784' : 
                            success >= 2.0 ? '#aed581' : 
                            success >= 1.5 ? '#ffeb3b' : 
                            success >= 1.0 ? '#ffb74d' : '#ef5350'})`,
                        borderRadius: '30px 30px 8px 8px',
                        margin: '0 auto 8px auto',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingTop: '8px',
                        fontSize: '20px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        animation: `bounce 2s ease-in-out infinite ${i * 0.2}s`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {getSuccessEmoji(success)}
                        {/* Sparkle effect for high success */}
                        {success >= 2.0 && (
                          <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                            animation: 'shimmer 2s infinite'
                          }} />
                        )}
                      </div>
                      <div style={{
                        color: 'white', 
                        fontSize: '10px', 
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                      }}>
                        {timeline.name.substring(0, 8)}...
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary message */}
              <div style={{
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                zIndex: 2
              }}>
                <h3 style={{margin: '20px 0 10px 0', fontSize: '1.5em', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
                  {combined.filter(t => (t.simulated?.multiplier ?? 1) >= 2.0).length > combined.length / 2 
                    ? '🎉 Wow! You\'re making amazing choices!' 
                    : combined.filter(t => (t.simulated?.multiplier ?? 1) >= 1.5).length > 0
                    ? '😊 Great job! Keep exploring different choices!'
                    : '💪 Every choice is a learning adventure!'}
                </h3>
                <p style={{margin: 0, fontSize: '1.1em', opacity: 0.9}}>
                  You have {combined.length} timeline adventures! Each one shows what happens with different choices.
                </p>
              </div>

              {/* Add CSS for animations */}
              <style>
                {`
                  @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                  }
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}
              </style>
            </div>
          ) : (
            <div style={{
              textAlign: 'center', 
              padding: 60, 
              background: '#F5DEB3',
              border: '4px solid #8B4513', 
              borderRadius: 15, 
              color: '#654321'
            }}>
              <div style={{fontSize: '5em', marginBottom: 20}}>🎭</div>
              <h3 style={{margin: '0 0 15px 0', fontSize: '1.8em', color: '#654321'}}>Your Adventure Gallery is Empty!</h3>
              <p style={{margin: '0 0 25px 0', fontSize: '1.2em', color: '#8B4513'}}>
                Create your first timeline and watch the magic happen!
              </p>
            </div>
          )}
        </div>

        {/* Timeline Cards Section */}
        <div style={{background: '#F5DEB3', border: '4px solid #8B4513', borderRadius: 20, padding: 25, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
          <div style={{textAlign: 'center', marginBottom: 25}}>
            <h2 style={{fontSize: '2em', margin: 0, color: '#654321'}}>
              🎭 Your Timeline Adventures
            </h2>
            <p style={{fontSize: '1.1em', color: '#654321', margin: '10px 0 20px 0'}}>
              Click on any timeline to visit that parallel world and see what happened!
            </p>
            
            {/* Filter/Sort Options */}
            <div style={{display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap'}}>
              <button style={{background: '#8B4513', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 25, cursor: 'pointer'}}>
                🌟 All Stories
              </button>
              <button style={{background: '#F5DEB3', color: '#654321', border: '2px solid #8B4513', padding: '10px 20px', borderRadius: 25, cursor: 'pointer'}}>
                🏠 My Stories
              </button>
              <button style={{background: '#F5DEB3', color: '#654321', border: '2px solid #8B4513', padding: '10px 20px', borderRadius: 25, cursor: 'pointer'}}>
                👫 Friends' Stories
              </button>
            </div>
          </div>

          {combined.length > 0 ? (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20}}>
              {combined.map(t => (
                <div key={t.id} style={{transform: 'translateY(0)', transition: 'all 0.3s'}}>
                  <TimelineCard timeline={t} onSpawnLocal={(tl) => { spawnLocal(tl); broadcastSpawn(tl); }}/>
                </div>
              ))}
            </div>
          ) : (
            <div style={{textAlign: 'center', padding: 60, background: '#F5DEB3', border: '4px solid #8B4513', borderRadius: 15, color: '#654321'}}>
              <div style={{fontSize: '5em', marginBottom: 20}}>🎬</div>
              <h3 style={{margin: '0 0 15px 0', fontSize: '1.8em', color: '#654321'}}>Ready to Start Your Adventure?</h3>
              <p style={{margin: '0 0 25px 0', fontSize: '1.2em', color: '#8B4513'}}>
                Create your first timeline and watch your choices come to life!
              </p>
              <button 
                onClick={() => window.location.href = '/editor'}
                style={{
                  background: 'linear-gradient(45deg, #DAA520, #B8860B)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: 25,
                  fontSize: '1.2em',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                }}
              >
                🚀 Create My First Timeline!
              </button>
            </div>
          )}
        </div>

        {/* Fun Tips Section */}
        {combined.length > 0 && (
          <div style={{background: 'linear-gradient(45deg, #DAA520, #B8860B)', color: 'white', borderRadius: 20, padding: 25, marginTop: 25, textAlign: 'center'}}>
            <h3 style={{margin: '0 0 15px 0', fontSize: '1.5em'}}>🎭 Pro Tips for Timeline Explorers!</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20}}>
              <div>
                <div style={{fontSize: '2em', marginBottom: 8}}>🎯</div>
                <strong>Try Different Choices</strong><br/>
                <span style={{fontSize: '0.9em', opacity: 0.9}}>Compare timelines with different decisions!</span>
              </div>
              <div>
                <div style={{fontSize: '2em', marginBottom: 8}}>👫</div>
                <strong>Share with Friends</strong><br/>
                <span style={{fontSize: '0.9em', opacity: 0.9}}>Click "Spawn Locally" to copy cool timelines!</span>
              </div>
              <div>
                <div style={{fontSize: '2em', marginBottom: 8}}>🔍</div>
                <strong>Explore Details</strong><br/>
                <span style={{fontSize: '0.9em', opacity: 0.9}}>Visit timelines to see what the AI thinks!</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Character Mascot */}
      <CharacterMascot 
        action={combined.length === 0 ? 'encouraging' : combined.length > 3 ? 'celebrating' : 'waving'}
        position="bottom-right"
        message={
          combined.length === 0 ? "Hi there! Ready to create your first timeline adventure? 🚀" :
          combined.length > 3 ? "Wow! You're creating so many amazing timelines! 🎉" :
          "Looking great! Keep exploring different choices! ✨"
        }
        duration={4000}
      />
    </div>
  );
}
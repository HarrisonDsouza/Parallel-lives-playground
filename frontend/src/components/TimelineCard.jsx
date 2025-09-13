import React from 'react';
import { Link } from 'react-router-dom';

export default function TimelineCard({ timeline, onSpawnLocal }) {
  const { id, name, owner, simulated } = timeline;
  
  // Convert multiplier to kid-friendly success level
  const getSuccessEmoji = (mult) => {
    if (mult >= 2.5) return '🌟';
    if (mult >= 2.0) return '🎉';
    if (mult >= 1.5) return '😊';
    if (mult >= 1.0) return '😐';
    return '💪';
  };
  
  const getSuccessColor = (mult) => {
    if (mult >= 2.5) return '#4caf50';
    if (mult >= 2.0) return '#8bc34a';
    if (mult >= 1.5) return '#ffc107';
    if (mult >= 1.0) return '#ff9800';
    return '#f44336';
  };
  
  const getSuccessText = (mult) => {
    if (mult >= 2.5) return 'Amazing!';
    if (mult >= 2.0) return 'Great!';
    if (mult >= 1.5) return 'Good!';
    if (mult >= 1.0) return 'Okay';
    return 'Learning!';
  };

  const successEmoji = getSuccessEmoji(simulated?.multiplier ?? 1);
  const successColor = getSuccessColor(simulated?.multiplier ?? 1);
  const successText = getSuccessText(simulated?.multiplier ?? 1);
  const happinessLevel = Math.round((simulated?.emotional ?? 0) * 10);
  
  return (
    <div style={{
      background: 'white',
      borderRadius: 15,
      padding: 20,
      boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
      border: `3px solid ${successColor}`,
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0px)';
      e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    }}>
      
      {/* Header with Success Badge */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15}}>
        <div style={{flex: 1}}>
          <h3 style={{margin: '0 0 8px 0', fontSize: '1.2em', color: '#333', lineHeight: 1.3}}>
            🎬 {name}
          </h3>
          <div style={{fontSize: '0.9em', color: '#666'}}>
            👤 {owner}'s Story
          </div>
        </div>
        <div style={{
          background: successColor,
          color: 'white',
          padding: '8px 12px',
          borderRadius: 20,
          fontSize: '0.8em',
          fontWeight: 'bold',
          textAlign: 'center',
          minWidth: 70
        }}>
          {successEmoji}<br/>
          {successText}
        </div>
      </div>

      {/* Progress Indicators */}
      <div style={{marginBottom: 15}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
          <span style={{fontSize: '0.9em', color: '#666'}}>💰 Success Level</span>
          <span style={{fontSize: '0.9em', fontWeight: 'bold', color: successColor}}>
            {Math.round((simulated?.multiplier ?? 1) * 10)}/30
          </span>
        </div>
        <div style={{background: '#e0e0e0', height: 8, borderRadius: 4, overflow: 'hidden'}}>
          <div style={{
            background: successColor,
            height: '100%',
            width: `${Math.min(100, ((simulated?.multiplier ?? 1) / 3) * 100)}%`,
            borderRadius: 4,
            transition: 'width 0.3s'
          }}></div>
        </div>
      </div>

      <div style={{marginBottom: 15}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
          <span style={{fontSize: '0.9em', color: '#666'}}>😊 Happiness</span>
          <span style={{fontSize: '0.9em', fontWeight: 'bold', color: '#ff9800'}}>
            {happinessLevel}/10
          </span>
        </div>
        <div style={{background: '#e0e0e0', height: 8, borderRadius: 4, overflow: 'hidden'}}>
          <div style={{
            background: '#ff9800',
            height: '100%',
            width: `${happinessLevel * 10}%`,
            borderRadius: 4,
            transition: 'width 0.3s'
          }}></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
        <Link to={`/visit/${id}`} style={{textDecoration: 'none'}}>
          <button style={{
            width: '100%',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: 10,
            fontSize: '0.9em',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => {
            e.target.style.background = 'linear-gradient(45deg, #5a6fd8, #6941a0)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            e.target.style.transform = 'translateY(0px)';
          }}>
            🔍 Visit World
          </button>
        </Link>
        
        <button 
          onClick={() => onSpawnLocal(timeline)}
          style={{
            background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: 10,
            fontSize: '0.9em',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => {
            e.target.style.background = 'linear-gradient(45deg, #45b7aa, #3d8b7a)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
            e.target.style.transform = 'translateY(0px)';
          }}>
          ✨ Copy Story
        </button>
      </div>

      {/* Fun Fact */}
      <div style={{
        marginTop: 12,
        padding: 10,
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: 8,
        fontSize: '0.8em',
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        💡 {simulated?.multiplier >= 2.0 ? 'This could buy a car someday!' : 
             simulated?.multiplier >= 1.5 ? 'Great choices for the future!' : 
             'Every choice teaches us something!'}
      </div>
    </div>
  );
}
import { useState } from 'react';
import AnimatedGoose from './AnimatedGoose';

export default function GooseShowcase() {
  const actions = [
    'idle', 'waving', 'celebrating', 'super_celebrating', 'thinking', 
    'working', 'encouraging', 'pointing', 'oops', 'honking', 
    'confused', 'amazed'
  ];

  const [currentAction, setCurrentAction] = useState('idle');

  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        color: 'white',
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '2.5em'
      }}>
        🦆 Meet Gus the Timeline Goose! 🦆
      </h1>

      {/* Goose Display */}
      <div style={{
        background: 'white',
        borderRadius: '50%',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        <AnimatedGoose action={currentAction} size={200} />
      </div>

      {/* Action Info */}
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
          Current Action: <span style={{ color: '#ff6b6b' }}>{currentAction}</span>
        </h2>
        <p style={{ margin: 0, color: '#666' }}>
          {getActionDescription(currentAction)}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        maxWidth: '800px',
        width: '100%'
      }}>
        {actions.map(action => (
          <button
            key={action}
            onClick={() => setCurrentAction(action)}
            style={{
              background: currentAction === action ? '#ff6b6b' : 'white',
              color: currentAction === action ? 'white' : '#333',
              border: '3px solid #ff6b6b',
              borderRadius: '25px',
              padding: '15px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textTransform: 'capitalize'
            }}
          >
            {action.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div style={{
        marginTop: '40px',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '15px',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
          ✨ Animated with Framer Motion & SVG
        </h3>
        <p style={{ margin: 0, color: '#666' }}>
          This is a fully programmatic cartoon character created with React, SVG, and Framer Motion. 
          No static images or emojis - just pure code creating delightful animations for kids!
        </p>
      </div>
    </div>
  );
}

function getActionDescription(action) {
  const descriptions = {
    'idle': 'Gus is peacefully floating and blinking, ready for action!',
    'waving': 'A friendly wing wave to say hello to all the kids!',
    'celebrating': 'Dancing with joy and confetti - success achieved!',
    'super_celebrating': 'Extra energetic celebration with fireworks!',
    'thinking': 'Deep in thought with a question mark bubble.',
    'working': 'Busy wings at work, getting things done!',
    'encouraging': 'Thumbs up to motivate and support the children.',
    'pointing': 'Directing attention to something important.',
    'oops': 'A gentle apology when something goes wrong.',
    'honking': 'Excited goose honking with sound waves!',
    'confused': 'Scratching head with floating question marks.',
    'amazed': 'Mind blown with sparkling stars of wonder!'
  };
  
  return descriptions[action] || 'A delightful goose animation!';
}
import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)',
      minHeight: '100vh',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#F5DEB3',
        border: '4px solid #8B4513',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{
          color: '#654321',
          fontSize: '2.5em',
          marginBottom: '20px'
        }}>
          🟩 Welcome to the Parallel Lives Playground 🟩
        </h2>
        <p style={{
          color: '#654321',
          fontSize: '1.2em',
          lineHeight: '1.6',
          margin: 0
        }}>
          Create timelines, spawn parallel realities, visit your friends' lives, and watch how different choices change outcomes.
        </p>
      </div>
    </div>
  );
}

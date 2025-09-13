import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h2>Welcome to the Parallel Lives Playground</h2>
      <p>Create timelines, spawn parallel realities, visit your friends' lives, and watch how different choices change outcomes.</p>
      <div style={{marginTop:12}}>
        <Link to="/playground"><button>Open Playground</button></Link>
        <Link to="/editor" style={{marginLeft:8}}><button>Create Timeline</button></Link>
      </div>
    </div>
  );
}

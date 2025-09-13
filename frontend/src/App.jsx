import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Parallel Lives Playground</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/playground">Playground</Link> | <Link to="/editor">Create Timeline</Link> | <Link to="/goose">🦆 Goose Showcase</Link>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

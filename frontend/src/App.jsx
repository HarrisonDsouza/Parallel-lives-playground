import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import MinecraftBackground from './components/MinecraftBackground';
import './App.css';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container">
      <MinecraftBackground />

      <header className="app-header">
        {/* Only show big header on homepage */}
        {isHome && <h1 className="app-title">🟩 Parallel Lives Playground 🟩</h1>}

        {/* Navbar */}
        {isHome ? (
          <nav className="app-nav">
            <Link to="/">Home</Link>
            <Link to="/playground">Playground</Link>
            <Link to="/editor">Create Timeline</Link>
            <Link to="/goose">🦆 Goose Showcase</Link>
          </nav>
        ) : (
          <nav className="app-nav-small">
            <Link to="/">Home</Link>
            <Link to="/playground">Playground</Link>
            <Link to="/editor">Create Timeline</Link>
            <Link to="/goose">🦆 Goose Showcase</Link>
          </nav>
        )}
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>© 2025 Parallel Lives Playground | Built with React & Three.js</p>
      </footer>
    </div>
  );
}

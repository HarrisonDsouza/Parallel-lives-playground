import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import MinecraftBackground from './components/MinecraftBackground';
import CharacterMascot from './components/CharacterMascot';
import './App.css';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Smart mascot behavior based on current page with LOTS of variety
  const getMascotBehavior = () => {
    const path = location.pathname;
    const randomBehaviors = ['thinking', 'waving', 'encouraging', 'idle', 'amazed', 'honking'];
    const randomBehavior = randomBehaviors[Math.floor(Math.random() * randomBehaviors.length)];
    
    // Lots of message varieties for each page
    const homeMessages = [
      "Welcome to Parallel Lives! 🎮 Ready for an adventure?",
      "Hey there! 👋 Let's explore some amazing timelines!",
      "Psst! 🤫 Want to see what your future looks like?",
      "Welcome, future explorer! 🚀 What will you discover today?",
      "Hi friend! 😊 Ready to make some big decisions?",
      "Honk honk! 🦆 Time for some timeline magic!",
      "Greetings, adventurer! ⚡ Your journey starts here!",
      "Hey buddy! 🌟 Let's create some parallel worlds!"
    ];

    const editorMessages = [
      "Let's create something amazing together! ✨",
      "Time to build your future story! 📖",
      "What adventure will you create today? 🎭",
      "I'm so excited to see what you'll make! 🎉",
      "Ready to design your dream timeline? 💭",
      "Let's craft an epic adventure! ⚔️",
      "Your imagination is the limit here! 🌈",
      "Time to make some magic happen! 🪄",
      "What choices will shape your future? 🤔",
      "Let's write your story together! ✏️"
    ];

    const playgroundMessages = [
      "Welcome to the playground! 🎪 What will you explore?",
      "So many adventures to discover here! 🔍",
      "Ready to dive into some timelines? 🏊‍♂️",
      "This place is full of amazing stories! 📚",
      "Let's see what others have created! 👀",
      "Time to explore different possibilities! 🌍",
      "Welcome to the adventure hub! 🎯",
      "So many paths to choose from! 🛤️"
    ];

    const gooseMessages = [
      "That's me! I'm the star of this show! 🌟",
      "Look at me go! Pretty cool, right? 😎",
      "I'm the best animated goose ever! 🏆",
      "Honk honk! Isn't this amazing? 🎭",
      "Watch me dance! I've got moves! 💃",
      "I'm your friendly neighborhood goose! 🏠",
      "Pretty impressive animations, huh? 🎨",
      "I love being the mascot here! ❤️"
    ];

    const visitMessages = [
      "Wow! Someone's timeline adventure! 🎢",
      "Let's see how this story unfolds! 📖",
      "This is someone's future vision! 🔮",
      "What interesting choices they made! 🤓",
      "Every timeline tells a unique story! 📚",
      "I love seeing different adventures! 🗺️",
      "Look at all these possibilities! ✨",
      "Someone's dreams coming to life! 💫"
    ];

    const defaultMessages = [
      "🎪 Psst! Having fun exploring?",
      "🎭 Hey there! What are you up to?",
      "🌟 This place is pretty cool, right?",
      "🚀 Ready for more adventures?",
      "🎯 What will you discover next?",
      "🎨 I love hanging out here!",
      "🎪 Want to try something new?",
      "🎭 Every page has something special!",
      "🌈 Life is full of possibilities!",
      "🎪 Keep exploring, friend!"
    ];
    
    const randomMessage = (messages) => messages[Math.floor(Math.random() * messages.length)];
    const randomPosition = () => {
      // Prefer top positions to avoid blocking content at bottom
      const positions = ['top-right', 'top-left', 'top-right', 'top-left']; // Weight towards top
      return positions[Math.floor(Math.random() * positions.length)];
    };
    
    switch(path) {
      case '/':
        return {
          action: Math.random() > 0.5 ? 'waving' : 'encouraging',
          message: randomMessage(homeMessages),
          position: randomPosition()
        };
      case '/editor':
        return {
          action: Math.random() > 0.3 ? 'encouraging' : 'thinking',
          message: randomMessage(editorMessages),
          position: randomPosition()
        };
      case '/playground':
        return {
          action: Math.random() > 0.4 ? 'amazed' : 'waving',
          message: randomMessage(playgroundMessages),
          position: 'top-right' // Fixed top position to avoid blocking timeline content
        };
      case '/goose':
        return {
          action: Math.random() > 0.6 ? 'super_celebrating' : 'celebrating',
          message: randomMessage(gooseMessages),
          position: 'top-right' // Fixed to top-right to avoid blocking goose showcase content
        };
      default:
        // For visit pages and other pages - always use top positions to avoid blocking content
        const isVisitPage = path.startsWith('/visit/');
        return {
          action: randomBehavior,
          message: randomMessage(isVisitPage ? visitMessages : defaultMessages),
          position: Math.random() > 0.5 ? 'top-right' : 'top-left' // Always top positions for visit/other pages
        };
    }
  };

  const mascotBehavior = getMascotBehavior();

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
      
      {/* Smart Global Character Mascot - adapts to each page */}
      <CharacterMascot 
        key={location.pathname} // Force re-render on page change for new entrance animation
        action={mascotBehavior.action}
        position={mascotBehavior.position}
        message={mascotBehavior.message}
        autoHide={false}
        popupFrom="random" // Always random entrance direction
      />
    </div>
  );
}

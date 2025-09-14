import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CharacterMascot from '../components/CharacterMascot';
import { createTimelineWithRegistration } from '../api/apiClient';

// Set default headers for axios
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function TimelineEditor() {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('You');
  const [email, setEmail] = useState('');
  const [cashAmount, setCashAmount] = useState(10000);
  const [portfolios, setPortfolios] = useState([]);
  const [choices, setChoices] = useState('');
  const [profileText, setProfileText] = useState('');
  const [loading, setLoading] = useState(false);
  const [useRegistration, setUseRegistration] = useState(false);
  const nav = useNavigate();

  async function createTimeline(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      let res;
      
      if (useRegistration) {
        // Use the new registration endpoint
        const userData = {
          name: owner,
          email,
          cashAmount,
          portfolios,
          profileText,
          choices: choices.split(',').map(s => s.trim()).filter(Boolean)
        };
        
        res = await createTimelineWithRegistration(userData);
        
        if (res.success) {
          const locals = JSON.parse(localStorage.getItem('pl_local_timelines') || '[]');
          locals.unshift(res.timeline);
          localStorage.setItem('pl_local_timelines', JSON.stringify(locals));
          setLoading(false);
          alert('Timeline created and client registered successfully!');
          nav(`/visit/${res.timeline.id}`);
        } else {
          throw new Error(res.error || 'Registration failed');
        }
      } else {
        // Use the original timeline creation
        const payload = { owner, name, choices: choices.split(',').map(s => s.trim()).filter(Boolean), profileText };
        res = await axios.post(`${API}/timelines/`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const locals = JSON.parse(localStorage.getItem('pl_local_timelines') || '[]');
        locals.unshift(res.data);
        localStorage.setItem('pl_local_timelines', JSON.stringify(locals));
        setLoading(false);
        nav(`/visit/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error creating timeline: ${err.message || err}`);
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth: 700, background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)', minHeight: '100vh', padding: 20}}>
      <div style={{background: '#F5DEB3', border: '4px solid #8B4513', borderRadius: 20, padding: 30, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
        <div style={{textAlign: 'center', marginBottom: 30}}>
          <h1 style={{fontSize: '2.5em', margin: 0, color: '#654321'}}>
            🌟 Create Your Future Adventure! 🌟
          </h1>
          <p style={{fontSize: '1.2em', color: '#654321', margin: '10px 0'}}>
            What if you could see into the future? Let's build your story and see what happens! ✨
          </p>
          
          {/* Registration Toggle */}
          <div style={{background: '#e7f3ff', border: '2px solid #007bff', borderRadius: 15, padding: 20, margin: '20px 0', textAlign: 'left'}}>
            <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold', color: '#0056b3'}}>
              <input 
                type="checkbox" 
                checked={useRegistration} 
                onChange={e => setUseRegistration(e.target.checked)}
                style={{marginRight: 10, transform: 'scale(1.2)'}}
              />
              🚀 Create My First Timeline! (Register with AI-powered client system)
            </label>
            <p style={{fontSize: '0.9em', color: '#0056b3', margin: '8px 0 0 30px', fontStyle: 'italic'}}>
              Enable this to use Cohere AI to generate your financial profile and register with our AWS system!
            </p>
          </div>
        </div>
        
        <form onSubmit={createTimeline}>
          <div style={{background: '#F5DEB3', border: '3px solid #DAA520', borderRadius: 15, padding: 20, marginBottom: 25}}>
            <label style={{display: 'block', fontSize: '1.3em', fontWeight: 'bold', marginBottom: 10, color: '#654321'}}>
              🎬 What's Your Story Called?
            </label>
            <p style={{fontSize: '1em', color: '#654321', margin: '0 0 12px 0'}}>
              Give your adventure a cool name! What's the main thing you want to try?
            </p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12}}>
              <button type="button" onClick={() => setName("My Awesome Lemonade Stand")} 
                style={{background: '#DAA520', border: 'none', padding: '8px 12px', borderRadius: 20, cursor: 'pointer', color: 'white'}}>
                🍋 Lemonade Stand
              </button>
              <button type="button" onClick={() => setName("Saving My Allowance Adventure")}
                style={{background: '#8B4513', border: 'none', padding: '8px 12px', borderRadius: 20, cursor: 'pointer', color: 'white'}}>
                💰 Saving Money
              </button>
              <button type="button" onClick={() => setName("My Pet Care Business")}
                style={{background: '#A0522D', border: 'none', padding: '8px 12px', borderRadius: 20, cursor: 'pointer', color: 'white'}}>
                🐕 Pet Business
              </button>
            </div>
            <input 
              style={{width: '100%', padding: 15, border: '2px solid #DAA520', borderRadius: 10, fontSize: '1.1em'}}
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Type your adventure name here!"
              required
            />
          </div>

          <div style={{background: '#F5DEB3', border: '3px solid #A0522D', borderRadius: 15, padding: 20, marginBottom: 25}}>
            <label style={{display: 'block', fontSize: '1.3em', fontWeight: 'bold', marginBottom: 10, color: '#654321'}}>
              👋 What's Your Name, Future Hero?
            </label>
            <p style={{fontSize: '1em', color: '#654321', margin: '0 0 12px 0'}}>
              This is YOUR story, so let's put your name on it!
            </p>
            <input 
              style={{width: '100%', padding: 15, border: '2px solid #A0522D', borderRadius: 10, fontSize: '1.1em'}}
              value={owner} 
              onChange={e => setOwner(e.target.value)}
              placeholder="Your awesome name goes here!"
              required
            />
          </div>

          {/* Registration Fields - Only show when registration is enabled */}
          {useRegistration && (
            <>
              <div style={{background: '#F5DEB3', border: '3px solid #A0522D', borderRadius: 15, padding: 20, marginBottom: 25}}>
                <label style={{display: 'block', fontSize: '1.3em', fontWeight: 'bold', marginBottom: 10, color: '#654321'}}>
                  📧 Your Email Address
                </label>
                <p style={{fontSize: '1em', color: '#654321', margin: '0 0 12px 0'}}>
                  We need your email to register you in our financial system!
                </p>
                <input 
                  type="email"
                  style={{width: '100%', padding: 15, border: '2px solid #A0522D', borderRadius: 10, fontSize: '1.1em'}}
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required={useRegistration}
                />
              </div>

              <div style={{background: '#F5DEB3', border: '3px solid #DAA520', borderRadius: 15, padding: 20, marginBottom: 25}}>
                <label style={{display: 'block', fontSize: '1.3em', fontWeight: 'bold', marginBottom: 10, color: '#654321'}}>
                  💰 Starting Cash Amount
                </label>
                <p style={{fontSize: '1em', color: '#654321', margin: '0 0 12px 0'}}>
                  How much money do you want to start your financial journey with?
                </p>
                <div style={{display: 'flex', gap: 10, marginBottom: 12}}>
                  {[1000, 5000, 10000, 25000, 50000].map(amount => (
                    <button 
                      key={amount}
                      type="button" 
                      onClick={() => setCashAmount(amount)}
                      style={{
                        background: cashAmount === amount ? '#DAA520' : 'white',
                        color: cashAmount === amount ? 'white' : '#DAA520',
                        border: '2px solid #DAA520',
                        padding: '8px 12px',
                        borderRadius: 20,
                        cursor: 'pointer',
                        fontSize: '0.9em',
                        fontWeight: 'bold'
                      }}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input 
                  type="number"
                  style={{width: '100%', padding: 15, border: '2px solid #DAA520', borderRadius: 10, fontSize: '1.1em'}}
                  value={cashAmount} 
                  onChange={e => setCashAmount(Number(e.target.value))}
                  placeholder="10000"
                  min="0"
                  required={useRegistration}
                />
              </div>

              <div style={{background: '#F5DEB3', border: '3px solid #CD853F', borderRadius: 15, padding: 20, marginBottom: 25}}>
                <label style={{display: 'block', fontSize: '1.3em', fontWeight: 'bold', marginBottom: 10, color: '#654321'}}>
                  📈 Investment Portfolios
                </label>
                <p style={{fontSize: '1em', color: '#654321', margin: '0 0 12px 0'}}>
                  What types of investments are you interested in? (Optional - AI will suggest based on your profile)
                </p>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12}}>
                  {['Stocks', 'Bonds', 'ETFs', 'Crypto', 'Real Estate', 'Mutual Funds'].map(portfolio => (
                    <button 
                      key={portfolio}
                      type="button" 
                      onClick={() => {
                        if (portfolios.includes(portfolio)) {
                          setPortfolios(portfolios.filter(p => p !== portfolio));
                        } else {
                          setPortfolios([...portfolios, portfolio]);
                        }
                      }}
                      style={{
                        background: portfolios.includes(portfolio) ? '#CD853F' : 'white',
                        color: portfolios.includes(portfolio) ? 'white' : '#CD853F',
                        border: '2px solid #CD853F',
                        padding: '8px 12px',
                        borderRadius: 20,
                        cursor: 'pointer',
                        fontSize: '0.9em',
                        fontWeight: 'bold'
                      }}
                    >
                      {portfolio}
                    </button>
                  ))}
                </div>
                <input 
                  style={{width: '100%', padding: 15, border: '2px solid #CD853F', borderRadius: 10, fontSize: '1.1em'}}
                  value={portfolios.join(', ')} 
                  onChange={e => setPortfolios(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Click buttons above or type: Stocks, ETFs, Bonds"
                />
              </div>
            </>
          )}

          <div style={{background: '#F5DEB3', border: '3px solid #8B4513', borderRadius: 15, padding: 20, marginBottom: 25}}>
            <label style={{display: 'block', fontSize: '1.3em', fontWeight: 'bold', marginBottom: 10, color: '#654321'}}>
              🎯 What Cool Things Will You Do?
            </label>
            <p style={{fontSize: '1em', color: '#654321', margin: '0 0 12px 0'}}>
              Pick the awesome choices you want to make! Each choice changes your future! 
              Click the buttons or type your own (separate with commas).
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 15}}>
              {[
                {emoji: '💰', text: 'save money', color: '#DAA520'},
                {emoji: '🍋', text: 'lemonade stand', color: '#8B4513'},
                {emoji: '📈', text: 'invest', color: '#A0522D'},
                {emoji: '🎮', text: 'buy games', color: '#CD853F'},
                {emoji: '🐕', text: 'pet sitting', color: '#D2691E'},
                {emoji: '🎨', text: 'sell art', color: '#8B4513'},
                {emoji: '📚', text: 'tutoring', color: '#A0522D'},
                {emoji: '🏪', text: 'yard sale', color: '#DAA520'}
              ].map(choice => (
                <button 
                  key={choice.text}
                  type="button" 
                  onClick={() => {
                    const current = choices ? choices.split(',').map(s => s.trim()).filter(Boolean) : [];
                    if (current.includes(choice.text)) {
                      setChoices(current.filter(c => c !== choice.text).join(', '));
                    } else {
                      setChoices([...current, choice.text].join(', '));
                    }
                  }}
                  style={{
                    background: choices && choices.includes(choice.text) ? choice.color : 'white',
                    color: choices && choices.includes(choice.text) ? 'white' : choice.color,
                    border: `2px solid ${choice.color}`,
                    padding: '10px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  {choice.emoji} {choice.text}
                </button>
              ))}
            </div>
            
            <input 
              style={{width: '100%', padding: 15, border: '2px solid #8B4513', borderRadius: 10, fontSize: '1.1em'}}
              value={choices} 
              onChange={e => setChoices(e.target.value)} 
              placeholder="Click buttons above or type: save money, lemonade stand, pet sitting"
              required
            />
          </div>

          <div style={{background: '#F5DEB3', border: '3px solid #CD853F', borderRadius: 15, padding: 20, marginBottom: 25}}>
            <label style={{display: 'block', fontSize: '1.3em', fontWeight: 'bold', marginBottom: 10, color: '#654321'}}>
              🤖 Tell Me About YOU! 
            </label>
            <p style={{fontSize: '1em', color: '#654321', margin: '0 0 12px 0'}}>
              What do you love to do? What makes you special? Our AI friend wants to know so it can 
              give you the best advice!
            </p>
            <div style={{fontSize: '0.9em', color: '#654321', marginBottom: 12, fontStyle: 'italic'}}>
              💡 Ideas: What animals do you love? What do you like to build? What subjects are fun? 
              What do you want to be when you grow up?
            </div>
            <textarea 
              style={{width: '100%', padding: 15, border: '2px solid #CD853F', borderRadius: 10, fontSize: '1.1em', resize: 'vertical'}}
              value={profileText} 
              onChange={e => setProfileText(e.target.value)} 
              placeholder="I love dogs and want to help animals! I also like building with Legos and learning about space..."
              rows={4}
            />
          </div>

          <div style={{background: '#F5DEB3', border: '4px solid #8B4513', borderRadius: 15, padding: 25, marginBottom: 25}}>
            <h3 style={{margin: '0 0 20px 0', fontSize: '1.5em', color: '#654321', textAlign: 'center'}}>🎭 Here's What Will Happen!</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20}}>
              <div style={{textAlign: 'center', background: 'rgba(139, 69, 19, 0.1)', padding: 15, borderRadius: 12, border: '2px solid #DAA520'}}>
                <div style={{fontSize: '2.5em', marginBottom: 12}}>🤖</div>
                <div style={{fontWeight: 'bold', color: '#654321', fontSize: '1.1em', marginBottom: 8}}>AI Analyzes You!</div>
                <div style={{fontSize: '0.95em', color: '#8B4513'}}>Learns what makes you special</div>
              </div>
              <div style={{textAlign: 'center', background: 'rgba(139, 69, 19, 0.1)', padding: 15, borderRadius: 12, border: '2px solid #A0522D'}}>
                <div style={{fontSize: '2.5em', marginBottom: 12}}>⚡</div>
                <div style={{fontWeight: 'bold', color: '#654321', fontSize: '1.1em', marginBottom: 8}}>Magic Simulation!</div>
                <div style={{fontSize: '0.95em', color: '#8B4513'}}>Shows your future story</div>
              </div>
              <div style={{textAlign: 'center', background: 'rgba(139, 69, 19, 0.1)', padding: 15, borderRadius: 12, border: '2px solid #CD853F'}}>
                <div style={{fontSize: '2.5em', marginBottom: 12}}>🏗️</div>
                <div style={{fontWeight: 'bold', color: '#654321', fontSize: '1.1em', marginBottom: 8}}>3D World!</div>
                <div style={{fontSize: '0.95em', color: '#8B4513'}}>Your story becomes a building</div>
              </div>
              <div style={{textAlign: 'center', background: 'rgba(139, 69, 19, 0.1)', padding: 15, borderRadius: 12, border: '2px solid #D2691E'}}>
                <div style={{fontSize: '2.5em', marginBottom: 12}}>👫</div>
                <div style={{fontWeight: 'bold', color: '#654321', fontSize: '1.1em', marginBottom: 8}}>Share & Compare!</div>
                <div style={{fontSize: '0.95em', color: '#8B4513'}}>Show friends your adventure</div>
              </div>
            </div>
          </div>

          <div style={{textAlign: 'center'}}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                background: loading ? '#ccc' : 'linear-gradient(45deg, #DAA520, #B8860B)',
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                borderRadius: 25,
                fontSize: '1.3em',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                transform: loading ? 'none' : 'translateY(-2px)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                }
              }}
              onMouseLeave={e => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                }
              }}
            >
              {loading ? '🔮 Creating Your Magic Story...' : '🚀 Launch My Adventure!'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Character Mascot */}
      <CharacterMascot 
        action={loading ? 'working' : name && choices ? 'encouraging' : 'thinking'}
        position="top-right"
        message={
          loading ? "Creating your amazing timeline story! ✨" :
          name && choices ? "Great choices! Ready to see your future? 🚀" :
          "Tell me about your adventure! What will you choose? 🤔"
        }
        autoHide={false}
      />
    </div>
  );
}
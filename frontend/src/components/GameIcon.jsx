import React from 'react';
import { 
  Star, 
  Film, 
  Target, 
  Palette, 
  DollarSign, 
  Coffee, 
  Gamepad2, 
  Bot, 
  Zap, 
  Building, 
  Users, 
  Store, 
  PaintBucket, 
  Book, 
  Sparkles,
  TrendingUp,
  Dog,
  Trophy,
  Play,
  Home,
  Coins
} from 'lucide-react';

// Mapping of emoji names to Lucide icons
const iconMap = {
  'star': Star,
  'film': Film,
  'target': Target,
  'palette': Palette,
  'dollar': DollarSign,
  'coffee': Coffee, // Using coffee instead of lemonade
  'gamepad': Gamepad2,
  'bot': Bot,
  'zap': Zap,
  'building': Building,
  'users': Users,
  'store': Store,
  'paint': PaintBucket,
  'book': Book,
  'sparkles': Sparkles,
  'trending': TrendingUp,
  'dog': Dog,
  'trophy': Trophy,
  'play': Play,
  'home': Home,
  'coins': Coins
};

export default function GameIcon({ 
  icon, 
  size = 24, 
  color = '#654321', 
  style = {},
  className = '',
  ...props 
}) {
  const IconComponent = iconMap[icon];
  
  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in iconMap`);
    return null;
  }

  return (
    <IconComponent 
      size={size} 
      color={color}
      style={{
        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
        ...style
      }}
      className={className}
      {...props}
    />
  );
}

// Helper component for larger gaming-style icons
export function GameIconLarge({ icon, size = 48, color = '#654321', ...props }) {
  return (
    <GameIcon 
      icon={icon} 
      size={size} 
      color={color}
      style={{
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
        transform: 'scale(1)',
        transition: 'transform 0.2s ease',
        ...props.style
      }}
      {...props}
    />
  );
}

// Gaming-themed icon variants with specific styling
export const GameIcons = {
  Achievement: (props) => <GameIcon icon="trophy" {...props} />,
  Adventure: (props) => <GameIcon icon="sparkles" {...props} />,
  Money: (props) => <GameIcon icon="coins" {...props} />,
  Savings: (props) => <GameIcon icon="dollar" {...props} />,
  Games: (props) => <GameIcon icon="gamepad" {...props} />,
  Business: (props) => <GameIcon icon="store" {...props} />,
  AI: (props) => <GameIcon icon="bot" {...props} />,
  Magic: (props) => <GameIcon icon="zap" {...props} />,
  Building: (props) => <GameIcon icon="building" {...props} />,
  Friends: (props) => <GameIcon icon="users" {...props} />,
  Story: (props) => <GameIcon icon="film" {...props} />,
  Goals: (props) => <GameIcon icon="target" {...props} />,
  Timeline: (props) => <GameIcon icon="play" {...props} />
};
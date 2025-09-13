import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AnimatedGoose({ action = 'idle', size = 120 }) {
  // More natural animation variants for a real goose
  const animations = {
    idle: {
      body: { y: [0, -2, 0], rotate: [0, 0.5, 0] },
      head: { rotate: [0, -3, 3, 0] },
      neck: { rotate: [0, -1, 1, 0] },
      leftWing: { rotate: [0, -5, 0] },
      rightWing: { rotate: [0, 5, 0] },
      tail: { rotate: [0, 2, -2, 0] },
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    
    waving: {
      body: { y: [0, -3, 0] },
      head: { rotate: [0, 8, 0] },
      neck: { rotate: [0, 5, 0] },
      leftWing: { rotate: [0, -30, -15, -30, 0] },
      rightWing: { rotate: [0, 8, 0] },
      tail: { rotate: [0, 5, 0] },
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
    },
    
    celebrating: {
      body: { y: [0, -8, -2, -8, 0], scale: [1, 1.05, 1] },
      head: { rotate: [0, 12, -12, 0] },
      neck: { rotate: [0, 8, -8, 0] },
      leftWing: { rotate: [0, -45, -20, -45, 0] },
      rightWing: { rotate: [0, 45, 20, 45, 0] },
      tail: { rotate: [0, 8, -8, 0] },
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
    },
    
    thinking: {
      body: { y: [0, -1, 0] },
      head: { rotate: [0, -15, -12, -15, 0] },
      neck: { rotate: [0, -10, -8, -10, 0] },
      leftWing: { rotate: [0, -8, 0] },
      rightWing: { rotate: [0, 8, 0] },
      tail: { rotate: [0, -3, 3, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    
    working: {
      body: { y: [0, -2, 0], rotate: [0, -1, 1, 0] },
      head: { rotate: [0, -8, 8, 0] },
      neck: { rotate: [0, -5, 5, 0] },
      leftWing: { rotate: [0, -25, -10, -25, 0] },
      rightWing: { rotate: [0, 25, 10, 25, 0] },
      tail: { rotate: [0, 3, -3, 0] },
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
    },
    
    encouraging: {
      body: { y: [0, -4, 0] },
      head: { rotate: [0, 10, 0] },
      neck: { rotate: [0, 6, 0] },
      leftWing: { rotate: [0, -35, 0] }, // Thumbs up gesture
      rightWing: { rotate: [0, 8, 0] },
      tail: { rotate: [0, 5, 0] },
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
    },
    
    pointing: {
      body: { y: [0, -2, 0] },
      head: { rotate: [0, 12, 0] },
      neck: { rotate: [0, 8, 0] },
      leftWing: { rotate: [0, 5, 0] },
      rightWing: { rotate: [0, -25, -30, -25, 0] }, // Pointing gesture
      tail: { rotate: [0, 3, 0] },
      transition: { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
    },
    
    oops: {
      body: { y: [0, -1, 0], rotate: [0, -3, 0] },
      head: { rotate: [0, -25, -20, -25, 0] },
      neck: { rotate: [0, -15, -12, -15, 0] },
      leftWing: { rotate: [0, -15, 0] },
      rightWing: { rotate: [0, 10, 0] },
      tail: { rotate: [0, -5, 0] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    
    honking: {
      body: { y: [0, -6, -2, -6, 0], scale: [1, 1.03, 1] },
      head: { rotate: [0, 20, 15, 20, 0] },
      neck: { rotate: [0, 15, 10, 15, 0] },
      leftWing: { rotate: [0, -15, 0] },
      rightWing: { rotate: [0, 15, 0] },
      tail: { rotate: [0, 8, 0] },
      transition: { duration: 0.5, repeat: Infinity, ease: "easeOut" }
    },

    super_celebrating: {
      body: { y: [0, -12, -3, -12, 0], scale: [1, 1.1, 1.05, 1.1, 1], rotate: [0, 3, -3, 0] },
      head: { rotate: [0, 15, -15, 12, -12, 0] },
      neck: { rotate: [0, 10, -10, 8, -8, 0] },
      leftWing: { rotate: [0, -60, -30, -60, 0] },
      rightWing: { rotate: [0, 60, 30, 60, 0] },
      tail: { rotate: [0, 10, -10, 0] },
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
    },

    confused: {
      body: { y: [0, -1, 0], rotate: [0, -2, 2, 0] },
      head: { rotate: [0, -20, -15, -25, -15, 0] },
      neck: { rotate: [0, -12, -8, -15, -8, 0] },
      leftWing: { rotate: [0, -12, 0] },
      rightWing: { rotate: [0, 12, 0] },
      tail: { rotate: [0, -3, 3, 0] },
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
    },

    amazed: {
      body: { y: [0, -4, 0], scale: [1, 1.08, 1] },
      head: { rotate: [0, 2, -2, 0] }, // Keep head mostly straight for amazed look
      neck: { rotate: [0, 1, -1, 0] },
      leftWing: { rotate: [0, -20, 0] },
      rightWing: { rotate: [0, 20, 0] },
      tail: { rotate: [0, 5, 0] },
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const currentAnimation = animations[action] || animations.idle;

  // Sparkle effects for magical actions
  const showSparkles = ['celebrating', 'super_celebrating', 'encouraging', 'honking', 'amazed'].includes(action);

  return (
    <div style={{ 
      width: size, 
      height: size, 
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Sparkles for celebration */}
      {showSparkles && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                background: '#FFD700',
                borderRadius: '50%',
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </>
      )}

      {/* Main Goose SVG - More Realistic Design */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{ overflow: 'visible' }}
        animate={currentAnimation.body}
        transition={currentAnimation.transition}
      >
        {/* Drop shadow and gradients */}
        <defs>
          <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
          <radialGradient id="bodyGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F5F5F5" />
          </radialGradient>
          <radialGradient id="headGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8F8F8" />
          </radialGradient>
        </defs>

        {/* Goose Body (realistic pear shape) */}
        <motion.path
          d="M 100 85 
             C 125 88, 140 100, 145 125
             C 147 145, 145 160, 140 170
             C 135 180, 125 185, 100 187
             C 75 185, 65 180, 60 170
             C 55 160, 53 145, 55 125
             C 60 100, 75 88, 100 85 Z"
          fill="url(#bodyGradient)"
          stroke="#E0E0E0"
          strokeWidth="2"
          filter="url(#dropshadow)"
        />

        {/* Tail feathers */}
        <motion.g
          animate={currentAnimation.tail}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "135px 165px" }}
        >
          <path
            d="M 140 165 C 150 160, 160 162, 165 170 C 163 175, 155 178, 145 175 Z"
            fill="#F0F0F0"
            stroke="#E0E0E0"
            strokeWidth="1.5"
          />
          <path
            d="M 143 168 C 153 163, 163 165, 168 173 C 166 178, 158 181, 148 178 Z"
            fill="#F5F5F5"
            stroke="#E0E0E0"
            strokeWidth="1"
          />
        </motion.g>

        {/* Neck (connects head to body naturally) */}
        <motion.path
          d="M 100 85 
             C 98 78, 97 70, 96 62
             C 95 55, 96 50, 98 47
             C 100 44, 103 42, 106 44
             C 108 46, 109 50, 108 55
             C 107 62, 105 70, 103 78
             C 102 82, 101 84, 100 85 Z"
          fill="url(#headGradient)"
          stroke="#E0E0E0"
          strokeWidth="1.5"
          animate={currentAnimation.neck}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "102px 65px" }}
        />

        {/* Head (proper goose head shape) */}
        <motion.g
          animate={currentAnimation.head}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "102px 55px" }}
        >
          {/* Main head shape - more elongated like real goose */}
          <ellipse
            cx="102"
            cy="55"
            rx="20"
            ry="16"
            fill="url(#headGradient)"
            stroke="#E0E0E0"
            strokeWidth="2"
            filter="url(#dropshadow)"
          />
          
          {/* Beak (realistic goose beak) */}
          <path
            d="M 82 55 
               C 72 53, 65 55, 60 57
               C 57 58, 57 60, 60 61
               C 65 63, 72 65, 82 63 Z"
            fill="#FF8C00"
            stroke="#E6650A"
            strokeWidth="1.5"
          />
          
          {/* Nostrils */}
          <ellipse cx="66" cy="57" rx="1" ry="0.5" fill="#CC6600" />
          <ellipse cx="66" cy="61" rx="1" ry="0.5" fill="#CC6600" />
          
          {/* Eyes (realistic goose eyes) */}
          <ellipse cx="90" cy="50" rx="3.5" ry="4.5" fill="#000000" />
          <ellipse cx="114" cy="50" rx="3.5" ry="4.5" fill="#000000" />
          <ellipse cx="91" cy="48" rx="1.3" ry="1.8" fill="#FFFFFF" />
          <ellipse cx="113" cy="48" rx="1.3" ry="1.8" fill="#FFFFFF" />
          <circle cx="91.5" cy="49" r="0.5" fill="#FFFFFF" />
          <circle cx="113.5" cy="49" r="0.5" fill="#FFFFFF" />
        </motion.g>

        {/* Left Wing (proper wing shape and connection) */}
        <motion.g
          animate={currentAnimation.leftWing}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "75px 115px" }}
        >
          <path
            d="M 78 105
               C 65 108, 52 115, 48 125
               C 45 135, 48 145, 58 150
               C 68 153, 78 150, 83 140
               C 85 130, 83 120, 78 105 Z"
            fill="#F8F8F8"
            stroke="#E0E0E0"
            strokeWidth="2"
          />
          {/* Wing feather details */}
          <path d="M 58 120 C 53 125, 53 135, 58 140" fill="none" stroke="#D0D0D0" strokeWidth="1" />
          <path d="M 63 117 C 58 122, 58 132, 63 137" fill="none" stroke="#D0D0D0" strokeWidth="1" />
          <path d="M 68 115 C 63 120, 63 130, 68 135" fill="none" stroke="#D0D0D0" strokeWidth="1" />
        </motion.g>

        {/* Right Wing (proper wing shape and connection) */}
        <motion.g
          animate={currentAnimation.rightWing}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "125px 115px" }}
        >
          <path
            d="M 122 105
               C 135 108, 148 115, 152 125
               C 155 135, 152 145, 142 150
               C 132 153, 122 150, 117 140
               C 115 130, 117 120, 122 105 Z"
            fill="#F8F8F8"
            stroke="#E0E0E0"
            strokeWidth="2"
          />
          {/* Wing feather details */}
          <path d="M 142 120 C 147 125, 147 135, 142 140" fill="none" stroke="#D0D0D0" strokeWidth="1" />
          <path d="M 137 117 C 142 122, 142 132, 137 137" fill="none" stroke="#D0D0D0" strokeWidth="1" />
          <path d="M 132 115 C 137 120, 137 130, 132 135" fill="none" stroke="#D0D0D0" strokeWidth="1" />
        </motion.g>

        {/* Webbed Feet (more realistic) */}
        <motion.g
          animate={{ 
            y: currentAnimation.body.y ? currentAnimation.body.y.map(val => val * 0.1) : [0]
          }}
          transition={currentAnimation.transition}
        >
          {/* Left foot */}
          <path
            d="M 85 185 
               C 82 187, 79 190, 77 193
               L 75 195 L 79 197 L 83 195
               L 87 197 L 91 195 L 89 193
               C 87 190, 85 187, 85 185 Z"
            fill="#FF8C00"
            stroke="#E6650A"
            strokeWidth="1"
          />
          {/* Right foot */}
          <path
            d="M 115 185 
               C 118 187, 121 190, 123 193
               L 125 195 L 121 197 L 117 195
               L 113 197 L 109 195 L 111 193
               C 113 190, 115 187, 115 185 Z"
            fill="#FF8C00"
            stroke="#E6650A"
            strokeWidth="1"
          />
        </motion.g>

        {/* Small bow tie (subtle, natural placement) */}
        <polygon
          points="96,80 104,80 100,75 96,80"
          fill="#FF6B6B"
          opacity="0.8"
        />
        <polygon
          points="96,80 104,80 100,85 96,80"
          fill="#FF6B6B"
          opacity="0.8"
        />
        <rect x="98.5" y="78.5" width="3" height="3" fill="#FF4757" opacity="0.9" />

        {/* Thought bubble for thinking action */}
        {action === 'thinking' && (
          <motion.g
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <circle cx="145" cy="45" r="12" fill="#FFFFFF" stroke="#DDD" strokeWidth="2" />
            <circle cx="135" cy="55" r="6" fill="#FFFFFF" stroke="#DDD" strokeWidth="2" />
            <circle cx="130" cy="60" r="3" fill="#FFFFFF" stroke="#DDD" strokeWidth="2" />
            <text x="145" y="50" textAnchor="middle" fontSize="16" fill="#333">?</text>
          </motion.g>
        )}

        {/* Exclamation for celebrating */}
        {(action === 'celebrating' || action === 'super_celebrating') && (
          <motion.g
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 10, -10, 0] 
            }}
            transition={{ duration: action === 'super_celebrating' ? 0.6 : 1, repeat: Infinity }}
          >
            <circle cx="145" cy="40" r="15" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
            <text x="145" y="47" textAnchor="middle" fontSize="20" fill="#FFF">!</text>
          </motion.g>
        )}

        {/* Question marks for confused */}
        {action === 'confused' && (
          <motion.g>
            {[1, 2, 3].map((i) => (
              <motion.g
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.3 
                }}
              >
                <circle cx={130 + i * 15} cy={35 + i * 5} r="8" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
                <text x={130 + i * 15} y={41 + i * 5} textAnchor="middle" fontSize="12" fill="#333">?</text>
              </motion.g>
            ))}
          </motion.g>
        )}

        {/* Stars for amazed */}
        {action === 'amazed' && (
          <motion.g>
            {[1, 2].map((i) => (
              <motion.g
                key={i}
                animate={{ 
                  scale: [0, 1.5, 1],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.3 
                }}
              >
                <polygon
                  points={`${140 + i*20},${35 + i*5} ${142 + i*20},${42 + i*5} ${149 + i*20},${42 + i*5} ${144 + i*20},${47 + i*5} ${146 + i*20},${54 + i*5} ${140 + i*20},${50 + i*5} ${134 + i*20},${54 + i*5} ${136 + i*20},${47 + i*5} ${131 + i*20},${42 + i*5} ${138 + i*20},${42 + i*5}`}
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth="1"
                />
              </motion.g>
            ))}
          </motion.g>
        )}

        {/* Sound waves for honking */}
        {action === 'honking' && (
          <motion.g>
            {[1, 2, 3].map((i) => (
              <motion.path
                key={i}
                d={`M 60 55 Q ${50 - i*5} ${50 + i*3} ${40 - i*8} ${55 + i*5}`}
                fill="none"
                stroke="#4ECDC4"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{
                  opacity: [0, 1, 0],
                  pathLength: [0, 1]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
}
// AnimatedGoose.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Updated AnimatedGoose component — visuals changed to resemble a Canada goose:
 * - Black head & neck with a white cheek patch
 * - Brown/gray body with lighter chest area
 * - Black beak & black webbed feet
 * - Longer neck and less "ducky" rounded head
 *
 * Kept your original animation variants and interactive visual elements
 * (thought bubble, honk waves, sparkles, confused/question marks, etc.)
 *
 * Props:
 * - action: animation/action name (e.g. 'idle', 'honking', 'celebrating', etc.)
 * - size: px size for the SVG container (default 120)
 */
export default function AnimatedGoose({ action = "idle", size = 140 }) {
  // Keep the animation variants you already had (kept same names & behavior)
  const animations = {
    idle: {
      body: { y: [0, -2, 0], rotate: [0, 0.5, 0] },
      head: { rotate: [0, -3, 3, 0] },
      neck: { rotate: [0, -1, 1, 0] },
      leftWing: { rotate: [0, -5, 0] },
      rightWing: { rotate: [0, 5, 0] },
      tail: { rotate: [0, 2, -2, 0] },
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },

    waving: {
      body: { y: [0, -3, 0] },
      head: { rotate: [0, 8, 0] },
      neck: { rotate: [0, 5, 0] },
      leftWing: { rotate: [0, -30, -15, -30, 0] },
      rightWing: { rotate: [0, 8, 0] },
      tail: { rotate: [0, 5, 0] },
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },

    celebrating: {
      body: { y: [0, -8, -2, -8, 0], scale: [1, 1.05, 1] },
      head: { rotate: [0, 12, -12, 0] },
      neck: { rotate: [0, 8, -8, 0] },
      leftWing: { rotate: [0, -45, -20, -45, 0] },
      rightWing: { rotate: [0, 45, 20, 45, 0] },
      tail: { rotate: [0, 8, -8, 0] },
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },

    thinking: {
      body: { y: [0, -1, 0] },
      head: { rotate: [0, -15, -12, -15, 0] },
      neck: { rotate: [0, -10, -8, -10, 0] },
      leftWing: { rotate: [0, -8, 0] },
      rightWing: { rotate: [0, 8, 0] },
      tail: { rotate: [0, -3, 3, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },

    working: {
      body: { y: [0, -2, 0], rotate: [0, -1, 1, 0] },
      head: { rotate: [0, -8, 8, 0] },
      neck: { rotate: [0, -5, 5, 0] },
      leftWing: { rotate: [0, -25, -10, -25, 0] },
      rightWing: { rotate: [0, 25, 10, 25, 0] },
      tail: { rotate: [0, 3, -3, 0] },
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    },

    encouraging: {
      body: { y: [0, -4, 0] },
      head: { rotate: [0, 10, 0] },
      neck: { rotate: [0, 6, 0] },
      leftWing: { rotate: [0, -35, 0] },
      rightWing: { rotate: [0, 8, 0] },
      tail: { rotate: [0, 5, 0] },
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },

    pointing: {
      body: { y: [0, -2, 0] },
      head: { rotate: [0, 12, 0] },
      neck: { rotate: [0, 8, 0] },
      leftWing: { rotate: [0, 5, 0] },
      rightWing: { rotate: [0, -25, -30, -25, 0] },
      tail: { rotate: [0, 3, 0] },
      transition: { duration: 1.3, repeat: Infinity, ease: "easeInOut" },
    },

    oops: {
      body: { y: [0, -1, 0], rotate: [0, -3, 0] },
      head: { rotate: [0, -25, -20, -25, 0] },
      neck: { rotate: [0, -15, -12, -15, 0] },
      leftWing: { rotate: [0, -15, 0] },
      rightWing: { rotate: [0, 10, 0] },
      tail: { rotate: [0, -5, 0] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },

    honking: {
      body: { y: [0, -6, -2, -6, 0], scale: [1, 1.03, 1] },
      head: { rotate: [0, 20, 15, 20, 0] },
      neck: { rotate: [0, 15, 10, 15, 0] },
      leftWing: { rotate: [0, -15, 0] },
      rightWing: { rotate: [0, 15, 0] },
      tail: { rotate: [0, 8, 0] },
      transition: { duration: 0.5, repeat: Infinity, ease: "easeOut" },
    },

    super_celebrating: {
      body: {
        y: [0, -12, -3, -12, 0],
        scale: [1, 1.1, 1.05, 1.1, 1],
        rotate: [0, 3, -3, 0],
      },
      head: { rotate: [0, 15, -15, 12, -12, 0] },
      neck: { rotate: [0, 10, -10, 8, -8, 0] },
      leftWing: { rotate: [0, -60, -30, -60, 0] },
      rightWing: { rotate: [0, 60, 30, 60, 0] },
      tail: { rotate: [0, 10, -10, 0] },
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    },

    confused: {
      body: { y: [0, -1, 0], rotate: [0, -2, 2, 0] },
      head: { rotate: [0, -20, -15, -25, -15, 0] },
      neck: { rotate: [0, -12, -8, -15, -8, 0] },
      leftWing: { rotate: [0, -12, 0] },
      rightWing: { rotate: [0, 12, 0] },
      tail: { rotate: [0, -3, 3, 0] },
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },

    amazed: {
      body: { y: [0, -4, 0], scale: [1, 1.08, 1] },
      head: { rotate: [0, 2, -2, 0] },
      neck: { rotate: [0, 1, -1, 0] },
      leftWing: { rotate: [0, -20, 0] },
      rightWing: { rotate: [0, 20, 0] },
      tail: { rotate: [0, 5, 0] },
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const currentAnimation = animations[action] || animations.idle;
  const showSparkles = [
    "celebrating",
    "super_celebrating",
    "encouraging",
    "honking",
    "amazed",
  ].includes(action);

  // scale helpers
  const svgSize = Number(size) || 140;
  const sparkleSize = Math.max(6, Math.round(svgSize * 0.06));

  return (
    <div
      style={{
        width: svgSize,
        height: svgSize,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Sparkles (for certain actions) */}
      {showSparkles &&
        [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: sparkleSize,
              height: sparkleSize,
              background: "#FFD700",
              borderRadius: "50%",
              top: `${18 + Math.random() * 60}%`,
              left: `${18 + Math.random() * 60}%`,
              boxShadow: "0 0 8px rgba(255,200,0,0.8)",
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Main SVG */}
      <motion.svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 200 200"
        style={{ overflow: "visible" }}
        animate={currentAnimation.body}
        transition={currentAnimation.transition}
      >
        <defs>
          <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ---------------------------
            BODY (brown/gray) and CHEST (lighter)
            --------------------------- */}
        <motion.path
          d="M 100 85 
             C 125 88, 140 100, 145 125
             C 147 145, 145 160, 140 170
             C 135 180, 125 185, 100 187
             C 75 185, 65 180, 60 170
             C 55 160, 53 145, 55 125
             C 60 100, 75 88, 100 85 Z"
          fill="#8B6E57" /* warm brown body */
          stroke="#6B4F3E"
          strokeWidth="1.8"
          filter="url(#dropshadow)"
        />

        {/* lighter chest to read as underside */}
        <path
          d="M 100 100
             C 120 105, 125 120, 120 135
             C 115 150, 100 160, 85 150
             C 70 140, 75 120, 100 100 Z"
          fill="#D9D3C3"
          opacity="0.95"
        />

        {/* ---------------------------
            TAIL FEATHERS (back) - subtle, animated
            --------------------------- */}
        <motion.g
          animate={currentAnimation.tail}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "135px 165px" }}
        >
          <path
            d="M 140 165 C 150 160, 160 162, 165 170 C 163 175, 155 178, 145 175 Z"
            fill="#6F5A48"
            stroke="#5C4638"
            strokeWidth="0.8"
          />
          <path
            d="M 143 168 C 153 163, 163 165, 168 173 C 166 178, 158 181, 148 178 Z"
            fill="#8A6F5B"
            stroke="#6B4F3E"
            strokeWidth="0.6"
          />
        </motion.g>

        {/* ---------------------------
            NECK - LONG and BLACK (Canada goose)
            --------------------------- */}
        <motion.path
          d="M 100 85
             C 99 70, 98 60, 98 50
             C 98 40, 100 34, 104 32
             C 109 30, 112 34, 113 41
             C 114 52, 111 64, 106 74
             C 104 79, 102 83, 100 85 Z"
          fill="#000000"
          stroke="#111111"
          strokeWidth="0.8"
          animate={currentAnimation.neck}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "102px 60px" }}
        />

        {/* ---------------------------
            HEAD - BLACK with WHITE CHEEK PATCH
            --------------------------- */}
        <motion.g
          animate={currentAnimation.head}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "103px 44px" }}
        >
          {/* main head */}
          <ellipse
            cx="103"
            cy="42"
            rx="16"
            ry="14"
            fill="#000000"
            stroke="#111111"
            strokeWidth="0.9"
          />

          {/* white cheek patch - angled, distinctive Canada goose mark */}
          <path
            d="M 112 38
               C 118 36, 122 44, 112 48
               C 110 49, 107 48, 105 46
               C 104 44, 104 41, 105 39 Z"
            fill="#FFFFFF"
          />

          {/* eye - small white highlight then pupil */}
          <ellipse cx="96" cy="40" rx="3" ry="3.7" fill="#FFFFFF" />
          <circle cx="96" cy="40" r="1.3" fill="#000000" />

          {/* beak - black, shorter and triangular for goose */}
          <path
            d="M 88 44 
               C 82 42, 78 44, 88 46
               C 90 46, 92 46, 94 45
               C 92 44, 90 44, 88 44 Z"
            fill="#111111"
            stroke="#222222"
            strokeWidth="0.6"
          />
        </motion.g>

        {/* ---------------------------
            LEFT WING (subtle feathers)
            --------------------------- */}
        <motion.g
          animate={currentAnimation.leftWing}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "70px 115px" }}
        >
          <path
            d="M 78 105
               C 65 108, 52 115, 48 125
               C 45 135, 48 145, 58 150
               C 68 153, 78 150, 83 140
               C 85 130, 83 120, 78 105 Z"
            fill="#7F6958"
            stroke="#5E4A3A"
            strokeWidth="1"
          />
          <path d="M 58 120 C 53 125, 53 135, 58 140" fill="none" stroke="#6B5547" strokeWidth="0.6" />
          <path d="M 63 117 C 58 122, 58 132, 63 137" fill="none" stroke="#6B5547" strokeWidth="0.6" />
          <path d="M 68 115 C 63 120, 63 130, 68 135" fill="none" stroke="#6B5547" strokeWidth="0.6" />
        </motion.g>

        {/* ---------------------------
            RIGHT WING
            --------------------------- */}
        <motion.g
          animate={currentAnimation.rightWing}
          transition={currentAnimation.transition}
          style={{ transformOrigin: "130px 115px" }}
        >
          <path
            d="M 122 105
               C 135 108, 148 115, 152 125
               C 155 135, 152 145, 142 150
               C 132 153, 122 150, 117 140
               C 115 130, 117 120, 122 105 Z"
            fill="#7F6958"
            stroke="#5E4A3A"
            strokeWidth="1"
          />
          <path d="M 142 120 C 147 125, 147 135, 142 140" fill="none" stroke="#6B5547" strokeWidth="0.6" />
          <path d="M 137 117 C 142 122, 142 132, 137 137" fill="none" stroke="#6B5547" strokeWidth="0.6" />
          <path d="M 132 115 C 137 120, 137 130, 132 135" fill="none" stroke="#6B5547" strokeWidth="0.6" />
        </motion.g>

        {/* ---------------------------
            FEET - black webbed (animated slightly)
            --------------------------- */}
        <motion.g
          animate={{
            y: currentAnimation.body && currentAnimation.body.y ? currentAnimation.body.y.map((v) => v * 0.08) : [0],
          }}
          transition={currentAnimation.transition}
        >
          <path
            d="M 84 168 C 82 170, 79 173, 77 176 L 75 178 L 79 180 L 83 178 L 87 180 L 91 178 L 89 176 C 87 173 85 170 84 168 Z"
            fill="#111111"
            stroke="#000000"
            strokeWidth="0.6"
          />
          <path
            d="M 116 168 C 118 170, 121 173, 123 176 L 125 178 L 121 180 L 117 178 L 113 180 L 109 178 L 111 176 C 113 173 115 170 116 168 Z"
            fill="#111111"
            stroke="#000000"
            strokeWidth="0.6"
          />
        </motion.g>

        {/* ---------------------------
            Small accessories (optional) - bow tie was making ducky look silly,
            so keep it subtle and smaller. */}
        <g>
          <rect x="98.5" y="78.5" width="3" height="3" fill="#8B1A1A" opacity="0.9" />
        </g>

        {/* ---------------------------
            Thought bubble for thinking
            --------------------------- */}
        {action === "thinking" && (
          <motion.g animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <circle cx="145" cy="45" r="12" fill="#FFFFFF" stroke="#DDD" strokeWidth="2" />
            <circle cx="135" cy="55" r="6" fill="#FFFFFF" stroke="#DDD" strokeWidth="2" />
            <circle cx="130" cy="60" r="3" fill="#FFFFFF" stroke="#DDD" strokeWidth="2" />
            <text x="145" y="50" textAnchor="middle" fontSize="12" fill="#333">
              ?
            </text>
          </motion.g>
        )}

        {/* ---------------------------
            Celebrate / Exclamation
            --------------------------- */}
        {(action === "celebrating" || action === "super_celebrating") && (
          <motion.g
            animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: action === "super_celebrating" ? 0.6 : 1, repeat: Infinity }}
          >
            <circle cx="145" cy="40" r="15" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
            <text x="145" y="47" textAnchor="middle" fontSize="18" fill="#FFF">
              !
            </text>
          </motion.g>
        )}

        {/* ---------------------------
            Confused question marks
            --------------------------- */}
        {action === "confused" && (
          <motion.g>
            {[1, 2, 3].map((i) => (
              <motion.g
                key={i}
                animate={{ y: [0, -10, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.28 }}
              >
                <circle cx={130 + i * 15} cy={35 + i * 5} r="8" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
                <text x={130 + i * 15} y={41 + i * 5} textAnchor="middle" fontSize="12" fill="#333">
                  ?
                </text>
              </motion.g>
            ))}
          </motion.g>
        )}

        {/* ---------------------------
            Amazed stars
            --------------------------- */}
        {action === "amazed" && (
          <motion.g>
            {[1, 2].map((i) => (
              <motion.g
                key={i}
                animate={{ scale: [0, 1.5, 1], rotate: [0, 180, 360], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.32 }}
              >
                <polygon
                  points={`${140 + i * 20},${35 + i * 5} ${142 + i * 20},${42 + i * 5} ${149 + i * 20},${42 + i * 5} ${144 + i * 20},${47 + i * 5} ${146 + i * 20},${54 + i * 5} ${140 + i * 20},${50 + i * 5} ${134 + i * 20},${54 + i * 5} ${136 + i * 20},${47 + i * 5} ${131 + i * 20},${42 + i * 5} ${138 + i * 20},${42 + i * 5}`}
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth="1"
                />
              </motion.g>
            ))}
          </motion.g>
        )}

        {/* ---------------------------
            Honk sound waves (for 'honking')
            --------------------------- */}
        {action === "honking" && (
          <motion.g>
            {[1, 2, 3].map((i) => (
              <motion.path
                key={i}
                d={`M 60 55 Q ${50 - i * 5} ${50 + i * 3} ${40 - i * 8} ${55 + i * 5}`}
                fill="none"
                stroke="#4ECDC4"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ opacity: [0, 1, 0], pathLength: [0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
}

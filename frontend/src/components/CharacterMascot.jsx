import React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedGoose from "./AnimatedGoose";

export default function CharacterMascot({
	action = "idle",
	position = "bottom-right",
	message = "",
	autoHide = true,
	duration = 4000,
	popupFrom = "random", // "random", "left", "right", "top", "bottom"
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [currentMessage, setCurrentMessage] = useState("");
	const [popupMessages, setPopupMessages] = useState([]);
	const [entranceDirection, setEntranceDirection] = useState("right");
	const messageRef = useRef(null);

	// TONS of fun messages that can randomly appear
	const funMessages = [
		// Encouraging messages
		"🎉 Looking awesome today!",
		"💡 Great thinking!",
		"🚀 You've got this!",
		"⭐ Amazing choice!",
		"🔥 On fire!",
		"💪 Super smart!",
		"🎨 Creative genius!",
		"🏆 Champion move!",
		"✨ Brilliant!",
		"🌟 Fantastic work!",
		"👏 Way to go!",
		"🎯 Perfect aim!",
		"🌈 You're amazing!",
		"💫 Pure magic!",
		"🦸 You're a hero!",
		
		// Playful entrance messages
		`🌪️ Zooming in from the ${entranceDirection}!`,
		"💨 Surprise entrance!",
		"🎪 Ta-da! I'm here!",
		"🎭 Dramatic entrance!",
		"🚁 Helicopter landing!",
		"🎢 Roller coaster arrival!",
		"🎪 Circus is in town!",
		"🎨 Paint me surprised!",
		
		// Kid-friendly fun messages
		"🍎 You're the apple of my eye!",
		"🌟 Shooting star wishes!",
		"🎈 Party time!",
		"🎁 You're a gift to the world!",
		"🍀 Lucky me, I found you!",
		"🎵 Music to my ears!",
		"🌸 Blooming brilliant!",
		"🎪 Step right up!",
		"🎭 Break a leg!",
		"🌊 Making waves!",
		"⚡ Electrifying!",
		"🎯 Bulls eye!",
		"🎊 Confetti time!",
		"🎈 Up, up, and away!",
		"🌺 Beautiful mind!",
		"🎪 Center ring star!",
		"🚀 Blast off!",
		"🌟 Wish upon a star!",
		"🎨 Masterpiece maker!",
		"🎪 Greatest show on earth!",
		
		// Interactive messages
		"👀 I spy something awesome!",
		"🤫 Can you keep a secret?",
		"🕵️ Detective skills activated!",
		"🎯 Mission accomplished!",
		"🎪 Welcome to the show!",
		"🎭 Plot twist!",
		"🌟 Star quality!",
		"🎈 Sky's the limit!",
		"🚀 To infinity and beyond!",
		"🎪 Ladies and gentlemen!",
	];

	// Determine entrance direction based on position and popupFrom
	const getEntranceDirection = () => {
		if (popupFrom === "random") {
			const directions = ["left", "right", "top", "bottom"];
			return directions[Math.floor(Math.random() * directions.length)];
		}
		return popupFrom;
	};

	// Get initial position off-screen based on entrance direction - from true device edges
	const getInitialPosition = (direction) => {
		const screenWidth = window.innerWidth || 1200;
		const screenHeight = window.innerHeight || 800;
		
		switch (direction) {
			case "left":
				return { x: -screenWidth - 400, y: 0 }; // Way beyond left edge
			case "right":
				return { x: screenWidth + 400, y: 0 }; // Way beyond right edge  
			case "top":
				return { x: 0, y: -screenHeight - 400 }; // Way above top edge
			case "bottom":
				return { x: 0, y: screenHeight + 400 }; // Way below bottom edge
			default:
				return { x: screenWidth + 400, y: 0 };
		}
	};

	// Get final position - this should be 0,0 since CSS positioning handles the final location
	const getFinalPosition = () => {
		return { x: 0, y: 0 };
	};

	// Get position styles for CSS - positioned below nav bar and fully visible on screen
	const getPositionStyle = () => {
		// Calculate safe positioning that keeps mascot fully visible and below navigation
		const mascotSize = 280; // Our mascot size
		const navBarHeight = 120; // Approximate nav bar height with padding
		const edgeBuffer = 20; // Buffer from screen edges
		
		const positions = {
			"bottom-right": { 
				position: "fixed",
				bottom: `${edgeBuffer}px`,
				right: `${edgeBuffer}px`,
				// No transform needed - position from edge with buffer keeps it fully visible
			},
			"bottom-left": { 
				position: "fixed",
				bottom: `${edgeBuffer}px`, 
				left: `${edgeBuffer}px`,
			},
			"top-right": { 
				position: "fixed",
				top: `${navBarHeight + edgeBuffer}px`, // Below nav bar + buffer
				right: `${edgeBuffer}px`,
			},
			"top-left": { 
				position: "fixed",
				top: `${navBarHeight + edgeBuffer}px`, // Below nav bar + buffer
				left: `${edgeBuffer}px`,
			},
			center: {
				position: "fixed",
				top: "50vh",
				left: "50vw",
				transform: "translate(-50%, -50%)",
			},
			"floating-center": {
				position: "fixed",
				top: `calc(${navBarHeight}px + 30vh)`, // Below nav bar + 30% of remaining viewport
				left: "50vw",
				transform: "translate(-50%, -50%)",
			},
		};
		return positions[position] || positions["top-right"];
	};

	// Add a fun popup message
	const addPopupMessage = () => {
		const randomMessage =
			funMessages[Math.floor(Math.random() * funMessages.length)];
		const id = Date.now();
		setPopupMessages((prev) => [...prev, { id, text: randomMessage }]);

		// Remove popup after 2 seconds
		setTimeout(() => {
			setPopupMessages((prev) => prev.filter((msg) => msg.id !== id));
		}, 2000);
	};

	// Enhanced visibility logic with interactive behaviors
	useEffect(() => {
		if (action !== "hidden") {
			const direction = getEntranceDirection();
			setEntranceDirection(direction);
			console.log(`🦆 Goose entering from: ${direction}`); // Debug log
			setIsVisible(true);
			setCurrentMessage(message);

			// Fun interactive behaviors for kids
			const randomInteraction = Math.random();
			
			// 30% chance for popup messages
			if (randomInteraction > 0.7) {
				setTimeout(addPopupMessage, 1500);
			}
			
			// 20% chance for sneaky peek behavior
			if (randomInteraction > 0.8) {
				setTimeout(() => {
					// Temporarily change to peeking, then back to normal
					setCurrentMessage("👀 Peeking at you!");
					setTimeout(() => setCurrentMessage(message), 2000);
				}, 3000);
			}
			
			// 10% chance for hide and seek behavior
			if (randomInteraction > 0.9) {
				setTimeout(() => {
					setCurrentMessage("🙈 Playing hide and seek!");
					// Add hiding animation here
				}, 4000);
			}

			if (autoHide && duration > 0) {
				const timer = setTimeout(() => {
					setIsVisible(false);
				}, duration);
				return () => clearTimeout(timer);
			}
		} else {
			setIsVisible(false);
		}
	}, [action, message, autoHide, duration]);

	// Spring animation variants
	const springVariants = {
		hidden: {
			...getInitialPosition(entranceDirection),
			scale: 0.2,
			rotate:
				entranceDirection === "left"
					? -360
					: entranceDirection === "right"
					? 360
					: entranceDirection === "top"
					? -180
					: entranceDirection === "bottom"
					? 180
					: 0,
			opacity: 0,
		},
		visible: {
			...getFinalPosition(),
			scale: 1,
			rotate: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 200,
				damping: 15,
				mass: 0.8,
				duration: 1.2,
				bounce: 0.6,
			},
		},
		exit: {
			// Random exit behavior - sometimes tilted, sometimes spinning
			scale: 0.2,
			rotate: Math.random() > 0.5 ? 360 : -180,
			x: Math.random() > 0.5 ? 200 : -200,
			y: Math.random() > 0.5 ? -100 : 100,
			opacity: 0,
			transition: {
				type: "spring",
				stiffness: 250,
				damping: 20,
				duration: 0.8,
			},
		},
		// Fun sneaky peek behavior
		peeking: {
			scale: 0.8,
			rotate: Math.random() > 0.5 ? 15 : -15, // Slightly tilted
			x: Math.random() > 0.5 ? -30 : 30, // Peek from side
			y: 10,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 20,
			},
		},
		// Sneaky hide behavior
		hiding: {
			scale: 0.6,
			rotate: 45,
			x: entranceDirection === "left" ? -80 : 80,
			y: entranceDirection === "top" ? -80 : 80,
			opacity: 0.3,
			transition: {
				type: "spring",
				stiffness: 200,
				damping: 25,
			},
		},
		hover: {
			scale: 1.05,
			y: -8,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 10,
			},
		},
		idle: {
			y: [-5, 5, -5],
			rotate: [-2, 2, -2],
			transition: {
				duration: 4,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	};

	// Speech bubble variants
	const speechVariants = {
		hidden: {
			scale: 0,
			y: 10,
			opacity: 0,
		},
		visible: {
			scale: 1,
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 25,
				delay: 0.3,
			},
		},
		exit: {
			scale: 0,
			y: -10,
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	// Popup message variants
	const popupVariants = {
		hidden: {
			scale: 0,
			y: 20,
			opacity: 0,
		},
		visible: {
			scale: 1,
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 25,
			},
		},
		exit: {
			scale: 0.8,
			y: -30,
			opacity: 0,
			transition: {
				duration: 0.4,
			},
		},
	};

	if (!isVisible && action === "hidden") return null;

	return (
		<AnimatePresence mode="wait">
			{isVisible && (
				<motion.div
					style={{
						...getPositionStyle(),
						zIndex: 40, // Below navigation (z-index: 50) but above content (z-index: 10)
						pointerEvents: "none",
					}}
					variants={springVariants}
					initial="hidden"
					animate={["visible", "idle"]}
					exit="exit"
					whileHover="hover"
				>
					{/* Popup Messages */}
					<AnimatePresence>
						{popupMessages.map((popup, index) => (
							<motion.div
								key={popup.id}
								variants={popupVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								style={{
									position: "absolute",
									top: `-${60 + index * 15}px`,
									left: "50%",
									transform: "translateX(-50%)",
									background:
										"linear-gradient(135deg, #FFD700, #FFA500)",
									border: "3px solid #FF8C00",
									borderRadius: "15px",
									padding: "8px 12px",
									fontSize: "12px",
									fontWeight: "bold",
									color: "#FFF",
									textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
									boxShadow: "0 4px 12px rgba(255,215,0,0.4)",
									whiteSpace: "nowrap",
									zIndex: 1001 + index,
								}}
							>
								{popup.text}
							</motion.div>
						))}
					</AnimatePresence>

					{/* Main mascot container */}
					<div
						style={{
							position: "relative",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						{/* Speech bubble */}
						<AnimatePresence>
							{currentMessage && (
								<motion.div
									ref={messageRef}
									variants={speechVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									style={{
										background:
											"linear-gradient(135deg, #4ECDC4, #44A08D)",
										border: "3px solid #2C7873",
										borderRadius: "20px",
										padding: "14px 18px",
										marginBottom: "15px",
										boxShadow:
											"0 8px 20px rgba(78,205,196,0.3)",
										position: "relative",
										maxWidth: "250px",
										fontSize: "15px",
										fontWeight: "bold",
										color: "#FFF",
										textAlign: "center",
										textShadow:
											"1px 1px 2px rgba(0,0,0,0.2)",
									}}
								>
									{currentMessage}
									{/* Speech bubble tail */}
									<div
										style={{
											position: "absolute",
											bottom: "-14px",
											left: "50%",
											transform: "translateX(-50%)",
											width: 0,
											height: 0,
											borderLeft:
												"12px solid transparent",
											borderRight:
												"12px solid transparent",
											borderTop: "14px solid #2C7873",
										}}
									/>
									<div
										style={{
											position: "absolute",
											bottom: "-11px",
											left: "50%",
											transform: "translateX(-50%)",
											width: 0,
											height: 0,
											borderLeft:
												"10px solid transparent",
											borderRight:
												"10px solid transparent",
											borderTop: "11px solid #44A08D",
										}}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Enhanced Animated Goose Character - HUGE SIZE, No Circle */}
						<motion.div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.3))",
							}}
							whileHover={{
								scale: 1.05,
								transition: {
									type: "spring",
									stiffness: 300,
									damping: 15,
								},
							}}
						>
							<AnimatedGoose action={action} size={280} />
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Note: AnimatedGoose component now handles all character animations
// No need for emoji placeholders anymore!

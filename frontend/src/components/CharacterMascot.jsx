import { useState, useEffect } from "react";
import AnimatedGoose from "./AnimatedGoose";
import React from "react";

export default function CharacterMascot({
	action = "idle",
	position = "bottom-right",
	message = "",
	autoHide = true,
	duration = 3000,
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [currentMessage, setCurrentMessage] = useState("");

	useEffect(() => {
		if (action !== "hidden") {
			setIsVisible(true);
			setCurrentMessage(message);

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

	if (!isVisible && action === "hidden") return null;

	// Position styles
	const getPositionStyle = () => {
		const positions = {
			"bottom-right": { bottom: "20px", right: "20px" },
			"bottom-left": { bottom: "20px", left: "20px" },
			"top-right": { top: "20px", right: "20px" },
			"top-left": { top: "20px", left: "20px" },
			center: {
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
			},
			"floating-center": {
				top: "30%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				animation: "float 3s ease-in-out infinite",
			},
		};
		return positions[position] || positions["bottom-right"];
	};

	// Animation entrance styles
	const getEntranceAnimation = () => {
		const animations = {
			"slide-up": "slideUpEntrance 0.6s ease-out",
			"pop-in": "popInEntrance 0.5s ease-out",
			"fly-in": "flyInEntrance 0.8s ease-out",
			"bounce-in": "bounceInEntrance 0.7s ease-out",
		};
		return animations["bounce-in"]; // default animation
	};

	return (
		<>
			{/* Add CSS animations */}
			<style>
				{`
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }
          @keyframes bounceInEntrance {
            0% { transform: scale(0) rotate(-360deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(-180deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes slideUpEntrance {
            0% { transform: translateY(100px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes popInEntrance {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes flyInEntrance {
            0% { transform: translateX(-100vw) rotate(-180deg); opacity: 0; }
            100% { transform: translateX(0) rotate(0deg); opacity: 1; }
          }
        `}
			</style>

			<div
				style={{
					position: "fixed",
					...getPositionStyle(),
					zIndex: 1000,
					opacity: isVisible ? 1 : 0,
					transition: "opacity 0.3s ease",
					animation: isVisible ? getEntranceAnimation() : "none",
					pointerEvents: "none",
				}}
			>
				{/* Character GIF container */}
				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Speech bubble */}
					{currentMessage && (
						<div
							style={{
								background: "white",
								border: "3px solid #4ecdc4",
								borderRadius: "20px",
								padding: "12px 16px",
								marginBottom: "10px",
								boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
								position: "relative",
								maxWidth: "200px",
								fontSize: "14px",
								fontWeight: "bold",
								color: "#333",
								textAlign: "center",
								animation: "popInEntrance 0.5s ease-out",
							}}
						>
							{currentMessage}
							{/* Speech bubble tail */}
							<div
								style={{
									position: "absolute",
									bottom: "-12px",
									left: "50%",
									transform: "translateX(-50%)",
									width: 0,
									height: 0,
									borderLeft: "10px solid transparent",
									borderRight: "10px solid transparent",
									borderTop: "12px solid #4ecdc4",
								}}
							/>
							<div
								style={{
									position: "absolute",
									bottom: "-9px",
									left: "50%",
									transform: "translateX(-50%)",
									width: 0,
									height: 0,
									borderLeft: "8px solid transparent",
									borderRight: "8px solid transparent",
									borderTop: "9px solid white",
								}}
							/>
						</div>
					)}

					{/* Animated Goose Character */}
					<div
						style={{
							width: "120px",
							height: "120px",
							background: "linear-gradient(45deg, #fff, #f0f8ff)",
							borderRadius: "50%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
							border: "4px solid white",
							overflow: "visible",
						}}
					>
						<AnimatedGoose action={action} size={110} />
					</div>
				</div>
			</div>
		</>
	);
}

// Note: AnimatedGoose component now handles all character animations
// No need for emoji placeholders anymore!

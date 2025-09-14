import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import TimelineCard from "../components/TimelineCard";
import GameIcon, { GameIcons, GameIconLarge } from "../components/GameIcon";

const API = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function Playground() {
	const [timelines, setTimelines] = useState([]);

	useEffect(() => {
		axios
			.get(`${API}/timelines/`)
			.then((r) => setTimelines(r.data))
			.catch(() => setTimelines([]));
	}, []);

	return (
		<div
			style={{
				background: "linear-gradient(135deg, #8B4513 0%, #654321 100%)",
				minHeight: "100vh",
				padding: 20,
			}}
		>
			<div style={{ maxWidth: 1200, margin: "0 auto" }}>
				{/* Header Section */}
				<div
					style={{
						textAlign: "center",
						marginBottom: 30,
						background: "#F5DEB3",
						border: "4px solid #8B4513",
						borderRadius: 20,
						padding: 30,
						boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
					}}
				>
					<h1
						style={{ fontSize: "3em", margin: 0, color: "#654321" }}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "15px",
							}}
						>
							<GameIconLarge
								icon="sparkles"
								color="#654321"
								size={32}
							/>
							Timeline Playground
							<GameIconLarge
								icon="sparkles"
								color="#654321"
								size={32}
							/>
						</div>
					</h1>
					<p
						style={{
							fontSize: "1.3em",
							color: "#654321",
							margin: "15px 0 20px 0",
						}}
					>
						Welcome to your magical world of parallel futures! Watch
						as your choices come to life in 3D!
					</p>

					{/* Stats Bar */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fit, minmax(150px, 1fr))",
							gap: 15,
							marginTop: 20,
						}}
					>
						<div
							style={{
								background: "#A0522D",
								border: "2px solid #8B4513",
								color: "white",
								padding: "15px",
								borderRadius: 15,
								textAlign: "center",
							}}
						>
							<div
								style={{ fontSize: "2em", fontWeight: "bold" }}
							>
								{timelines.length}
							</div>
							<div
								style={{
									fontSize: "0.9em",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "6px",
								}}
							>
								<GameIcon icon="film" color="white" size={16} />
								Total Adventures
							</div>
						</div>
						<div
							style={{
								background: "#DAA520",
								border: "2px solid #B8860B",
								color: "white",
								padding: "15px",
								borderRadius: 15,
								textAlign: "center",
							}}
						>
							<div
								style={{ fontSize: "2em", fontWeight: "bold" }}
							>
								{timelines.length}
							</div>
							<div style={{ fontSize: "0.9em" }}>
								📚 Your Stories
							</div>
						</div>
						<div
							style={{
								background: "#D2691E",
								border: "2px solid #A0522D",
								color: "white",
								padding: "15px",
								borderRadius: 15,
								textAlign: "center",
							}}
						>
							<div
								style={{ fontSize: "2em", fontWeight: "bold" }}
							>
								{timelines.length > 0
									? Math.round(
											(timelines.reduce(
												(sum, t) =>
													sum +
													(t.simulated?.multiplier ||
														t.localSimulation?.multiplier ||
														1),
												0
											) /
												timelines.length) *
												10
									  ) / 10
									: 0}
							</div>
							<div style={{ fontSize: "0.9em" }}>
								⭐ Average Success
							</div>
						</div>
					</div>
				</div>

				{/* Character Showcase Section */}
				<div
					style={{
						background: "#F5DEB3",
						border: "4px solid #8B4513",
						borderRadius: 20,
						padding: 25,
						marginBottom: 25,
						boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
					}}
				>
					<div style={{ textAlign: "center", marginBottom: 20 }}>
						<h2
							style={{
								fontSize: "2em",
								margin: 0,
								color: "#654321",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "12px",
								}}
							>
								<GameIcons.Timeline color="#654321" size={24} />
								Your Timeline Adventure Gallery
							</div>
						</h2>
						<p
							style={{
								fontSize: "1.1em",
								color: "#654321",
								margin: "10px 0",
							}}
						>
							Watch your timelines come alive! Our magical friend
							shows you how awesome your choices are! ✨
						</p>
					</div>

					{timelines.length > 0 ? (
						<div
							style={{
								background:
									"linear-gradient(135deg, #8B4513 0%, #654321 100%)",
								borderRadius: 15,
								padding: 30,
								minHeight: 300,
								position: "relative",
								overflow: "hidden",
							}}
						>
							{/* Floating background elements */}
							<div
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.2) 0%, transparent 50%)
                `,
									animation: "float 6s ease-in-out infinite",
								}}
							/>

							{/* Timeline Success Visualization */}
							<div
								style={{
									display: "grid",
									gridTemplateColumns:
										"repeat(auto-fit, minmax(80px, 1fr))",
									gap: 15,
									marginBottom: 20,
									position: "relative",
									zIndex: 2,
								}}
							>
								{timelines.slice(0, 8).map((timeline, i) => {
									const success =
										timeline.simulated?.multiplier ?? timeline.localSimulation?.multiplier ?? 1;
									const height = Math.max(
										40,
										Math.min(120, success * 40)
									);
									const getSuccessEmoji = (mult) => {
										if (mult >= 2.5)
											return (
												<GameIcon
													icon="star"
													color="white"
													size={20}
												/>
											);
										if (mult >= 2.0)
											return (
												<GameIcon
													icon="trophy"
													color="white"
													size={20}
												/>
											);
										if (mult >= 1.5)
											return (
												<GameIcon
													icon="sparkles"
													color="white"
													size={20}
												/>
											);
										if (mult >= 1.0)
											return (
												<GameIcon
													icon="target"
													color="white"
													size={20}
												/>
											);
										return (
											<GameIcon
												icon="zap"
												color="white"
												size={20}
											/>
										);
									};

									return (
										<div
											key={timeline.id}
											style={{ textAlign: "center" }}
										>
											<div
												style={{
													height: `${height}px`,
													width: "60px",
													background: `linear-gradient(to top, 
                          ${
								success >= 2.5
									? "#4caf50"
									: success >= 2.0
									? "#8bc34a"
									: success >= 1.5
									? "#ffc107"
									: success >= 1.0
									? "#ff9800"
									: "#f44336"
							}, 
                          ${
								success >= 2.5
									? "#81c784"
									: success >= 2.0
									? "#aed581"
									: success >= 1.5
									? "#ffeb3b"
									: success >= 1.0
									? "#ffb74d"
									: "#ef5350"
							})`,
													borderRadius:
														"30px 30px 8px 8px",
													margin: "0 auto 8px auto",
													display: "flex",
													alignItems: "flex-start",
													justifyContent: "center",
													paddingTop: "8px",
													fontSize: "20px",
													boxShadow:
														"0 5px 15px rgba(0,0,0,0.2)",
													animation: `bounce 2s ease-in-out infinite ${
														i * 0.2
													}s`,
													position: "relative",
													overflow: "hidden",
												}}
											>
												{getSuccessEmoji(success)}
												{/* Sparkle effect for high success */}
												{success >= 2.0 && (
													<div
														style={{
															position:
																"absolute",
															top: 0,
															left: 0,
															right: 0,
															bottom: 0,
															background:
																"linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
															animation:
																"shimmer 2s infinite",
														}}
													/>
												)}
											</div>
											<div
												style={{
													color: "white",
													fontSize: "10px",
													fontWeight: "bold",
													textShadow:
														"1px 1px 2px rgba(0,0,0,0.5)",
												}}
											>
												{timeline.name.substring(0, 8)}
												...
											</div>
										</div>
									);
								})}
							</div>

							{/* Summary message */}
							<div
								style={{
									textAlign: "center",
									color: "white",
									position: "relative",
									zIndex: 2,
								}}
							>
								<h3
									style={{
										margin: "20px 0 10px 0",
										fontSize: "1.5em",
										textShadow:
											"2px 2px 4px rgba(0,0,0,0.3)",
									}}
								>
									{timelines.filter(
										(t) =>
											(t.simulated?.multiplier ?? t.localSimulation?.multiplier ?? 1) >=
											2.0
									).length >
									timelines.length / 2 ? (
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												gap: "8px",
											}}
										>
											<GameIcon
												icon="trophy"
												color="white"
												size={20}
											/>
											<span>
												Wow! You're making amazing
												choices!
											</span>
										</div>
									) : timelines.filter(
											(t) =>
												(t.simulated?.multiplier ?? t.localSimulation?.multiplier ??
													1) >= 1.5
									  ).length > 0 ? (
										"😊 Great job! Keep exploring different choices!"
									) : (
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												gap: "8px",
											}}
										>
											<GameIcon
												icon="zap"
												color="white"
												size={20}
											/>
											<span>
												Every choice is a learning
												adventure!
											</span>
										</div>
									)}
								</h3>
								<p
									style={{
										margin: 0,
										fontSize: "1.1em",
										opacity: 0.9,
									}}
								>
									You have {timelines.length} timeline
									adventures! Each one shows what happens with
									different choices.
								</p>
							</div>

							{/* Add CSS for animations */}
							<style>
								{`
                  @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                  }
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}
							</style>
						</div>
					) : (
						<div
							style={{
								textAlign: "center",
								padding: 60,
								background: "#F5DEB3",
								border: "4px solid #8B4513",
								borderRadius: 15,
								color: "#654321",
							}}
						>
							<div style={{ marginBottom: 20 }}>
								<GameIconLarge
									icon="palette"
									color="#654321"
									size={60}
								/>
							</div>
							<h3
								style={{
									margin: "0 0 15px 0",
									fontSize: "1.8em",
									color: "#654321",
								}}
							>
								Your Adventure Gallery is Empty!
							</h3>
							<p
								style={{
									margin: "0 0 25px 0",
									fontSize: "1.2em",
									color: "#8B4513",
								}}
							>
								Create your first timeline and watch the magic
								happen!
							</p>
						</div>
					)}
				</div>

				{/* Timeline Cards Section */}
				<div
					style={{
						background: "#F5DEB3",
						border: "4px solid #8B4513",
						borderRadius: 20,
						padding: 25,
						boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
					}}
				>
					<div style={{ textAlign: "center", marginBottom: 25 }}>
						<h2
							style={{
								fontSize: "2em",
								margin: 0,
								color: "#654321",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "12px",
								}}
							>
								<GameIcons.Timeline color="#654321" size={24} />
								Your Timeline Adventures
							</div>
						</h2>
						<p
							style={{
								fontSize: "1.1em",
								color: "#654321",
								margin: "10px 0 20px 0",
							}}
						>
							Click on any timeline to visit that parallel world
							and see what happened!
						</p>

						{/* Filter/Sort Options */}
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								gap: 10,
								marginBottom: 20,
								flexWrap: "wrap",
							}}
						>
							<button
								style={{
									background: "#8B4513",
									color: "white",
									border: "none",
									padding: "10px 20px",
									borderRadius: 25,
									cursor: "pointer",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "6px",
									}}
								>
									<GameIcon
										icon="star"
										color="white"
										size={16}
									/>
									All Stories
								</div>
							</button>
							<button
								style={{
									background: "#F5DEB3",
									color: "#654321",
									border: "2px solid #8B4513",
									padding: "10px 20px",
									borderRadius: 25,
									cursor: "pointer",
								}}
							>
								🏠 My Stories
							</button>
							<button
								style={{
									background: "#F5DEB3",
									color: "#654321",
									border: "2px solid #8B4513",
									padding: "10px 20px",
									borderRadius: 25,
									cursor: "pointer",
								}}
							>
								👫 Friends' Stories
							</button>
						</div>
					</div>

					{timelines.length > 0 ? (
						<div
							style={{
								display: "grid",
								gridTemplateColumns:
									"repeat(auto-fill, minmax(300px, 1fr))",
								gap: 20,
							}}
						>
							{timelines.map((t) => (
								<div
									key={t.id}
									style={{
										transform: "translateY(0)",
										transition: "all 0.3s",
									}}
								>
									<TimelineCard timeline={t} />
								</div>
							))}
						</div>
					) : (
						<div
							style={{
								textAlign: "center",
								padding: 60,
								background: "#F5DEB3",
								border: "4px solid #8B4513",
								borderRadius: 15,
								color: "#654321",
							}}
						>
							<div style={{ marginBottom: 20 }}>
								<GameIconLarge
									icon="film"
									color="#654321"
									size={60}
								/>
							</div>
							<h3
								style={{
									margin: "0 0 15px 0",
									fontSize: "1.8em",
									color: "#654321",
								}}
							>
								Ready to Start Your Adventure?
							</h3>
							<p
								style={{
									margin: "0 0 25px 0",
									fontSize: "1.2em",
									color: "#8B4513",
								}}
							>
								Create your first timeline and watch your
								choices come to life!
							</p>
							<button
								onClick={() =>
									(window.location.href = "/editor")
								}
								style={{
									background:
										"linear-gradient(45deg, #DAA520, #B8860B)",
									color: "white",
									border: "none",
									padding: "15px 30px",
									borderRadius: 25,
									fontSize: "1.2em",
									cursor: "pointer",
									fontWeight: "bold",
									boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
									transform: "translateY(-2px)",
									transition: "all 0.3s",
								}}
								onMouseEnter={(e) => {
									e.target.style.transform =
										"translateY(-4px)";
									e.target.style.boxShadow =
										"0 8px 25px rgba(0,0,0,0.3)";
								}}
								onMouseLeave={(e) => {
									e.target.style.transform =
										"translateY(-2px)";
									e.target.style.boxShadow =
										"0 5px 15px rgba(0,0,0,0.2)";
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "8px",
									}}
								>
									<GameIcon
										icon="sparkles"
										color="white"
										size={18}
									/>
									Create My First Timeline!
								</div>
							</button>
						</div>
					)}
				</div>

				{/* Fun Tips Section */}
				{timelines.length > 0 && (
					<div
						style={{
							background:
								"linear-gradient(45deg, #DAA520, #B8860B)",
							color: "white",
							borderRadius: 20,
							padding: 25,
							marginTop: 25,
							textAlign: "center",
						}}
					>
						<h3
							style={{
								margin: "0 0 15px 0",
								fontSize: "1.5em",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "10px",
							}}
						>
							<GameIcon icon="palette" color="white" size={24} />
							Pro Tips for Timeline Explorers!
						</h3>
						<div
							style={{
								display: "grid",
								gridTemplateColumns:
									"repeat(auto-fit, minmax(250px, 1fr))",
								gap: 20,
							}}
						>
							<div>
								<div
									style={{ fontSize: "2em", marginBottom: 8 }}
								>
									🎯
								</div>
								<strong>Try Different Choices</strong>
								<br />
								<span
									style={{ fontSize: "0.9em", opacity: 0.9 }}
								>
									Compare timelines with different decisions!
								</span>
							</div>
							<div>
								<div
									style={{ fontSize: "2em", marginBottom: 8 }}
								>
									👫
								</div>
								<strong>Share with Friends</strong>
								<br />
								<span
									style={{ fontSize: "0.9em", opacity: 0.9 }}
								>
									Create multiple timelines to compare results!
								</span>
							</div>
							<div>
								<div
									style={{ fontSize: "2em", marginBottom: 8 }}
								>
									🔍
								</div>
								<strong>Explore Details</strong>
								<br />
								<span
									style={{ fontSize: "0.9em", opacity: 0.9 }}
								>
									Visit timelines to see what the AI thinks!
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import GameIcon, { GameIcons } from "../components/GameIcon";
import { simulateClient } from "../api/apiClient";
import SimulateButton from "../components/SimulateButton";

const API = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function Visit() {
	const { id } = useParams();
	const [timeline, setTimeline] = useState(null);
	const [showParent, setShowParent] = useState(false);

	useEffect(() => {
		axios
			.get(`${API}/timelines/${id}`)
			.then((r) => setTimeline(r.data))
			.catch(console.error);
	}, [id]);

	if (!timeline) return <div>Loading timeline...</div>;
	if (!timeline.simulated) return <div>Timeline data incomplete...</div>;

	const { name, owner, choices, simulated, analysis } = timeline;

	// Convert multiplier to kid-friendly metrics
	const getSuccessLevel = (mult) => {
		if (mult >= 2.5)
			return {
				level: "AMAZING",
				icon: <GameIcon icon="star" color="white" size={32} />,
				color: "#DAA520",
				description: "Super Successful!",
			};
		if (mult >= 2.0)
			return {
				level: "GREAT",
				icon: <GameIcon icon="trophy" color="white" size={32} />,
				color: "#A0522D",
				description: "Really Good!",
			};
		if (mult >= 1.5)
			return {
				level: "GOOD",
				icon: <GameIcon icon="sparkles" color="white" size={32} />,
				color: "#8B4513",
				description: "Pretty Good!",
			};
		if (mult >= 1.0)
			return {
				level: "OKAY",
				icon: <GameIcon icon="target" color="white" size={32} />,
				color: "#CD853F",
				description: "Could Be Better",
			};
		return {
			level: "TOUGH",
			icon: <GameIcon icon="zap" color="white" size={32} />,
			color: "#D2691E",
			description: "Needs Some Help",
		};
	};

	const success = getSuccessLevel(simulated?.multiplier ?? 1);
	const moneyBars = Math.max(
		1,
		Math.min(10, Math.round((simulated?.multiplier ?? 1) * 3))
	);
	const happinessBars = Math.max(
		1,
		Math.min(10, Math.round((simulated?.emotional ?? 0) * 10))
	);

	return (
		<div
			style={{
				background: "linear-gradient(135deg, #8B4513 0%, #654321 100%)",
				minHeight: "100vh",
				padding: 20,
			}}
		>
			<div
				style={{
					maxWidth: 800,
					margin: "0 auto",
					background: "#F5DEB3",
					border: "4px solid #8B4513",
					borderRadius: 20,
					padding: 30,
					boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
				}}
			>
				{/* Header */}
				<div style={{ textAlign: "center", marginBottom: 30 }}>
					<h1
						style={{
							fontSize: "2.5em",
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
							<GameIcons.Story color="#654321" size={32} />
							{name}
						</div>
					</h1>
					<p
						style={{
							fontSize: "1.2em",
							color: "#654321",
							margin: "10px 0",
						}}
					>
						{owner}'s Future Adventure Story! ✨
					</p>
				</div>

				{/* Success Level */}
				<div
					style={{
						background: success.color,
						color: "white",
						borderRadius: 15,
						padding: 25,
						marginBottom: 25,
						textAlign: "center",
					}}
				>
					<div style={{ marginBottom: 10 }}>{success.icon}</div>
					<h2 style={{ margin: "0 0 10px 0", fontSize: "2em" }}>
						{success.level} SUCCESS!
					</h2>
					<p style={{ fontSize: "1.3em", margin: 0 }}>
						{success.description}
					</p>
				</div>

				{/* Choices Made */}
				<div
					style={{
						background: "#e3f2fd",
						border: "3px solid #2196f3",
						borderRadius: 15,
						padding: 20,
						marginBottom: 25,
					}}
				>
					<h3
						style={{
							color: "#1565c0",
							margin: "0 0 15px 0",
							fontSize: "1.4em",
						}}
					>
						🎯 Choices You Made
					</h3>
					<div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
						{(choices || []).map((choice, i) => (
							<span
								key={i}
								style={{
									background: "#2196f3",
									color: "white",
									padding: "8px 15px",
									borderRadius: 20,
									fontSize: "1em",
									fontWeight: "bold",
								}}
							>
								{choice.trim()}
							</span>
						))}
					</div>
				</div>

				{/* Money & Happiness Bars */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 20,
						marginBottom: 25,
					}}
				>
					{/* Money Progress */}
					<div
						style={{
							background: "#e8f5e8",
							border: "3px solid #4caf50",
							borderRadius: 15,
							padding: 20,
						}}
					>
						<h3
							style={{
								color: "#2e7d32",
								margin: "0 0 15px 0",
								display: "flex",
								alignItems: "center",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
								}}
							>
								<GameIcons.Money color="#2e7d32" size={20} />
								Money Power
							</div>
						</h3>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: 10,
							}}
						>
							{[...Array(10)].map((_, i) => (
								<div
									key={i}
									style={{
										width: 20,
										height: 20,
										margin: "0 2px",
										borderRadius: 4,
										background:
											i < moneyBars
												? "#4caf50"
												: "#e0e0e0",
										transition: "all 0.3s",
									}}
								/>
							))}
							<span
								style={{
									marginLeft: 10,
									fontWeight: "bold",
									color: "#2e7d32",
								}}
							>
								{moneyBars}/10
							</span>
						</div>
						<p style={{ margin: 0, color: "#2e7d32" }}>
							{moneyBars >= 8
								? "🎉 Amazing! You could buy almost anything!"
								: moneyBars >= 6
								? "Great! You could buy lots of cool stuff!"
								: moneyBars >= 4
								? "👍 Good! You could buy some nice things!"
								: "💪 Keep trying! You can get better at this!"}
						</p>
					</div>

					{/* Happiness Progress */}
					<div
						style={{
							background: "#fff3e0",
							border: "3px solid #ff9800",
							borderRadius: 15,
							padding: 20,
						}}
					>
						<h3
							style={{
								color: "#f57c00",
								margin: "0 0 15px 0",
								display: "flex",
								alignItems: "center",
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
									color="#f57c00"
									size={20}
								/>
								Happiness Level
							</div>
						</h3>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: 10,
							}}
						>
							{[...Array(10)].map((_, i) => (
								<div
									key={i}
									style={{
										width: 20,
										height: 20,
										margin: "0 2px",
										borderRadius: "50%",
										background:
											i < happinessBars
												? "#ff9800"
												: "#e0e0e0",
										transition: "all 0.3s",
									}}
								/>
							))}
							<span
								style={{
									marginLeft: 10,
									fontWeight: "bold",
									color: "#f57c00",
								}}
							>
								{happinessBars}/10
							</span>
						</div>
						<p style={{ margin: 0, color: "#f57c00" }}>
							{happinessBars >= 8
								? "Super happy and confident!"
								: happinessBars >= 6
								? "😄 Pretty happy with life!"
								: happinessBars >= 4
								? "😐 Feeling okay, could be better!"
								: "😔 Might need some help feeling better!"}
						</p>
					</div>
				</div>

				{/* Cool Things That Happened */}
				<div
					style={{
						background: "#f3e5f5",
						border: "3px solid #9c27b0",
						borderRadius: 15,
						padding: 20,
						marginBottom: 25,
					}}
				>
					<h3
						style={{
							color: "#7b1fa2",
							margin: "0 0 15px 0",
							fontSize: "1.4em",
							display: "flex",
							alignItems: "center",
							gap: "10px",
						}}
					>
						<GameIcon icon="zap" color="#7b1fa2" size={22} />
						Cool Things That Happened!
					</h3>
					<div style={{ display: "grid", gap: 12 }}>
						{(simulated.events || []).map((event, i) => (
							<div
								key={i}
								style={{
									background: "white",
									padding: 15,
									borderRadius: 10,
									display: "flex",
									alignItems: "center",
									border: `2px solid ${
										event.impact >= 0
											? "#4caf50"
											: "#ff5722"
									}`,
								}}
							>
								<div
									style={{
										fontSize: "1.5em",
										marginRight: 15,
									}}
								>
									{event.impact >= 0 ? "🎉" : "😅"}
								</div>
								<div style={{ flex: 1 }}>
									<div
										style={{
											fontWeight: "bold",
											color: "#333",
										}}
									>
										{event.text}
									</div>
									<div
										style={{
											fontSize: "0.9em",
											color:
												event.impact >= 0
													? "#4caf50"
													: "#ff5722",
										}}
									>
										{event.impact >= 0
											? "This helped you!"
											: "This was tricky, but you learned!"}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* AI Analysis */}
				<div
					style={{
						background: "#e1f5fe",
						border: "3px solid #00bcd4",
						borderRadius: 15,
						padding: 20,
						marginBottom: 25,
					}}
				>
					<h3
						style={{
							color: "#00838f",
							margin: "0 0 15px 0",
							fontSize: "1.4em",
							display: "flex",
							alignItems: "center",
							gap: "10px",
						}}
					>
						<GameIcons.AI color="#00838f" size={22} />
						What Our AI Friend Says About You!
					</h3>
					<div
						style={{
							background: "white",
							padding: 15,
							borderRadius: 10,
							marginBottom: 15,
						}}
					>
						<p
							style={{
								margin: 0,
								fontSize: "1.1em",
								color: "#333",
							}}
						>
							{analysis?.summary}
						</p>
					</div>
					<div>
						<strong style={{ color: "#00838f" }}>
							Your Special Traits:
						</strong>
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								gap: 8,
								marginTop: 8,
							}}
						>
							{(analysis?.tags || []).map((tag, i) => (
								<span
									key={i}
									style={{
										background: "#00bcd4",
										color: "white",
										padding: "6px 12px",
										borderRadius: 15,
										fontSize: "0.9em",
									}}
								>
									#{tag}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Parent Mode Toggle */}
				<div style={{ textAlign: "center", marginBottom: 20 }}>
					<label
						style={{
							display: "inline-flex",
							alignItems: "center",
							background: "#f8f9fa",
							padding: "10px 20px",
							borderRadius: 25,
							cursor: "pointer",
							fontWeight: "bold",
						}}
					>
						<input
							type="checkbox"
							checked={showParent}
							onChange={(e) => setShowParent(e.target.checked)}
							style={{ marginRight: 10 }}
						/>
						👨‍👩‍👧‍👦 Show Parent View
					</label>
				</div>

				{/* Parent Overlay */}
				{showParent && (
					<div
						style={{
							background:
								"linear-gradient(45deg, #ff9800, #ff5722)",
							color: "white",
							borderRadius: 15,
							padding: 25,
							marginBottom: 25,
						}}
					>
						<h3 style={{ margin: "0 0 15px 0", fontSize: "1.4em" }}>
							👨‍👩‍👧‍👦 Parent Insights
						</h3>
						<div
							style={{
								background: "rgba(255,255,255,0.2)",
								padding: 15,
								borderRadius: 10,
							}}
						>
							<p
								style={{
									margin: "0 0 10px 0",
									fontSize: "1.1em",
								}}
							>
								This timeline shows how your child's choices
								could affect your family's financial goals.
							</p>
							<div
								style={{
									fontSize: "1.2em",
									fontWeight: "bold",
								}}
							>
								Family Impact Score:{" "}
								{((simulated?.multiplier ?? 1) * 10).toFixed(0)}
								/30
							</div>
							<p
								style={{
									margin: "10px 0 0 0",
									fontSize: "0.95em",
								}}
							>
								{(simulated?.multiplier ?? 1) >= 2.0
									? "🎯 Excellent! These habits support major goals like college savings."
									: (simulated?.multiplier ?? 1) >= 1.5
									? "👍 Good foundation! Consider discussing long-term financial planning."
									: "💡 Great learning opportunity! Talk about balancing fun spending with saving for big dreams."}
							</p>
						</div>
					</div>
				)}

				{/* RBC Investease Integration Showcase */}
				{timeline.rbc_investease && (
					<div
						style={{
							background: "#f8f6ff",
							border: "3px solid #7c3aed",
							borderRadius: 15,
							padding: 20,
							marginBottom: 25,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "15px",
								marginBottom: 15,
							}}
						>
							<div
								style={{
									background: "#7c3aed",
									color: "white",
									borderRadius: "50%",
									width: 50,
									height: 50,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "1.5em",
								}}
							>
								🏦
							</div>
							<div>
								<h3
									style={{
										margin: 0,
										color: "#7c3aed",
										fontSize: "1.4em",
									}}
								>
									Powered by RBC Investease
								</h3>
								<p
									style={{
										margin: 0,
										color: "#666",
										fontSize: "0.9em",
									}}
								>
									Real financial calculations from RBC Bank
								</p>
							</div>
						</div>

						{/* API Integration Details (for technical demo) */}
						{showParent && timeline.rbc_investease.api_metadata && (
							<div
								style={{
									background: "#ede9fe",
									border: "2px solid #8b5cf6",
									borderRadius: 10,
									padding: 15,
									marginBottom: 15,
								}}
							>
								<h4
									style={{
										margin: "0 0 10px 0",
										color: "#8b5cf6",
									}}
								>
									🔧 API Integration Details
								</h4>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: 10,
										fontSize: "0.9em",
									}}
								>
									<div>
										<strong>Endpoint:</strong>
										<br />
										<code
											style={{
												background: "#fff",
												padding: "2px 6px",
												borderRadius: 4,
											}}
										>
											{
												timeline.rbc_investease
													.api_metadata.endpoint
											}
										</code>
									</div>
									<div>
										<strong>Provider:</strong>
										<br />
										{
											timeline.rbc_investease.api_metadata
												.provider
										}
									</div>
									<div>
										<strong>Portfolios Simulated:</strong>
										<br />
										{
											timeline.rbc_investease.api_metadata
												.portfolios_simulated
										}
									</div>
									<div>
										<strong>Simulation Period:</strong>
										<br />
										{
											timeline.rbc_investease.api_metadata
												.simulation_months
										}{" "}
										months
									</div>
								</div>
							</div>
						)}

						{/* Kid Adventures Display */}
						{timeline.kid_adventures &&
							timeline.kid_adventures.adventures && (
								<div>
									<h4
										style={{
											margin: "0 0 15px 0",
											color: "#7c3aed",
										}}
									>
										🎮 Your Money Adventures
									</h4>
									<div
										style={{
											display: "grid",
											gridTemplateColumns:
												"repeat(auto-fit, minmax(280px, 1fr))",
											gap: 15,
										}}
									>
										{timeline.kid_adventures.adventures.map(
											(adventure, i) => (
												<div
													key={i}
													style={{
														background: "#fff",
														border: "2px solid #4caf50",
														borderRadius: 12,
														padding: 15,
													}}
												>
													<div
														style={{
															display: "flex",
															alignItems:
																"center",
															gap: "10px",
															marginBottom: 10,
														}}
													>
														<span
															style={{
																fontSize:
																	"1.5em",
															}}
														>
															{adventure.emoji}
														</span>
														<h5
															style={{
																margin: 0,
																color: "#2e7d32",
																fontSize:
																	"1.1em",
															}}
														>
															{
																adventure.adventure_name
															}
														</h5>
													</div>
													<p
														style={{
															margin: "0 0 10px 0",
															fontSize: "0.95em",
															lineHeight: 1.4,
															color: "#333",
														}}
													>
														{adventure.story}
													</p>
													{adventure.learning_point && (
														<div
															style={{
																background:
																	"#f1f8e9",
																border: "1px solid #8bc34a",
																borderRadius: 8,
																padding: 8,
																fontSize:
																	"0.85em",
																color: "#33691e",
															}}
														>
															💡{" "}
															<strong>
																Learning:
															</strong>{" "}
															{
																adventure.learning_point
															}
														</div>
													)}
													{showParent &&
														adventure.real_data && (
															<div
																style={{
																	background:
																		"#fff3e0",
																	border: "1px solid #ff9800",
																	borderRadius: 8,
																	padding: 8,
																	marginTop: 8,
																	fontSize:
																		"0.8em",
																	color: "#e65100",
																}}
															>
																📊{" "}
																<strong>
																	Technical:
																</strong>{" "}
																{
																	adventure.real_data
																}
															</div>
														)}
												</div>
											)
										)}
									</div>
									{timeline.kid_adventures.overall_story && (
										<div
											style={{
												background: "#fff",
												border: "2px solid #ff9800",
												borderRadius: 12,
												padding: 15,
												marginTop: 15,
												textAlign: "center",
											}}
										>
											<h5
												style={{
													margin: "0 0 8px 0",
													color: "#f57c00",
												}}
											>
												🌟 Overall Adventure Summary
											</h5>
											<p
												style={{
													margin: 0,
													fontSize: "0.95em",
													fontStyle: "italic",
													color: "#333",
												}}
											>
												{
													timeline.kid_adventures
														.overall_story
												}
											</p>
										</div>
									)}
								</div>
							)}
					</div>
				)}

				{/* Fun Facts */}
				<div
					style={{
						background: "linear-gradient(45deg, #8B4513, #654321)",
						color: "white",
						borderRadius: 15,
						padding: 20,
						textAlign: "center",
					}}
				>
					<h3
						style={{
							margin: "0 0 10px 0",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "10px",
						}}
					>
						<GameIcon icon="sparkles" color="white" size={22} />
						Fun Fact!
					</h3>
					<p style={{ margin: 0, fontSize: "1.1em" }}>
						{(simulated?.multiplier ?? 1) >= 2.0
							? "If you kept making choices like these for 10 years, you could probably buy your own car!"
							: (simulated?.multiplier ?? 1) >= 1.5
							? "Choices like these could help you save enough for that expensive gaming setup!"
							: "Every choice is a learning experience - even tough ones teach us something valuable!"}
					</p>

					<SimulateButton id={id} setTimeline={setTimeline} />

				</div>
			</div>
		</div>
	);
}

import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createTimelineWithRegistration } from "../api/apiClient";
import GameIcon, { GameIcons, GameIconLarge } from "../components/GameIcon";
import { Container, Card, Heading, Text } from "../components/ui";

export default function TimelineEditor() {
	const [name, setName] = useState("");
	const [owner, setOwner] = useState("You");
	const [email, setEmail] = useState("");
	const [cashAmount, setCashAmount] = useState(10000);
	const [portfolios, setPortfolios] = useState([]);
	const [choices, setChoices] = useState("");
	const [profileText, setProfileText] = useState("");
	const [loading, setLoading] = useState(false);
	const nav = useNavigate();

	async function createTimeline(e) {
		e.preventDefault();
		setLoading(true);

		try {
			// Always use the Cohere AI registration endpoint
			const userData = {
				name: owner,
				email,
				cashAmount,
				portfolios,
				profileText,
				choices: choices
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
			};

			const res = await createTimelineWithRegistration(userData);

			if (res.success) {
				const locals = JSON.parse(
					localStorage.getItem("pl_local_timelines") || "[]"
				);
				locals.unshift(res.timeline);
				localStorage.setItem(
					"pl_local_timelines",
					JSON.stringify(locals)
				);
				setLoading(false);
				alert("Timeline created and client registered successfully!");
				nav(`/visit/${res.timeline.id}`);
			} else {
				throw new Error(res.error || "Registration failed");
			}
		} catch (err) {
			console.error(err);
			alert(`Error creating timeline: ${err.message || err}`);
			setLoading(false);
		}
	}

	return (
		<div
			style={{
				background:
					"linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-800) 100%)",
				minHeight: "100vh",
			}}
		>
			<Container size="md" padding="lg">
				<Card variant="elevated" padding="xl">
					<div
						style={{
							textAlign: "center",
							marginBottom: "var(--space-8)",
						}}
					>
						<Heading
							level={1}
							size="4xl"
							align="center"
							icon="sparkles"
							style={{ marginBottom: "var(--space-4)" }}
						>
							Create Your Future Adventure!
						</Heading>
						<Text
							size="xl"
							align="center"
							style={{
								margin: 0,
								color: "var(--color-primary-700)",
							}}
						>
							What if you could see into the future? Let's build
							your story and see what happens!
						</Text>
					</div>

					<form onSubmit={createTimeline}>
						<div
							style={{
								background: "#F5DEB3",
								border: "3px solid #DAA520",
								borderRadius: 15,
								padding: 20,
								marginBottom: 25,
							}}
						>
							<label
								style={{
									display: "block",
									fontSize: "1.3em",
									fontWeight: "bold",
									marginBottom: 10,
									color: "#654321",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "10px",
									}}
								>
									<GameIcons.Story
										color="#654321"
										size={24}
									/>
									What's Your Story Called?
								</div>
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
								}}
							>
								Give your adventure a cool name! What's the main
								thing you want to try?
							</p>
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: 10,
									marginBottom: 12,
								}}
							>
								<button
									type="button"
									onClick={() =>
										setName("My Awesome Lemonade Stand")
									}
									style={{
										background: "#DAA520",
										border: "none",
										padding: "8px 12px",
										borderRadius: 20,
										cursor: "pointer",
										color: "white",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										<GameIcons.Business
											color="white"
											size={18}
										/>
										Lemonade Stand
									</div>
								</button>
								<button
									type="button"
									onClick={() =>
										setName("Saving My Allowance Adventure")
									}
									style={{
										background: "#8B4513",
										border: "none",
										padding: "8px 12px",
										borderRadius: 20,
										cursor: "pointer",
										color: "white",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										<GameIcons.Savings
											color="white"
											size={18}
										/>
										Saving Money
									</div>
								</button>
								<button
									type="button"
									onClick={() =>
										setName("My Pet Care Business")
									}
									style={{
										background: "#A0522D",
										border: "none",
										padding: "8px 12px",
										borderRadius: 20,
										cursor: "pointer",
										color: "white",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										<GameIcons.Business
											color="white"
											size={18}
										/>
										Pet Business
									</div>
								</button>
							</div>
							<input
								style={{
									width: "100%",
									padding: 15,
									border: "2px solid #DAA520",
									borderRadius: 10,
									fontSize: "1.1em",
								}}
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Type your adventure name here!"
								required
							/>
						</div>

						<div
							style={{
								background: "#F5DEB3",
								border: "3px solid #A0522D",
								borderRadius: 15,
								padding: 20,
								marginBottom: 25,
							}}
						>
							<label
								style={{
									display: "block",
									fontSize: "1.3em",
									fontWeight: "bold",
									marginBottom: 10,
									color: "#654321",
								}}
							>
								👋 What's Your Name, Future Hero?
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
								}}
							>
								This is YOUR story, so let's put your name on
								it!
							</p>
							<input
								style={{
									width: "100%",
									padding: 15,
									border: "2px solid #A0522D",
									borderRadius: 10,
									fontSize: "1.1em",
								}}
								value={owner}
								onChange={(e) => setOwner(e.target.value)}
								placeholder="Your awesome name goes here!"
								required
							/>
						</div>

						<div
							style={{
								background: "#F5DEB3",
								border: "3px solid #A0522D",
								borderRadius: 15,
								padding: 20,
								marginBottom: 25,
							}}
						>
							<label
								style={{
									display: "block",
									fontSize: "1.3em",
									fontWeight: "bold",
									marginBottom: 10,
									color: "#654321",
								}}
							>
								📧 Your Parent's Email
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
								}}
							>
								We'll send your grown-up updates about your
								awesome money adventure!
							</p>
							<input
								type="email"
								style={{
									width: "100%",
									padding: 15,
									border: "2px solid #A0522D",
									borderRadius: 10,
									fontSize: "1.1em",
								}}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="parent@email.com"
								required
							/>
						</div>

						<div
							style={{
								background: "#F5DEB3",
								border: "3px solid #DAA520",
								borderRadius: 15,
								padding: 20,
								marginBottom: 25,
							}}
						>
							<label
								style={{
									display: "block",
									fontSize: "1.3em",
									fontWeight: "bold",
									marginBottom: 10,
									color: "#654321",
								}}
							>
								💰 Your Starting Money
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
								}}
							>
								How much money do you want to start with in your
								pretend wallet?
							</p>
							<div
								style={{
									display: "flex",
									gap: 10,
									marginBottom: 12,
								}}
							>
								{[1000, 5000, 10000, 25000, 50000].map(
									(amount) => (
										<button
											key={amount}
											type="button"
											onClick={() =>
												setCashAmount(amount)
											}
											style={{
												background:
													cashAmount === amount
														? "#DAA520"
														: "white",
												color:
													cashAmount === amount
														? "white"
														: "#DAA520",
												border: "2px solid #DAA520",
												padding: "8px 12px",
												borderRadius: 20,
												cursor: "pointer",
												fontSize: "0.9em",
												fontWeight: "bold",
											}}
										>
											${amount.toLocaleString()}
										</button>
									)
								)}
							</div>
							<input
								type="number"
								style={{
									width: "100%",
									padding: 15,
									border: "2px solid #DAA520",
									borderRadius: 10,
									fontSize: "1.1em",
								}}
								value={cashAmount}
								onChange={(e) =>
									setCashAmount(Number(e.target.value))
								}
								placeholder="How much money do you want to start with?"
								min="0"
								required
							/>
						</div>

						<div
							style={{
								background: "#F5DEB3",
								border: "3px solid #CD853F",
								borderRadius: 15,
								padding: 20,
								marginBottom: 25,
							}}
						>
							<label
								style={{
									display: "block",
									fontSize: "1.3em",
									fontWeight: "bold",
									marginBottom: 10,
									color: "#654321",
								}}
							>
								🎯 How Do You Like to Save Money?
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
								}}
							>
								Pick the ways you'd like to grow your money!
								(Don't worry, our AI will figure out the best
								options for you!)
							</p>
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: 10,
									marginBottom: 12,
								}}
							>
								{[
									"Safe & Slow (like a piggy bank)",
									"Medium Risk (like a lemonade stand)",
									"Fun & Fast (like collecting trading cards)",
									"Houses & Buildings",
									"Cool Tech Companies",
									"Let AI Choose for Me!",
								].map((portfolio) => (
									<button
										key={portfolio}
										type="button"
										onClick={() => {
											if (
												portfolios.includes(portfolio)
											) {
												setPortfolios(
													portfolios.filter(
														(p) => p !== portfolio
													)
												);
											} else {
												setPortfolios([
													...portfolios,
													portfolio,
												]);
											}
										}}
										style={{
											background: portfolios.includes(
												portfolio
											)
												? "#CD853F"
												: "white",
											color: portfolios.includes(
												portfolio
											)
												? "white"
												: "#CD853F",
											border: "2px solid #CD853F",
											padding: "8px 12px",
											borderRadius: 20,
											cursor: "pointer",
											fontSize: "0.9em",
											fontWeight: "bold",
										}}
									>
										{portfolio}
									</button>
								))}
							</div>
							<input
								style={{
									width: "100%",
									padding: 15,
									border: "2px solid #CD853F",
									borderRadius: 10,
									fontSize: "1.1em",
								}}
								value={portfolios.join(", ")}
								onChange={(e) =>
									setPortfolios(
										e.target.value
											.split(",")
											.map((s) => s.trim())
											.filter(Boolean)
									)
								}
								placeholder="Click buttons above or tell us your own ideas!"
							/>
						</div>

						<div
							style={{
								background: "#F5DEB3",
								border: "3px solid #8B4513",
								borderRadius: 15,
								padding: 20,
								marginBottom: 25,
							}}
						>
							<label
								style={{
									display: "block",
									fontSize: "1.3em",
									fontWeight: "bold",
									marginBottom: 10,
									color: "#654321",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "10px",
									}}
								>
									<GameIcons.Goals
										color="#654321"
										size={24}
									/>
									What Cool Things Will You Do?
								</div>
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
								}}
							>
								Pick the awesome choices you want to make! Each
								choice changes your future! Click the buttons or
								type your own (separate with commas).
							</p>

							<div
								style={{
									display: "grid",
									gridTemplateColumns:
										"repeat(auto-fit, minmax(140px, 1fr))",
									gap: 10,
									marginBottom: 15,
								}}
							>
								{[
									{
										icon: "coins",
										text: "save money",
										color: "#DAA520",
									},
									{
										icon: "store",
										text: "lemonade stand",
										color: "#8B4513",
									},
									{
										icon: "trending",
										text: "invest",
										color: "#A0522D",
									},
									{
										icon: "gamepad",
										text: "buy games",
										color: "#CD853F",
									},
									{
										icon: "dog",
										text: "pet sitting",
										color: "#D2691E",
									},
									{
										icon: "palette",
										text: "sell art",
										color: "#8B4513",
									},
									{
										icon: "book",
										text: "tutoring",
										color: "#A0522D",
									},
									{
										icon: "home",
										text: "yard sale",
										color: "#DAA520",
									},
								].map((choice) => (
									<button
										key={choice.text}
										type="button"
										onClick={() => {
											const current = choices
												? choices
														.split(",")
														.map((s) => s.trim())
														.filter(Boolean)
												: [];
											if (current.includes(choice.text)) {
												setChoices(
													current
														.filter(
															(c) =>
																c !==
																choice.text
														)
														.join(", ")
												);
											} else {
												setChoices(
													[
														...current,
														choice.text,
													].join(", ")
												);
											}
										}}
										style={{
											background:
												choices &&
												choices.includes(choice.text)
													? choice.color
													: "white",
											color:
												choices &&
												choices.includes(choice.text)
													? "white"
													: choice.color,
											border: `2px solid ${choice.color}`,
											padding: "10px",
											borderRadius: 10,
											cursor: "pointer",
											fontSize: "0.9em",
											fontWeight: "bold",
											transition: "all 0.3s",
											display: "flex",
											alignItems: "center",
											gap: "8px",
											justifyContent: "center",
										}}
									>
										<GameIcon
											icon={choice.icon}
											size={18}
											color={
												choices &&
												choices.includes(choice.text)
													? "white"
													: choice.color
											}
										/>
										{choice.text}
									</button>
								))}
							</div>

							<input
								style={{
									width: "100%",
									padding: 15,
									border: "2px solid #8B4513",
									borderRadius: 10,
									fontSize: "1.1em",
								}}
								value={choices}
								onChange={(e) => setChoices(e.target.value)}
								placeholder="Click buttons above or type: save money, lemonade stand, pet sitting"
								required
							/>
						</div>

						<div
							style={{
								background: "#F5DEB3",
								border: "3px solid #CD853F",
								borderRadius: 15,
								padding: 20,
								marginBottom: 25,
							}}
						>
							<label
								style={{
									display: "block",
									fontSize: "1.3em",
									fontWeight: "bold",
									marginBottom: 10,
									color: "#654321",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "10px",
									}}
								>
									<GameIcons.AI color="#654321" size={24} />
									Tell Me About YOU!
								</div>
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
								}}
							>
								What do you love to do? What makes you special?
								Our AI friend wants to know so it can give you
								the best advice!
							</p>
							<div
								style={{
									fontSize: "0.9em",
									color: "#654321",
									marginBottom: 12,
									fontStyle: "italic",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "flex-start",
										gap: "8px",
									}}
								>
									<GameIcon
										icon="zap"
										color="#654321"
										size={16}
									/>
									<span>
										Ideas: What animals do you love? What do
										you like to build? What subjects are
										fun?
									</span>
								</div>
								What do you want to be when you grow up?
							</div>
							<textarea
								style={{
									width: "100%",
									padding: 15,
									border: "2px solid #CD853F",
									borderRadius: 10,
									fontSize: "1.1em",
									resize: "vertical",
								}}
								value={profileText}
								onChange={(e) => setProfileText(e.target.value)}
								placeholder="I love dogs and want to help animals! I also like building with Legos and learning about space..."
								rows={4}
							/>
						</div>

						<div
							style={{
								background: "#F5DEB3",
								border: "4px solid #8B4513",
								borderRadius: 15,
								padding: 25,
								marginBottom: 25,
							}}
						>
							<h3
								style={{
									margin: "0 0 20px 0",
									fontSize: "1.5em",
									color: "#654321",
									textAlign: "center",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "12px",
								}}
							>
								<GameIcons.Timeline color="#654321" size={28} />
								Here's What Will Happen!
							</h3>
							<div
								style={{
									display: "grid",
									gridTemplateColumns:
										"repeat(auto-fit, minmax(200px, 1fr))",
									gap: 20,
								}}
							>
								<div
									style={{
										textAlign: "center",
										background: "rgba(139, 69, 19, 0.1)",
										padding: 15,
										borderRadius: 12,
										border: "2px solid #DAA520",
									}}
								>
									<div style={{ marginBottom: 12 }}>
										<GameIconLarge
											icon="bot"
											color="#654321"
											size={40}
										/>
									</div>
									<div
										style={{
											fontWeight: "bold",
											color: "#654321",
											fontSize: "1.1em",
											marginBottom: 8,
										}}
									>
										AI Analyzes You!
									</div>
									<div
										style={{
											fontSize: "0.95em",
											color: "#8B4513",
										}}
									>
										Learns what makes you special
									</div>
								</div>
								<div
									style={{
										textAlign: "center",
										background: "rgba(139, 69, 19, 0.1)",
										padding: 15,
										borderRadius: 12,
										border: "2px solid #A0522D",
									}}
								>
									<div style={{ marginBottom: 12 }}>
										<GameIconLarge
											icon="zap"
											color="#654321"
											size={40}
										/>
									</div>
									<div
										style={{
											fontWeight: "bold",
											color: "#654321",
											fontSize: "1.1em",
											marginBottom: 8,
										}}
									>
										Magic Simulation!
									</div>
									<div
										style={{
											fontSize: "0.95em",
											color: "#8B4513",
										}}
									>
										Shows your future story
									</div>
								</div>
								<div
									style={{
										textAlign: "center",
										background: "rgba(139, 69, 19, 0.1)",
										padding: 15,
										borderRadius: 12,
										border: "2px solid #CD853F",
									}}
								>
									<div style={{ marginBottom: 12 }}>
										<GameIconLarge
											icon="building"
											color="#654321"
											size={40}
										/>
									</div>
									<div
										style={{
											fontWeight: "bold",
											color: "#654321",
											fontSize: "1.1em",
											marginBottom: 8,
										}}
									>
										3D World!
									</div>
									<div
										style={{
											fontSize: "0.95em",
											color: "#8B4513",
										}}
									>
										Your story becomes a building
									</div>
								</div>
								<div
									style={{
										textAlign: "center",
										background: "rgba(139, 69, 19, 0.1)",
										padding: 15,
										borderRadius: 12,
										border: "2px solid #D2691E",
									}}
								>
									<div style={{ marginBottom: 12 }}>
										<GameIconLarge
											icon="users"
											color="#654321"
											size={40}
										/>
									</div>
									<div
										style={{
											fontWeight: "bold",
											color: "#654321",
											fontSize: "1.1em",
											marginBottom: 8,
										}}
									>
										Share & Compare!
									</div>
									<div
										style={{
											fontSize: "0.95em",
											color: "#8B4513",
										}}
									>
										Show friends your adventure
									</div>
								</div>
							</div>
						</div>

						<div style={{ textAlign: "center" }}>
							<button
								type="submit"
								disabled={loading}
								style={{
									background: loading
										? "#ccc"
										: "linear-gradient(45deg, #DAA520, #B8860B)",
									color: "white",
									border: "none",
									padding: "20px 40px",
									borderRadius: 25,
									fontSize: "1.3em",
									cursor: loading ? "not-allowed" : "pointer",
									fontWeight: "bold",
									boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
									transform: loading
										? "none"
										: "translateY(-2px)",
									transition: "all 0.3s",
								}}
								onMouseEnter={(e) => {
									if (!loading) {
										e.target.style.transform =
											"translateY(-4px)";
										e.target.style.boxShadow =
											"0 8px 25px rgba(0,0,0,0.3)";
									}
								}}
								onMouseLeave={(e) => {
									if (!loading) {
										e.target.style.transform =
											"translateY(-2px)";
										e.target.style.boxShadow =
											"0 5px 15px rgba(0,0,0,0.2)";
									}
								}}
							>
								{loading
									? "🔮 Creating Your Magic Story..."
									: "🚀 Launch My Adventure!"}
							</button>
						</div>
					</form>
				</Card>
			</Container>
		</div>
	);
}

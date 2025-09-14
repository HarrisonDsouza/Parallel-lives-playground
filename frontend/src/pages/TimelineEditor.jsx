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
							🎮 Build Your Future Adventure! 🎮
						</Heading>
						<Text
							size="xl"
							align="center"
							style={{
								margin: 0,
								color: "var(--color-primary-700)",
								lineHeight: "1.6",
							}}
						>
							Ever wonder what happens if you make different
							choices with money? This magical simulator shows you
							EXACTLY what your future could look like! Make
							choices, watch your story unfold, and see your money
							grow in a fun 3D world!
						</Text>
					</div>{" "}
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
									🌟 Name Your Money Adventure! 🌟
								</div>
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
									lineHeight: "1.5",
								}}
							>
								What should we call your awesome money
								adventure? Pick something that sounds exciting!
								This will be the title of your future story that
								our AI creates just for you!
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
										setName("My Epic Lemonade Empire")
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
										setName("My Super Saving Challenge")
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
										setName(
											"My Amazing Pet Business Journey"
										)
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
								placeholder="Type your adventure name here! (Like: The Great Cookie Business, Money Master Quest, etc.)"
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
								👋 Hey There, Future Money Hero!
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
									lineHeight: "1.5",
								}}
							>
								What should we call you in your adventure story?
								This is YOUR journey, so let's make sure your
								name is on it! Our AI will use this to create a
								personalized story just for you.
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
								placeholder="Your awesome name goes here! (First name is perfect)"
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
								📧 Your Grown-Up's Email Address
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
									lineHeight: "1.5",
								}}
							>
								We need to tell your parent or guardian about
								your awesome money adventure! They'll get
								updates about your simulation results and can
								see how smart you are with money choices.
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
								placeholder="your.parent@email.com (Ask your grown-up!)"
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
								💰 Your Magical Starting Money
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
									lineHeight: "1.5",
								}}
							>
								Imagine you have a magic wallet! How much
								pretend money should we put in it to start your
								adventure? Don't worry - this is just for the
								simulation, but it shows how different amounts
								can grow over time!
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
								placeholder="How much magical money should we start with?"
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
								🎯 How Should Your Money Grow?
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
									lineHeight: "1.5",
								}}
							>
								Different ways of saving money work differently!
								Pick what sounds most interesting to you. Our
								super-smart AI will use real financial data to
								show how your money could grow over time with
								these choices. It's like a crystal ball for
								money!
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
									"Super Safe & Steady (like a piggy bank - slow but sure!)",
									"Balanced Adventure (like a lemonade stand - medium risk, medium reward)",
									"Exciting & Fast (like collecting rare cards - higher risk, bigger rewards!)",
									"Houses & Buildings (real estate investments)",
									"Cool Tech Companies (technology stocks)",
									"Surprise Me! (Let our AI pick the best mix for me!)",
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
								placeholder="Click the awesome buttons above or tell us your own cool ideas!"
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
									🎮 What Money Adventures Will You Try?
								</div>
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
									lineHeight: "1.5",
								}}
							>
								Every choice you make changes your future! Pick
								all the awesome things you want to try. Our AI
								will show you exactly how each choice affects
								your money story. Will you save up, start a
								business, or spend on fun things? Each path
								leads to a different adventure!
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
										text: "save up my money",
										color: "#DAA520",
									},
									{
										icon: "store",
										text: "start a lemonade stand",
										color: "#8B4513",
									},
									{
										icon: "trending",
										text: "learn about investing",
										color: "#A0522D",
									},
									{
										icon: "gamepad",
										text: "buy fun games & toys",
										color: "#CD853F",
									},
									{
										icon: "dog",
										text: "start a pet-sitting business",
										color: "#D2691E",
									},
									{
										icon: "palette",
										text: "sell my art & crafts",
										color: "#8B4513",
									},
									{
										icon: "book",
										text: "help teach other kids",
										color: "#A0522D",
									},
									{
										icon: "home",
										text: "organize a yard sale",
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
								placeholder="Click the adventure buttons above or type your own ideas: buy a bike, start a bakery, save for college..."
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
									🤖 Help Our AI Get to Know You!
								</div>
							</label>
							<p
								style={{
									fontSize: "1em",
									color: "#654321",
									margin: "0 0 12px 0",
									lineHeight: "1.5",
								}}
							>
								The cooler stuff you tell us about yourself, the
								more awesome your adventure story will be! Our
								AI friend will use this to create personalized
								advice and make your simulation super realistic.
								What makes YOU special?
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
										💡 Ideas to get you started: What
										animals do you love? What do you like to
										build or create? What school subjects
										are your favorites? What do you want to
										be when you grow up? What makes you
										laugh?
									</span>
								</div>
								<div
									style={{
										marginTop: "8px",
										fontSize: "0.9em",
										color: "#654321",
									}}
								>
									🎯 Example: "I love dogs and want to become
									a veterinarian! I also enjoy building with
									Legos, playing soccer, and learning about
									space. Math is my favorite subject and I
									love helping my little sister."
								</div>
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
								placeholder="I love animals and want to be a vet! I also enjoy building robots, playing basketball, and learning about science. My favorite subjects are math and art, and I love helping my friends..."
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
								🎬 Here's the Amazing Magic That Will Happen!
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
										🤖 AI Creates Your Story!
									</div>
									<div
										style={{
											fontSize: "0.95em",
											color: "#8B4513",
										}}
									>
										Learns about you and makes personalized
										adventures
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
										⚡ Money Magic Simulation!
									</div>
									<div
										style={{
											fontSize: "0.95em",
											color: "#8B4513",
										}}
									>
										Shows your future with real financial
										data
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
										🏗️ Amazing 3D World!
									</div>
									<div
										style={{
											fontSize: "0.95em",
											color: "#8B4513",
										}}
									>
										Your story becomes a cool building you
										can explore
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
										👥 Share Your Epic Adventure!
									</div>
									<div
										style={{
											fontSize: "0.95em",
											color: "#8B4513",
										}}
									>
										Show friends & family your awesome
										future
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
									? "🔮 Creating Your Epic Money Adventure..."
									: "🚀 Start My Amazing Money Adventure!"}
							</button>
						</div>
					</form>
				</Card>
			</Container>
		</div>
	);
}

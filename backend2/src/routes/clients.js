const express = require("express");
const router = express.Router();
const investease = require("../services/investease");

// Create client
router.post("/", async (req, res) => {
	try {
		const data = await investease.post("/clients", req.body);
		res.json(data);
	} catch (err) {
		res.status(err.response?.status || 500).json({
			error: err.message,
			details: err.response?.data,
		});
	}
});

// List clients
router.get("/", async (req, res) => {
	try {
		const data = await investease.get("/clients");
		res.json(data);
	} catch (err) {
		res.status(err.response?.status || 500).json({
			error: err.message,
			details: err.response?.data,
		});
	}
});

// Get client
router.get("/:clientId", async (req, res) => {
	try {
		const data = await investease.get(`/clients/${req.params.clientId}`);
		res.json(data);
	} catch (err) {
		res.status(err.response?.status || 500).json({
			error: err.message,
			details: err.response?.data,
		});
	}
});

// Deposit to client cash
router.post("/:clientId/deposit", async (req, res) => {
	try {
		const data = await investease.post(
			`/clients/${req.params.clientId}/deposit`,
			req.body
		);
		res.json(data);
	} catch (err) {
		res.status(err.response?.status || 500).json({
			error: err.message,
			details: err.response?.data,
		});
	}
});

// Create portfolio for a client
router.post("/:clientId/portfolios", async (req, res) => {
	try {
		const data = await investease.post(
			`/clients/${req.params.clientId}/portfolios`,
			req.body
		);
		res.json(data);
	} catch (err) {
		res.status(err.response?.status || 500).json({
			error: err.message,
			details: err.response?.data,
		});
	}
});

module.exports = router;

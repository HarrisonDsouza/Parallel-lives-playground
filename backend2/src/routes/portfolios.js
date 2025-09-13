const express = require("express");
const router = express.Router();
const investease = require("../services/investease");

router.get("/:portfolioId", async (req, res) => {
	try {
		const data = await investease.get(
			`/portfolios/${req.params.portfolioId}`
		);
		res.json(data);
	} catch (err) {
		res.status(err.response?.status || 500).json({
			error: err.message,
			details: err.response?.data,
		});
	}
});

router.post("/:portfolioId/transfer", async (req, res) => {
	try {
		const data = await investease.post(
			`/portfolios/${req.params.portfolioId}/transfer`,
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

router.post("/:portfolioId/withdraw", async (req, res) => {
	try {
		const data = await investease.post(
			`/portfolios/${req.params.portfolioId}/withdraw`,
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

router.get("/:portfolioId/analysis", async (req, res) => {
	try {
		const data = await investease.get(
			`/portfolios/${req.params.portfolioId}/analysis`
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

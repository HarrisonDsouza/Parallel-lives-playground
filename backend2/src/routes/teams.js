const express = require("express");
const router = express.Router();
const investease = require("../services/investease");

// Register team (proxied) - optional
router.post("/register", async (req, res) => {
	try {
		const resp = await investease.post("/teams/register", req.body);
		res.json(resp);
	} catch (err) {
		res.status(err.response?.status || 500).json({
			error: err.message,
			details: err.response?.data,
		});
	}
});

module.exports = router;

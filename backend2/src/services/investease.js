const axios = require("axios");
const BASE = process.env.INVESTEASE_BASE_URL;

function authHeaders() {
	const token = process.env.TEAM_JWT || "";
	return {
		Authorization: token ? `Bearer ${token}` : undefined,
		"Content-Type": "application/json",
	};
}

async function post(path, body) {
	return axios
		.post(`${BASE}${path}`, body, { headers: authHeaders() })
		.then((r) => r.data);
}

async function get(path) {
	return axios
		.get(`${BASE}${path}`, { headers: authHeaders() })
		.then((r) => r.data);
}

async function put(path, body) {
	return axios
		.put(`${BASE}${path}`, body, { headers: authHeaders() })
		.then((r) => r.data);
}

async function del(path) {
	return axios
		.delete(`${BASE}${path}`, { headers: authHeaders() })
		.then((r) => r.data);
}

module.exports = { get, post, put, del };

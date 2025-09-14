import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export const api = axios.create({ baseURL: API_BASE });

export async function listClients() {
	return api.get("/clients").then((r) => r.data);
}
export async function createClient(payload) {
	return api.post("/clients", payload).then((r) => r.data);
}
export async function getClient(id) {
	return api.get(`/clients/${id}`).then((r) => r.data);
}
export async function depositToClient(clientId, amount) {
	return api
		.post(`/clients/${clientId}/deposit`, { amount })
		.then((r) => r.data);
}
export async function getPortfolio(id) {
	return api.get(`/portfolios/${id}`).then((r) => r.data);
}
export async function transferToPortfolio(portfolioId, amount) {
	return api
		.post(`/portfolios/${portfolioId}/transfer`, { amount })
		.then((r) => r.data);
}
export async function withdrawFromPortfolio(portfolioId, amount) {
	return api
		.post(`/portfolios/${portfolioId}/withdraw`, { amount })
		.then((r) => r.data);
}

export async function createTimelineWithRegistration(userData) {
	return api
		.post("/timelines/create-with-registration", userData)
		.then((r) => r.data);
}

export async function simulateClient() {
	return api.get(`/simulate`).then((r) => r.data);
}
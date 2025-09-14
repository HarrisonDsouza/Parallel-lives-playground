import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export const api = axios.create({ baseURL: API_BASE });

// Main AI Pipeline Function - Kids interact with this
export async function createTimelineWithRegistration(userData) {
	return api
		.post("/timelines/create-with-registration", userData)
		.then((r) => r.data);
}

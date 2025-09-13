import { io } from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace('/api', '') : 'http://localhost:4000';
const socket = io(ENDPOINT);

export default socket;
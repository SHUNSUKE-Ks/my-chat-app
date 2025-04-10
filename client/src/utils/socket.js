import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL); // .envで切替
export default socket;

import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface JoinRoomData {
  roomId: string;
  userId: string;
}

export default function initializeSocket(io: Server<DefaultEventsMap, DefaultEventsMap>) {
  io.on('connection', (socket: Socket) => {
    // Rejoindre une room
    socket.on("join-room", ({ roomId, userId }: JoinRoomData) => {
      socket.join(roomId);
      // Informer les autres utilisateurs de la room qu'un nouvel utilisateur est arrivé
      socket.to(roomId).emit("user-joined", { userId, socketId: socket.id });
    });

    // Envoyer un signal de connexion
    socket.on("sending-signal", ({ signal, roomId, callerId }) => {
      socket.to(roomId).emit("user-joined", { signal, callerId });
    });

    // Retourner le signal
    socket.on("returning-signal", ({ signal, callerId }) => {
      socket.to(callerId).emit("receiving-returned-signal", { signal, id: socket.id });
    });

    // Gérer la déconnexion
    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", socket.id);
    });
  });
} 
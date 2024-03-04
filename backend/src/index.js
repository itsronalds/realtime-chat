import Server from './api/models/server';

require('dotenv').config();

const server = new Server();

server.execute();

/*
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import socketIO from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';

dotenv.config();

import authRoutes from './api/routes/auth/auth';
import privateRoutes from './api/routes/private/user';

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/private/', privateRoutes);

server.listen(port, () => console.log(`Server on port ${port}`));

// Array donde estarán todos los usuarios conectados en tiempo real
const users = [];

io.on('connection', async (socket) => {
  if (socket.handshake.query.token) {
    const token = socket.handshake.query.token.slice(6);

    try {
      const payload = jwt.verify(token, process.env.TOKEN_SECRET);
      const { IDUser } = payload;

      const user = {
        socketId: socket.id,
        userId: IDUser,
      };

      users.push(user);

      // Emitir a todos los sockets que este usuario esta conectado
      socket.broadcast.emit('user status: online', {
        IDUser: IDUser,
        status: 1,
      });

      // Recibiendo mensajes en tiempo real
      socket.on('message', (message) => {
        const { messageIncomingUserId } = message;

        if (users.length > 0) {
          for (let i = 0; i < users.length; i++) {
            if (users[i].userId == messageIncomingUserId) {
              const { socketId } = users[i];

              socket.to(socketId).emit('message', message);
            }
          }
        }
      });

      // Cuando haya una desconexión
      socket.on('disconnect', () => {
        for (let i = 0; i < users.length; i++) {
          if (users[i].userId === IDUser) {
            if (users.length > 1) {
              // Enviar mensaje a todos los usuarios que este usuarios se desconecto
              socket.broadcast.emit('user status: offline', {
                IDUser: users[i].userId,
                status: 0,
              });
            }

            // Encontrar la posición en el array del usuario desconectado
            users.splice(i, 1);
          }
        }
      });
    } catch (err) {
      const socketId = socket.id;

      socket.to(socketId).emit('Invalid access', {
        success: false,
        auth: false,
        role: '',
        message: 'Unauthorized access',
      });

      console.log('Token invalido');
    }
  } else {
    // En caso que en la solicitud de conexión no haya un token, se procede a rechazar la solicitud
    return;
  }
});

*/

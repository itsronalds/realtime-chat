import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import socketIO from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';

import authRoutes from '../routes/auth/auth';
import privateRoutes from '../routes/private/user';

class Server {
  constructor() {
    this.port = process.env.PORT || 4000;
    this.app = express();

    // Socket
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server, {
      cors: {
        origin: 'http://localhost:3000',
      },
    });
    this.users = [];
  }

  middlewares() {
    this.app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
      })
    );
    this.app.use(fileUpload());
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/private/', privateRoutes);
  }

  socketServer() {
    this.io.on('connection', async (socket) => {
      if (socket.handshake.query.token) {
        const token = socket.handshake.query.token.slice(6);

        try {
          const payload = jwt.verify(token, process.env.TOKEN_SECRET);
          const { IDUser } = payload;

          const user = {
            socketId: socket.id,
            userId: IDUser,
          };

          this.users.push(user);

          // Emitir a todos los sockets que este usuario esta conectado
          socket.broadcast.emit('user status: online', {
            IDUser: IDUser,
            status: 1,
          });

          // Recibiendo mensajes en tiempo real
          socket.on('message', (message) => {
            const { messageIncomingUserId } = message;

            if (this.users.length > 0) {
              for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].userId == messageIncomingUserId) {
                  const { socketId } = this.users[i];

                  socket.to(socketId).emit('message', message);
                }
              }
            }
          });

          // Cuando haya una desconexión
          socket.on('disconnect', () => {
            for (let i = 0; i < this.users.length; i++) {
              if (this.users[i].userId === IDUser) {
                if (this.users.length > 1) {
                  // Enviar mensaje a todos los usuarios que este usuarios se desconecto
                  socket.broadcast.emit('user status: offline', {
                    IDUser: this.users[i].userId,
                    status: 0,
                  });
                }

                // Encontrar la posición en el array del usuario desconectado
                this.users.splice(i, 1);
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
  }

  execute() {
    this.middlewares();

    this.routes();

    this.socketServer();

    this.server.listen(this.port, () =>
      console.log('Server on port: ' + this.port)
    );
  }
}

export default Server;

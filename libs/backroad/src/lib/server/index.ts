import express from 'express';
import * as http from 'http';
import path from 'path';
import { Namespace, Server } from 'socket.io';
import multer from 'multer';
const upload = multer();
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@backroad/core';
import { join } from 'path';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { sessionManager } from './sessions/session-manager';
export const startBackroadServer = (options: { port: number }) => {
  return new Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Namespace<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, any>
  >((resolve) => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
      path: '/api/socket.io',
      cors: {},
    });

    app.use(express.static(join(__dirname, 'public')));

    app.post<
      '/api/uploads',
      any,
      any,
      {
        sessionId: string;
        id: string;
      }
    >('/api/uploads', upload.array('files'), (req, res) => {
      const session = sessionManager.getSession(req.body.sessionId);
      console.log('received file upload request', req.files, req.files?.length);
      return res.json(
        session?.uploadManager.setFiles(
          req.body.id,
          req.files as Express.Multer.File[]
        )
      );
    });

    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    );

    server.listen(options.port, () => {
      // open(`http://localhost:${options.port}/`);
      console.log(
        `server started. App can be accessed on http://localhost:${options.port}/`
      );
      resolve(io.of(/^\/.+$/));
    });
  });
};

import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import 'express-async-errors';
// import http from 'http';
// import socketio from 'socket.io';

import '@config/typeorm';
import '@shared/container';

import '../api/telegraf';
import routes from './express/routes';
import errorHandler from './express/middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errorHandler);

// const server = http.createServer(app);

// const io = socketio(server);

app.listen(process.env.PORT, () =>
  console.log(`>> Server started at > ${process.env.PORT}`),
);

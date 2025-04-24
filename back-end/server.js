// Importando bibliotecas necessárias
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import cors from 'cors';

const port = 3000;

// Criando e configurando app
const app = express();
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // inclua os dois por segurança
  credentials: true
}));

app.use(session({
  secret: 'segredo_bem_forte',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax', // 'lax' funciona bem com GET e navegação normal
    secure: false    // true apenas se estiver com HTTPS
  }
}));


// Sessão de Rotas
import funcionariosRouter from './routes/funcionarios.js';
app.use('/funcionarios', funcionariosRouter);

import clientesRouter from './routes/clientes.js';
app.use('/clientes', clientesRouter);

import veiculosRouter from './routes/veiculos.js';
app.use('/veiculos', veiculosRouter);

import entradasRouter from './routes/entradas.js';
app.use('/entradas', entradasRouter);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

export default app;

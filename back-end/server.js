// Importando bibliotecas necessárias
import express, { json, urlencoded } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const port = 3000;

// Criando e configurando app
const app = express();
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Configurando a sessão para o usuário ao logar
app.use(session({
    secret: 'sua_chave_secreta_segura',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 50 } // 50 minutos
}));

import cors from 'cors';
app.use(cors());


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

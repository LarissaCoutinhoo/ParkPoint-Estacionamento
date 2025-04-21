// Importando bibliotecas necessárias
import prisma from '../database/client.js';
import { DateTime } from 'luxon';

const controller = {};

// Função Validada 20/04
// Função para verificar se a sessão foi iniciada
function verificaSessao(req){
    if (req.session.funcionario){
        return true;
    }else{
        return false;
    }
}

// Função Validada 20/04
// Criando um novo entrada
controller.entrada = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo o id do veiculo informado pela placa
        const veiculo = await prisma.veiculo.findFirst({
            where: { placa: req.body.placa }
        });

        // Verificando se a placa informada é válida
        if (!veiculo){
            return res.status(400).json({ mensagem: "Veículo não cadastrado!" });
        }

        // Verificando se a placa informada já não está em alocada no estacionamento
        const placaAlocada = await prisma.entrada.findFirst({
            where: { id_veiculo: veiculo.id, status: "Alocado" }
        });

        if(placaAlocada) {
            return res.status(400).json({ mensagem: "Entrada com essa placa já se encontra no estacionamento!" });
        }

        // Definindo o id do funcionário responsável pela entrada
        req.body.id_funcionario = req.session.funcionario.id;

        // Definindo o id do veiculo pela placa informada
        req.body.id_veiculo = veiculo.id;

        // Definindo o cliente pelo CPF informado
        const cliente = await prisma.cliente.findFirst({
            where: { cpf: req.body.cpf }
        });

        // Verificando se o cpf informado é válido
        if (!cliente){
            return res.status(400).json({ mensagem: "Cliente não cadastrado!" });
        }

        req.body.id_cliente = cliente.id;


        // Definindo a data da entrada e ajustando para o horário de Brasília (BR)
        req.body.data_entrada = DateTime.now().setZone('America/Sao_Paulo').toISO();
        
        // Definindo o status
        req.body.status = "Alocado";

        // Deletando do body dados que não serão armazenados na tabela
        delete req.body.cpf;
        delete req.body.placa;

        // Cadastrando o entrada
        await prisma.entrada.create({ data: req.body });

        // Retornando resultado para redirecionamento no front
        // console.log(req.session.entrada);
        return res.status(201).json({result: true});

    }
    catch(error) {
        // Deu errado: exibe o erro no terminal
        console.error(error);

        // Envia o erro ao front-end, com status de erro
        // HTTP 500: Internal Server Error
        return res.status(500).send(error);
    }
}

// Função Validada 21/04
// Alterando os dados de um entrada
controller.update = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo o id do veiculo informado pela placa
        const veiculo = await prisma.veiculo.findFirst({
            where: { placa: req.body.placa }
        });

        // Verificando se a placa informada é válida
        if (!veiculo){
            return res.status(400).json({ mensagem: "Veículo não cadastrado!" });
        }

        // Obetendo o veiculo da entrada original 
        const entrada = await prisma.entrada.findFirst({
            where: { id: Number(req.params.id) }
        });

        // Verificando se a placa informada é diferente e já não está alocada no estacionamento
        if (entrada.id_veiculo !== veiculo.id){
            const placaAlocada = await prisma.entrada.findFirst({
                where: { id_veiculo: veiculo.id, status: "Alocado" }
            });

            if(placaAlocada) {
                return res.status(400).json({ mensagem: "Entrada com essa placa já se encontra no estacionamento!" });
            }
        }
        
        // Definindo o id do funcionário responsável pela entrada
        req.body.id_funcionario = req.session.funcionario.id;

        // Definindo o id do veiculo pela placa informada
        req.body.id_veiculo = veiculo.id;

        // Definindo o cliente pelo CPF informado
        const cliente = await prisma.cliente.findFirst({
            where: { cpf: req.body.cpf }
        });

        // Verificando se o cpf informado é válido
        if (!cliente){
            return res.status(400).json({ mensagem: "Cliente não cadastrado!" });
        }

        req.body.id_cliente = cliente.id;

        if (req.body.status){
            if (req.body.status === "Alocado"){
                req.body.data_saida = null;
                req.body.valor_pagar = null;
            }else{
                delete req.body.data_saida;
                delete req.body.valor_pagar;
            }
        }

        // Deletando atributos não necessário para o bd e que podem dar divergencias ou erros
        delete req.body.cpf;
        delete req.body.placa;

        // Cadastrando a entrada
        await prisma.entrada.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });

        // Retornando resultado para redirecionamento no front
        // console.log(req.session.entrada);
        return res.status(201).json({result: true});

    }
    catch(error) {
        // Deu errado: exibe o erro no terminal
        console.error(error);

        // Envia o erro ao front-end, com status de erro
        // HTTP 500: Internal Server Error
        return res.status(500).send(error);
    }
}

// Função Validada 20/04
// Cancelando a entrada
controller.cancelar = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        await prisma.entrada.update({
            where: { id: Number(req.params.id) },
            data: {
                status: "Cancelado",
                id_funcionario: req.session.funcionario.id
            }
        });

        return res.status(201).json({result: true});
    }
    catch(error) {
      // P2025: erro do Prisma referente a objeto não encontrado
      if(error?.code === 'P2025') {
        // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
        return res.status(400).json({mensagem: "Entrada Não Encontrado!"});
      }
      else {    // Outros tipos de erro
        // Deu errado: exibe o erro no terminal
        console.error(error);
  
        // Envia o erro ao front-end, com status de erro
        // HTTP 500: Internal Server Error
        return res.status(500).send(error);
      }
    }
}

// Função Validada 21/04
// Finalizando a entrada
controller.saida = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Difinindo a data da saida
        const data_saida = new Date();

        // Obtendo a data da entrada
        const entrada = await prisma.entrada.findFirst({
            where: { id: Number(req.params.id) }
        });

        // Diferença em milissegundos
        let horas = Math.abs(data_saida - entrada.data_entrada);

        // Converter para horas
        horas = horas / (1000 * 60 * 60);

        console.log(`Horas estadia: ${horas} horas`);

        await prisma.entrada.update({
            where: { id: Number(req.params.id) },
            data: {
                status: "Finalizado",
                id_funcionario: req.session.funcionario.id,
                data_saida: data_saida,
                valor_pagar: horas * entrada.valor_hora
            }
        });

        return res.status(201).json({result: true});
    }
    catch(error) {
      // P2025: erro do Prisma referente a objeto não encontrado
      if(error?.code === 'P2025') {
        // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
        return res.status(400).json({mensagem: "Entrada Não Encontrado!"});
      }
      else {    // Outros tipos de erro
        // Deu errado: exibe o erro no terminal
        console.error(error);
  
        // Envia o erro ao front-end, com status de erro
        // HTTP 500: Internal Server Error
        return res.status(500).send(error);
      }
    }
}

// Função Validada 21/04
// Buscando entrada ativa pela placa do veiculo
controller.retrieveOnePlaca = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo o ID do veículo com essa placa
        const veiculo = await prisma.veiculo.findFirst({
            where: { placa: req.params.placa }
        });

        if (!veiculo){
            return res.status(400).json({mensagem: "Veículo não cadastrado!"});
        }

        // Obtendo a entrada ativa do  veiculo
        const result = await prisma.entrada.findFirst({
            where: { id_veiculo: veiculo.id, status: "Alocado" }
        });

        if (!result){
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }

        // Ajustando datas para o retorno
        if (result && result.data_entrada) {
            result.data_entrada = DateTime.fromJSDate(result.data_entrada).setZone('America/Sao_Paulo').toISO();
        }

        if (result && result.data_saida) {
            result.data_saida = DateTime.fromJSDate(result.data_saida).setZone('America/Sao_Paulo').toISO();
        }

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 20/04
// Buscando todas as entradas de um veiculo pela placa
controller.retrieveAllPlaca = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo o ID do veícolo com essa placa
        const veiculo = await prisma.veiculo.findFirst({
            where: { placa: req.params.placa }
        });

        if (!veiculo){
            return res.status(400).json({mensagem: "Veículo não cadastrado!"});
        }

        // Obtendo todas as entradas realizadas pelo veiculo
        const result = await prisma.entrada.findMany({
            where: { id_veiculo: veiculo.id }
        });

        if (!result){
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }

        // Ajustando datas para o retorno
        result.forEach(item => {
        if (item.data_entrada) {
            item.data_entrada = DateTime.fromJSDate(item.data_entrada).setZone('America/Sao_Paulo').toISO();
        }
        });

        result.forEach(item => {
        if (item.data_saida) {
            item.data_saida = DateTime.fromJSDate(item.data_saida).setZone('America/Sao_Paulo').toISO();
        }
        });

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 21/04
// Buscando todas as entradas de um veiculo pelo cliente
controller.retrieveAllClienteCpf = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo o ID do veícolo com essa placa
        const cliente = await prisma.cliente.findFirst({
            where: { cpf: req.params.cpf }
        });

        if (!cliente){
            return res.status(400).json({mensagem: "Cliente não cadastrado!"});
        }

        // Obtendo todas as entradas realizadas pelo cliente
        const result = await prisma.entrada.findMany({
            where: { id_cliente: cliente.id }
        });

        if (!result){
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }

        // Ajustando datas para o retorno
        result.forEach(item => {
        if (item.data_entrada) {
            item.data_entrada = DateTime.fromJSDate(item.data_entrada).setZone('America/Sao_Paulo').toISO();
        }
        });

        result.forEach(item => {
        if (item.data_saida) {
            item.data_saida = DateTime.fromJSDate(item.data_saida).setZone('America/Sao_Paulo').toISO();
        }
        });

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 21/04
// Buscando todas as entradas com status Alocado
controller.retrieveAllAlocados = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo todas as entradas com satatus Alocado
        const result = await prisma.entrada.findMany({
            where: { status: "Alocado" }
        });

        if (!result){
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }

        // Ajustando datas para o retorno
        result.forEach(item => {
        if (item.data_entrada) {
            item.data_entrada = DateTime.fromJSDate(item.data_entrada).setZone('America/Sao_Paulo').toISO();
        }
        });

        result.forEach(item => {
        if (item.data_saida) {
            item.data_saida = DateTime.fromJSDate(item.data_saida).setZone('America/Sao_Paulo').toISO();
        }
        });

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 21/04
// Buscando todas as entradas com status Cancelado
controller.retrieveAllCancelados = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo todas as entradas com satatus Alocado
        const result = await prisma.entrada.findMany({
            where: { status: "Cancelado" }
        });

        if (!result){
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }

        // Ajustando datas para o retorno
        result.forEach(item => {
        if (item.data_entrada) {
            item.data_entrada = DateTime.fromJSDate(item.data_entrada).setZone('America/Sao_Paulo').toISO();
        }
        });

        result.forEach(item => {
        if (item.data_saida) {
            item.data_saida = DateTime.fromJSDate(item.data_saida).setZone('America/Sao_Paulo').toISO();
        }
        });

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 21/04
// Buscando todas as entradas com status Finalizado
controller.retrieveAllFinalizados = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo todas as entradas com satatus Alocado
        const result = await prisma.entrada.findMany({
            where: { status: "Finalizado" }
        });

        if (!result){
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }

        // Ajustando datas para o retorno
        result.forEach(item => {
        if (item.data_entrada) {
            item.data_entrada = DateTime.fromJSDate(item.data_entrada).setZone('America/Sao_Paulo').toISO();
        }
        });

        result.forEach(item => {
        if (item.data_saida) {
            item.data_saida = DateTime.fromJSDate(item.data_saida).setZone('America/Sao_Paulo').toISO();
        }
        });

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 20/04
// Buscando um entrada pelo id
controller.retrieveOne = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo os dados do entrada atual, passados pelo atributo ID
        const result = await prisma.entrada.findFirst({
            where: { id: Number(req.params.id) }
        });

        if (!result){
            return res.status(400).json({mensagem: "Entrada Não Encontrada!"});
        }

        // Ajustando as datas para o fuso horário certo
        if (result && result.data_entrada) {
            result.data_entrada = DateTime.fromJSDate(result.data_entrada).setZone('America/Sao_Paulo').toISO();
        }

        if (result && result.data_saida) {
            result.data_saida = DateTime.fromJSDate(result.data_saida).setZone('America/Sao_Paulo').toISO();
        }

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Entrada Não Encontrada!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 20/04
// Buscando todos os entradas cadastrados
controller.retrieveAll = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo os dados do entrada atual, passados pelo atributo ID
        const result = await prisma.entrada.findMany({ 
            orderBy: [{ data_entrada: "asc"}] 
        });

        if (!result){
            return res.status(400).json({mensagem: "Nenhuma Entrada Encontrada!"});
        }

        // Ajustando datas para o retorno
        result.forEach(item => {
        if (item.data_entrada) {
            item.data_entrada = DateTime.fromJSDate(item.data_entrada).setZone('America/Sao_Paulo').toISO();
        }
        });

        result.forEach(item => {
        if (item.data_saida) {
            item.data_saida = DateTime.fromJSDate(item.data_saida).setZone('America/Sao_Paulo').toISO();
        }
        });

        return res.send(result);

    }
    catch(error) {
        // Deu errado: exibe o erro no terminal
        console.error(error);

        // Envia o erro ao front-end, com status de erro
        // HTTP 500: Internal Server Error
        return res.status(500).send(error);
    }
}

export default controller;
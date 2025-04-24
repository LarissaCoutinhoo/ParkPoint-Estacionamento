// Importando bibliotecas necessárias
import prisma from '../database/client.js';

const controller = {};

// Função Validada 19/04
// Função para verificar se a sessão foi iniciada
function verificaSessao(req){
    if (req.session.funcionario){
        return true;
    }else{
        return false;
    }
}

// Função Validada 19/04
// Criando um novo veiculo
controller.create = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se os dados não foram enviados vazios
        if (req.body.placa.trim() === ""){
            return res.status(400).json({ mensagem: "Placa não pode ser nula!" });
        }else if (req.body.cor.trim() === ""){
            return res.status(400).json({ mensagem: "Cor não pode ser nula!" });
        }else if (req.body.tipo.trim() === ""){
            return res.status(400).json({ mensagem: "Tipo não pode ser nulo!" });
        }else if (req.body.modelo.trim() === ""){
            return res.status(400).json({ mensagem: "Modelo não pode ser nulo!" });
        }

        // Verificando se a placa informada já não está em uso
        const placaCadastrada = await prisma.veiculo.findFirst({
            where: { placa: req.body.placa }
        });

        if(placaCadastrada) {
            return res.status(400).json({ mensagem: "Placa já se encontra cadastrada!" });
        }

        // Definindo o id do funcionário responsável pelo cadastro
        req.body.id_funcionario = req.session.funcionario.id;

        // Cadastrando o veiculo
        await prisma.veiculo.create({ data: req.body });

        // Retornando resultado para redirecionamento no front
        // console.log(req.session.veiculo);
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

// Função Validada 19/04
// Alterando os dados de um veiculo
controller.update = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se os dados não foram enviados vazios
        if (req.body.placa.trim() === ""){
            return res.status(400).json({ mensagem: "Placa não pode ser nula!" });
        }else if (req.body.cor.trim() === ""){
            return res.status(400).json({ mensagem: "Cor não pode ser nula!" });
        }else if (req.body.tipo.trim() === ""){
            return res.status(400).json({ mensagem: "Tipo não pode ser nulo!" });
        }else if (req.body.modelo.trim() === ""){
            return res.status(400).json({ mensagem: "Modelo não pode ser nulo!" });
        }

        // Obtendo os dados do veiculo atual, passados pelo atributo ID
        const veiculoCadastrado = await prisma.veiculo.findFirst({
            where: { id: Number(req.params.id) }
        });

        // Verificando se o placa informado já não está em uso se for diferente do já cadastrado
        if (veiculoCadastrado.placa !== req.body.placa){
            const placaCadastrada = await prisma.veiculo.findFirst({
                where: { placa: req.body.placa }
            });
            if(placaCadastrada) {
                return res.status(400).json({ mensagem: "Placa já se encontra cadastrada!" });
            }
        }

        // Definindo o id do funcionário responsável pela alteração
        req.body.id_funcionario = req.session.funcionario.id;
        
        // Atualizando os dados do veiculo
        await prisma.veiculo.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });

        // Retornando resultado para redirecionamento no front
        // console.log(req.session.veiculo);
        return res.status(201).json({result: true});

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Veículo Não Encontrado!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 19/04
// Deletando o veiculo
// Não de fato, mas altera o seu status para Cancelado, afim de manter o histórico das entradas realizada por ele
controller.delete = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Exclui o veiculo
        // Não de fato, mas altera o seu status para Cancelado, afim de manter o histórico das entradas realizada por ele

        await prisma.veiculo.update({
            where: { id: Number(req.params.id) },
            data: {
                status: false,
                id_funcionario: req.session.funcionario.id
            }
        });

        return res.status(201).json({result: true});
    }
    catch(error) {
      // P2025: erro do Prisma referente a objeto não encontrado
      if(error?.code === 'P2025') {
        // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
        return res.status(400).json({mensagem: "Veículo Não Encontrado!"});
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

// Função Validada 19/04
// Buscando um veiculo pela placa
controller.retrieveOnePlaca = async function(req, res) {
    try {

        console.log(req.session);

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo os dados do veiculo atual, passados pelo atributo ID
        const result = await prisma.veiculo.findFirst({
            where: { placa: req.params.placa }
        });

        if (!result){
            return res.status(400).json({mensagem: "Veículo Não Encontrado!"});
        }

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Veículo Não Encontrado!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 19/04
// Buscando um veiculo pelo id
controller.retrieveOne = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo os dados do veiculo atual, passados pelo atributo ID
        const result = await prisma.veiculo.findFirst({
            where: { id: Number(req.params.id) }
        });

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Veículo Não Encontrado!"});
        }else{
            // Deu errado: exibe o erro no terminal
            console.error(error);

            // Envia o erro ao front-end, com status de erro
            // HTTP 500: Internal Server Error
            return res.status(500).send(error);
        }
    }
}

// Função Validada 19/04
// Buscando todos os veiculos cadastrados
controller.retrieveAll = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo os dados do veiculo atual, passados pelo atributo ID
        const result = await prisma.veiculo.findMany({ 
            orderBy: [{ modelo: "asc"}] 
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
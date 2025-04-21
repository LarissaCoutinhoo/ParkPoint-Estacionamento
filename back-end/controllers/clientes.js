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
// Criando um novo cliente
controller.create = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se os dados não foram enviados vazios
        if (req.body.nome.trim() === ""){
            return res.status(400).json({ mensagem: "Nome não pode ser nulo!" });
        }else if (req.body.cpf.trim() === ""){
            return res.status(400).json({ mensagem: "CPF não pode ser nulo!" });
        }

        // Verificando se o cpf informado já não está em uso
        const cpfCadastrado = await prisma.cliente.findFirst({
            where: { cpf: req.body.cpf }
        });

        if(cpfCadastrado) {
            return res.status(400).json({ mensagem: "CPF já se encontra cadastrado!" });
        }

        // Definindo um status padrão
        req.body.status = true;

        // Definindo o id do funcionário responsável pelo cadastro
        req.body.id_funcionario = req.session.funcionario.id;

        // Cadastrando o cliente
        await prisma.cliente.create({ data: req.body });

        // Retornando resultado para redirecionamento no front
        // console.log(req.session.cliente);
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
// Alterando os dados de um cliente
controller.update = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se os dados não foram enviados vazios
        if (req.body.nome.trim() === ""){
            return res.status(400).json({ mensagem: "Nome não pode ser nulo!" });
        }else if (req.body.cpf.trim() === ""){
            return res.status(400).json({ mensagem: "CPF não pode ser nulo!" });
        }

        // Obtendo os dados do cliente atual, passados pelo atributo ID
        const clienteCadastrado = await prisma.cliente.findFirst({
            where: { id: Number(req.params.id) }
        });

        // Verificando se o cpf informado já não está em uso se for diferente do já cadastrado
        if (clienteCadastrado.cpf !== req.body.cpf){
            const cpfCadastrado = await prisma.cliente.findFirst({
                where: { cpf: req.body.cpf }
            });
            if(cpfCadastrado) {
                return res.status(400).json({ mensagem: "CPF já se encontra cadastrado!" });
            }
        }

        // Definindo o id do funcionário responsável pela alteração
        req.body.id_funcionario = req.session.funcionario.id;
        
        // Atualizando os dados do cliente
        await prisma.cliente.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });

        // Retornando resultado para redirecionamento no front
        // console.log(req.session.cliente);
        return res.status(201).json({result: true});

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Cliente Não Encontrado!"});
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
// Deletando o cliente
// Não de fato, mas altera o seu status para Cancelado, afim de manter o histórico das entradas realizada por ele
controller.delete = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Exclui o cliente
        // Não de fato, mas altera o seu status para Cancelado, afim de manter o histórico das entradas realizada por ele
        let observacao = "";
        if (req.body.observacao){
            observacao = req.body.observacao;
        }

        await prisma.cliente.update({
            where: { id: Number(req.params.id) },
            data: {
                status: false,
                observacao: observacao,
                id_funcionario: req.session.funcionario.id
            }
        });

        return res.status(201).json({result: true});
    }
    catch(error) {
      // P2025: erro do Prisma referente a objeto não encontrado
      if(error?.code === 'P2025') {
        // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
        return res.status(400).json({mensagem: "Cliente Não Encontrado!"});
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
// Buscando um cliente pelo cpf
controller.retrieveOneCpf = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo os dados do cliente atual, passados pelo atributo ID
        const result = await prisma.cliente.findFirst({
            where: { cpf: req.params.cpf }
        });

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Cliente Não Encontrado!"});
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
// Buscando um cliente pelo id
controller.retrieveOne = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo os dados do cliente atual, passados pelo atributo ID
        const result = await prisma.cliente.findFirst({
            where: { id: Number(req.params.id) }
        });

        return res.send(result);

    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Cliente Não Encontrado!"});
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
// Buscando todos os clientes cadastrados
controller.retrieveAll = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Obtendo os dados do cliente atual, passados pelo atributo ID
        const result = await prisma.cliente.findMany({ 
            orderBy: [{ nome: "asc"}] 
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
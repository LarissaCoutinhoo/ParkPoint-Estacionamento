// Importando bibliotecas necessárias
import prisma from '../database/client.js';
import bcrypt from 'bcrypt';

const controller = {};

// Função Validada 19/04
// Função para validar senha do funcionário
async function validaSenha(senhaAtual, idFuncionario){
    const verificaFuncionario = await prisma.funcionario.findUnique({
        where: { id: idFuncionario }
    }); 
    
    let verSenha = await bcrypt.compare(senhaAtual, verificaFuncionario.senha);
    if(verSenha){
        return true;
    }else{
        return false;
    }
}

// Função Validada 19/04
// Função para verificar se a sessão foi iniciada
function verificaSessao(req){
    if (req.session.funcionario){
        return true;
    }else{
        return false;
    }
}
controller.verificaSessao = async function(req, res){
    const verSes = verificaSessao(req);
    if (verSes){
        return res.status(201).json({result: verSes, nomeUsuario: req.session.funcionario.nome});
    }else{
        return res.status(400).json({result: verSes});
    }
}

// Função Validada 19/04
// Encerrando a sessão quando solicitado
controller.encerrarSessao = async function(req, res) {
    try{
        // Destruindo sessão
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ mensagem: 'Erro ao encerrar sessão' });
            } else {
                console.log('Logout realizado com sucesso');
                // Envia resultado confirmando a exclusão
                res.status(201).json({result: true});
            }
        });

        return;
    }catch{
        // Deu errado: exibe o erro no terminal
        console.error(error);
  
        // Envia o erro ao front-end, com status de erro
        // HTTP 500: Internal Server Error
        return res.status(500).send(error);
    }
}

// Função Validada 19/04
// Criando um novo funcionário
controller.create = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se o usuário logado tem permissão para cadastar outros funcionários
        if (req.session.funcionario.nivel === "ADM"){

            // Verificando se os dados não foram enviados vazios
            if (req.body.nome.trim() === ""){
                return res.status(400).json({ mensagem: "Nome não pode ser nulo!" });
            }else if (req.body.login.trim() === ""){
                return res.status(400).json({ mensagem: "Login não pode ser nulo!" });
            }else if (req.body.senha.trim() === ""){
                return res.status(400).json({ mensagem: "Senha não pode ser nula!" });
            }

            // Verificando se o login informado já não está em uso
            const loginCadastrado = await prisma.funcionario.findFirst({
                where: { login: req.body.login }
            });

            if(loginCadastrado) {
                return res.status(400).json({ mensagem: "Login já está em uso!" });
            }

            // Criptografando a senha antes de cadastrar
            const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);
            req.body.senha = senhaCriptografada

            await prisma.funcionario.create({ data: req.body });

            // Retornando resultado para redirecionamento no front
            // console.log(req.session.funcionario);
            return res.status(201).json({result: true});
        }else{
            return res.status(400).json({mensagem: "Esse Usuário não tem permissão para acessar essa função!"});
        }
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
// Obtendo um funcionário específico pelo id
controller.retrieveOne = async function(req, res) {
    try {
        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Buscando os dados de um funcionário específico
        const result = await prisma.funcionario.findUnique({
            where: {id: Number(req.params.id)}
        });

        return res.send(result);
    
    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Funcionário Não Encontrado!"});
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
// Obtendo todos os funcionários cadastrados
controller.retrieveAll = async function(req, res) {
    try {
        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se o funcionário atual tem permissão para acessar os dados de toodos os funcionários
        if (req.session.funcionario.nivel === "ADM"){
            // Buscando todas os funcionários cadastrados
            const result = await prisma.funcionario.findMany({
                where: {
                    id: { not: Number(req.session.funcionario.id) }
                },
                orderBy: [ { nome: 'asc' } ]
            });

            // Retorna os dados obtidos
            return res.send(result);
        }else{
            return res.status(400).json({mensagem: "Esse Usuário não tem permissão para acessar essa função!"});
        }
    
        
    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Nenhum Funcionário Encontrado!"});
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
// Obtendo um funcionário específico pelo atributo login (Nome funcionário Sistema)
controller.loginFuncionario = async function(req, res) {
    try {

        // Verificando se não ha nenhum registro de funcionários
        // Para inicializar um usuário padrão
        const qtFuncionarios = await prisma.funcionario.findFirst();

        if (qtFuncionarios){
            // Buscando os dados de um funcionário específico
            const verificaLogin = await prisma.funcionario.findFirst({
                where: {login: req.body.login}
            });
        
            // Veridicando se o usuário existe
            if (!verificaLogin){
                return res.status(400).json({mensagem: "Funcionário Não Encontrado!"});
            }

            // Veridicando se o usuário inormado não está cancelado
            if (verificaLogin.nivel === "Cancelado"){
                return res.status(400).json({ mensagem: "Usuário cancelado, não se pode entrar no Sistema! Verifique com algum ADM de Sistema da empresa!"});
            }

            // Verificando se a senha informada é a senha atual do funcionário
            const valSenha = await validaSenha(req.body.senha, verificaLogin.id);
            if (!valSenha){
                return res.status(400).json({ mensagem: "Senha Inválida!"});
            }

            // Recuperando os dados alterados do funcionário para iniciar a sessão no nanegador
            const funcionarioCadastrado = await prisma.funcionario.findFirst({
                where: { login: req.body.login }
            });

            // Alterando os dados da sessão
            req.session.funcionario = {
                id: funcionarioCadastrado.id,
                nome: funcionarioCadastrado.nome,
                login: funcionarioCadastrado.login,
                nivel: funcionarioCadastrado.nivel
            };

            console.log('Sessão salva no login:', req.session);

            // Retornando resultado para redirecionamento no front
            // console.log(req.session.funcionario);
            return res.status(201).json({result: true});
        }else{
            // Cadastrando um usuário padrão para o primeiro acesso

            // Criptografando a senha antes de cadastrar
            const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);
            req.body.senha = senhaCriptografada;

            req.body.nome   = "Usuário Adminsitrador";
            req.body.nivel  = "ADM";
            req.body.login  = req.body.login;

            await prisma.funcionario.create({ data: req.body });

            // Recuperando os dados do recem criado funcionário para iniciar a sessão no vanegador
            const funcionarioCadastrado = await prisma.funcionario.findFirst({
                where: { login: req.body.login }
            });

            // Criando a sessão no navegador
            req.session.funcionario = {
                id: funcionarioCadastrado.id,
                nome: funcionarioCadastrado.nome,
                login: funcionarioCadastrado.login,
                nivel: funcionarioCadastrado.nivel
            };

            // Retornando resultado para redirecionamento no front
            // console.log(req.session.funcionario);
            return res.status(201).json({result: true, mensagem: "Usuário padrão criado! Não se esqueça de Alterar os Dados!"});
        }
    }
    catch(error) {
        // P2025: erro do Prisma referente a objeto não encontrado
        if(error?.code === 'P2025') {
            // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
            return res.status(400).json({mensagem: "Funcionário Não Encontrado!"});
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
// Atualizando os dados do funcionário
controller.update = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se o usuário a ser aletrado é o memso logado
        // pois essa função não permite a alteração de um funcionário diferente do logado
        // Existe a função updateAdmFunc para isso
        if (req.session.funcionario.id != Number(req.params.id)){
            return res.status(400).json({ mensagem: "Essa função não permite a alteração de um Usuário diferente do Logado" });
        }

        // Verificando se o usuário logado tem permissão para alterar os seus próprios dados
        if (req.session.funcionario.nivel === "ADM"){

            // Verificando se os dados não foram enviados vazios
            if (req.body.nome.trim() === ""){
                return res.status(400).json({ mensagem: "Nome não pode ser nulo!" });
            }else if (req.body.login.trim() === ""){
                return res.status(400).json({ mensagem: "Login não pode ser nulo!" });
            }else if (req.body.senha.trim() === ""){
                return res.status(400).json({ mensagem: "Senha não pode ser nula!" });
            }

            // Verificando se o login a ser atualizado é o mesmo que o login atual
            const verificaLogin = await prisma.funcionario.findUnique({
                where: { id: Number(req.params.id) }
            });

            if(verificaLogin.login !== req.body.login){
                // Verificando se o login informado já não está em uso
                const loginCadastrado = await prisma.funcionario.findUnique({
                    where: { login: req.body.login }
                });

                if(loginCadastrado) {
                    return res.status(400).json({ mensagem: "Login já está em uso!" });
                }
            }

            // Verificando se a senha informada é a senha atual do funcionário
            const valSenha = await validaSenha(req.body.senha_atual, Number(req.params.id));
            if (!valSenha){
                return res.status(400).json({ mensagem: "Senha Inválida!"});
            }
            delete req.body.senha_atual;

            // Criptografando a senha antes de ser alterados os dados
            const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);

            req.body.senha = senhaCriptografada;

            // Atualizando os dados do funcionário
            await prisma.funcionario.update({
                where: { id: Number(req.params.id) },
                data: req.body
            });

            // Recuperando os dados alterados do funcionário para iniciar a sessão no vanegador
            const funcionarioCadastrado = await prisma.funcionario.findFirst({
                where: { login: req.body.login }
            });

            // Alterando os dados da sessão
            req.session.funcionario = {
                id: funcionarioCadastrado.id,
                nome: funcionarioCadastrado.nome,
                login: funcionarioCadastrado.login,
                nivel: funcionarioCadastrado.nivel
            };
        
            // Retornando mensagem de sucessao caso tenha atualizado
            return res.status(201).json({mensagem: "Dados Atualizados com Sucesso!"});
        }else{
            return res.status(400).json({mensagem: "Esse Usuário não tem permissão para acessar essa função!"});
        }
    }
    catch(error) {
      // P2025: erro do Prisma referente a objeto não encontrado
      if(error?.code === 'P2025') {
        // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
        return res.status(400).json({mensagem: "Funcionário Não Encontrado!"});
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
// Deletando o funcionário
// Não de fato, mas altera o seu nivel para Cancelado, afim de manter o histórico das entradas realizada por ele
controller.delete = async function(req, res) {
    try {

        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se o usuário a ser excluido é o memso logado
        // pois essa função não permite a exclusão de um funcionário diferente do logado
        // Existe a função deleteAdmFunc para isso
        if (req.session.funcionario.id != Number(req.params.id)){
            return res.status(400).json({ mensagem: "Essa função não permite a alteração de um Usuário diferente do Logado" });
        }

        // Verificando se o usuário logado tem permissão para se deletar
        if (req.session.funcionario.nivel === "ADM"){
            // Verificando se a senha informada é a senha atual do funcionario
            const valSenha = await validaSenha(req.body.senha_atual, Number(req.params.id));
            if (!valSenha){
                return res.status(400).json({ mensagem: "Senha Inválida!"});
            }
            delete req.body.senha_atual;

            // Verificando se existe outro funcionario ADM para permitir a exclusão
            const qtFuncionarios = await prisma.funcionario.count({ where: {nivel: "ADM"} });
            console.log("Contador de ADM: " + qtFuncionarios);
            if (qtFuncionarios < 2){
                return res.status(400).json({ mensagem: "Você precisa designar outro funcionário como ADM! Pois só há você com esse nível no momento!"});
            }

            // Exclui o funcionário
            // Não de fato, mas altera o seu nivel para Cancelado, afim de manter o histórico das entradas realizada por ele
            await prisma.funcionario.update({
                where: { id: Number(req.params.id) },
                data: {
                    nivel: "Cancelado"
                }
            });

            // Destruindo sessão
            req.session.destroy(err => {
                if (err) {
                    res.status(500).json({ mensagem: 'Erro ao encerrar sessão' });
                } else {
                    console.log('Logout realizado com sucesso');
                    // Envia resultado confirmando a exclusão
                    res.status(201).json({result: true});
                }
            });

            return;
        
        }else{
            return res.status(400).json({mensagem: "Esse Usuário não tem permissão para acessar essa função!"});
        }
    }
    catch(error) {
      // P2025: erro do Prisma referente a objeto não encontrado
      if(error?.code === 'P2025') {
        // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
        return res.status(400).json({mensagem: "Funcionário Não Encontrado!"});
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
// ADM Atualizando os dados de um funcionário
controller.updateAdmFunc = async function(req, res) {
    try {
        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }

        // Verificando se o usuário a ser alterado não é o memso logado
        // pois essa função não permite a alteração de um funcionário igual do logado
        // Existe a função update para isso
        if (req.session.funcionario.id === Number(req.params.id)){
            return res.status(400).json({ mensagem: "Essa função não permite a alteração de um Usuário igual ao Logado" });
        }

        // Verificando se o usuário logado tem permissão para alterar outros funcionários
        if (req.session.funcionario.nivel === "ADM"){

            // Verificando se os dados não foram enviados vazios
            if (req.body.nome.trim() === ""){
                return res.status(400).json({ mensagem: "Nome não pode ser nulo!" });
            }else if (req.body.login.trim() === ""){
                return res.status(400).json({ mensagem: "Login não pode ser nulo!" });
            }else if (req.body.senha.trim() === ""){
                return res.status(400).json({ mensagem: "Senha não pode ser nula!" });
            }
                
            // Verificando se o login a ser atualizado é o mesmo que o login atual
            const verificaLogin = await prisma.funcionario.findUnique({
                where: { id: Number(req.params.id) }
            });

            if(verificaLogin.login !== req.body.login){
                // Verificando se o login informado já não está em uso
                const loginCadastrado = await prisma.funcionario.findUnique({
                    where: { login: req.body.login }
                });

                if(loginCadastrado) {
                    return res.status(400).json({ mensagem: "Login já está em uso!" });
                }
            }


            // Criptografando a senha antes de ser alterados os dados
            const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);

            req.body.senha = senhaCriptografada;

            // Atualizando os dados do funcionário
            await prisma.funcionario.update({
                where: { id: Number(req.params.id) },
                data: req.body
            });
        
            // Retornando mensagem de sucessao caso tenha atualizado
            return res.status(201).json({mensagem: "Funcionário Atualizado com Sucesso!"});
        }else{
            return res.status(400).json({mensagem: "Esse Usuário não tem permissão para acessar essa função!"});
        }
    }
    catch(error) {
      // P2025: erro do Prisma referente a objeto não encontrado
      if(error?.code === 'P2025') {
        // Não encontrou e não alterar ~> retorna HTTP 404: Not Found
        return res.status(400).json({mensagem: "Funcionário Não Encontrado!"});
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
// ADM Deletando um funcionário
controller.deleteAdmFunc = async function(req, res) {
    try {
        // Verificando se a sessão foi iniciada
        if (!verificaSessao(req)){
            return res.status(400).json({ mensagem: "Sessão não iniciada!" });
        }
        
        // Verificando se o usuário a ser excluido não é o memso logado
        // pois essa função não permite a exclusão de um funcionário igual do logado
        // Existe a função update para isso
        if (req.session.funcionario.id === Number(req.params.id)){
            return res.status(400).json({ mensagem: "Essa função não permite a exclusão de um Usuário igual ao Logado" });
        }

        // Verificando se o usuário logado tem permissão para deletar outros funcionários
        if (req.session.funcionario.nivel === "ADM"){

            // Excluindo funcionário 
            // Não de fato, mas altera o seu nivel para Cancelado, afim de manter o histórico das entradas realizada por ele
            await prisma.funcionario.update({
                where: { id: Number(req.params.id) },
                data: {
                    nivel: "Cancelado"
                }
            });
        
            // Envia resultado confirmando a exclusão
            return res.status(201).json({result: true});
        }
    }
    catch(error) {
      // P2025: erro do Prisma referente a objeto não encontrado
      if(error?.code === 'P2025') {
        // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
        return res.status(400).json({mensagem: "Funcionário Não Encontrado!"});
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

export default controller;
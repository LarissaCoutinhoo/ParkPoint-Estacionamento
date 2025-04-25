// Função para verificar se a placa (Veiculo) já esta cadastrada, se não estiver mostrará os dados requiridos para o cadastro
async function verPlaca(placa) {
    document.getElementById('mensagem').innerHTML = "";

    if (!placa || placa.trim() === "") {
        document.getElementById('placa').focus();
        document.getElementById('mensagem').innerHTML = "Placa Nula!";
        return "Placa Nula";
    }

    try {

        const resposta = await fetch('http://127.0.0.1:3000/veiculos/placa/' + placa, {
            method: 'GET',
            credentials: 'include' // ESSENCIAL para cookies de sessão
        });

        const dados = await resposta.json();

        if (dados.mensagem) {
            if (dados.mensagem === "Veículo Não Encontrado!") {
                document.getElementById('dadosVeiculo').style.display = "block";
                document.getElementById('cor').focus();
                return "cadastrar";
            } else if (dados.mensagem === "Sessão não iniciada!") {
                window.location.href = '../index.html';
                return false;
            } else {
                document.getElementById('mensagem').innerHTML = dados.mensagem;
                return "Erro: " + dados.mensagem;
            }
        }
        
        document.getElementById('cpf').focus();
        document.getElementById('dadosVeiculo').style.display = "none";
        return "cadastrado";

    } catch (erro) {
        console.error('Erro ao buscar placa:', erro);
        document.getElementById('mensagem').innerHTML = "Erro na consulta dos dados! Verifique a conexão com o servidor!";
        return "Erro: " + erro;
    }
}


// Função para verificar se o cpf (Cliente) já esta cadastrada, se não estiver mostrará os dados requiridos para o cadastro
async function verCpf(cpf){
    
    document.getElementById('mensagem').innerHTML = "";

    if (!cpf || cpf.trim() === "") {
        document.getElementById('cpf').focus();
        document.getElementById('mensagem').innerHTML = "CPF Nulo!";
        return "invalido";
    }

    // Validando a mascara do cpf
    const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const teste = regexCPF.test(cpf);
    if (!teste){
        document.getElementById('cpf').focus();
        document.getElementById('mensagem').innerHTML = "CPF Inválido!";
        return "invalido";
    }

    try {

        const resposta = await fetch('http://127.0.0.1:3000/clientes/cpf/' + cpf, {
            method: 'GET',
            credentials: 'include' // ESSENCIAL para cookies de sessão
          });

        const dados = await resposta.json();

        if (dados.mensagem) {
            if (dados.mensagem === "Cliente Não Encontrado!") {
                document.getElementById('dadosCliente').style.display = "block";
                document.getElementById('nome').focus();
                return "cadastrar";
            } else if (dados.mensagem === "Sessão não iniciada!") {
                window.location.href = '../index.html';
                return;
            } else {
                document.getElementById('mensagem').innerHTML = dados.mensagem;
                return "erro";
            }
        }
        document.getElementById('dadosCliente').style.display = "none";
        return "cadastrado";

    } catch (erro) {
        console.error('Erro ao buscar cliente:', erro);
        document.getElementById('mensagem').innerHTML = "Erro na consulta dos dados! Verifique a conexão com o servidor!";
        return "erro";
    }
}


// Função para registrar a entrada
async function regEntrada(placa, cor, tipo, modelo, cpf, nome, observacao, valor_hora){
    
    document.getElementById('mensagem').innerHTML = "";

    try {

        // Verificando a procedencia do cpf para ver se será necessário cadastra-lo
        const resCpf = await verCpf(cpf);

        // Validando os dados para o cadastro da entrada do veículo
        // Verificando se não estão nulos ou com valores incongruentes
        if (valor_hora <= 0){
            return document.getElementById('mensagem').innerHTML = "Valor da Hora Inválido!";
        }
        
        // Se houver a necessidade de cadastrar o cliente
        if (resCpf === "cadastrar"){

            // Validando os dados adicionais
            if (nome.trim() === ""){
                return document.getElementById('mensagem').innerHTML = "Nome não pode ser Nulo!";
            }

            const resCliente = await fetch('http://127.0.0.1:3000/clientes/', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, cpf, observacao })
            });

        }else if (resCpf !== "cadastrado"){
            document.getElementById('cpf').focus();
            return document.getElementById('mensagem').innerHTML = resCpf;
        }


        // Verificando a procedencia da placa para ver se será necessário cadastra-la
        const resPlaca = await verPlaca(placa);
        
        // Se houver a necessidade de cadastrar o cliente
        if (resPlaca === "cadastrar"){

            // Validando os dados adicionais
            if (cor.trim() === "" || modelo.trim() === "" || (tipo !== "moto" && tipo !== "carro")){
                return document.getElementById('mensagem').innerHTML = "Dados do veículo Inválidos!";
            }

            const resVeiculo = await fetch('http://127.0.0.1:3000/veiculos/', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ placa, cor, tipo, modelo })
            });

        }else if (resPlaca !== "cadastrado"){
            document.getElementById('placa').focus();
            document.getElementById('mensagem').innerHTML = resPlaca;
            return;
        }


        // Cadastrando a entrada
        const resposta = await fetch('http://127.0.0.1:3000/entradas/', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ placa, cpf, valor_hora })
        });

        const dados = await resposta.json();

        if (dados.mensagem) {
           if (dados.mensagem === "Sessão não iniciada!") {
                window.location.href = '../index.html';
                return;
            } else {
                document.getElementById('placa').focus();
                document.getElementById('mensagem').innerHTML = dados.mensagem;
                return;
            }
        }

        // Limpando os campos e emitindo mensagem de sucesso
        document.getElementById('cpf').value = "";
        document.getElementById('nome').value = "";
        document.getElementById('observacao').value = "";

        document.getElementById('placa').value = "";
        document.getElementById('placa').focus();
        document.getElementById('cor').value = "";
        document.getElementById('modelo').value = "";
        document.getElementById('valor_hora').value = "";

        document.getElementById('dadosCliente').style.display = "none";
        document.getElementById('dadosVeiculo').style.display = "none";

        document.getElementById('mensagem').innerHTML = "Entrada Cadatrada!";
        return;

    } catch (erro) {
        console.error('Erro ao buscar cliente:', erro);
        document.getElementById('mensagem').innerHTML = "Erro na consulta dos dados! Verifique a conexão com o servidor!";
        return;
    }
}
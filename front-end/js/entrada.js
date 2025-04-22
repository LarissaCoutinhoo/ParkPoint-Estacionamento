// Função para verificar se a placa (Veiculo) já esta cadastrada, se não estiver mostrará os dados requiridos para o cadastro
async function verPlaca(placa) {
    document.getElementById('mensagem').innerHTML = "";

    try {
        const resposta = await fetch('http://localhost:3000/veiculos/placa/' + placa);

        if (!resposta) {
            return document.getElementById('mensagem').innerHTML = "Erro na consulta dos dados!";
        }

        const dados = await resposta.json();

        if (dados.mensagem) {
            if (dados.mensagem === "Veículo Não Encontrado!") {
                return document.getElementById('dadosVeiculo').style.display = "block";
            } else if (dados.mensagem === "Sessão não iniciada!") {
                return window.location.href = '../index.html';
            } else {
                return document.getElementById('mensagem').innerHTML = dados.mensagem;
            }
        }

        document.getElementById('dadosVeiculo').style.display = "none";

    } catch (erro) {
        console.error('Erro ao buscar placa:', erro);
        document.getElementById('mensagem').innerHTML = "Erro na consulta dos dados! Verifique a conexão com o servidor.";
    }
}


// Função para verificar se o cpf (Cliente) já esta cadastrada, se não estiver mostrará os dados requiridos para o cadastro
function verCpf(cpf){
    
}
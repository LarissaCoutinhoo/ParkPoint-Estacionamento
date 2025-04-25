// Função para realizar a saida de alguma entrada
async function sair(placa) {
    document.getElementById('mensagem').innerHTML = "";

    if (!placa || placa.trim() === "") {
        document.getElementById('placa').focus();
        document.getElementById('mensagem').innerHTML = "Placa Nula!";
        return "Placa Nula";
    }

    try {

        const resposta = await fetch('http://127.0.0.1:3000/entradas/placa/' + placa, {
            method: 'GET',
            credentials: 'include'
        });

        const dados = await resposta.json();

        if (dados.mensagem) {
            if (dados.mensagem === "Sessão não iniciada!") {
                window.location.href = '../index.html';
                return;
            } else {
                document.getElementById('mensagem').innerHTML = dados.mensagem;
                return;
            }
        }

        // Registrando saida
        const resSaida = await fetch('http://127.0.0.1:3000/entradas/sair/' + dados.id, {
            method: 'PUT',
            credentials: 'include'
        });

        const dadosSaida = await resSaida.json();

        if (!dadosSaida.result){
            document.getElementById('mensagem').innerHTML = "Erro no Registro da Saída!";
            return;
        }

        document.getElementById('placa').value = "";
        document.getElementById('mensagem').innerHTML = "Saída Registrada!";
        return;

    } catch (erro) {
        console.error('Erro ao buscar placa:', erro);
        document.getElementById('mensagem').innerHTML = erro + "Erro na consulta dos dados! Verifique a conexão com o servidor!";
        return;
    }
}
async function verStatusGar() {
    try {
        const resposta = await fetch('http://127.0.0.1:3000/entradas/contarTipos/true', {
            method: 'GET',
            credentials: 'include'
        });

        if (!resposta.ok) {
            alert("Erro na resposta do servidor!");
            return;
        }

        const dados = await resposta.json();

        const tblRelatorio = document.getElementById('tabelaVeiculos'); // Deve ser o <tbody> da tabela

        if (dados.length === 0) {
            tblRelatorio.innerHTML = '<tr><td colspan="3">Nenhum dado encontrado.</td></tr>';
            return;
        }

        for (const tipoVeiculo of dados) {
            const linha = document.createElement('tr'); // Aqui cria a linha!

            linha.innerHTML = `
              <td>${tipoVeiculo.tipo}</td>
              <td>${tipoVeiculo.quantidade}</td>
              <td>${tipoVeiculo.quantidadeMaxima ?? '-'}</td>
            `;

            tblRelatorio.appendChild(linha);
        }

    } catch (erro) {
        console.error('Erro ao buscar status do estacionamento:', erro);
        alert("Erro ao buscar status!");
    }
}

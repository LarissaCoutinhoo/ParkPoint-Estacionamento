
const entradaForm = document.getElementById('entradaForm');
const saidaForm = document.getElementById('saidaForm');

const taxaPorHora = {
    carro: 5,
    moto: 3
};

const vagas = {
    carro: 20,
    moto: 10
};

let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];

if (entradaForm) {
    entradaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const placa = document.getElementById('placa').value.toUpperCase();
        const tipo = document.getElementById('tipo').value;

        if (veiculos.find(v => v.placa === placa)) {
            document.getElementById('mensagem').innerText = 'Veículo já registrado.';
            return;
        }

        const ocupados = veiculos.filter(v => v.tipo === tipo).length;
        if (ocupados >= vagas[tipo]) {
            document.getElementById('mensagem').innerText = 'Sem vagas disponíveis para este tipo.';
            return;
        }

        veiculos.push({ placa, tipo, entrada: Date.now() });
        localStorage.setItem('veiculos', JSON.stringify(veiculos));
        document.getElementById('mensagem').innerText = 'Entrada registrada com sucesso.';
        entradaForm.reset();
    });
}

if (saidaForm) {
    saidaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const placa = document.getElementById('placaSaida').value.toUpperCase();
        const index = veiculos.findIndex(v => v.placa === placa);

        if (index === -1) {
            document.getElementById('saidaMensagem').innerText = 'Veículo não encontrado.';
            return;
        }

        const veiculo = veiculos[index];
        const tempo = Math.ceil((Date.now() - veiculo.entrada) / (1000 * 60 * 60));
        const preco = tempo * taxaPorHora[veiculo.tipo];
        veiculos.splice(index, 1);
        localStorage.setItem('veiculos', JSON.stringify(veiculos));

        document.getElementById('saidaMensagem').innerText =
            `Saída registrada. Total a pagar: R$ ${preco.toFixed(2)} (${tempo}h).`;
        saidaForm.reset();
    });
}

if (document.getElementById('statusContainer')) {
    const container = document.getElementById('statusContainer');
    const status = {
        carro: veiculos.filter(v => v.tipo === 'carro').length,
        moto: veiculos.filter(v => v.tipo === 'moto').length
    };
    container.innerHTML = `
        <p>Carros: ${status.carro} / ${vagas.carro}</p>
        <p>Motos: ${status.moto} / ${vagas.moto}</p>
    `;
}

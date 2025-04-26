var idCliAlt = null;

// Função para mostrar as entradas na tabela
async function carEnt() {
    try {

      const resposta = await fetch('http://127.0.0.1:3000/entradas/', {
        method: 'GET',
        credentials: 'include'
      });
      
      const dados = await resposta.json();
      if (dados.mensagem === "Sessão não iniciada!") {
        window.location.href = '../index.html';
        return;
      }

      const tabela = document.querySelector("#tabelaEntradas tbody");
      tabela.innerHTML = "";
  
      dados.forEach(entrada => {
        const linha = document.createElement('tr');

        let exclusao = '';
        if (entrada.status === "Alocado"){
          exclusao = `<i class='bi bi-trash-fill' title='Cancelar' style='cursor: pointer;' onclick='canCli(${entrada.id})'></i>`;
        }

        const totalHoras = 0;
        
        linha.innerHTML = `
          <td style="text-align: left;">${entrada.id_veiculo}</td>
          <td>${entrada.id_cliente}</td>
          <td>${entrada.data_entrada}</td>
          <td>${entrada.data_saida}</td>
          <td>${totalHoras}</td>
          <td>${entrada.valor_hora}</td>
          <td>${entrada.valor_pagar}</td>
          <td>${entrada.status}</td>
          <td>${entrada.id_funcionario}</td>
          <td><i class="bi bi-pencil-square" style='cursor: pointer;' title='Alterar' onclick='busCli(${entrada.id})'></i></td>
          <td>${exclusao}</td>
        `;
  
        tabela.appendChild(linha);
      });
  
    } catch (erro) {
      console.error("Erro ao carregar entradas:", erro);
      document.getElementById('mensagem').innerText = "Erro ao carregar os entradas!";
    }
}

// Função para buscar os dados de um cliente expecifico e exibir no form
async function busCli(id) {

  // Buscando os dados atuais e exibindo-os nas campos do form
  const resposta = await fetch('http://127.0.0.1:3000/clientes/' + id, {
    method: 'GET',
    credentials: 'include'
  });
  
  const dados = await resposta.json();

  document.getElementById('altDadosCli').style.display = 'block';

  document.getElementById('cpf').value = dados.cpf;
  document.getElementById('nome').value = dados.nome;
  document.getElementById('observacao').value = dados.observacao;

  idCliAlt = dados.id;
}

// Cancelar exibição de alterar dados
function canAltDados(){
  document.getElementById('cpf').value = "";
  document.getElementById('nome').value = "";
  document.getElementById('observacao').value = "";

  document.getElementById('altDadosCli').style.display = 'none';
  idCliAlt = null;
}

// Função para alterar os dados do cliente
async function altCli(nome, cpf, observacao) {

  // Buscando os dados atuais e exibindo-os nas campos do form
  const resposta = await fetch('http://127.0.0.1:3000/clientes/' + idCliAlt, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, cpf, observacao })
  });
  
  const dados = await resposta.json();

  if (dados.result){
    window.location.href = 'clientes.html';
    return;
  }else{
    document.getElementById('mensagem').innerHTML = dados.mensagem;
  }
}

// Função para "cancelar" cliente
async function canCli(id) {

  // Buscando os dados atuais e exibindo-os nas campos do form
  const status = false;
  const resposta = await fetch('http://127.0.0.1:3000/clientes/status/' + id, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  
  const dados = await resposta.json();

  if (dados.result){
    alert('Cliente Cancelado com Sucesso!')
    window.location.href = 'clientes.html';
    return;
  }else{
    alert(dados.mensagem);
  }
}

// Função para "reabilitar" clinete
async function habCli(id) {

  // Buscando os dados atuais e exibindo-os nas campos do form
  const status = true;
  const resposta = await fetch('http://127.0.0.1:3000/clientes/status/' + id, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  
  const dados = await resposta.json();

  if (dados.result){
    alert('Cliente Reabilitado com Sucesso!')
    window.location.href = 'clientes.html';
    return;
  }else{
    alert(dados.mensagem);
  }
}
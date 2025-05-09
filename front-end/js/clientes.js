var idCliAlt = null;

// Função para mostrar os clientes na tabela
async function carCli() {
    try {

      const resposta = await fetch('http://127.0.0.1:3000/clientes/', {
        method: 'GET',
        credentials: 'include'
      });
      
      const dados = await resposta.json();
      if (dados.mensagem === "Sessão não iniciada!") {
        window.location.href = '../index.html';
        return;
      }

      const tabela = document.querySelector("#tabelaClientes tbody");
      tabela.innerHTML = "";
  
      dados.forEach(cliente => {
        const linha = document.createElement('tr');

        if (cliente.status === true){
            cliente.status = "Ativo";
        }else{
            cliente.status = "Cancelado";
        }

        if (cliente.observacao === null){
            cliente.observacao = "";
        }

        let exclusao = `<i class='bi bi-trash-fill' title='Cancelar' style='cursor: pointer;' onclick='canCli(${cliente.id})'></i>`;
        if (cliente.status === "Cancelado"){
          exclusao = `<i class='bi bi-arrow-up-left-square-fill' title='Reabilitar' style='cursor: pointer;' onclick='habCli(${cliente.id})'></i>`;
        }
        
        linha.innerHTML = `
          <td style="text-align: left;">${cliente.nome}</td>
          <td>${cliente.cpf}</td>
          <td>${cliente.observacao}</td>
          <td>${cliente.status}</td>
          <td><i class="bi bi-pencil-square" style='cursor: pointer;' title='Alterar' onclick='busCli(${cliente.id})'></i></td>
          <td>${exclusao}</td>
        `;
  
        tabela.appendChild(linha);
      });
  
    } catch (erro) {
      console.error("Erro ao carregar clientes:", erro);
      document.getElementById('mensagem').innerText = "Erro ao carregar os clientes!";
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
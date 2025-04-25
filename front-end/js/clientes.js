// Função para mostrar os clientes na tabela
async function carregarClientes() {
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
        
        linha.innerHTML = `
          <td>${cliente.id}</td>
          <td>${cliente.nome}</td>
          <td>${cliente.cpf}</td>
          <td>${cliente.observacao}</td>
          <td>${cliente.status || 'false'}</td>
        `;
  
        tabela.appendChild(linha);
      });
  
    } catch (erro) {
      console.error("Erro ao carregar clientes:", erro);
      document.getElementById('mensagem').innerText = "Erro ao carregar os clientes!";
    }
  }
  
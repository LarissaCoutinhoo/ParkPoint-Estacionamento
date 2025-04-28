// Função para formatar a data para um formato brasileiro
async function formatarDataHora(dataString) {
  const data = new Date(dataString);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // mês começa do zero
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
}

var idCliAlt = null;

// Função para mostrar as entradas na tblAlo
async function carEnt(status) {
    try {

      // Definindo tabelas
      const tblAlo = document.querySelector("#tblEntAlocado tbody");
      tblAlo.innerHTML = "";

      const tblFin = document.querySelector("#tblEntFinalizado tbody");
      tblAlo.innerHTML = "";

      const tblCan = document.querySelector("#tblEntCancelado tbody");
      tblAlo.innerHTML = "";
  
      // Verificando qual é o tipo para realizar a busca
      if (status === "alocadas"){
        const resposta = await fetch('http://127.0.0.1:3000/entradas/alocados/all/', {
          method: 'GET',
          credentials: 'include'
        });
        
        // Verificando sessão
        const dados = await resposta.json();
        if (dados.mensagem === "Sessão não iniciada!") {
          window.location.href = '../index.html';
          return;
        }
        
        tblAlo.innerHTML = "";
        // Tabela com as Alocadas
        for (const entrada of dados) {
          if (entrada.status === "Alocado"){
            
            const linha = document.createElement('tr');

            // Formatando a data e hora para exibir
            const dataEntrada = await formatarDataHora(entrada.data_entrada);

            const valorhora = Number(entrada.valor_hora);

            // Buscando o cpf do cliente
            const resCli = await fetch('http://127.0.0.1:3000/clientes/' + entrada.id_cliente, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosCliente = await resCli.json();

            // Buscando a palca do veiculo
            const resVei = await fetch('http://127.0.0.1:3000/veiculos/' + entrada.id_veiculo, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosVeiculo = await resVei.json();

            // Buscando o nome do funcionario
            const resFun = await fetch('http://127.0.0.1:3000/funcionarios/' + entrada.id_funcionario, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosFuncionario = await resFun.json();

            linha.innerHTML = `
              <td>${dadosVeiculo.placa}</td>
              <td>${dadosCliente.cpf}</td>
              <td>${dataEntrada}</td>

              <td>${valorhora.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>

              <td>${dadosFuncionario.nome}</td>
              <td><i class="bi bi-check-circle-fill" style='cursor: pointer;' title='Finalizar' onclick='finEnt(${entrada.id})'></i></td>
              <td><i class='bi bi-trash-fill' title='Cancelar' style='cursor: pointer;' onclick='canEnt(${entrada.id})'></td>
            `;
      
            tblAlo.appendChild(linha);
          }
        }
      }else if (status === "finalizadas"){
        const resposta = await fetch('http://127.0.0.1:3000/entradas/finalizados/all/', {
          method: 'GET',
          credentials: 'include'
        });
        
        // Verificando sessão
        const dados = await resposta.json();
        if (dados.mensagem === "Sessão não iniciada!") {
          window.location.href = '../index.html';
          return;
        }

        tblFin.innerHTML = "";
        // Tabela com as Finalizadas
        for (const entrada of dados) {
          if (entrada.status === "Finalizado"){
            
            const linha = document.createElement('tr');

            // Formatando a data e hora para exibir
            const dataEntrada = await formatarDataHora(entrada.data_entrada);

            const dataSaida = await formatarDataHora(entrada.data_saida);

            // Obtendo o total de horas que ficou alocado o veiculo
            let totalHoras = Math.abs(new Date(entrada.data_saida) - new Date(entrada.data_entrada));

            // Converter para horas
            totalHoras = totalHoras / (1000 * 60 * 60);

            let valorPagar = Number(entrada.valor_pagar);

            let valorhora = Number(entrada.valor_hora);

            // Buscando o nome do funcionario
            const resFun = await fetch('http://127.0.0.1:3000/funcionarios/' + entrada.id_funcionario, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosFuncionario = await resFun.json();

            // Buscando o cpf do cliente
            const resCli = await fetch('http://127.0.0.1:3000/clientes/' + entrada.id_cliente, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosCliente = await resCli.json();

            // Buscando a palca do veiculo
            const resVei = await fetch('http://127.0.0.1:3000/veiculos/' + entrada.id_veiculo, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosVeiculo = await resVei.json();

            linha.innerHTML = `
              <td>${dadosVeiculo.placa}</td>
              <td>${dadosCliente.cpf}</td>
              <td>${dataEntrada}</td>
              <td>${dataSaida}</td>
              <td>${totalHoras.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>

              <td style="text-align: right;">R$ ${valorhora.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>

              <td style="text-align: right;">R$ ${valorPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${dadosFuncionario.nome}</td>
            `;
      
            tblFin.appendChild(linha);
          }
        }
      }else if (status === "canceladas"){
        const resposta = await fetch('http://127.0.0.1:3000/entradas/cancelados/all/', {
          method: 'GET',
          credentials: 'include'
        });
        
        // Verificando sessão
        const dados = await resposta.json();
        if (dados.mensagem === "Sessão não iniciada!") {
          window.location.href = '../index.html';
          return;
        }

        tblCan.innerHTML = "";
        // Tabela com as Canceladas
        for (const entrada of dados) {
          if (entrada.status === "Cancelado"){
            
            const linha = document.createElement('tr');

            // Formatando a data e hora para exibir
            const dataEntrada = await formatarDataHora(entrada.data_entrada);

            const dataSaida = await formatarDataHora(entrada.data_saida);

            // Obtendo o total de horas que ficou alocado o veiculo
            let totalHoras = Math.abs(new Date(entrada.data_saida) - new Date(entrada.data_entrada));

            // Converter para horas
            totalHoras = totalHoras / (1000 * 60 * 60);

            let valorhora = Number(entrada.valor_hora);

            // Buscando o nome do funcionario
            const resFun = await fetch('http://127.0.0.1:3000/funcionarios/' + entrada.id_funcionario, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosFuncionario = await resFun.json();

            // Buscando o cpf do cliente
            const resCli = await fetch('http://127.0.0.1:3000/clientes/' + entrada.id_cliente, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosCliente = await resCli.json();

            // Buscando a palca do veiculo
            const resVei = await fetch('http://127.0.0.1:3000/veiculos/' + entrada.id_veiculo, {
              method: 'GET',
              credentials: 'include'
            });

            const dadosVeiculo = await resVei.json();

            linha.innerHTML = `
              <td>${dadosVeiculo.placa}</td>
              <td>${dadosCliente.cpf}</td>
              <td>${dataEntrada}</td>

              <td style="text-align: right;">R$ ${valorhora.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>

              <td>${dadosFuncionario.nome}</td>
              <td><i class="bi bi-skip-backward-fill" style='cursor: pointer;' title='Reabrir' onclick='reaEnt(${entrada.id})'></i></td>
            `;
            
            tblCan.appendChild(linha);
          }
        }
      }

    } catch (erro) {
      console.error("Erro ao carregar entradas:", erro);
      document.getElementById('mensagem').innerText = "Erro ao carregar os entradas!";
    }
}

// Função para finalizar uma entrada
async function finEnt(id) {
    try {

      const confirmar = confirm('Sendo a entrada finalizada, não poderá ser reaberta. Deseja realmente Finalizar a Entrada?');

      if (!confirmar){
        return;
      }

      const resposta = await fetch('http://127.0.0.1:3000/entradas/sair/' + id, {
        method: 'PUT',
        credentials: 'include'
      });
      
      // Verificando sessão
      const dados = await resposta.json();
      if (dados.mensagem){
        if (dados.mensagem === "Sessão não iniciada!") {
          window.location.href = '../index.html';
          return;
        }else{
          document.getElementById('mensagem').innerText = dados.mensagem;
        }
      }else if (dados.result){
        alert("Entrada Finalizada!");
        window.location.href = 'historicoEntradas.html';
        return;
      }
  
    } catch (erro) {
      console.error("Erro ao carregar entradas:", erro);
      document.getElementById('mensagem').innerText = "Erro ao carregar os entradas!";
    }
}

// Função para reiniciar uma entrada
async function reaEnt(id) {
  try {

    const confirmar = confirm('Deseja realmente Reabrir a Entrada (Tirar do Cancelamento)?');

    if (!confirmar){
      return;
    }

    const resposta = await fetch('http://127.0.0.1:3000/entradas/reiniciar/' + id, {
      method: 'PUT',
      credentials: 'include'
    });
    
    // Verificando sessão
    const dados = await resposta.json();
    if (dados.mensagem){
      if (dados.mensagem === "Sessão não iniciada!") {
        window.location.href = '../index.html';
        return;
      }else{
        alert(dados.mensagem);
      }
    }else if (dados.result){
      alert("Entrada Reiniciada!");
      window.location.href = 'historicoEntradas.html';
      return;
    }

  } catch (erro) {
    console.error("Erro ao carregar entradas:", erro);
    document.getElementById('mensagem').innerText = "Erro ao carregar os entradas!";
  }
}

// Função para cancelar um entrada
async function canEnt(id) {
  try {

    const confirmar = confirm('Deseja realmente Cancelar a Entrada?');

    if (!confirmar){
      return;
    }

    const resposta = await fetch('http://127.0.0.1:3000/entradas/cancelar/' + id, {
      method: 'PUT',
      credentials: 'include'
    });
    
    // Verificando sessão
    const dados = await resposta.json();
    if (dados.mensagem){
      if (dados.mensagem === "Sessão não iniciada!") {
        window.location.href = '../index.html';
        return;
      }else{
        alert(dados.mensagem);
        return;
      }
    }else if (dados.result){
      alert("Entrada Cancelada!");
      window.location.href = 'historicoEntradas.html';
      return;
    }

  } catch (erro) {
    console.error("Erro ao carregar entradas:", erro);
    document.getElementById('mensagem').innerText = "Erro ao carregar os entradas!";
  }
}

// Função para selecionar o tipo de tabela a ser mostrado
async function selTab(status) {
  if (status === "alocadas"){
    document.getElementById('tblEntAlocado').style.display = "block";
    document.getElementById('tblEntCancelado').style.display = "none";
    document.getElementById('tblEntFinalizado').style.display = "none";

  }else if (status === "finalizadas"){
    document.getElementById('tblEntAlocado').style.display = "none";
    document.getElementById('tblEntCancelado').style.display = "none";
    document.getElementById('tblEntFinalizado').style.display = "block";

  }else if (status === "canceladas"){
    document.getElementById('tblEntAlocado').style.display = "none";
    document.getElementById('tblEntCancelado').style.display = "block";
    document.getElementById('tblEntFinalizado').style.display = "none";
  }

  await carEnt(status);
}
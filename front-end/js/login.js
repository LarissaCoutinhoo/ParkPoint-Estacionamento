async function entrar(login, senha) {

    document.getElementById('mensagem').innerHTML = "";

    try {
        const resposta = await fetch('http://127.0.0.1:3000/funcionarios/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, senha })
          });

        const resultado = await resposta.json();
        
        if (resultado.mensagem){
            return document.getElementById('mensagem').innerHTML = resultado.mensagem;
        }else if (resultado.result){
            return window.location.href = 'pages/inicial.html';
        }

  } catch (erro) {
    console.error('Erro ao enviar dados:', erro.message);
    return document.getElementById('mensagem').innerHTML = erro;
  }
}
# ParkPoint - (Um site para Controle de Estacionamento de Veículos)

Esse projeto é uma atividade de DWIII (Desenvolvimento Web III) do terceiro semestre do curso DSM (Desenvolvimento de Softwares Multiplataforma) da Faculdade de Tecnologia Fatec Franca Dr. Thomaz Novelino. Seu intuito é criar um site de controle de entrada e saída de veículos de um estacionamento, desenvolvido com as linguagens HTML5, CSS3, JavaScript, PostgreSQL, além de Node.js, abrangendo tanto a parte visual quanto funcional do sistema.

## 📄 Descrição

O site apresenta as seguintes páginas, com as seguintes funções:

* **Index** (Nessa página você realizará o login para poder entrar e gerenciar o sistema e as entradas e saídas dos veículos. Sem login não é possível utilizar as funções do site. Caso seja a primeira vez que o sistema esteja no ar, será criado um usuário administrador para o acesso);
* **Registrar Entrada** (Nessa página o usuário informará os dados para o cadastro de uma entrada. Se o veículo e o cliente não estiverem cadastrados, o sistema efetuará o cadastro deles automaticamente, desde que sejam informados os dados corretamente);
* **Registrar Saída** (Nessa página o usuário poderá finalizar uma entrada ao informar a placa do veículo que esteja alocado no estacionamento);
* **Clientes** (Nessa página o usuário poderá gerenciar os clientes cadastrados);
* **Histórico de Entradas** (Nessa página são mostradas todas as entradas realizadas pelos usuários, podendo finalizar, cancelar ou reiniciar uma entrada);
* **Status Garagem** (Nessa página será exibida uma tabela mostrando os tipos de veículos cadastrados, sua capacidade no estacionamento e a quantidade atualmente alocada);

<br>

## 📋 Pré-requisitos

Para que o site possa apresentar pleno funcionamento, é necessário um navegador com acesso à Internet e suporte a JavaScript. Além disso, é preciso ter um SGBD local (PostgreSQL).

## 🔧 Instalação

* Baixe os arquivos e pastas contidos neste repositório e coloque-os em uma pasta;
* Baixe o PostgreSQL no site oficial: [https://www.postgresql.org/download/](https://www.postgresql.org/download/);
* Obtenha acesso à Internet;
* Deixe o JavaScript ativado no seu navegador;
* Execute no terminal do repositório o comando `cd back-end`;
* Execute no terminal o comando `npx prisma migrate dev --name add-relacionamentos`;
* Execute no terminal o comando `npx prisma generate`;
* Execute no terminal o comando `node server.js`;
* Se tudo ocorrer bem, aparecerá no terminal: **"Servidor rodando em http://localhost:3000"**;
* Hospede o front-end na porta 5500 (foi utilizado o Live Server do VS Code);
* Caso deseje alterar o servidor do front-end, edite o arquivo `server.js` na linha 18, na configuração `origin`, colocando a URL do servidor do front-end.

## 🛠️ Construído com

**Ferramentas:**
* Visual Studio Code - Editor de Código-Fonte;
* PostgreSQL - Sistema Gerenciador de Banco de Dados;
* Postman - Utilizado para testes do Back-End;

**Linguagens, Frameworks e APIs:**
* HTML5 - Linguagem de Marcação;
* JavaScript - Linguagem de Programação;
* CSS3 - Linguagem Web de Estilo e Formatação;
* Node.js - Utilizado no Back-End, fazendo a conexão com o banco de dados;
* SQL - Utilizado para a criação e interação com o banco de dados;
* Bootstrap - Utilizado para estilização e inclusão de ícones no site.

## ✒️ Autores

* **[Larissa Coutinho Ferreira](https://github.com/LarissaCoutinhoo)** - *Criação do Front-End;*
* **[Luís Pedro Dutra Carrocini](https://github.com/luis-pedro-dutra-carrocini)** - *Criação do Back-End; Criação do Banco de Dados; Participação no Front-End;*
* **[Maria Luiza Barbosa](https://github.com/mluizabss)** - *Criação do Front-End;*

---

Esse site foi desenvolvido no início de nossas carreiras, por isso temos orgulho desse projeto! Em comparação com o semestre passado, evoluímos bastante, mas estamos sempre buscando nos aperfeiçoar.  
Releve algumas baguncinhas no nosso código rsrsrs 😅.  
Esperamos que goste e que ele possa lhe ajudar em algum projeto. ❤️😊

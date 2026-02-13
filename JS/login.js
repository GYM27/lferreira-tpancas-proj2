// JS/login.js

const htmlLogin = `
    <form id="login-form">
        <label class="login" for="username">Utilizador:</label>
        <input type="text" id="username" name="username" placeholder="Introduza o seu nome" required>

        <label class="login" for="password">Palavra-passe:</label>
        <input type="password" id="password" name="password" placeholder="Introduza a sua senha" required>

        <button type="submit" class="botao">ENTRAR</button>
    </form>
    <p>
        Ainda não tem conta? <a href="javascript:void(0)" onclick="mostrarRegisto()">Registe-se aqui</a>
    </p>
`;

const htmlRegisto = `
    <h2>Criar Nova Conta</h2>
    <form id="register-form">
        <div>
            <div>
                <label for="reg-firstname">Primeiro Nome</label>
                <input type="text" id="reg-firstname" placeholder="Ex: João" required>
            </div>
            <div style="flex: 1;">
                <label for="reg-lastname">Apelido</label>
                <input type="text" id="reg-lastname" placeholder="Ex: Silva" required>
            </div>
        </div>

        <label for="reg-username">Nome de Utilizador (Username)</label>
        <input type="text" id="reg-username" placeholder="Escolha um username" required>

        <label for="reg-email">E-mail</label>
        <input type="email" id="reg-email" placeholder="exemplo@bridge.com" required>

        <label for="reg-phone">Telefone</label>
        <input type="tel" id="reg-phone" placeholder="912 345 678" required>

        <label for="reg-password">Palavra-passe</label>
        <input type="password" id="reg-password" placeholder="Crie uma senha forte" required>

        <button type="submit" class="botao">REGISTAR</button>
    </form>
    <p>
        Já tem conta? <a href="javascript:void(0)" onclick="mostrarLogin()" >Faça Login aqui</a>
    </p>
`;

// Funções para trocar o conteúdo
function mostrarRegisto() {
    const box = document.querySelector(".login-box");
    box.innerHTML = htmlRegisto;

    // Captura o formulário assim que ele é injetado no HTML
    const form = document.getElementById("register-form");
    form.onsubmit = function (event) {
        event.preventDefault(); // Impede o recarregamento da página
        fazerRegisto();        // Só chama a função se o navegador validar os campos
    };
}

function mostrarLogin() {
    const box = document.querySelector(".login-box");
    box.innerHTML = htmlLogin;

    const form = document.getElementById("login-form");
    form.onsubmit = function (event) {
        event.preventDefault();
        fazerLogin();
    };
}

function fazerLogin() {
    const nome = document.getElementById("username").value.trim();
    const senha = document.getElementById("password").value.trim();

    // Verificação manual de segurança
    if (nome === "" || senha === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return; // Impede a execução do resto da função
    }

    // Se houver dados, guarda o nome e avança
    localStorage.setItem("userName", nome);
    window.location.href = "Dashboard.html";
}

function fazerRegisto() {
    const dadosregisto = {
        nome: document.getElementById("reg-username").value,
        senha: document.getElementById("reg-password").value,
        email: document.getElementById("reg-email").value,
        primeiroNome: document.getElementById("reg-firstname").value,
        ultimoNome: document.getElementById("reg-lastname").value,
        telefone: document.getElementById("reg-phone").value
    };

    // Correção: Aceder às propriedades de 'dadosregisto'
    if (dadosregisto.nome === "" || dadosregisto.email === "" || dadosregisto.primeiroNome === "" || dadosregisto.ultimoNome === "" || dadosregisto.telefone === "" || dadosregisto.senha === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // Guardar o primeiro nome para a saudação no Dashboard
    localStorage.setItem("userName", dadosregisto.primeiroNome);

    alert(`Bem-vindo, ${dadosregisto.primeiroNome}! Conta criada com sucesso!`);
    window.location.href = "Dashboard.html";
}
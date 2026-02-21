function loadHeader() {
    fetch("header.html")
        .then(response => response.text())
        .then(async html => {

            document.getElementById("header-placeholder").innerHTML = html;

            atualizarSaudacao();
            inicializarMenuUtilizador();

            //header existente
            await carregarFotoHeader();
        });
}

async function carregarFotoHeader() {

    const headerFoto = document.getElementById("header-foto");
    const username = localStorage.getItem("userName");
    const password = localStorage.getItem("userPass");

    if (!headerFoto || !username || !password) return;

    try {
        const response = await fetch(
            `http://localhost:8080/lferreira-tpancas-proj2/rest/users/${username}/profile`,
            {
                headers: {
                    "username": username,
                    "password": password
                }
            }
        );

        if (!response.ok) return;

        const user = await response.json();

        const photo = user.photo && user.photo.trim() !== ""
            ? user.photo
            : `https://ui-avatars.com/api/?name=${user.firstName || user.username}+${user.lastName || ""}&background=1e2a78&color=fff`;

        headerFoto.src = photo;
        localStorage.setItem("userPhoto", photo);

    } catch (error) {
        console.error("Erro ao carregar foto do header:", error);
    }
}

function inicializarMenuUtilizador() {

    const foto = document.getElementById("header-foto");
    const menu = document.getElementById("dropdown-menu");

    if (!foto || !menu) return;

    foto.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.style.display =
            menu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
        menu.style.display = "none";
    });

    // Carregar foto guardada
    const fotoGuardada = localStorage.getItem("userPhoto");
    if (fotoGuardada && fotoGuardada.trim() !== "") {
        foto.src = fotoGuardada;
    }
}

function atualizarSaudacao() {
  const nome = localStorage.getItem("userName");

  if (nome) {
    document.getElementById("saudacao").innerText = `Olá, ${nome}!`;
  }
}

function loadFooter() {
  fetch("footer.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("footer-placeholder").innerHTML = html;
    });
}

function loadAside() {
  fetch("aside.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("aside-placeholder").innerHTML = html;
    });
}

function removerItem(index) {
  // 1. Criamos o elemento do modal
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
        <div class="modal-box">
            <h3>Confirmar Exclusão</h3>
            <p>Tem a certeza de que deseja apagar?</p>
            <div class="modal-buttons">
                <button id="btn-confirmar">Sim, apagar!</button>
                <button id="btn-cancelar">Cancelar</button>
            </div>
        </div>
    `;

  document.body.appendChild(overlay);


  // 2. Lógica do botão de confirmar
  document.getElementById('btn-confirmar').onclick = function () {
    projetos.splice(index, 1);
    localStorage.setItem('box-lista', JSON.stringify(projetos));
    document.body.removeChild(overlay); // Remove o modal
    renderizarTabela(); // Atualiza a lista
  };

  // 3. Lógica do botão de cancelar
  document.getElementById('btn-cancelar').onclick = function () {
    document.body.removeChild(overlay); // Apenas fecha o modal
  };
}

function getIdCliente(id) {

  id = Number(id);
  return meusClientes.find(function (cliente) {
    return cliente.id === id;
  });
}

function irParaPerfil() {
    window.location.href = "perfil.html";
}


function logout() {
    // Apaga TODOS os dados de ambos os armazenamentos, conforme exigido no enunciado
    localStorage.clear();
    sessionStorage.clear();

    // Redireciona para a página de login
    window.location.href = "Login.html";
}

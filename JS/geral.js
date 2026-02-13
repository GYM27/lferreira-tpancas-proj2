function loadHeader() {
  fetch("header.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("header-placeholder").innerHTML = html;

      atualizarSaudacao();
    });
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

function fazerLogin() {

  const nome = document.getElementById("username").value;

  localStorage.setItem("userName", nome);

  window.location.href = "Dashboard.html";
}

function logout() {

  localStorage.removeItem("userName");

  window.location.href = "Login.html";
}


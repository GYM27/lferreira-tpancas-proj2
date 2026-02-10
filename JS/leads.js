let filtroAtual = "Todos";

let leadList = JSON.parse(localStorage.getItem("leadList")) || [];
let idEmEdicao = null;

// para ler o estado da URL - se houver estado, usa-o como filtro
const params = new URLSearchParams(window.location.search);
const estadoURL = params.get("estado");

if (estadoURL) {
  filtroAtual = estadoURL;
}

renderizarLista();

const selectFiltro = document.getElementById("filtroEstado");
if (selectFiltro && estadoURL) {
  selectFiltro.value = estadoURL;
}

// renderizar lista
function renderizarLista() {

  const corpo = document.getElementById("corpoTabela");
  if (!corpo) return;

  corpo.innerHTML = "";

  let listaFiltrada = leadList;

  if (filtroAtual !== "Todos") {
    listaFiltrada = leadList.filter(function (lead) {
      return lead.estado === filtroAtual;
    });
  }

  listaFiltrada.forEach(function (lead) {

    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${lead.titulo}</td>
      <td>${lead.descricao}</td>
      <td>${lead.estado}</td>
      <td>
        <button class="button-edit-objects" data-tooltip="Editar" onclick="editarLead(${lead.id})"> 
       <i class="fa-solid fa-pen"></i> 
       </button> 
       <button class="button-edit-objects" data-tooltip="Eliminar" onclick="removerItem(${lead.id})"> 
       <i class="fa-solid fa-trash"></i> 
       </button> 

      </td>
    `;

    corpo.appendChild(linha);
  });
}


// Criar Lead
function criarLead(titulo, descricao, estado) {

  const novaLead = {
    id: Date.now(),
    titulo,
    descricao,
    estado
  };

  leadList.push(novaLead);
  localStorage.setItem("leadList", JSON.stringify(leadList));

  renderizarLista();
}


// Editar
function editarLead(id) {

  const lead = leadList.find(l => l.id === id);
  if (!lead) return;

  idEmEdicao = id;

  document.getElementById("lista-container").style.display = "none";
  document.getElementById("formLead").classList.remove("form-hidden");

  document.getElementById("titulo").value = lead.titulo;
  document.getElementById("descricao").value = lead.descricao;
  document.getElementById("estado").value = lead.estado;
}


// Eliminar
function eliminarLead(id) {

  leadList = leadList.filter(l => l.id !== id);
  localStorage.setItem("leadList", JSON.stringify(leadList));

  renderizarLista();
}


// Guardar alterações do formulário
const btnGuardar = document.getElementById("guardarLead");

if (btnGuardar) {
  btnGuardar.addEventListener("click", function () {

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const estado = document.getElementById("estado").value;

    if (idEmEdicao === null) {
      criarLead(titulo, descricao, estado);
    } else {
      leadList.forEach(function (lead) {
        if (lead.id === idEmEdicao) {
          lead.titulo = titulo;
          lead.descricao = descricao;
          lead.estado = estado;
        }
      });
      localStorage.setItem("leadList", JSON.stringify(leadList));
      renderizarLista();
    }

    fecharFormulario();
  });
}


// 🔹 CANCELAR
const btnCancelar = document.getElementById("cancelarLead");

if (btnCancelar) {
  btnCancelar.addEventListener("click", fecharFormulario);
}


// fechar formulário
function fecharFormulario() {

  document.getElementById("formLead").classList.add("form-hidden");
  document.getElementById("lista-container").style.display = "block";

  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("estado").value = "Novo";

  idEmEdicao = null;
}


// BOTÃO +
const btnCriar = document.querySelector('[data-acao="criar"]');

if (btnCriar) {
  btnCriar.addEventListener("click", function () {

    idEmEdicao = null;

    document.getElementById("lista-container").style.display = "none";
    document.getElementById("formLead").classList.remove("form-hidden");

  });
}


// filtro de estado
document.getElementById("filtroEstado").addEventListener("change", function () {
  filtroAtual = this.value;
  renderizarLista();
});

function removerItem(id) {

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Confirmar Exclusão</h3>
      <p>Tem a certeza de que deseja apagar?</p>
      <div class="modal-buttons">
        <button id="btn-confirmar" class="btn-acao">Sim, apagar!</button>
        <button id="btn-cancelar" class="btn-acao">Cancelar</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('btn-confirmar').onclick = function () {
    eliminarLead(id);
    document.body.removeChild(overlay);
  };

  document.getElementById('btn-cancelar').onclick = function () {
    document.body.removeChild(overlay);
  };
}

// Inicializar
renderizarLista();
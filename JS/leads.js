// --- 1. CONFIGURAÇÕES E ESTADO GLOBAL ---
const BASE_URL = "http://localhost:8080/lferreira-tpancas-proj2/rest/users";
const username = localStorage.getItem("userName");

let leadList = [];
let idEmEdicao = null;
let filtroAtual = "Todos";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Verificar se existe um filtro vindo do Dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');

    if (stateParam) {
        filtroAtual = stateParam;
        // Atualiza o valor visual do select de filtro, se ele existir
        const selectFiltro = document.getElementById("filtroEstado");
        if (selectFiltro) selectFiltro.value = stateParam;
    }

    carregarLeads(); // Esta função já chama o renderizarLista() que usa o filtroAtual
    configurarEventos();
});

// Mapeamento para exibir nomes em vez de números na tabela
const mapeamentoEstados = {
    "1": "Novo",
    "2": "Em Análise",
    "3": "Proposta",
    "4": "Ganho",
    "5": "Perdido"
};

function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "username": localStorage.getItem("userName"),
        "password": localStorage.getItem("userPass")
    };
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarLeads();
    configurarEventos();
});

// --- 2. COMUNICAÇÃO COM O SERVIDOR (API REST) ---

// LISTAR (GET)
async function carregarLeads() {
    try {
        const response = await fetch(`${BASE_URL}/${username}/leads`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (response.ok) {
            leadList = await response.json();
            renderizarLista();
        }
    } catch (error) {
        console.error("Erro ao carregar leads:", error);
    }
}

// GRAVAR (POST/PUT)
async function guardarLeadNoServidor() {
    const inputTitulo = document.getElementById("titulo").value;
    const inputDesc = document.getElementById("descricao").value;
    const inputEstado = document.getElementById("estado").value;

    if (!inputTitulo || !inputDesc) {
        alert("Por favor, preencha o título e a descrição.");
        return;
    }

    const leadData = {
        title: inputTitulo,           // Mapeia para String title no Java
        description: inputDesc,       // Mapeia para String description
        state: parseInt(inputEstado) || 0  // Mapeia para Integer state
    };

    let url = `${BASE_URL}/${username}/leads/addLead`;
    let metodo = "POST";

    if (idEmEdicao !== null) {
        leadData.id = idEmEdicao;
        url = `${BASE_URL}/${username}/leads/editLead`;
        metodo = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: getAuthHeaders(),
            body: JSON.stringify(leadData)
        });

        if (response.ok) {
            fecharFormulario();
            carregarLeads();
        } else {
            alert("Erro ao gravar no servidor (Erro 500).");
        }
    } catch (error) {
        console.error("Erro na ligação:", error);
    }
}

// ELIMINAR (DELETE)
async function eliminarLeadNoServidor(id) {
    
    try {
        const response = await fetch(`${BASE_URL}/${username}/leads/remove?id=${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (response.ok) carregarLeads();
    } catch (error) {
        console.error("Erro ao eliminar:", error);
    }
}

// --- 3. INTERFACE E RENDERIZAÇÃO ---

function renderizarLista() {
    const corpo = document.getElementById("corpoTabela");
    if (!corpo) return;
    corpo.innerHTML = "";

    // Filtra localmente com base no ID do estado
    const filtradas = filtroAtual === "Todos"
        ? leadList
        : leadList.filter(l => String(l.state) === filtroAtual);

    filtradas.forEach(lead => {
        const tr = document.createElement("tr");

        // Tradução do número para texto usando o objeto mapeamentoEstados
        const textoEstado = mapeamentoEstados[lead.state] || "Desconhecido";

        tr.innerHTML = `
            <td>${lead.title}</td> 
            <td>${lead.description}</td>
            <td><span class="status-badge">${textoEstado}</span></td>
            <td>
                <button class="button-edit-objects btn-editar" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button class="button-edit-objects btn-eliminar" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
            </td>`;

        tr.querySelector(".btn-editar").onclick = () => prepararEdicao(lead);
        tr.querySelector(".btn-eliminar").onclick = () => {
            abrirModalConfirmacao(
                `Tem a certeza de que deseja apagar a lead <strong>${lead.title}</strong>?`,
                () => eliminarLeadNoServidor(lead.id)
            );
        };
        corpo.appendChild(tr);
    });
}

function configurarEventos() {
    // Botão Gravar
    document.getElementById("guardarLead").onclick = guardarLeadNoServidor;

    // Botão Cancelar
    document.getElementById("cancelarLead").onclick = fecharFormulario;

    // Botão Criar (+)
    document.querySelector('[data-acao="criar"]').onclick = () => {
        idEmEdicao = null;
        document.getElementById("formLead").classList.remove("form-hidden");
        document.getElementById("lista-container").style.display = "none";
        // Garante que o título do formulário diz "Nova Lead"
        document.querySelector("#formLead h3").innerText = "Nova Lead";
    };

    // Filtro de Estado
    document.getElementById("filtroEstado").onchange = (e) => {
        filtroAtual = e.target.value;
        renderizarLista();
    };
}

function prepararEdicao(lead) {
    idEmEdicao = lead.id;
    document.getElementById("titulo").value = lead.title;
    document.getElementById("descricao").value = lead.description;
    document.getElementById("estado").value = lead.state;

    document.querySelector("#formLead h3").innerText = "Editar Lead";
    document.getElementById("formLead").classList.remove("form-hidden");
    document.getElementById("lista-container").style.display = "none";
}

function fecharFormulario() {
    document.getElementById("formLead").classList.add("form-hidden");
    document.getElementById("lista-container").style.display = "block";

    // Limpeza manual para evitar erro de ".reset() is not a function"
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("estado").value = "1";
    idEmEdicao = null;
}
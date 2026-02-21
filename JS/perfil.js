const BASE_URL = "http://localhost:8080/lferreira-tpancas-proj2/rest/users";

document.addEventListener("DOMContentLoaded", () => {
    carregarPerfil();
    carregarLeads();
    carregarClientes();

    document.getElementById("perfil-form")
        .addEventListener("submit", atualizarPerfil);
});

function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "username": localStorage.getItem("userName"),
        "password": localStorage.getItem("userPass")
    };
}


/// Carregar perfil
async function carregarPerfil() {

    const username = localStorage.getItem("userName");

    const response = await fetch(`${BASE_URL}/${username}/profile`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        alert("Erro ao carregar perfil.");
        return;
    }

    const user = await response.json();

    document.getElementById("username").value = user.username;
    document.getElementById("password").value = user.password;
    document.getElementById("email").value = user.email;
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("cellphone").value = user.cellphone;
    document.getElementById("photoUrl").value = user.photo || "";

    const photo = user.photo && user.photo.trim() !== ""
        ? user.photo
        : `https://ui-avatars.com/api/?name=${user.firstName || user.username}+${user.lastName || ""}&background=1e2a78&color=fff`;

    // Atualiza foto do perfil
    document.getElementById("fotoPerfil").src = photo;

    //Guarda no localStorage para usar noutras páginas
    localStorage.setItem("userPhoto", photo);

    //Atualiza foto do header (se existir)
    const headerFoto = document.getElementById("header-foto");
    if (headerFoto) {
        headerFoto.src = photo;
    }
}


//Atualizar perfil
async function atualizarPerfil(event) {

    event.preventDefault();

    const username = localStorage.getItem("userName");

    const dadosAtualizados = {
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        cellphone: document.getElementById("cellphone").value,
        photo: document.getElementById("photoUrl").value
    };

    const response = await fetch(`${BASE_URL}/${username}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(dadosAtualizados)
    });

    if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        window.location.href = "Dashboard.html";
    } else {
        alert("Erro ao atualizar perfil.");
    }
}


//Listar Leads
async function carregarLeads() {

    const listaLeads = document.getElementById("lista-leads");
    if (!listaLeads) return; //evita erro se não existir

    const username = localStorage.getItem("userName");

    const response = await fetch(`${BASE_URL}/${username}/leads`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) return;

    const leads = await response.json();
    listaLeads.innerHTML = "";

    leads.forEach(lead => {
        const li = document.createElement("li");
        li.textContent = `${lead.title} - ${lead.state}`;
        lista.appendChild(li);
    });
}


//Listar Clientes
async function carregarClientes() {

    const listaClients = document.getElementById("lista-clientes");
    if (!listaClients) return; //evita erro se não existir

    const username = localStorage.getItem("userName");

    const response = await fetch(`${BASE_URL}/${username}/clients`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) return;

    const clientes = await response.json();
    const lista = document.getElementById("lista-clientes");
    listaClients.innerHTML = "";

    clientes.forEach(cliente => {
        const li = document.createElement("li");
        li.textContent = `${cliente.name} - ${cliente.email}`;
        lista.appendChild(li);
    });
}

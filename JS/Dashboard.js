const dados = localStorage.getItem("leadList");
let leadList = [];

if (dados !== null) {
  leadList = JSON.parse(dados);
}

const clientesDados = localStorage.getItem("meusClientes");
let clientesList = [];

if (clientesDados !== null) {
  clientesList = JSON.parse(clientesDados);
}

function atualizarDashboard() {

  const novos = leadList.filter(l => l.estado === "Novo").length;
  const analise = leadList.filter(l => l.estado === "Em Análise").length;
  const propostas = leadList.filter(l => l.estado === "Proposta").length;
  const ganhos = leadList.filter(l => l.estado === "Ganho").length;
  const perdidos = leadList.filter(l => l.estado === "Perdido").length;


  document.getElementById("totalNovos").textContent = novos;
  document.getElementById("totalAnalise").textContent = analise;
  document.getElementById("totalPropostas").textContent = propostas;
  document.getElementById("totalGanhos").textContent = ganhos;
  document.getElementById("totalPerdidos").textContent = perdidos;

  document.getElementById("totalLeads").textContent = leadList.length;
  document.getElementById("totalClientes").textContent = clientesList.length;
}

// quando volto ao dashboard, vou buscar novamente os dados ao LocalStorage e atualizo a dashboard para recalcular os totais
window.addEventListener("focus", function () {
  const dados = localStorage.getItem("leadList");
  if (dados !== null) {
    leadList = JSON.parse(dados);
  }
  atualizarDashboard();
});

document.addEventListener("DOMContentLoaded", function () {
  atualizarDashboard();
});
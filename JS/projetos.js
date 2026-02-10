
let projetos = JSON.parse(localStorage.getItem('box-lista')) || [];
let indexEditando = -1; // Variável para controlar se estamos editando (-1 significa novo projeto)

function renderizarTabela() {
    const corpoTabela = document.getElementById('corpoTabela');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = "";

    projetos.forEach((projeto, index) => {
        let row = corpoTabela.insertRow();

        row.insertCell(0).textContent = projeto.nome || "";
        row.insertCell(1).textContent = projeto.cliente || "";
        row.insertCell(2).textContent = projeto.estado || "";
        row.insertCell(3).textContent = projeto.dataInicio || "";
        row.insertCell(4).textContent = projeto.dataFim || "";

        let acoesCell = row.insertCell(5);
        // Adicionamos os dois botões: Editar e Remover
        acoesCell.innerHTML = `
            <button class="btn-acao" onclick="editarProjeto(${index})" data-tooltip="Editar projeto"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-acao" onclick="removerItem(${index})" data-tooltip="Remover projeto"><i class="fa-solid fa-trash"></i></button>
        `;
    });
}

function editarProjeto(index) {
    indexEditando = index; // Marcamos qual projeto estamos editando
    const p = projetos[index];

    abrirFormulario();

    // Preenchemos os campos com os valores atuais do projeto
    document.getElementById('input-nome').value = p.nome;
    document.getElementById('input-cliente').value = p.cliente;
    document.getElementById('input-estado').value = p.estado;
    document.getElementById('input-data-inicio').value = p.dataInicio;
    document.getElementById('input-data-fim').value = p.dataFim;
}

function abrirFormulario() {
    const boxLista = document.getElementById('box-lista');

    // Definimos os estados possíveis (ajuste conforme sua necessidade)
    const opcoesEstados = ["Planeamento", "Em Curso", "Concluído", "Suspenso"];

    // --- BUSCA DINÂMICA DE CLIENTES ---   
    // 1. Pegamos a string do localStorage
    const clientesGuardados = localStorage.getItem('meusClientes');
    // 2. Convertemos para array ou criamos um array vazio se não existir
    const listaClientesObjetos = clientesGuardados ? JSON.parse(clientesGuardados) : [];
    // 3. Extraímos apenas o nome da organização para o dropdown
    const nomesClientes = listaClientesObjetos.map(c => c.organizacao);

    boxLista.innerHTML = `
        <div class="form-container">
            <h3>${indexEditando === -1 ? 'Novo Projeto' : 'Editar Projeto'}</h3>
            
            <label>Nome do Projeto:</label>
            <input type="text" id="input-nome" placeholder="Nome do Projeto">
            
            <label>Cliente:</label>
            <select id="input-cliente">
                <option value="">Selecione um cliente...</option>
                    ${nomesClientes.map(cliente => `<option value="${cliente}">${cliente}</option>`).join('')}
            </select>
            
            <label>Estado do Projeto:</label>
            <select id="input-estado">
                ${opcoesEstados.map(estado => `<option value="${estado}">${estado}</option>`).join('')}
            </select>
            
            <label>Data de Início:</label>
            <input type="date" id="input-data-inicio">
            
            <label>Data de Fim:</label>
            <input type="date" id="input-data-fim">
            
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="button-edit-objects" onclick="salvarProjeto()" data-tooltip="Guardar"><i class="fa-solid fa-floppy-disk"></i></button>
                <button class="button-edit-objects" onclick="window.location.reload()" data-tooltip="Cancelar"><i class="fa-solid fa-ban"></i></button>
            </div>
        </div>
    `;

    // Se estivermos editando, precisamos selecionar a opção correta no select
    if (indexEditando !== -1) {
        const p = projetos[indexEditando];
        document.getElementById('input-nome').value = p.nome;
        document.getElementById('input-cliente').value = p.cliente.getIdCliente(id);
        document.getElementById('input-estado').value = p.estado; // Seleciona automaticamente
        document.getElementById('input-data-inicio').value = p.dataInicio;
        document.getElementById('input-data-fim').value = p.dataFim;
    }

}

function salvarProjeto() {
    const dados = {
        nome: document.getElementById('input-nome').value,
        cliente: document.getElementById('input-cliente').value,
        estado: document.getElementById('input-estado').value,
        dataInicio: document.getElementById('input-data-inicio').value,
        dataFim: document.getElementById('input-data-fim').value
    };

    if (!dados.nome) return alert("Preencha o nome!");

    if (indexEditando === -1) {
        // Modo criação
        projetos.push(dados);
    } else {
        // Modo edição
        projetos[indexEditando] = dados;
    }

    localStorage.setItem('box-lista', JSON.stringify(projetos));
    window.location.reload();
}




window.onload = renderizarTabela;

const btnCriar = document.querySelector('[data-acao="criar"]');

if (btnCriar) {
    btnCriar.addEventListener("click", function () {
        indexEditando = -1;
        abrirFormulario();
    });
}

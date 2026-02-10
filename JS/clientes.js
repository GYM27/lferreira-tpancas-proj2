document.addEventListener("DOMContentLoaded", function () {

    // --- 1. ESTADO E SELEÇÃO DE ELEMENTOS ---
    let cardSendoEditado = null;

    const btnAdicionar = document.getElementById('btn-adicionar');
    const btnCancelar = document.getElementById('cancelar');
    const formContainer = document.getElementById('form-container');
    const formCliente = document.getElementById('form-cliente');

    // --- 2. INICIALIZAÇÃO ---
    carregarListaClientes();

    // --- 3. EVENTOS PRINCIPAIS ---
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => {
            formContainer.classList.remove('hidden');
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', fecharFormulario);
    }

    formCliente.addEventListener('submit', (enviar) => {
        enviar.preventDefault();

        let id = Date.now();

        if (cardSendoEditado) {
            id = cardSendoEditado.querySelector('.val-id').innerText;
            cardSendoEditado.remove();
            cardSendoEditado = null;
        }

        const nome = document.getElementById('nome-cliente').value;
        const email = document.getElementById('email-cliente').value;
        const telefone = document.getElementById('telefone-cliente').value;
        const organizacao = document.getElementById('organizacao-cliente').value;

        criarElementoCard(nome, email, telefone, organizacao, id);
        guardarNoLocalStorage();
        fecharFormulario();
    });

    // --- 4. FUNÇÕES DE APOIO ---
    function fecharFormulario() {
        formContainer.classList.add('hidden');
        formCliente.reset();
        cardSendoEditado = null;
    }

    function criarElementoCard(nome, email, telefone, organizacao, id) {
        const listaClientes = document.getElementById('lista-clientes');
        const novoCard = document.createElement('div');
        novoCard.classList.add('clientes-card', 'fechado');

        novoCard.innerHTML = `
            <div class="card-header">
                <strong class="org-name">${organizacao}</strong>
                <i class="fa-solid fa-chevron-down seta"></i>
            </div>
            <div class="card-detalhes">
                <hr>
                <p><strong>Responsável:</strong> <span class="val-nome">${nome}</span></p>
                <p><strong>Email:</strong> <span class="val-email">${email}</span></p>
                <p><strong>Telefone:</strong> <span class="val-tel">${telefone}</span></p>
                <p class="val-id hidden">${id}</p>
                <div class="card-actions"> 
                    <button class="button-edit-objects" aria-label="Editar" data-tooltip="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="button-edit-objects" aria-label="Eliminar" data-tooltip="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;

        configurarEventosDoCard(novoCard, nome, email, telefone, organizacao, id);
        listaClientes.appendChild(novoCard);
    }

    function configurarEventosDoCard(card, nome, email, telefone, organizacao, id) {
        card.addEventListener('click', () => {
            card.classList.toggle('aberto');
            card.classList.toggle('fechado');
        });

        const botoes = card.querySelectorAll('.button-edit-objects');
        
        // Botão Editar
        botoes[0].addEventListener('click', (e) => {
            e.stopPropagation();
            cardSendoEditado = card;
            document.getElementById('nome-cliente').value = nome;
            document.getElementById('email-cliente').value = email;
            document.getElementById('telefone-cliente').value = telefone;
            document.getElementById('organizacao-cliente').value = organizacao;
            formContainer.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Botão Eliminar
        botoes[1].addEventListener('click', (e) => {
            e.stopPropagation();
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-box">
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem a certeza de que deseja apagar o cliente <strong>${organizacao}</strong>?</p>
                    <div class="modal-buttons">
                        <button id="btn-confirmar" class="btn-acao" >Sim, Apagar</button>
                        <button id="btn-cancelar" class="btn-acao">Cancelar</button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);

            overlay.querySelector('#btn-confirmar').addEventListener('click', () => {
                card.remove();
                guardarNoLocalStorage();
                document.body.removeChild(overlay);
            });

            overlay.querySelector('#btn-cancelar').addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        });
    }

    function guardarNoLocalStorage() {
        const cards = document.querySelectorAll('.clientes-card');
        const listaParaGuardar = [];
        cards.forEach(card => {
            listaParaGuardar.push({
                nome: card.querySelector('.val-nome').innerText,
                email: card.querySelector('.val-email').innerText,
                telefone: card.querySelector('.val-tel').innerText,
                organizacao: card.querySelector('.org-name').innerText,
                id: card.querySelector('.val-id').innerText
            });
        });
        localStorage.setItem('meusClientes', JSON.stringify(listaParaGuardar));
    }

    function carregarListaClientes() {
        const dadosGuardados = localStorage.getItem('meusClientes');
        if (dadosGuardados) {
            const listaClientes = document.getElementById('lista-clientes');
            listaClientes.innerHTML = ""; // Limpa para evitar duplicados
            JSON.parse(dadosGuardados).forEach(c => {
                criarElementoCard(c.nome, c.email, c.telefone, c.organizacao, c.id);
            });
        }
    }
});
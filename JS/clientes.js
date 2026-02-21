document.addEventListener("DOMContentLoaded", function () {

    const BASE_URL = "http://localhost:8080/lferreira-tpancas-proj2/rest/users";
    const username = localStorage.getItem("userName");

    let cardSendoEditado = null;

    const btnAdicionar = document.getElementById('btn-adicionar');
    const btnCancelar = document.getElementById('cancelar');
    const formContainer = document.getElementById('form-container');
    const formCliente = document.getElementById('form-cliente');


    // --- 1. INICIALIZAÇÃO ---
    carregarListaClientes();

    // --- 2. CABEÇALHOS DE SEGURANÇA ---  esta funcao e geral para outros ficheiros do codigo pode ser reutilizada
    function getAuthHeaders() {
        return {
            "Content-Type": "application/json",
            "username": localStorage.getItem("userName"),
            "password": localStorage.getItem("userPass")
        };
    }

    // --- 3. EVENTOS PRINCIPAIS ---
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => {
            cardSendoEditado = null;
            formCliente.reset();
            formContainer.classList.remove('hidden');
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', fecharFormulario);
    }

    formCliente.addEventListener('submit', async (enviar) => {
        enviar.preventDefault();

        // Mapeamento para os nomes exatos do ClientesPojo.java
        const clienteData = {
            nome: document.getElementById('nome-cliente').value,
            email: document.getElementById('email-cliente').value,
            telefone: document.getElementById('telefone-cliente').value,
            organizacao: document.getElementById('organizacao-cliente').value
        };

        let url = `${BASE_URL}/${username}/clients/addClient`;
        let metodo = 'POST';

        // Se estivermos a editar, recuperamos o ID do card
        if (cardSendoEditado) {
            clienteData.id = parseInt(cardSendoEditado.querySelector('.val-id').innerText);
            url = `${BASE_URL}/${username}/clients/editClient`;
            metodo = 'PUT';
        }

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: getAuthHeaders(),
                body: JSON.stringify(clienteData)
            });

            if (response.ok) {
                fecharFormulario();

                setTimeout(() => {
                    carregarListaClientes();
                }, 300); // Recarrega a lista do servidor
            } else {
                alert("Erro ao comunicar com o servidor.");
            }
        } catch (error) {
            console.error("Erro na submissão:", error);
        }
    });

    // --- 4. FUNÇÕES DE API ---
    async function carregarListaClientes() {
        try {
            const response = await fetch(`${BASE_URL}/${username}/clients`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const clientes = await response.json();
                const listaClientes = document.getElementById('lista-clientes');

                // Limpa a lista atual para renderizar a nova versão do JSON
                listaClientes.innerHTML = "";

                if (clientes && clientes.length > 0) {
                    clientes.forEach(c => {
                        // Passa exatamente os campos do teu ClientesPojo
                        criarElementoCard(c.nome, c.email, c.telefone, c.organizacao, c.id);
                    });

                }
            }
        } catch (error) {
            console.error("Erro ao carregar lista:", error);
        }
    }

    async function eliminarNoServidor(id) {
        if (!id) {
            console.error("Erro: ID inválido");
            return;
        }

        const username = localStorage.getItem("userName");
        // O nome do parâmetro na URL deve ser 'id' porque o seu Java usa @QueryParam("id")
        // O Java mapeia esse valor para a variável interna 'clientId'
        const url = `${BASE_URL}/${username}/clients/remove?id=${id}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getAuthHeaders() // Garante que envia os Headers exigidos
            });

            if (response.ok) {
                carregarListaClientes();
            } else {
                console.error("Erro ao apagar cliente");
            }
        } catch (error) {
            console.error("Erro na ligação:", error);
        }
    }

    // --- 5. FUNÇÕES DE UI  ---
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
                    <button class="button-edit-objects btn-editar" aria-label="Editar" data-tooltip="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="button-edit-objects btn-eliminar" aria-label="Eliminar"data-tooltip="Remover"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`;

        configurarEventosDoCard(novoCard, nome, email, telefone, organizacao, id);
        listaClientes.appendChild(novoCard);
    }

    function configurarEventosDoCard(card, nome, email, telefone, organizacao, id) {
        // Lógica de abrir/fechar o card (Toggle)
        card.addEventListener('click', () => {
            card.classList.toggle('aberto');
            card.classList.toggle('fechado');
        });


        // Seleção semântica (por classe específica)
        const btnEditar = card.querySelector('.btn-editar');
        const btnEliminar = card.querySelector('.btn-eliminar');

        // Botão Editar
        if (btnEditar) {
            btnEditar.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede o card de fechar/abrir ao clicar no botão
                cardSendoEditado = card;
                document.getElementById('nome-cliente').value = nome;
                document.getElementById('email-cliente').value = email;
                document.getElementById('telefone-cliente').value = telefone;
                document.getElementById('organizacao-cliente').value = organizacao;
                formContainer.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Botão Eliminar
        if (btnEliminar) {
            btnEliminar.addEventListener('click', (e) => {
                e.stopPropagation();

                const overlay = document.createElement('div');
                overlay.className = 'modal-overlay';
                overlay.innerHTML = `
                <div class="modal-box">
                    <h3>Confirmar Exclusão</h3>
                    <p>Tem a certeza de que deseja apagar o cliente <strong>${organizacao}</strong>?</p>
                    <div class="modal-buttons">
                        <button id="btn-confirmar" >Sim, Apagar</button>
                        <button id="btn-cancelar" >Cancelar</button>
                    </div>
                </div>`;
                document.body.appendChild(overlay);

                overlay.querySelector('#btn-confirmar').onclick = () => {
                    if (id !== undefined && id !== null) {
                        eliminarNoServidor(id);
                    } else {
                        console.error("Erro: ID do cliente não encontrado.");
                    }
                    document.body.removeChild(overlay);
                };

                overlay.querySelector('#btn-cancelar').onclick = () => document.body.removeChild(overlay);
            });
        }
    }
});
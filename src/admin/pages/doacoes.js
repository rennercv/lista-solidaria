import Swal from "sweetalert2";

import {
    listarDoacoes,
    buscarDoacao,
    atualizarStatusDoacao,
    excluirDoacao
}
    from "../services/doacaoAdminService";
import { modalDetalhesDoacao }
    from "../components/modalDetalhesDoacao";

export function doacoes() {

    return `

        <div class="page-header">

            <h1>❤️ Doações</h1>

        </div>

        <div class="cards-dashboard">

            <div class="card-dashboard">

                <small>Total</small>

                <h2 id="totalDoacoes">0</h2>

            </div>

            <div class="card-dashboard">

                <small>Reservadas</small>

                <h2 id="totalReservadas">0</h2>

            </div>

            <div class="card-dashboard">

                <small>Entregues</small>

                <h2 id="totalEntregues">0</h2>

            </div>

            <div class="card-dashboard">

                <small>Doadores</small>

                <h2 id="totalDoadores">0</h2>

            </div>

        </div>

        <div class="filtros-doacoes">

            <input

                id="txtPesquisa"

                class="pesquisa"

                placeholder="🔍 Pesquisar por nome ou telefone">

            <div class="checks">

                <label>

                    <input
                        type="checkbox"
                        id="chkReservadas"
                        checked>

                    Reservadas

                </label>

                <label>

                    <input
                        type="checkbox"
                        id="chkEntregues"
                        checked>

                    Entregues

                </label>

            </div>

        </div>

        <div

            id="listaDoacoes"

            class="lista-doacoes">

            Carregando...

        </div>

    `;

}

let todasDoacoes = [];

export async function carregarDoacoes() {
    
    const lista =
        document.getElementById(
            "listaDoacoes"
        );

    lista.innerHTML =
        "Carregando...";

    try {

        todasDoacoes =
            await listarDoacoes();

        document.getElementById("totalDoacoes").innerText =
            todasDoacoes.length;

        document.getElementById("totalReservadas").innerText =
            todasDoacoes.filter(d => d.status === "Reservado").length;

        document.getElementById("totalEntregues").innerText =
            todasDoacoes.filter(d => d.status === "Entregue").length;

        document.getElementById("totalDoadores").innerText =
            new Set(
                todasDoacoes.map(d => d.telefone)
            ).size;

        aplicarFiltros();

        registrarPesquisa();

    }
    catch (e) {

        console.error(e);

        Swal.fire({

            icon: "error",

            title: "Erro",

            text: e.message

        });

    }

}

function aplicarFiltros() {

    const texto =
        document
            .getElementById("txtPesquisa")
            ?.value
            .toLowerCase() ?? "";

    const mostrarReservadas =
        document
            .getElementById("chkReservadas")
            ?.checked ?? true;

    const mostrarEntregues =
        document
            .getElementById("chkEntregues")
            ?.checked ?? true;

    const lista = todasDoacoes.filter(doacao => {

        const pesquisa =
            doacao.nome.toLowerCase().includes(texto) ||
            doacao.telefone.includes(texto);

        const reservado =
            doacao.status === "Reservado";

        if (!pesquisa)
            return false;

        if (reservado && !mostrarReservadas)
            return false;

        if (!reservado && !mostrarEntregues)
            return false;

        return true;

    });

    renderizarDoacoes(lista);

}

function renderizarDoacoes(lista) {

    const container =
        document.getElementById("listaDoacoes");

    container.innerHTML = "";

    if (lista.length === 0) {

        container.innerHTML = `

            <div class="card">

                Nenhuma doação encontrada.

            </div>

        `;

        return;

    }

    lista.forEach(doacao => {

        const status =
            doacao.status === "Entregue"
            ? `
                <span class="badge badge-success">
                    ✅ Entregue
                </span>
            `
            : `
                <span class="badge badge-warning">
                    🟡 Reservado
                </span>
            `;

        const itens = doacao.doacao_itens
            .map(item => `

                <div class="item-doacao">

                    <span>

                        ${item.ingredientes.nome}

                    </span>

                    <strong>

                        x${item.quantidade}

                    </strong>

                </div>

            `)
            .join("");

        container.innerHTML += `

            <div class="card-doacao">

                <div class="card-topo">

                    <div>

                        <h3>

                            👤 ${doacao.nome}

                        </h3>

                        <small>

                            📱 ${doacao.telefone}

                        </small>

                    </div>

                    ${status}

                </div>

                <div class="card-info">

    <small>

        🆔 Doação #${doacao.id}

    </small>

    <small>

        📦 ${doacao.doacao_itens.length} itens

    </small>

</div>

                <small>

                    📅 ${new Date(
            doacao.created_at
        ).toLocaleString("pt-BR")}

                </small>

                <div class="itens-doacao">

                    ${itens}

                </div>

                <div class="acoes-doacao">

                    <button
                        class="btn-primary btnDetalhes"
                        data-id="${doacao.id}">

                        👁 Detalhes

                    </button>

                    <button
                        class="btn btn-primary btnWhatsapp"
                        data-id="${doacao.id}">
                        📱 WhatsApp
                    </button>

                    ${doacao.status === "Entregue"

                                ? `
                            <button
                                class="btn-secondary btnEntregue"
                                data-id="${doacao.id}"
                                data-status="${doacao.status}">

                                ↩ Reservar

                            </button>
                        `

                                : `
                            <button
                                class="btn-success btnEntregue"
                                data-id="${doacao.id}"
                                data-status="${doacao.status}">

                                ✔ Entregue

                            </button>
                        `
                    }

                </div>

        `;

    });

    registrarEventos();

}

function registrarPesquisa() {

    document
        .getElementById("txtPesquisa")
        ?.addEventListener("input", aplicarFiltros);

    document
        .getElementById("chkReservadas")
        ?.addEventListener("change", aplicarFiltros);

    document
        .getElementById("chkEntregues")
        ?.addEventListener("change", aplicarFiltros);

}

function registrarEventos() {

    // =============================
    // DETALHES
    // =============================

    document
        .querySelectorAll(".btnDetalhes")
        .forEach(botao => {

            botao.onclick = async () => {

                const id = Number(botao.dataset.id);

                const doacao =
                    todasDoacoes.find(d => d.id === id);

                if (!doacao)
                    return;

                const itens = doacao.doacao_itens
                    .map(item => `
                        <tr>
                            <td>${item.ingredientes.nome}</td>
                            <td style="text-align:right">
                                ${item.quantidade}
                            </td>
                        </tr>
                    `)
                    .join("");

                await Swal.fire({

                    title: doacao.nome,

                    width: 650,

                    html: `

                        <p>

                            📱 <strong>${doacao.telefone}</strong>

                        </p>

                        <p>

                            📅 ${new Date(
                        doacao.created_at
                    ).toLocaleString("pt-BR")}

                        </p>

                        <table style="
                            width:100%;
                            border-collapse:collapse;
                            margin-top:20px;
                        ">

                            <thead>

                                <tr>

                                    <th style="text-align:left">

                                        Ingrediente

                                    </th>

                                    <th style="text-align:right">

                                        Qtd.

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                ${itens}

                            </tbody>

                        </table>

                    `

                });

            };

        });

    // =============================
    // ENTREGUE
    // =============================

    document
        .querySelectorAll(".btnEntregue")
        .forEach(botao => {

            botao.onclick = async () => {

                const status =
                    botao.dataset.status;

                const novoStatus =
                    status === "Entregue"
                        ? "Reservado"
                        : "Entregue";

                const texto =
                    novoStatus === "entregue"
                        ? "Marcar como entregue?"
                        : "Voltar para reservado?";

                const ok =
                    await Swal.fire({

                        icon: "question",

                        title: texto,

                        showCancelButton: true,

                        confirmButtonText: "Confirmar",

                        cancelButtonText: "Cancelar"

                    });

                if (!ok.isConfirmed)
                    return;

                try {

                    await atualizarStatusDoacao(

                        Number(botao.dataset.id),

                        novoStatus

                    );

                    await carregarDoacoes();

                }
                catch (e) {

                    Swal.fire({

                        icon: "error",

                        title: "Erro",

                        text: e.message

                    });

                }

            };

        });

    // =============================
    // WHATSAPP
    // =============================

    document
        .querySelectorAll(".btnWhatsapp")
        .forEach(botao => {

            botao.onclick = async () => {

                const doacao =
                    await buscarDoacao(
                        Number(botao.dataset.id)
                    );

                const telefone =
                    doacao.telefone.replace(/\D/g, "");

                let total = 0;

                const linhas = [

                    `Olá ${doacao.nome}! 👋`,
                    "",
                    "Segue sua reserva para:",
                    `🎉 ${doacao.campanhas?.nome ?? "Campanha Solidária"}`,
                    "",
                    "Itens reservados:",
                    ""

                ];

                doacao.doacao_itens.forEach(item => {

                    total += item.quantidade;

                    linhas.push(
                        `• ${item.quantidade}x ${item.ingredientes.nome}`
                    );

                });

                linhas.push("");
                linhas.push(`📦 Total de itens: ${total}`);

                if (doacao.campanhas?.descricao) {

                    linhas.push("");
                    linhas.push(`📍 ${doacao.campanhas.descricao}`);

                }

                linhas.push("");
                linhas.push("Muito obrigado pela sua colaboração! ❤️");

                const mensagem = linhas.join("\n");

                const url = new URL(
                    `https://wa.me/55${telefone}`
                );

                url.searchParams.set(
                    "text",
                    mensagem
                );
                
                window.open(
                    url.toString(),
                    "_blank"
                );

            };

        });
}
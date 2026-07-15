import Swal from "sweetalert2";

import {
    listarCampanhas,
    buscarCampanha,
    alterarStatusCampanha
} from "../services/campanhaAdminService";

import { modalCampanha } from "../components/modalCampanha";

export function campanhas() {

    return `

        <div class="page-header">

            <h1>📅 Campanhas</h1>

            <button
                id="btnNovaCampanha"
                class="btn-primary">

                ➕ Nova Campanha

            </button>

        </div>

        <table class="tabela">

            <thead>

                <tr>

                    <th>Nome</th>

                    <th>Descrição</th>

                    <th>Data</th>

                    <th>Status</th>

                    <th style="width:140px">

                        Ações

                    </th>

                </tr>

            </thead>

            <tbody id="tbodyCampanhas">

                <tr>

                    <td colspan="5">

                        Carregando...

                    </td>

                </tr>

            </tbody>

        </table>

    `;

}

export async function carregarCampanhas() {

    const tbody =
        document.getElementById(
            "tbodyCampanhas"
        );

    tbody.innerHTML = `

        <tr>

            <td colspan="5">

                Carregando...

            </td>

        </tr>

    `;

    try {

        const campanhas =
            await listarCampanhas();

        tbody.innerHTML = "";

        if (campanhas.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="5">

                        Nenhuma campanha cadastrada.

                    </td>

                </tr>

            `;

            return;

        }

        campanhas.forEach(item => {

            tbody.innerHTML += `

                <tr>

                    <td>

                        ${item.nome}

                    </td>

                    <td>

                        ${item.descricao ?? "-"}

                    </td>

                    <td>

                        ${new Date(
                item.data_evento
            ).toLocaleDateString("pt-BR")}

                    </td>

                    <td>

                        ${item.ativa

                    ? `<span class="badge badge-success">

                                Ativa

                               </span>`

                    : `<span class="badge badge-secondary">

                                Inativa

                               </span>`
                }

                    </td>

                    <td>

                        <button

                            class="btn-icon editar"

                            data-id="${item.id}"

                            title="Editar">

                            ✏️

                        </button>

                        <button

                            class="btn-icon ativar"

                            data-id="${item.id}"

                            data-ativa="${item.ativa}"

                            title="${item.ativa
                    ? "Já ativa"
                    : "Ativar campanha"
                }">

                            ${item.ativa
                    ? "🟢"
                    : "⚪"
                }

                        </button>

                    </td>

                </tr>

            `;

        });

        registrarEventos();

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

function registrarEventos() {

    // ==========================
    // NOVA CAMPANHA
    // ==========================

    const btnNova =
        document.getElementById(
            "btnNovaCampanha"
        );

    if (btnNova) {

        btnNova.onclick = async () => {

            try {

                const ok =
                    await modalCampanha();

                if (ok) {

                    await carregarCampanhas();

                }

            }
            catch (e) {

                console.error(e);

                Swal.fire({

                    icon: "error",

                    title: "Erro",

                    text: e.message

                });

            }

        };

    }

    // ==========================
    // EDITAR
    // ==========================

    document
        .querySelectorAll(".editar")
        .forEach(botao => {

            botao.onclick = async () => {

                try {

                    const campanha =
                        await buscarCampanha(
                            Number(
                                botao.dataset.id
                            )
                        );

                    const ok =
                        await modalCampanha(
                            campanha
                        );

                    if (ok) {

                        await carregarCampanhas();

                    }

                }
                catch (e) {

                    console.error(e);

                    Swal.fire({

                        icon: "error",

                        title: "Erro",

                        text: e.message

                    });

                }

            };

        });

    // ==========================
    // DEFINIR COMO ATIVA
    // ==========================

    document
        .querySelectorAll(".ativar")
        .forEach(botao => {

            botao.onclick = async () => {

                const ativa =
                    botao.dataset.ativa === "true";

                if (ativa) {

                    await Swal.fire({

                        icon: "info",

                        title: "Esta campanha já está ativa."

                    });

                    return;

                }

                const confirmar =
                    await Swal.fire({

                        icon: "question",

                        title: "Ativar campanha?",

                        text: "A campanha atualmente ativa será desativada.",

                        showCancelButton: true,

                        confirmButtonText: "Ativar",

                        cancelButtonText: "Cancelar",

                        reverseButtons: true

                    });

                if (!confirmar.isConfirmed)
                    return;

                try {

                    await alterarStatusCampanha(

                        Number(
                            botao.dataset.id
                        ),

                        true

                    );

                    await Swal.fire({

                        icon: "success",

                        title: "Campanha ativada!",

                        timer: 1200,

                        showConfirmButton: false

                    });

                    await carregarCampanhas();

                }
                catch (e) {

                    console.error(e);

                    Swal.fire({

                        icon: "error",

                        title: "Erro",

                        text: e.message

                    });

                }

            };

        });

}
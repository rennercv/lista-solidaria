import Swal from "sweetalert2";

import {
    listarIngredientesAdmin,
    buscarIngrediente,
    atualizarIngrediente,
    alterarStatusIngrediente
} from "../services/ingredienteAdminService";

import { listarCampanhas } from "../services/campanhaService";

import { modalIngrediente } from "../components/modalIngrediente";
import { modalEditar } from "../components/modalEditarIngrediente";

export function ingredientes() {

    return `

        <div class="page-header">

            <h1>📦 Ingredientes</h1>

            <button
                class="btn-primary"
                id="novoIngrediente">

                ➕ Novo Ingrediente

            </button>

        </div>

        <table class="tabela">

            <thead>

                <tr>

                    <th>Ingrediente</th>

                    <th>Campanha</th>

                    <th>Total</th>

                    <th>Restante</th>

                    <th>Status</th>

                    <th width="120"></th>

                </tr>

            </thead>

            <tbody id="tbodyIngredientes">

                <tr>

                    <td colspan="6" style="text-align:center">

                        Carregando...

                    </td>

                </tr>

            </tbody>

        </table>

    `;

}

export async function carregarIngredientes() {

    const tbody =
        document.getElementById("tbodyIngredientes");

    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center">
                Carregando...
            </td>
        </tr>
    `;

    try {

        const ingredientes =
            await listarIngredientesAdmin();

        tbody.innerHTML = "";

        if (ingredientes.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="text-align:center">

                        Nenhum ingrediente cadastrado.

                    </td>

                </tr>

            `;

            return;

        }

        ingredientes.forEach(item => {

            const status =
                item.quantidade_restante == 0
                    ? `<span class="badge badge-success">Completo</span>`
                    : `<span class="badge badge-warning">Em aberto</span>`;

            tbody.innerHTML += `

                <tr>

                    <td>

                        ${item.nome}

                    </td>

                    <td>

                        ${item.campanhas?.nome ?? "-"}

                    </td>

                    <td>

                        ${item.quantidade_total}

                    </td>

                    <td>

                        ${item.quantidade_restante}

                    </td>

                    <td>

                        ${status}

                    </td>

                    <td>

                        <button
                            class="btn-icon editar"
                            data-id="${item.id}"
                            title="Editar">

                            ✏️

                        </button>

                        ${item.ativo
                    ? `
        <button
            class="btn-icon status"
            data-id="${item.id}"
            data-ativo="false"
            title="Desativar">

            🚫

        </button>
    `
                    : `
        <button
            class="btn-icon status"
            data-id="${item.id}"
            data-ativo="true"
            title="Reativar">

            ♻️

        </button>
    `
}

                    </td>

                </tr>

            `;

        });

        registrarEventos();

    }
    catch (e) {

        console.error(e);

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    Erro ao carregar ingredientes.

                </td>

            </tr>

        `;

    }

}

function registrarEventos() {

    // ============================
    // NOVO INGREDIENTE
    // ============================

    const btnNovo = document.getElementById("novoIngrediente");

    if (btnNovo) {

        btnNovo.onclick = async () => {

            try {

                const campanhas = await listarCampanhas();

                const ok = await modalIngrediente(campanhas);

                if (!ok)
                    return;

                await carregarIngredientes();

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

    // ============================
    // EDITAR
    // ============================

    document
        .querySelectorAll(".editar")
        .forEach(botao => {

            botao.onclick = async () => {

                try {

                    const ingrediente =
                        await buscarIngrediente(
                            Number(botao.dataset.id)
                        );

                    const modal =
                        await modalEditar(
                            ingrediente
                        );

                    if (!modal.isConfirmed)
                        return;

                    await atualizarIngrediente(

                        ingrediente.id,

                        modal.value.nome,

                        modal.value.quantidade

                    );

                    await Swal.fire({

                        icon: "success",

                        title: "Ingrediente atualizado!",

                        timer: 1500,

                        showConfirmButton: false

                    });

                    await carregarIngredientes();

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

    // ============================
    // DESATIVAR
    // ============================

    document
        .querySelectorAll(".excluir")
        .forEach(botao => {

            botao.onclick = async () => {

                const confirmar =
                    await Swal.fire({

                        icon: "warning",

                        title: "Desativar ingrediente?",

                        text:
                            "Ele deixará de aparecer na campanha pública.",

                        showCancelButton: true,

                        confirmButtonText: "Desativar",

                        cancelButtonText: "Cancelar",

                        reverseButtons: true

                    });

                if (!confirmar.isConfirmed)
                    return;

                try {

                    await alterarStatusIngrediente(
                        Number(botao.dataset.id)
                    );

                    await Swal.fire({

                        icon: "success",

                        title: "Ingrediente desativado!",

                        timer: 1500,

                        showConfirmButton: false

                    });

                    await carregarIngredientes();

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

    document.querySelectorAll(".status")
        .forEach(botao => {

            botao.onclick = async () => {

                const ativo =
                    botao.dataset.ativo === "true";

                await alterarStatusIngrediente(
                    Number(botao.dataset.id),
                    ativo
                );

                await carregarIngredientes();

            };

        });

}
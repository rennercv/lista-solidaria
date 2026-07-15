import Swal from "sweetalert2";

import {
    listarUsuarios,
    buscarUsuario,
    alterarStatusUsuario
} from "../services/usuarioAdminService";

import { modalUsuario } from "../components/modalUsuario";

let usuarios = [];

export function usuariosPagina() {

    return `

        <div class="page-header">

            <h1>👥 Usuários</h1>

            <button
                class="btn-primary"
                id="btnNovoUsuario">

                ➕ Novo Usuário

            </button>

        </div>

        <table class="tabela">

            <thead>

                <tr>

                    <th>Nome</th>

                    <th>E-mail</th>

                    <th>Perfil</th>

                    <th>Status</th>

                    <th></th>

                </tr>

            </thead>

            <tbody id="tbodyUsuarios">

                <tr>

                    <td colspan="5">

                        Carregando...

                    </td>

                </tr>

            </tbody>

        </table>

    `;

}

export async function carregarUsuarios() {

    usuarios = await listarUsuarios();

    const tbody =
        document.getElementById(
            "tbodyUsuarios"
        );

    tbody.innerHTML = "";

    usuarios.forEach(usuario => {

        tbody.innerHTML += `

            <tr>

                <td>

                    ${usuario.nome}

                </td>

                <td>

                    ${usuario.email}

                </td>

                <td>

                    ${usuario.perfil}

                </td>

                <td>

                    ${usuario.ativo

                ? '<span class="badge badge-success">Ativo</span>'

                : '<span class="badge badge-danger">Inativo</span>'
            }

                </td>

                <td>

                    <button

                        class="btn-icon editar"

                        data-id="${usuario.id}">

                        ✏️

                    </button>

                    <button

                        class="btn-icon status"

                        data-id="${usuario.id}"

                        data-ativo="${usuario.ativo}">

                        ${usuario.ativo

                ? "🔒"

                : "🔓"}

                    </button>

                </td>

            </tr>

        `;

    });

    registrarEventos();

}

function registrarEventos() {

    document
        .getElementById("btnNovoUsuario")
        .onclick = async () => {

            const ok =
                await modalUsuario();

            if (ok) {

                await carregarUsuarios();

                Swal.fire({

                    icon: "success",

                    title: "Usuário cadastrado!"

                });

            }

        };

    document
        .querySelectorAll(".editar")
        .forEach(botao => {

            botao.onclick = async () => {

                const usuario =
                    await buscarUsuario(
                        Number(
                            botao.dataset.id
                        )
                    );

                const ok =
                    await modalUsuario(
                        usuario
                    );

                if (ok) {

                    await carregarUsuarios();

                    Swal.fire({

                        icon: "success",

                        title: "Usuário atualizado!"

                    });

                }

            };

        });

    document
        .querySelectorAll(".status")
        .forEach(botao => {

            botao.onclick = async () => {

                const ativo =
                    botao.dataset.ativo === "true";

                const confirmar =
                    await Swal.fire({

                        icon: "question",

                        title: ativo

                            ? "Desativar usuário?"

                            : "Ativar usuário?",

                        showCancelButton: true,

                        confirmButtonText: "Confirmar",

                        cancelButtonText: "Cancelar"

                    });

                if (!confirmar.isConfirmed)
                    return;

                await alterarStatusUsuario(

                    Number(
                        botao.dataset.id
                    ),

                    !ativo

                );

                await carregarUsuarios();

            };

        });

}
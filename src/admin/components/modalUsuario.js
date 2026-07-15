import Swal from "sweetalert2";
import { salvarUsuario } from "../services/usuarioAdminService";

export async function modalUsuario(usuario = null) {

    const novo = !usuario;

    const resultado = await Swal.fire({

        title: novo

            ? "Novo Usuário"

            : "Editar Usuário",

        width: 650,

        html: `

            <input

                id="nome"

                class="swal2-input"

                placeholder="Nome"

                value="${usuario?.nome ?? ""}">

            <input

                id="email"

                class="swal2-input"

                placeholder="E-mail"

                value="${usuario?.email ?? ""}">

            <input

                id="senha"

                class="swal2-input"

                type="password"

                placeholder="${novo ? "Senha" : "Nova senha (opcional)"}">

            <select

                id="perfil"

                class="swal2-select">

                <option value="Administrador"

                    ${usuario?.perfil === "Administrador"

                ? "selected"

                : ""}>

                    Administrador

                </option>

                <option value="Organizador"

                    ${usuario?.perfil === "Organizador"

                ? "selected"

                : ""}>

                    Organizador

                </option>

                <option value="Consulta"

                    ${usuario?.perfil === "Consulta"

                ? "selected"

                : ""}>

                    Consulta

                </option>

            </select>

        `,

        showCancelButton: true,

        confirmButtonText: "Salvar",

        cancelButtonText: "Cancelar",

        focusConfirm: false,

        preConfirm: () => {

            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const senha =
                document
                    .getElementById("senha")
                    .value;

            const perfil =
                document
                    .getElementById("perfil")
                    .value;

            if (!nome) {

                Swal.showValidationMessage(
                    "Informe o nome."
                );

                return false;

            }

            if (!email) {

                Swal.showValidationMessage(
                    "Informe o e-mail."
                );

                return false;

            }

            if (
                novo &&
                senha.length < 4
            ) {

                Swal.showValidationMessage(
                    "A senha deve possuir pelo menos 4 caracteres."
                );

                return false;

            }

            return {

                id: usuario?.id,

                nome,

                email,

                senha,

                perfil,

                ativo: usuario?.ativo ?? true

            };

        }

    });

    if (!resultado.isConfirmed)
        return false;

    await salvarUsuario(
        resultado.value
    );

    return true;

}
import Swal from "sweetalert2";
import { login } from "../services/authService";

export function telaLogin() {

    return `

        <div class="login-page">

            <div class="login-card">

                <img
                    src="/assets/img/logo.svg"
                    class="login-logo">

                <h1>

                    Lista Solidária

                </h1>

                <p>

                    Painel Administrativo

                </p>

                <input

                    id="email"

                    class="login-input"

                    placeholder="📧 E-mail">

                <input

                    id="senha"

                    type="password"

                    class="login-input"

                    placeholder="🔒 Senha">

                <button

                    id="btnEntrar"

                    class="btn btn-primary">

                    Entrar

                </button>

                <div class="versao">

                    Versão 1.0

                </div>

            </div>

        </div>

    `;

}

export function iniciarLogin() {

    const botao = document.getElementById("btnEntrar");

    botao.onclick = async () => {

        const email = document

            .getElementById("email")

            .value

            .trim();

        const senha = document

            .getElementById("senha")

            .value;

        if (!email) {

            Swal.fire({

                icon: "warning",

                title: "Informe o e-mail."

            });

            return;

        }

        if (!senha) {

            Swal.fire({

                icon: "warning",

                title: "Informe a senha."

            });

            return;

        }

        try {

            const usuario = await login(

                email,

                senha

            );

            sessionStorage.setItem(

                "usuario",

                JSON.stringify(usuario)

            );

            location.reload();

        }

        catch (e) {

            Swal.fire({

                icon: "error",

                title: "Login inválido",

                text: e.message

            });

        }

    };

}
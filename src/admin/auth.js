import { sidebar } from "./components/sidebar";

import {
    usuarioLogado,
    logout
} from "./services/authService";

import {
    telaLogin,
    iniciarLogin
} from "./pages/login";

import {
    carregarPagina
} from "./router";

export function iniciarSistema() {

    const app =
        document.getElementById("app");

    const usuario =
        usuarioLogado();

    // ==========================
    // NÃO LOGADO
    // ==========================

    if (!usuario) {

        app.innerHTML = telaLogin();

        iniciarLogin();

        return;

    }

    // ==========================
    // LOGADO
    // ==========================

    app.innerHTML = `

        <div class="admin">

            ${sidebar()}

            <main class="main">

                <header class="topbar">

                    <div class="usuario-logado">

                        👋 ${usuario.nome}

                        <small>

                            ${usuario.perfil}

                        </small>

                    </div>

                    <button
                        id="btnLogout"
                        class="btn btn-secondary">

                        Sair

                    </button>

                </header>

                <div
    class="content">

</div>

            </main>

        </div>

    `;

    document
        .getElementById("btnLogout")
        .onclick = logout;

    document
        .getElementById("menuDashboard")
        .onclick = () =>
            carregarPagina("dashboard");

    document
        .getElementById("menuIngredientes")
        .onclick = () =>
            carregarPagina("ingredientes");

    document
        .getElementById("menuCampanhas")
        .onclick = () =>
            carregarPagina("campanhas");

    document
        .getElementById("menuDoacoes")
        .onclick = () =>
            carregarPagina("doacoes");

    document
        .getElementById("menuUsuarios")
        .onclick = () =>
            carregarPagina("usuarios");

    carregarPagina("dashboard");

}
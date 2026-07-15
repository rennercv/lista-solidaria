import {
    dashboard,
    carregarDashboardPagina
} from "./pages/dashboard"; 
import {
    ingredientes,
    carregarIngredientes
} from "./pages/ingredientes"; 
import {
    campanhas,
    carregarCampanhas
} from "./pages/campanhas"; 
import {
    doacoes,
    carregarDoacoes
} from "./pages/doacoes"; 
import {
    usuariosPagina,
    carregarUsuarios
} from "./pages/usuarios";

export function carregarPagina(nome) {

    const content = document.querySelector(".content");

    switch (nome) {

        case "dashboard":

            content.innerHTML = dashboard();

            carregarDashboardPagina();

            break;

        case "ingredientes":

            content.innerHTML = ingredientes();

            carregarIngredientes();

            break;

        case "campanhas":

            content.innerHTML = campanhas();

            carregarCampanhas();

            break;

        case "doacoes":

            content.innerHTML = doacoes();

            carregarDoacoes();

            break;

        case "usuarios":

            content.innerHTML = usuariosPagina();

            carregarUsuarios();

            break;

    }

}
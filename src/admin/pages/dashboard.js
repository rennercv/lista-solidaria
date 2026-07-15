import Swal from "sweetalert2";

import {
    carregarDashboard
} from "../services/dashboardService";

export function dashboard() {

    return `

        <div class="page-header">

            <h1>

                📊 Dashboard

            </h1>

        </div>

        <div class="cards-dashboard">

            <div class="card-dashboard">

                <small>

                    ❤️ Campanha Ativa

                </small>

                <h2 id="campanhaAtiva">

                    ...

                </h2>

            </div>

            <div class="card-dashboard">

                <small>

                    👥 Doadores

                </small>

                <h2 id="totalDoadores">

                    0

                </h2>

            </div>

            <div class="card-dashboard">

                <small>

                    📦 Ingredientes

                </small>

                <h2 id="totalIngredientes">

                    0

                </h2>

            </div>

            <div class="card-dashboard">

                <small>

                    ❤️ Reservadas

                </small>

                <h2 id="totalReservadas">

                    0

                </h2>

            </div>

            <div class="card-dashboard">

                <small>

                    ✅ Entregues

                </small>

                <h2 id="totalEntregues">

                    0

                </h2>

            </div>

        </div>

    `;

}

export async function carregarDashboardPagina() {

    try {

        const dados =
            await carregarDashboard();

        document
            .getElementById("campanhaAtiva")
            .innerText =
            dados.campanhaAtiva
                ?.nome ?? "-";

        document
            .getElementById("totalDoadores")
            .innerText =
            dados.totalDoadores;

        document
            .getElementById("totalIngredientes")
            .innerText =
            dados.totalIngredientes;

        document
            .getElementById("totalReservadas")
            .innerText =
            dados.reservadas;

        document
            .getElementById("totalEntregues")
            .innerText =
            dados.entregues;

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
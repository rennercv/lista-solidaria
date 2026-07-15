import { listarIngredientes } from "../services/ingredienteService";
import { ingredienteCard } from "../components/ingredienteCard";
import { carrinho, salvarCarrinho } from "../js/state";
import { abrirModal } from "../components/modalConfirmacao";
import { obterCampanhaAtiva } from "../services/campanhaService";

export async function carregarHome() {

    const ingredientes = await listarIngredientes();

    const quantidadeTotal = ingredientes.reduce(
        (soma, item) => soma + item.quantidade_total,
        0
    );

    const quantidadeRestante = ingredientes.reduce(
        (soma, item) => soma + item.quantidade_restante,
        0
    );

    const quantidadeArrecadada =
        quantidadeTotal - quantidadeRestante;

    const percentual = quantidadeTotal > 0
        ? Math.round((quantidadeArrecadada / quantidadeTotal) * 100)
        : 0;

    const campanha = await obterCampanhaAtiva();

    const campanhaId = campanha.id;

    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="container">

            <h1>❤️ ${campanha.nome}</h1>

            <p>${campanha.descricao ?? ""}</p>

            <p>
                📅 ${new Date(campanha.data_evento).toLocaleDateString("pt-BR")}
            </p>

            <div class="campanha-status">

                <div class="status-header">

                    <span>Progresso da campanha</span>

                    <strong>${percentual}%</strong>

                </div>

                <div class="status-bar">

                    <div
                        class="status-fill"
                        style="width:${percentual}%">
                    </div>

                </div>

                <small class="status-texto">

    <span class="status-ok">
        ✅ ${quantidadeArrecadada} doados
    </span>

    <span class="status-separador">
        •
    </span>

    <span class="status-falta">
        🎯 Faltam ${quantidadeRestante}
    </span>

</small>

            </div>

            ${ingredientes.map(i => ingredienteCard(i)).join("")}

            <div class="resumo">

                <button
                    id="btnContinuar"
                    disabled>

                    Continuar (0)

                </button>

            </div>

        </div>
    `;

    registrarEventos(ingredientes, campanhaId);

    restaurarCarrinho();

}

function registrarEventos(ingredientes, campanhaId) {

    document.querySelectorAll(".btn-mais").forEach(btn => {

        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);

            const max = Number(btn.dataset.max);

            if (!carrinho[id])
                carrinho[id] = 0;

            if (carrinho[id] >= max)
                return;

            carrinho[id]++;

            salvarCarrinho();

            atualizarResumo();

        });

    });

    document.querySelectorAll(".btn-menos").forEach(btn => {

        btn.addEventListener("click", () => {

            const id = Number(btn.dataset.id);

            if (!carrinho[id])
                return;

            carrinho[id]--;

            salvarCarrinho();

            atualizarResumo();

        });

    });

    document
        .getElementById("btnContinuar")
        .addEventListener("click", async () => {

            const resposta = await abrirModal(

                campanhaId,

                ingredientes,

                carrinho

            );

            if (!resposta)
                return;

            if (resposta.success) {

                alert(resposta.message);

                Object.keys(carrinho).forEach(id => {

                    carrinho[id] = 0;

                });

                salvarCarrinho();

                carregarHome();

            }

        });

}

function atualizarResumo() {

    let total = 0;

    Object.keys(carrinho).forEach(id => {

        const qtd = carrinho[id];

        total += qtd;

        document.getElementById(`qtd-${id}`).innerText = qtd;

    });

    const botao = document.getElementById("btnContinuar");

    botao.disabled = total === 0;

    botao.innerText = `Continuar (${total})`;

}

function restaurarCarrinho() {

    Object.keys(carrinho).forEach(id => {

        const span = document.getElementById(`qtd-${id}`);

        if (span) {

            span.innerText = carrinho[id];

        }

    });

    atualizarResumo();

}
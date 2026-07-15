import Swal from "sweetalert2";
import { confirmarDoacao } from "../services/doacaoService";
import { limparCarrinho } from "../js/state";

export async function abrirModal(campanhaId, ingredientes, carrinho) {

    const itens = ingredientes.filter(i => (carrinho[i.id] || 0) > 0);

    if (itens.length === 0) {

        await Swal.fire({
            icon: "warning",
            title: "Nenhum item selecionado",
            text: "Selecione pelo menos um ingrediente."
        });

        return false;

    }

    let total = 0;

    let resumo = `
        <table style="
            width:100%;
            border-collapse:collapse;
            margin-bottom:20px;
        ">
            <thead>
                <tr>
                    <th style="text-align:center;padding-bottom:10px;">
                        Ingrediente
                    </th>

                    <th style="text-align:left;padding-bottom:10px;">
                        Qtd.
                    </th>
                </tr>
            </thead>

            <tbody>
    `;

    itens.forEach(item => {

        const qtd = carrinho[item.id];

        total += qtd;

        resumo += `
            <tr>

                <td style="
                    padding:8px 0;
                    border-bottom:1px solid #eee;
                ">
                    ${item.nome}
                </td>

                <td style="
                    text-align:left;
                    font-weight:bold;
                    color:#007AFF;
                    border-bottom:1px solid #eee;
                ">
                    ${qtd}
                </td>

            </tr>
        `;

    });

    resumo += `
            </tbody>
        </table>

        <div style="
            text-align:center;
            margin-bottom:20px;
            font-weight:bold;
            font-size:16px;
        ">
            Total de itens: ${total}
        </div>
    `;

    const resultado = await Swal.fire({

        title: "❤️ Confirmar Doação",

        width: 650,

        html: `

            ${resumo}

            <input
                id="nome"
                class="swal2-input"
                placeholder="Seu nome completo"
                autocomplete="name">

            <input
                id="telefone"
                class="swal2-input"
                placeholder="(27) 99999-9999"
                maxlength="15"
                autocomplete="tel">

        `,

        confirmButtonText: "Confirmar",

        cancelButtonText: "Cancelar",

        showCancelButton: true,

        reverseButtons: true,

        focusConfirm: false,

        didOpen: () => {

            const telefone = document.getElementById("telefone");

            telefone.addEventListener("input", (e) => {

                let valor = e.target.value.replace(/\D/g, "");

                valor = valor.substring(0, 11);

                if (valor.length > 6) {

                    valor = valor.replace(
                        /^(\d{2})(\d{5})(\d{0,4}).*/,
                        "($1) $2-$3"
                    );

                } else if (valor.length > 2) {

                    valor = valor.replace(
                        /^(\d{2})(\d*)/,
                        "($1) $2"
                    );

                }

                e.target.value = valor;

            });

        },

        preConfirm: () => {

            const nome = document
                .getElementById("nome")
                .value
                .trim();

            const telefone = document
                .getElementById("telefone")
                .value
                .trim();

            if (!nome) {

                Swal.showValidationMessage("Informe seu nome.");

                return false;

            }

            const telefoneNumeros = telefone.replace(/\D/g, "");

            if (telefoneNumeros.length !== 11) {

                Swal.showValidationMessage(
                    "Informe um WhatsApp válido com DDD."
                );

                return false;

            }
            return {
                nome,
                telefone: telefoneNumeros
            };

        }

    });

    if (!resultado.isConfirmed)
        return false;

    const { nome, telefone } = resultado.value;

    Swal.fire({

        title: "Salvando...",

        text: "Registrando sua doação.",

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {

            Swal.showLoading();

        }

    });

    try {

        const resposta = await confirmarDoacao(

            campanhaId,

            nome,

            telefone,

            carrinho

        );

        Swal.close();

        if (!resposta.success) {

            await Swal.fire({

                icon: "warning",

                title: "Atenção",

                text: resposta.message

            });

            return false;

        }

        limparCarrinho();

        await Swal.fire({

            icon: "success",

            title: "Muito obrigado! ❤️",

            html: `
                <p>Sua doação foi registrada com sucesso.</p>

                <strong>${resposta.message}</strong>
            `

        });

        location.reload();

        return true;

    }
    catch (e) {

        Swal.close();

        await Swal.fire({

            icon: "error",

            title: "Erro",

            text: e.message

        });

        return false;

    }

}
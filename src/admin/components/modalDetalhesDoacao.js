import Swal from "sweetalert2";

export async function modalDetalhesDoacao(doacao) {

    const itens = doacao.doacao_itens
        .map(item => `
            <tr>

                <td style="padding:10px 0">

                    ${item.ingredientes.nome}

                </td>

                <td style="
                    text-align:right;
                    font-weight:bold;
                    color:#007AFF;
                ">

                    ${item.quantidade}

                </td>

            </tr>
        `)
        .join("");

    const status = doacao.status === "entregue"

        ? `
            <span style="
                color:#34C759;
                font-weight:bold;
            ">
                ✅ Entregue
            </span>
        `

        : `
            <span style="
                color:#FF9500;
                font-weight:bold;
            ">
                🟡 Reservado
            </span>
        `;

    await Swal.fire({

        title: "❤️ Detalhes da Doação",

        width: 700,

        html: `

            <div style="text-align:left">

                <h3 style="margin-bottom:5px">

                    👤 ${doacao.nome}

                </h3>

                <p>

                    📱 ${doacao.telefone}

                </p>

                <p>

                    📅 ${new Date(
            doacao.created_at
        ).toLocaleString("pt-BR")}

                </p>

                <p style="margin:15px 0">

                    ${status}

                </p>

                <hr>

                <table style="
                    width:100%;
                    border-collapse:collapse;
                    margin-top:20px;
                ">

                    <thead>

                        <tr>

                            <th style="text-align:left">

                                Ingrediente

                            </th>

                            <th style="text-align:right">

                                Quantidade

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${itens}

                    </tbody>

                </table>

            </div>

        `,

        confirmButtonText: "Fechar"

    });

}
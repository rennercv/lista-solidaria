export function ingredienteCard(item) {

    const doados = item.quantidade_total - item.quantidade_restante;

    const percentual = item.quantidade_total > 0
        ? (doados / item.quantidade_total) * 100
        : 0;

    const esgotado = item.quantidade_restante === 0;

    return `
        <div class="card ${esgotado ? "esgotado" : ""}" data-id="${item.id}">

            <h3>

    ${item.nome}

    ${esgotado
        ? '<span class="badge-esgotado">❤️ META ATINGIDA</span>'
            : ""}

</h3>

            <div class="linha">

                <div class="progress">

                    <div
                        class="progress-fill"
                        style="width:${percentual}%">
                    </div>

                </div>

                <div class="contador">

                    <button
    class="btn-menos"
    data-id="${item.id}"
    ${esgotado ? "disabled" : ""}>
                        −
                    </button>

                    <span
                        class="qtd"
                        id="qtd-${item.id}">
                        0
                    </span>

                    <button
    class="btn-mais"
    data-id="${item.id}"
    data-max="${item.quantidade_restante}"
    ${esgotado ? "disabled" : ""}>
                        +
                    </button>

                </div>

            </div>

            <div class="info">

                ${esgotado
            ? "Todos os itens foram reservados."
            : `Restam
<strong>${item.quantidade_restante}</strong>
de ${item.quantidade_total}`
}



            </div>

        </div>
    `;

}
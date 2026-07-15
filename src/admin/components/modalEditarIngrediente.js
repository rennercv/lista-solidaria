import Swal from "sweetalert2";

export async function modalEditar(ingrediente) {

    const resultado = await Swal.fire({

        title: "Editar Ingrediente",

        html: `

<input
id="nome"
class="swal2-input"
value="${ingrediente.nome}">

<input
id="quantidade"
class="swal2-input"
type="number"
min="${ingrediente.quantidade_total - ingrediente.quantidade_restante}"
value="${ingrediente.quantidade_total}">

        `,

        showCancelButton: true,

        confirmButtonText: "Salvar",

        cancelButtonText: "Cancelar",

        preConfirm() {

            const nome = document
                .getElementById("nome")
                .value
                .trim();

            const quantidade = Number(
                document
                    .getElementById("quantidade")
                    .value
            );

            if (!nome) {

                Swal.showValidationMessage(
                    "Informe o nome."
                );

                return false;

            }

            return {

                nome,

                quantidade

            };

        }

    });

    return resultado;

}
import Swal from "sweetalert2";
import { inserirIngrediente } from "../services/ingredienteAdminService";

export async function modalIngrediente(campanhas) {

    if (!campanhas || campanhas.length === 0) {

        await Swal.fire({
            icon: "error",
            title: "Nenhuma campanha encontrada",
            text: "Cadastre uma campanha antes de adicionar ingredientes."
        });

        return false;

    }

    const options = campanhas
        .map(c => `
            <option value="${c.id}">
                ${c.nome}${c.ativa ? " (Ativa)" : ""}
            </option>
        `)
        .join("");

    const resultado = await Swal.fire({

        title: "📦 Novo Ingrediente",

        width: 650,

        html: `

            <select
                id="campanha"
                class="swal2-input">

                ${options}

            </select>

            <input
                id="nome"
                class="swal2-input"
                placeholder="Nome do ingrediente"
                maxlength="100">

            <input
                id="quantidade"
                class="swal2-input"
                type="number"
                min="1"
                step="1"
                value="1"
                placeholder="Quantidade necessária">

        `,

        showCancelButton: true,

        confirmButtonText: "Salvar",

        cancelButtonText: "Cancelar",

        reverseButtons: true,

        focusConfirm: false,

        preConfirm: () => {

            const campanha = Number(
                document.getElementById("campanha").value
            );

            const nome = document
                .getElementById("nome")
                .value
                .trim();

            const quantidade = Number(
                document.getElementById("quantidade").value
            );

            if (!campanha) {

                Swal.showValidationMessage(
                    "Selecione uma campanha."
                );

                return false;

            }

            if (!nome) {

                Swal.showValidationMessage(
                    "Informe o nome do ingrediente."
                );

                return false;

            }

            if (!Number.isInteger(quantidade) || quantidade <= 0) {

                Swal.showValidationMessage(
                    "Informe uma quantidade válida."
                );

                return false;

            }

            return {
                campanha,
                nome,
                quantidade
            };

        }

    });

    if (!resultado.isConfirmed)
        return false;

    const {
        campanha,
        nome,
        quantidade
    } = resultado.value;

    Swal.fire({

        title: "Salvando...",

        text: "Cadastrando ingrediente.",

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {

            Swal.showLoading();

        }

    });

    try {

        await inserirIngrediente(
            campanha,
            nome,
            quantidade
        );

        Swal.close();

        await Swal.fire({

            icon: "success",

            title: "Sucesso!",

            text: "Ingrediente cadastrado com sucesso."

        });

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
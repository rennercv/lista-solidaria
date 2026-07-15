import Swal from "sweetalert2";

import {
    inserirCampanha,
    atualizarCampanha
} from "../services/campanhaAdminService";

export async function modalCampanha(campanha = null) {

    const editando = campanha !== null;

    const resultado = await Swal.fire({

        title: editando
            ? "✏️ Editar Campanha"
            : "📅 Nova Campanha",

        width: 650,

        html: `

            <input
                id="nome"
                class="swal2-input"
                placeholder="Nome da campanha"
                value="${campanha?.nome ?? ""}">

            <textarea
                id="descricao"
                class="swal2-textarea"
                placeholder="Descrição">${campanha?.descricao ?? ""}</textarea>

            <input
                id="data"
                class="swal2-input"
                type="date"
                value="${campanha?.data_evento ?? ""}">

            <div
                style="
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    gap:10px;
                    margin-top:15px;
                ">

                <input
                    id="ativa"
                    type="checkbox"
                    ${campanha?.ativa ?? true ? "checked" : ""}>

                <label for="ativa">

                    Campanha ativa

                </label>

            </div>

        `,

        showCancelButton: true,

        confirmButtonText: editando
            ? "Salvar Alterações"
            : "Salvar",

        cancelButtonText: "Cancelar",

        reverseButtons: true,

        preConfirm() {

            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();

            const descricao =
                document
                    .getElementById("descricao")
                    .value
                    .trim();

            const data =
                document
                    .getElementById("data")
                    .value;

            const ativa =
                document
                    .getElementById("ativa")
                    .checked;

            if (!nome) {

                Swal.showValidationMessage(
                    "Informe o nome."
                );

                return false;

            }

            if (!data) {

                Swal.showValidationMessage(
                    "Informe a data."
                );

                return false;

            }

            return {

                nome,

                descricao,

                data,

                ativa

            };

        }

    });

    if (!resultado.isConfirmed)
        return false;

    Swal.fire({

        title: "Salvando...",

        allowOutsideClick: false,

        showConfirmButton: false,

        didOpen() {

            Swal.showLoading();

        }

    });

    try {

        if (editando) {

            await atualizarCampanha(

                campanha.id,

                resultado.value.nome,

                resultado.value.descricao,

                resultado.value.data,

                resultado.value.ativa

            );

        }
        else {

            await inserirCampanha(

                resultado.value.nome,

                resultado.value.descricao,

                resultado.value.data,

                resultado.value.ativa

            );

        }

        Swal.close();

        await Swal.fire({

            icon: "success",

            title: editando
                ? "Campanha atualizada!"
                : "Campanha cadastrada!",

            timer: 1500,

            showConfirmButton: false

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
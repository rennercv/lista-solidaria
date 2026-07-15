import { supabase } from "../../js/supabase";

/**
 * Lista todas as campanhas
 */
export async function listarCampanhas() {

    const { data, error } = await supabase
        .from("campanhas")
        .select("*")
        .order("data_evento", { ascending: false });

    if (error) throw error;

    return data;

}

/**
 * Busca uma campanha pelo ID
 */
export async function buscarCampanha(id) {

    const { data, error } = await supabase
        .from("campanhas")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;

}

/**
 * Cadastra uma campanha
 */
export async function inserirCampanha(
    nome,
    descricao,
    dataEvento,
    ativa
) {

    if (ativa) {

        await supabase
            .from("campanhas")
            .update({
                ativa: false
            })
            .eq("ativa", true);

    }

    const { error } = await supabase
        .from("campanhas")
        .insert({

            nome,

            descricao,

            data_evento: dataEvento,

            ativa

        });

    if (error) throw error;

}

/**
 * Atualiza uma campanha
 */
export async function atualizarCampanha(
    id,
    nome,
    descricao,
    dataEvento,
    ativa
) {

    if (ativa) {

        await supabase
            .from("campanhas")
            .update({
                ativa: false
            })
            .eq("ativa", true);

    }

    const { error } = await supabase
        .from("campanhas")
        .update({

            nome,

            descricao,

            data_evento: dataEvento,

            ativa

        })
        .eq("id", id);

    if (error) throw error;

}

/**
 * Ativa ou desativa uma campanha
 */
export async function alterarStatusCampanha(
    id,
    ativa
) {

    if (ativa) {

        await supabase
            .from("campanhas")
            .update({
                ativa: false
            })
            .eq("ativa", true);

    }

    const { error } = await supabase
        .from("campanhas")
        .update({
            ativa
        })
        .eq("id", id);

    if (error) throw error;

}


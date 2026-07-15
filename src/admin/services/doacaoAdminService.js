import { supabase } from "../../js/supabase";

/**
 * Lista todas as doações
 */
export async function listarDoacoes() {

    const { data, error } = await supabase
        .from("doacoes")
        .select(`
            *,
            doacao_itens(
                quantidade,
                ingredientes(
                    nome
                )
            )
        `)
        .order("created_at", {
            ascending: false
        });

    if (error)
        throw error;

    return data;

}

/**
 * Atualiza o status da doação
 */
export async function atualizarStatusDoacao(
    id,
    status
) {

    const { error } = await supabase
        .from("doacoes")
        .update({
            status
        })
        .eq("id", id);

    if (error)
        throw error;

}

/**
 * Busca uma doação pelo ID
 */
export async function buscarDoacao(id) {

    const { data, error } = await supabase
        .from("doacoes")
        .select(`
            *,
            campanhas(
                id,
                nome,
                descricao
            ),
            doacao_itens(
                quantidade,
                ingredientes(
                    id,
                    nome
                )
            )
        `)
        .eq("id", id)
        .single();

    if (error)
        throw error;

    return data;

}

/**
 * Exclui uma doação
 */
export async function excluirDoacao(id) {

    const { error } = await supabase
        .from("doacoes")
        .delete()
        .eq("id", id);

    if (error)
        throw error;

}
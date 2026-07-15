import { supabase } from "../../js/supabase";

/**
 * Lista todos os ingredientes
 */
export async function listarIngredientesAdmin() {

    const { data, error } = await supabase
        .from("ingredientes")
        .select(`
            *,
            campanhas (
                id,
                nome
            )
        `)
        .order("nome");

    if (error) throw error;

    return data;

}

/**
 * Busca um ingrediente pelo ID
 */
export async function buscarIngrediente(id) {

    const { data, error } = await supabase
        .from("ingredientes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;

}

/**
 * Insere um novo ingrediente
 */
export async function inserirIngrediente(
    campanhaId,
    nome,
    quantidade
) {

    const { error } = await supabase
        .from("ingredientes")
        .insert({

            campanha_id: campanhaId,

            nome,

            quantidade_total: quantidade,

            quantidade_restante: quantidade,

            ativo: true

        });

    if (error) throw error;

}

/**
 * Atualiza um ingrediente
 */
export async function atualizarIngrediente(
    id,
    nome,
    quantidadeTotal
) {

    const ingrediente = await buscarIngrediente(id);

    const reservado =
        ingrediente.quantidade_total -
        ingrediente.quantidade_restante;

    let restante =
        quantidadeTotal - reservado;

    if (restante < 0)
        restante = 0;

    const { error } = await supabase
        .from("ingredientes")
        .update({

            nome,

            quantidade_total: quantidadeTotal,

            quantidade_restante: restante

        })
        .eq("id", id);

    if (error) throw error;

}

/**
 * Desativa um ingrediente
 */
export async function alterarStatusIngrediente(id, ativo) {

    const { error } = await supabase
        .from("ingredientes")
        .update({
            ativo
        })
        .eq("id", id);

    if (error) throw error;

}
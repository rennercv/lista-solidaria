import { supabase } from "../js/supabase";

export async function confirmarDoacao(
    campanhaId,
    nome,
    telefone,
    carrinho
) {

    const itens = Object.entries(carrinho)
        .filter(([_, quantidade]) => Number(quantidade) > 0)
        .map(([ingrediente_id, quantidade]) => ({
            ingrediente_id: Number(ingrediente_id),
            quantidade: Number(quantidade)
        }));

    if (itens.length === 0) {
        return {
            success: false,
            message: "Nenhum ingrediente foi selecionado."
        };
    }

    const { data, error } = await supabase.rpc(
        "confirmar_doacao",
        {
            p_campanha_id: campanhaId,
            p_nome: nome,
            p_telefone: telefone,
            p_itens: itens
        }
    );

    if (error) {
        console.error(error);

        return {
            success: false,
            message: error.message
        };
    }

    return data;

}
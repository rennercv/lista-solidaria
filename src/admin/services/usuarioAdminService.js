import { supabase } from "../../js/supabase";

/**
 * Lista usuários
 */
export async function listarUsuarios() {

    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("nome");

    if (error)
        throw error;

    return data;

}

/**
 * Busca usuário
 */
export async function buscarUsuario(id) {

    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", id)
        .single();

    if (error)
        throw error;

    return data;

}

/**
 * Salvar usuário
 */
export async function salvarUsuario(usuario) {

    // ======================
    // EDITAR
    // ======================

    if (usuario.id) {

        const dados = {

            nome: usuario.nome,

            email: usuario.email,

            perfil: usuario.perfil,

            ativo: usuario.ativo

        };

        if (

            usuario.senha &&
            usuario.senha.trim() !== ""

        ) {

            const { error } =
                await supabase.rpc(

                    "alterar_senha_usuario",

                    {

                        p_usuario_id: usuario.id,

                        p_senha: usuario.senha

                    }

                );

            if (error)
                throw error;

        }

        const { error } =
            await supabase

                .from("usuarios")

                .update(dados)

                .eq("id", usuario.id);

        if (error)
            throw error;

        return;

    }

    // ======================
    // NOVO
    // ======================

    const { data, error } =
        await supabase.rpc(

            "criar_usuario",

            {

                p_nome: usuario.nome,

                p_email: usuario.email,

                p_senha: usuario.senha,

                p_perfil: usuario.perfil

            }

        );

    if (error)
        throw error;

    if (!data.success)
        throw new Error(data.message);

}

/**
 * Ativar / Desativar
 */
export async function alterarStatusUsuario(

    id,

    ativo

) {

    const { error } = await supabase

        .from("usuarios")

        .update({

            ativo

        })

        .eq("id", id);

    if (error)
        throw error;

}
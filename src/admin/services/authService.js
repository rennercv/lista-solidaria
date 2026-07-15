import { supabase } from "../../js/supabase";

/**
 * Realiza o login
 */
export async function login(email, senha) {

    const { data, error } = await supabase.rpc(
        "login_usuario",
        {
            p_email: email.trim().toLowerCase(),
            p_senha: senha
        }
    );

    if (error)
        throw error;

    if (!data.success)
        throw new Error(data.message);

    sessionStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
    );

    return data.usuario;

}

/**
 * Retorna o usuário logado
 */
export function usuarioLogado() {

    const usuario =
        sessionStorage.getItem("usuario");

    if (!usuario)
        return null;

    return JSON.parse(usuario);

}

/**
 * Logout
 */
export function logout() {

    sessionStorage.removeItem("usuario");

    location.reload();

}
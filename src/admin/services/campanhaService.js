import { supabase } from "../../js/supabase";

export async function listarCampanhas() {

    const { data, error } = await supabase
        .from("campanhas")
        .select("*")
        .order("nome");

    if (error) throw error;

    return data;

}
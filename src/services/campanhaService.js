import { supabase } from "../js/supabase";

export async function obterCampanhaAtiva() {

    const { data, error } = await supabase
        .from("campanhas")
        .select("*")
        .eq("ativa", true)
        .limit(1)
        .single();

    if (error) throw error;

    return data;
}
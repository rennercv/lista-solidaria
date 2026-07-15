import { supabase } from "../../js/supabase";

export async function carregarDashboard() {

    const [

        campanhas,

        ingredientes,

        doacoes

    ] = await Promise.all([

        supabase
            .from("campanhas")
            .select("*"),

        supabase
            .from("ingredientes")
            .select("*"),

        supabase
            .from("doacoes")
            .select("*")

    ]);

    if (campanhas.error)
        throw campanhas.error;

    if (ingredientes.error)
        throw ingredientes.error;

    if (doacoes.error)
        throw doacoes.error;

    const campanhaAtiva =
        campanhas.data.find(c => c.ativa);

    const totalIngredientes =
        ingredientes.data.length;

    const totalDoadores =
        new Set(
            doacoes.data.map(d => d.telefone)
        ).size;

    const totalDoacoes =
        doacoes.data.length;

    const entregues =
        doacoes.data.filter(
            d => d.status === "Entregue"
        ).length;

    const reservadas =
        totalDoacoes - entregues;

    return {

        campanhaAtiva,

        totalIngredientes,

        totalDoacoes,

        totalDoadores,

        entregues,

        reservadas

    };

}


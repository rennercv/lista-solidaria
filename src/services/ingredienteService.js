import { supabase } from '../js/supabase';

export async function listarIngredientes() {

    const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

    if (error) throw error;

    return data;
}
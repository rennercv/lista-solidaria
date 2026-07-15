const KEY = "lista-solidaria-carrinho";

export let carrinho = carregar();

function carregar() {

    const dados = localStorage.getItem(KEY);

    if (!dados) return {};

    return JSON.parse(dados);

}

export function salvarCarrinho() {

    localStorage.setItem(KEY, JSON.stringify(carrinho));

}

export function limparCarrinho() {

    carrinho = {};

    salvarCarrinho();

}
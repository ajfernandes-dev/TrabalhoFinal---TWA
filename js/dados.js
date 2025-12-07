export function rolarExpressao(expr) {
    const m = expr.trim().toLowerCase().match(/^(\d+)d(\d+)$/);
    if (!m) return 0;

    const qtd = parseInt(m[1], 10);
    const lados = parseInt(m[2], 10);
    let soma = 0;

    for (let i = 0; i < qtd; i++) {
        soma += Math.floor(Math.random() * lados) + 1;
    }
    return soma;
}



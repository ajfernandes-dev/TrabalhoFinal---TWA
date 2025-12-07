import {Personagem} from './personagem.js';

export class jogo
{
    constructor(){
        this.personagem = new Personagem();
        this.historia = {};
        this.capituloAtual = '1';
        this.ui = null;
    }

  async carregarHistoria(url = 'historia.json'){
    const res = await fetch(url);
    if(!res.ok) throw new Error('Não foi possivel carregar historia.json');
    this.historia = await res.json();
  }

  iniciar(cap = '1'){
    this.capituloAtual = String(cap);
    this.irPara(this.capituloAtual)
  }

  irPara(id){
    const key = String(id).trim();
    const cap = this.historia[key];
    if(!cap){
        console.error('Capituo não encontrado:',key);
        if(this.ui) this.ui.mostrarMensagem(`Capitulo "${key}" não encontrado`);
        return;
    }
    if (cap.atributo_mudanca){
        this.personagem.aplicarMudanças(cap.atributo_mudanca);
    }
    if (cap.item) {
        this.personagem.adicionarItem(cap.item);
    }

    this.capituloAtual = key;
    if(this.ui) this.ui.renderizarCapitulo(cap,key);
}

rolarExpressao(expr) {
    if(typeof expr !== 'string') return NaN;
    const m = expr.trim().toLowerCase().match(/^(\d+)d(\d+)$/);
    if(!m) return NaN;
    const n = parseInt(m[1],10);
    let soma = 0;

    for (let i = 0; i < n; i++){
        soma += Math.floor(Math.random()* lados) + 1;
    }
    return soma;
}

static normalizarAtributos(name){
    if(!name) return null;

    const s = name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLoweCase()
    .replace(/\s+/g,'');

    if(s.includes('forc')) return 'forca';
    if(s.includes('sorte')) return 'sorte';
    if(s.includes('vida')) return 'vida';
    return s;
}

executarTeste(teste)
{
    if(!teste)
    {
        return {sucesso: false,total:0, alvo: 0};

        //descobrir expressao de dados
        const expr = teste.tipo_dado || teste.dados || teste.tipo || teste.dado || '1d6';
        const totalDados = this.rolarExpressao(String(expr));

        //descobrir atributo
        const atributoRaw =teste.atributo || teste.tipo || teste.atributo_nome || null;
        const atributo = jogo.normalizarAtributos(atributoRaw);
        const valorAtributo = atributo ? (this.personagem[atributo] || 0) : 0;
        const total = totalDados + valorAtributo;
        const alvo = parseInt(teste.valor_alvo || teste.alvo || teste.valor || 0,10) || 0;
        const sucesso = alvo ? (total>=alvo) : Boolean(total);

        return {sucesso,total,totalDados,valorAtributo,alvo};
    }

    acharChaveResultado(baseToken) {
        if(!baseToken) return null;
        const normalize = k => k.toString().replace(/\s+/g,'').toUpperCase();
        const target = normalize(baseToken + '_RESULTADO');
        for( const k of Object.keys(this.historia)){
            if(normalize(k) === target) return k;
        }
    }
    return null;
}
}
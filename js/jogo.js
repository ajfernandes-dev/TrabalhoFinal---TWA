import { Personagem } from './personagem.js';
import { rolarExpressao } from './dados.js';

export class Jogo {
    constructor() {
        this.historia = {};
        this.personagem = new Personagem();
        this.ui = null; 
        this.capituloAtual = "1";
    }
    
    // Método para receber a instância da UI/Interface
    setInterface(uiInstance) {
        this.ui = uiInstance;
    }

    async carregarHistoria(url = "historia.json") {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro ao carregar historia.json");
        this.historia = await res.json();
    }

    async iniciar() {
        // Carrega o JSON antes de iniciar a aventura
        await this.carregarHistoria();
        this.irPara("1");
    }
    
    reiniciar() {
        // Cria um novo personagem e volta para o início
        this.personagem = new Personagem();
        this.irPara("1");
    }

    irPara(id) {
        const key = String(id).trim();
        const cap = this.historia[key];

        if (!cap) {
            if (this.ui) this.ui.mostrarMensagem(`Capítulo ${key} não encontrado. FIM INESPERADO.`);
            return;
        }

        // 1. Aplica mudanças de atributo (Capítulo 3, 6, 9, 12_FALHA_ITEM)
        if (cap.atributo_mudanca) {
            this.personagem.aplicarMudancas(cap.atributo_mudanca);
        }

        // 2. Adiciona item (Capítulo 3, 7, 8)
        if (cap.item) {
            this.personagem.adicionarItem(cap.item);
        }
        
        // 3. Remove item (Capítulo 15)
        if (cap.item_removido) { 
            this.personagem.removerItem(cap.item_removido);
        }
        
        // 4. Se o personagem morrer, ir direto para Fim A
        if (this.personagem.vida <= 0 && !cap.final) {
            this.irPara("Fim A");
            return;
        }

        // 5. Renderiza o capítulo
        this.capituloAtual = key;
        if (this.ui) this.ui.renderizarCapitulo(cap, key, this.personagem);
    }
    
    // Método que normaliza nomes de atributos para acessar a classe Personagem
    static normalizarAtributos(name) {
        if (!name) return null;
        return name.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "");
    }

    // Executa a lógica de teste de dado
    executarTeste(teste) {
        const expr = teste.tipo_dado || "1d6";
        const rolagem = rolarExpressao(expr);
        
        const atributoNome = Jogo.normalizarAtributos(teste.atributo);
        const bonus = atributoNome ? (this.personagem[atributoNome] || 0) : 0;
        const total = rolagem + bonus;
        const alvo = Number(teste.valor_alvo) || 0;

        return {
            sucesso: total >= alvo,
            total,
            rolagem,
            bonus,
            alvo,
            atributoNome
        };
    }

    // Chamado pelo botão 'Rolar Dados' na UI
    executarTesteAtual() {
        const cap = this.historia[this.capituloAtual];
        if (!cap || !cap.teste) return;

        const resultado = this.executarTeste(cap.teste);
        const chave = this.acharChaveResultado(this.capituloAtual);

        if (!chave || !this.historia[chave]) {
            this.ui.mostrarMensagem("Erro: Chave de resultado condicional não encontrada no JSON.");
            return;
        }
        
        const destino = resultado.sucesso
            ? this.historia[chave].sucesso
            : this.historia[chave].falha;

        // Avisa a UI para renderizar o resultado do teste e o botão de continuação
        this.ui.mostrarResultadoTeste(
            resultado.rolagem, 
            resultado.bonus, 
            resultado.total, 
            resultado.alvo, 
            resultado.sucesso, 
            destino
        );
    }
    
    // Método para encontrar as chaves condicionais (TESTE_FORCA_RESULTADO)
    acharChaveResultado(id) {
        const alvo = String(id).trim() + "_RESULTADO";
        const normalizado = alvo.replace(/\s+/g, "").toUpperCase();
        
        for (const chave of Object.keys(this.historia)) {
            const normaliza = chave.replace(/\s+/g, "").toUpperCase();
            if (normaliza === normalizado) return chave;
        }
        return null;
    }
}
export class Personagem {
    constructor() {
        this.vida = 10;
        this.forca = 3;
        this.sorte = 3;
        this.inventario = [];
    }

    aplicarMudancas(mudancas) {
        if (mudancas.vida) {
            this.vida += mudancas.vida;
        }
        if (mudancas.forca) {
            this.forca += mudancas.forca;
        }
        if (mudancas.sorte) {
            this.sorte += mudancas.sorte;
        }
        if (this.vida < 0) {
            this.vida = 0; // Impede vida negativa
        }
    }

    adicionarItem(nomeDoItem) {
        if (!this.inventario.includes(nomeDoItem)) {
            this.inventario.push(nomeDoItem);
        }
    }

    removerItem(nomeDoItem) {
        this.inventario = this.inventario.filter(item => item !== nomeDoItem);
    }

    temItem(nomeDoItem) {
        return this.inventario.includes(nomeDoItem);
    }
}
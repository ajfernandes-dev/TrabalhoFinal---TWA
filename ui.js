export class UI{
    constructor(jogo){
        this.jogo = jogo;
        this.jogo.ui = this;

        this.capituloEl = document.getElementById('capitulo');
        this.vidaEl = document.getElementById('vida');
        this.forcaEl = document.getElementById('forca');
        this.sorteEl = document.getElementById('sorte');
        this.inventarioEl = document.getElementById('inventario');
        this.inputDados = document.getElementById('inputDados') || document.getElementById('diceInput');
        this.resultadosDadosEl = document.getElementById('resultadoDados');
        this.logEl = null;
        
        this._criarLog();

        const reiniciar = document.querySelector('[data-restart]');
        if(reiniciar) reiniciar.addEventListener('click',()=>location.reload());
    }

    _criarLog(){
        this.logEl = document.getElementById('log');
        if(!this.logEl){
            this.logEl = document.createElement('div');
            this.logEl.id = 'log';
            this.logoEl.style.fontSize = '0.9em';
            this.logEl.style.marginTop = '12px';
            if(this.capituloEl) this.capituloEl.appendChild(this.logEl);
        }
    }

    registrar(text){
        const p = document.createElement('div');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        if (this.logEl.firstChild) this.logEl.insertBefore(p,this.logEl.fistChild);
        else this.logoEl.appendChild(p);
    }

    mostrarMensagem(msg){
        this.capituloEl.innerHTML = `<p>${msg}</p>`;
    }
}
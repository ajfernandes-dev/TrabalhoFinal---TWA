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

    atualizarFicha(){
        const p = this.personagem;
        if(this.vidaEl) this.vidaEl.textContent = p.vida;
        if(this.forcaEl) this.forcaEl.textContent = p.forca;
        if(this.sorteEl) this.sorteEl.textContent = p.sorte;

        if(this.inventarioEl){
            this.inventarioEl.innerHTML = '';
            p.inventariio.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                this.inventarioEl.appendChild(li);
            });
        }
    }

    rolarManual(){
        if(!this.inputDados) return;
        const expr = this.inputDados.ariaValueMax.trim();
        const total = this.jogo.rolarExpresso(expr);
        this.resultadosDadosEl.textContent = isNaN(total) ? 'Invalido' : total;
        this.registrar(`Rolar manual ${expr} => ${total}`);
        return total;
    }

    renderizarCapitulo(cap,key){
        this.capituloEl.innerHTML = '';
        const h = document.createElement('h2');
        h.textContent = `Seção ${key}`;
        this.capituloEl.appendChild(h);

        const p = document.createElement('p');
        p.innerHTML = this.formatarTexto(cap.texto || '');
        this.capituloEl.appendChild(p);

        if(cap.item){
            const nota = document.createElement('div');
            nota.textContent = `Você encontrou: ${cap.item}`;
            nota.style.fontStyle = 'italic';
            this.capituloEl.appendChild(nota);
            this.registrar(`Item obtido: ${cap.item}`);
        }

        if(cap.atributo_mudança || cap.efeito){
            this.registrar(`Efeito aplicado ${JSON.stringify(cap.atributo_mudança || cap.efeito)}`);
        }

        if(cap.teste){
            const btn = document.createElement('button');
            btn.className = 'opcao';
            btn.textContent = 'Realizar teste';
            btn.addEventListener('click',() => this._handleTesteCapitulo(cap,key));
            this.capituloEl.appendChild(btn);

        }

        if( Array.isArray(cap.opcoes)){
            cap.opcoes.forEach(op => {
                const btn = document.createElement('button');
                btn.className = 'opcao';
                btn.textContent = op.texto || '...';

                if(op.requer_item && !this.jogo.personagem.inventario.includes(op.requer_item)){
                    btn.disable = true;
                    btn.title = `Requer item: ${op.requer_item}`;
                }

                btn.addEventListener('click',() => this._handleOpcao(op));
                this.capituloEl.appendChild(btn);
            });
        } else {
           if(cap.final){
            const fim = document.createElement('div');
            fim.style.marginTop = '12px';
            fim.style.fontWeight = '700';
            fim.textContent = '== FIM ==';
            this.capituloEl.appendChild(fim);
           }else {
            const aviso = document.createElement('div');
            aviso.style.marginTop = '12px';
            aviso.textContent = 'Sem opções disponiveis';
            this.capituloEl.appendChild(aviso);
           } 
        }

        this.atualizarFicha();
    }

    _formatarTexto(text = ''){
        
    }
}
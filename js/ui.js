// js/ui.js (Classe de Manipulação do DOM)

export class UI {
    
    constructor(jogo) {
        this.jogo = jogo;
        this.jogo.ui = this; 

        // Mapeamento dos elementos do DOM
        this.tituloCapitulo = document.getElementById("titulo-capitulo");
        this.textoCapitulo = document.getElementById("historia-texto");
        this.opcoesDiv = document.getElementById("opcoes");
        this.areaInventario = document.getElementById("inventario-lista"); 
        
        this.fichaElementos = {
            vida: document.getElementById("vida-valor"),
            forca: document.getElementById("forca-valor"),
            sorte: document.getElementById("sorte-valor")
        };
        
        this.areaDados = document.getElementById('area-dados');
        this.botaoRolarDado = document.getElementById('botao-rolar-dado');
        this.resultadoDado = document.getElementById('resultado-dado');
        
        // Listener para o botão de rolagem, que chama a lógica no Jogo.js
        if (this.botaoRolarDado) {
            this.botaoRolarDado.addEventListener('click', () => {
                this.jogo.executarTesteAtual();
            });
        }
        
        if (this.areaDados) {
             this.areaDados.style.display = 'none';
        }
    }

    mostrarMensagem(msg) {
        console.warn(msg);
        alert(msg);
    }
    
    mostrarResultadoTeste(rolagem, bonus, total, alvo, sucesso, destino) {
        if (!this.resultadoDado || !this.opcoesDiv) return;

        const bonusTexto = bonus > 0 ? ` + ${bonus} (Bônus)` : '';
        
        this.resultadoDado.innerHTML = `
            Rolagem: ${rolagem}${bonusTexto} = **${total}** (Alvo: ${alvo})<br>
            Resultado: <strong style="color: ${sucesso ? 'green' : 'red'};">${sucesso ? 'SUCESSO' : 'FALHA'}!</strong>
        `;
        
        this.opcoesDiv.innerHTML = '';
        const btn = document.createElement('button');
        btn.textContent = `Continuar a Aventura`;
        btn.addEventListener('click', () => {
            this.jogo.irPara(destino);
            this.resultadoDado.textContent = 'Clique no botão para rolar o dado.';
        });
        this.opcoesDiv.appendChild(btn);
    }

    renderizarCapitulo(capitulo, id, personagem) {
        // ESSENCIAL: Garante que os elementos principais existem
        if (!this.tituloCapitulo || !this.textoCapitulo || !this.opcoesDiv) {
            console.error("Erro de renderização: Elementos DOM não encontrados!");
            return;
        }

        this.tituloCapitulo.textContent = capitulo.titulo || `Capítulo ${id}`;
        this.textoCapitulo.innerHTML = capitulo.texto;
        this.opcoesDiv.innerHTML = "";
        
        this.areaDados.style.display = capitulo.teste ? 'block' : 'none';

        if (capitulo.final) {
            const btn = document.createElement('button');
            btn.textContent = 'FIM DA AVENTURA. Clique para Reiniciar.';
            btn.addEventListener('click', () => this.jogo.reiniciar());
            this.opcoesDiv.appendChild(btn);
            this.atualizarFicha(personagem);
            return;
        }

        capitulo.opcoes.forEach((op, index) => {
            const btn = document.createElement("button");
            btn.textContent = `${index + 1}. ${op.texto}`; 
            
            const itemNecessario = op.requer_item && !personagem.temItem(op.requer_item);
            if (itemNecessario) {
                btn.disabled = true;
                btn.style.opacity = "0.6";
                btn.title = `Opção requer: ${op.requer_item}`;
            }

            btn.onclick = () => {
                if (String(op.vaiPara).trim().includes("TESTE")) {
                     this.areaDados.style.display = 'block';
                     this.resultadoDado.textContent = 'Teste pronto! Clique no botão "Realizar Rolagem" para continuar.';
                     return; 
                }
                
                if (op.requer_item) {
                     if (personagem.temItem(op.requer_item)) {
                         this.jogo.irPara(op.vaiPara);
                     } else {
                         // Fallback para falha (se houver no JSON)
                         this.jogo.irPara("12_FALHA_ITEM"); 
                     }
                     return;
                }
                
                this.jogo.irPara(op.vaiPara);
            }

            this.opcoesDiv.appendChild(btn);
        });

        this.atualizarFicha(personagem);
    }

    atualizarFicha(personagem) {
        if (!this.fichaElementos.vida || !this.areaInventario) return;
        
        this.fichaElementos.vida.textContent = personagem.vida;
        this.fichaElementos.forca.textContent = personagem.forca;
        this.fichaElementos.sorte.textContent = personagem.sorte;

        this.areaInventario.innerHTML = "";
        const inventario = personagem.inventario;
        if (inventario.length === 0) {
             const li = document.createElement("li");
             li.textContent = "(Vazio)";
             this.areaInventario.appendChild(li);
        } else {
             inventario.forEach(item => {
                 const li = document.createElement("li");
                 li.textContent = item;
                 this.areaInventario.appendChild(li);
             });
        }
    }
}
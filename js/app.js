// js/app.js - Rastreamento de Erros

import { Jogo } from './jogo.js';
import { UI } from './ui.js'; 

const jogo = new Jogo();

async function boot() {
    
    const ui = new UI(jogo); 
   
    jogo.setInterface(ui); 

    try {
        
        await jogo.iniciar(); 
        

        
    } catch (err) {
        
        if (ui) ui.mostrarMensagem('Erro ao carregar a história. Verifique o console.');
    }
}

boot();
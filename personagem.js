export class Personagem{
    constructor(){
        this.vida = 10;
        this.force = 5;
        this.sorte = 4;
        this.inventario = [];
    }

    adicionarItem(item){
        if(!item) return;
        if(!this.inventario.includes(item)){
            this.inventario.push(item);
        }
    }

    removerItem(item){
        const idx = this.inventario.indexOf(item);
        if (idx !== -1)
            this.inventario.splice(idx,1);
    }

    aplicarMudanças(obj = {}){
        if(obj.vida){
            this.vida += obj.vida;
        }
        if(obj.forca){
            this.forca += obj.forca;
        }
        if(obj.sorte){
            this.sorte += obj.sorte;
        }
        if(obj.item)this.adicionarItem(obj.item);

        if(obj.removerItem) this.removerItem(obj.removerItem);
    }
}
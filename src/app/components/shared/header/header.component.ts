import { Component, OnInit } from '@angular/core';
import { Opcion, OpcionesMenuService } from 'src/app/services/opciones-menu.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})

export class HeaderComponent implements OnInit {

    optsMenu : Opcion[] = [];
    hashPathDefault : string;
    constructor( private _opcionesMenuService : OpcionesMenuService ) {
        this.hashPathDefault = window.location.hash;
    }

    urlImg: string;
    ngOnInit(): void {
        this.urlImg = '../../../assets/img/default.png'
        
        this.optsMenu = this._opcionesMenuService.getOptsMenu();
    }
    
    activeOptMenu(menu, opcion) {
        for (let i = 0; i < menu.children.length; i++) {
            menu.children[i].children[0].classList.remove("bg-light");
        }
        opcion.classList.add('bg-light');
    }
}
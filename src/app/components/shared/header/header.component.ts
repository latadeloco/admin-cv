import { Component, OnInit } from '@angular/core';
import { Opcion, OpcionesMenuService } from 'src/app/services/opciones-menu.service';
import { AppComponent } from "../../../app.component";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})

export class HeaderComponent implements OnInit {
    optsMenu : Opcion[] = [];
    hashPathDefault : string;

    /**
     * Constructor del componente
     * @param _opcionesMenuService Parámetro necesario para recoger las opciones del menú
     */
    constructor( private _opcionesMenuService : OpcionesMenuService ) {
        this.hashPathDefault = window.location.hash;
    }
    urlImg: string;

    /**
     * Método de iniciación del componente
     */
    ngOnInit(): void {
        this.urlImg = '../../../assets/img/default.png'
        
        this.optsMenu = this._opcionesMenuService.getOptsMenu();
    }
    
    /**
     * Método para cambiar y resaltar la opción de menú activa
     * @param menu Recoge el selector del templateUrl para recoger el formulario
     * @param opcion Recoge la opción (el hash) y añade una clase para cambiar su visualización
     */
    activeOptMenu(menu, opcion) {
        for (let i = 0; i < menu.children.length; i++) {
            menu.children[i].children[0].classList.remove("bg-light");
        }
        opcion.classList.add('bg-light');
    }
}
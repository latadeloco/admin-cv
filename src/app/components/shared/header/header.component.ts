import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Opcion, OpcionesMenuService } from 'src/app/services/opciones-menu.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
     * @param usuarioService Parámetro para ver si el usuario tiene el token activo en el navegador
     * @param router Parámetro para redireccionar en caso de token KO
     */
    constructor( 
        private _opcionesMenuService : OpcionesMenuService,
        private usuarioService : UsuarioService,
        private router: Router
         ) {
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

    /**
     * Cerrar sesión, se pregunta por el token y en caso de que lo tenga lo elimina y lo redirecciona a iniciar-sesión.
     */
    logOut() {
        if (this.usuarioService.getUserToken()) {
            localStorage.removeItem('user-token');
        }

        this.router.navigateByUrl('/iniciar-sesion');
    }

    /**
     * Hacer que el navegador sea fullScreen (pantalla completa)
     */
    fullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
            document.exitFullscreen(); 
            }
        }
    }
}
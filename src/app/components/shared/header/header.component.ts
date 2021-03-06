import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { Opcion, OpcionesMenuService } from 'src/app/services/opciones-menu.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})

export class HeaderComponent implements OnInit {
    optsMenu : Opcion[] = [];
    hashPathDefault : string;
    urlImg: string;
    nombreUsuario = null;
    puestoUsuario = null;
    cargado : boolean = false;

    /**
     * Constructor del componente
     * @param _opcionesMenuService Parámetro necesario para recoger las opciones del menú
     * @param usuarioService Parámetro para ver si el usuario tiene el token activo en el navegador
     * @param datosPersonalesService Parámetro para ver si el usuario tiene imagen de perfil
     * @param router Parámetro para redireccionar en caso de token KO
     */
    constructor( 
        private _opcionesMenuService : OpcionesMenuService,
        private usuarioService : UsuarioService,
        private datosPersonalesService : DatosPersonalesService,
        private router: Router,
         ) {
        this.hashPathDefault = window.location.hash;

        this.urlImg = '../../../assets/img/default.png';
        
        if (window.location.hash !== '#/iniciar-sesion') {
            datosPersonalesService.getDatosPersonales().toPromise().then(datosPersonales => {
                if (datosPersonales[0] !== undefined) {
                    this.nombreUsuario = datosPersonales[0]['nombre'] + " " + datosPersonales[0]['apellidos'];
                    this.puestoUsuario = datosPersonales[0]['puesto'];
                    this.cargado = true;
                }
            })

            this.datosPersonalesService.getImagenPerfil().toPromise().then(imagenPefilDetectada => {
                if (imagenPefilDetectada['imagenNotFound'] == undefined) this.urlImg = '../../../assets/img/default.png';
                if (imagenPefilDetectada['perfilExiste'] == true) this.urlImg = '../../../assets/img/perfil.'+ imagenPefilDetectada['extension'];
            });
        }
    }

    /**
     * Método de iniciación del componente
     */
    ngOnInit(): void {   
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

    /**
     * Quitar cuando se máximiza el menú en móvil
     */
    toogleFullAndLogOut() {
        var sidebar = document.getElementById('sidebar');

        if(!sidebar.classList.contains('active') && screen.width < 600) {
            document.getElementById('fullscreen').style.display = "none";
            document.getElementById('logOutIcon').style.display = "none";
        } else if(sidebar.classList.contains('active') && screen.width < 600) {
            document.getElementById('fullscreen').style.display = "inherit";
            document.getElementById('logOutIcon').style.display = "inherit";
        }
    }
}
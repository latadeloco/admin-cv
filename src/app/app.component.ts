import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin-cv';
  constructor() {
  }

}

export class Shared {

  /**
   * Constructor de la clase Shared
   */
  constructor() {
    this.visualizacion();
  }

  /**
   * Método en el cuál el contenido ve el hash actual y modifica si debe aparecer el Header y Footer.
   * Método utilizado para parametrizar la pantalla de inicio de sesión y las pantallas internas una vez hecho el logueo el usuario.
   */
  visualizacion() {
    var header = document.getElementById('header-app');
    var footer = document.getElementById('footer-app');
    var body = document.getElementById('body');
    var contenido = document.getElementsByClassName('contenido-router-outlet')[0];

    if (window.location.hash == '#/iniciar-sesion') {
      header.classList.add('invisible');
      footer.classList.add('invisible');
      body.classList.add('login');
      contenido.classList.remove('page-content');
    } else {
      header.classList.remove('invisible');
      footer.classList.remove('invisible');
      body.classList.remove('login');

      contenido.classList.add('page-content');
    }
  }
}

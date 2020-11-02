import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  year : number;
  derechos : string;
  website : string;

  /**
   * Constructor del componente
   * Se le añade el año, derechos y la URL de redirección el en Footer de la app
   */
  constructor() {
    this.year =  new Date().getFullYear();
    this.derechos = " | Todos los derechos reservados" + " © " + this.year;
    this.website = "http://www.jesusrs.site";
  }
}

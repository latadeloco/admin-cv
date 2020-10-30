import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  year : number;
  derechos : string;
  website : string;

  constructor() {
    this.year =  new Date().getFullYear();
    this.derechos = " | Todos los derechos reservados" + " © " + this.year;
    this.website = "http://www.jesusrs.site";
  }

  ngOnInit(): void {
  }

}

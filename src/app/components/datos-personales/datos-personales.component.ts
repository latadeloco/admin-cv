import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Shared } from 'src/app/app.component';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  
  @Output() cambiarVisualizacion: EventEmitter<Shared>

  constructor() {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared())
  }

  ngOnInit(): void {
    
  }

}

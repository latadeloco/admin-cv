import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Shared } from 'src/app/app.component';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>

  constructor() {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared())
  }

  ngOnInit(): void {
  }

}

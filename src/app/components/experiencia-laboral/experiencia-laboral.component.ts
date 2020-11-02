import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Shared } from 'src/app/app.component';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.css']
})
export class ExperienciaLaboralComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>

  /**
   * Constructor del componente
   */
  constructor() {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared())
  }

  ngOnInit(): void {
  }

}

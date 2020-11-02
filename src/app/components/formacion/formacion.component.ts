import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Shared } from 'src/app/app.component';

@Component({
  selector: 'app-formacion',
  templateUrl: './formacion.component.html',
  styleUrls: ['./formacion.component.css']
})
export class FormacionComponent implements OnInit {

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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Shared } from 'src/app/app.component';

@Component({
  selector: 'app-objetivos-profesionales',
  templateUrl: './objetivos-profesionales.component.html',
  styleUrls: ['./objetivos-profesionales.component.css']
})
export class ObjetivosProfesionalesComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>

  constructor() {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared())
  }

  ngOnInit(): void {
  }

}

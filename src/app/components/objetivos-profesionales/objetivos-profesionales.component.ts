import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
import { ObjetivoProfesionalService } from 'src/app/services/objetivo-profesional.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-objetivos-profesionales',
  templateUrl: './objetivos-profesionales.component.html',
  styleUrls: ['./objetivos-profesionales.component.css']
})
export class ObjetivosProfesionalesComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>
  objetivosProfesionales = new Array();

  constructor(
    private objetivoProfesionalService : ObjetivoProfesionalService,
    private toast : ToastService,
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.objetivoProfesionalForm();
  }

  ngOnInit(): void {
  }

  objetivoProfesionalForm(){
    this.objetivoProfesionalService.getObjetivosProfesionales().toPromise().then(respuestaObjetivoProfesional => {
      this.objetivosProfesionales.push(respuestaObjetivoProfesional);
    })
  }

  eliminarObjetivoProfesional(idObjetivoProfesional) {
    this.objetivoProfesionalService.removeObjetivoProfesional(idObjetivoProfesional).toPromise().then(respuestaRemoveObjetivoProfesional => {
      if (respuestaRemoveObjetivoProfesional['responseOK'] != undefined) {
        this.toast.showSuccess(respuestaRemoveObjetivoProfesional['responseOK'], 1500);
        window.location.reload();
      } else if (respuestaRemoveObjetivoProfesional['responseKO'] != undefined) {
        this.toast.showDanger(respuestaRemoveObjetivoProfesional['responseKO'], 1500);
      } else {
        this.toast.showDanger("Error desconocido", 1500);
      }
    })
  }
}

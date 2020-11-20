import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
import { ObjetivoProfesionalService } from 'src/app/services/objetivo-profesional.service';
import { ReusableService } from 'src/app/services/reusable.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-objetivos-profesionales',
  templateUrl: './objetivos-profesionales.component.html',
  styleUrls: ['./objetivos-profesionales.component.css']
})
export class ObjetivosProfesionalesComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>
  objetivosProfesionales = new Array();

  /**
   * Constructor del componente
   * @param objetivoProfesionalService servicio necesario para llamadas a API
   * @param toast servicio de alertas
   * @param reusableService servicio necesario para redireccionamientos
   */
  constructor(
    private objetivoProfesionalService : ObjetivoProfesionalService,
    private toast : ToastService,
    private reusableService : ReusableService
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.objetivoProfesionalForm();
  }

  /**
   * Inicio del componente
   */
  ngOnInit(): void {
  }

  /**
   * Inicio de formulario
   */
  objetivoProfesionalForm(){
    this.objetivoProfesionalService.getObjetivosProfesionales().toPromise().then(respuestaObjetivoProfesional => {
      this.objetivosProfesionales.push(respuestaObjetivoProfesional);
    })
  }

  /**
   * Eliminar objetivo profesional
   * @param idObjetivoProfesional id del objetivo profesional a eliminar
   */
  eliminarObjetivoProfesional(idObjetivoProfesional) {
    this.objetivoProfesionalService.removeObjetivoProfesional(idObjetivoProfesional).toPromise().then(respuestaRemoveObjetivoProfesional => {
      if (respuestaRemoveObjetivoProfesional['responseOK'] != undefined) {
        this.toast.showSuccess(respuestaRemoveObjetivoProfesional['responseOK'], 1500);
      } else if (respuestaRemoveObjetivoProfesional['responseKO'] != undefined) {
        this.toast.showDanger(respuestaRemoveObjetivoProfesional['responseKO'], 1500);
      } else {
        this.toast.showDanger("Error desconocido", 1500);
      }

      this.reusableService.redirectTo('objetivos-profesionales');
    })
  }
}

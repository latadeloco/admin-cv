import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
import { ObjetivoProfesionalService } from 'src/app/services/objetivo-profesional.service';
import { ReusableService } from 'src/app/services/reusable.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-update-objetivos-profesionales',
  templateUrl: './update-objetivos-profesionales.component.html',
})
export class UpdateObjetivosProfesionalesComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>;
  objetivoProfesionalGroup : FormGroup;
  routeParams;
  cargado : boolean = false;
  reusable;

  /**
   * Constructor del componente
   * @param formBuilder constructor del formulario reactivo
   * @param objetivoProfesionalService servicio necesario para llamadas a API
   * @param toast servicio de alertas
   * @param activeRoute argumento necesario para obtener la ID
   * @param reusableService servicio de redirección
   */
  constructor(
    private formBuilder : FormBuilder,
    private objetivoProfesionalService : ObjetivoProfesionalService,
    private toast : ToastService,
    private activeRoute : ActivatedRoute,
    private reusableService : ReusableService
  ) {
    this.reusable = reusableService;
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.routeParams = this.activeRoute.snapshot.params['id'];
    this.objetivoProfesionalForm();
  }

  /**
   * Inicio de componente
   */
  ngOnInit(): void {
  }

  /**
   * Inicio del formulario
   */
  objetivoProfesionalForm() {
    this.objetivoProfesionalService.getObjetivoProfesional(this.routeParams).toPromise().then(respuestaObjetivoProfesionalID => {
      this.objetivoProfesionalGroup = this.formBuilder.group({
        objetivoProfesional : [respuestaObjetivoProfesionalID[0]['objetivo_profesional'], [Validators.required]]
      });
      this.cargado = true;
    })
  }

  /**
   * Actualizar el formulario
   */
  updateObjetivoProfesional() {
    if (this.objetivoProfesionalGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.objetivoProfesionalGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.objetivoProfesionalService.updateObjetivoProfesional(this.objetivoProfesionalGroup.value, this.routeParams).toPromise().then(respuestaUpdateObjetivoProfesional => {
        if (respuestaUpdateObjetivoProfesional['responseOK'] != undefined) {
          this.toast.showSuccess(respuestaUpdateObjetivoProfesional['responseOK'], 1500);
          this.reusableService.redirectTo('objetivos-profesionales');
        } else if (respuestaUpdateObjetivoProfesional['responseKO'] != undefined) {
          this.toast.showDanger(respuestaUpdateObjetivoProfesional['responseKO'], 1500);
        } else {
          this.toast.showDanger("Error desconocido", 1500);
        }
      })
    }
  }
}

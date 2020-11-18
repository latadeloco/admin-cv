import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
import { ObjetivoProfesionalService } from 'src/app/services/objetivo-profesional.service';
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

  constructor(
    private formBuilder : FormBuilder,
    private objetivoProfesionalService : ObjetivoProfesionalService,
    private toast : ToastService,
    private activeRoute : ActivatedRoute,
    private router : Router
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.routeParams = this.activeRoute.snapshot.params['id'];
    this.objetivoProfesionalForm();
  }

  ngOnInit(): void {
  }

  objetivoProfesionalForm() {
    this.objetivoProfesionalService.getObjetivoProfesional(this.routeParams).toPromise().then(respuestaObjetivoProfesionalID => {
      this.objetivoProfesionalGroup = this.formBuilder.group({
        objetivoProfesional : [respuestaObjetivoProfesionalID[0]['objetivo_profesional'], [Validators.required]]
      });
      this.cargado = true;
    })
  }

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
          setTimeout(() => {
            this.router.navigateByUrl('objetivos-profesionales');
          }, 1450);
        } else if (respuestaUpdateObjetivoProfesional['responseKO'] != undefined) {
          this.toast.showDanger(respuestaUpdateObjetivoProfesional['responseKO'], 1500);
        } else {
          this.toast.showDanger("Error desconocido", 1500);
        }
      })
    }
  }

  /**
   * Validador de campos dinámico
   * @param formControl control dentro del formulario html
   */
  getValidateFormControl(formControl): boolean {
    return this.objetivoProfesionalGroup.get(formControl).invalid && this.objetivoProfesionalGroup.get(formControl).touched;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObjetivoProfesionalService } from 'src/app/services/objetivo-profesional.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-objetivos-profesionales',
  templateUrl: './add-objetivos-profesionales.component.html',
})
export class AddObjetivosProfesionalesComponent implements OnInit {

  objetivoProfesionalGroup : FormGroup;

  constructor(
    private formBuilder : FormBuilder,
    private objetivoProfesionalService : ObjetivoProfesionalService,
    private toast : ToastService
  ) {
    this.objetivoProfesionalForm();
  }

  ngOnInit(): void {
  }

  objetivoProfesionalForm() {
    this.objetivoProfesionalGroup = this.formBuilder.group({
      objetivoProfesional : ['', [Validators.required]]
    });
  }

  saveObjetivoProfesionalForm() {
    if (this.objetivoProfesionalGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.objetivoProfesionalGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.objetivoProfesionalService.addObjetivoProfesional(this.objetivoProfesionalGroup.value).toPromise().then(respuestaObjetivoProfesional => {
        if (respuestaObjetivoProfesional['responseOK'] != undefined) {
          this.toast.showSuccess(respuestaObjetivoProfesional['responseOK'], 1500);
        } else if (respuestaObjetivoProfesional['responseKO'] != undefined) {
          this.toast.showDanger(respuestaObjetivoProfesional['responseKO'], 1500);
        } else {
          this.toast.showSuccess("Error desconocido", 1500);
        }

        setTimeout(() => {
          window.location.reload();
        }, 1450);
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

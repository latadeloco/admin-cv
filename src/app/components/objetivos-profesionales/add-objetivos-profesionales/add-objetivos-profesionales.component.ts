import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
import { ObjetivoProfesionalService } from 'src/app/services/objetivo-profesional.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-objetivos-profesionales',
  templateUrl: './add-objetivos-profesionales.component.html',
})
export class AddObjetivosProfesionalesComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>
  objetivoProfesionalGroup : FormGroup;

  /**
   * Constructor del componente
   * @param formBuilder constructor de formulario reactivo
   * @param objetivoProfesionalService servicio necesario para llamadas a API
   * @param toast servicio de alertas
   * @param router argumento para redireccionamiento
   */
  constructor(
    private formBuilder : FormBuilder,
    private objetivoProfesionalService : ObjetivoProfesionalService,
    private toast : ToastService,
    private router : Router
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.objetivoProfesionalForm();
  }

  /**
   * Inicio de componente
   */
  ngOnInit(): void {
  }

  /**
   * Iniciar formulario
   */
  objetivoProfesionalForm() {
    this.objetivoProfesionalGroup = this.formBuilder.group({
      objetivoProfesional : ['', [Validators.required]]
    });
  }

  /**
   * Guardar objetivo profesional
   */
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

        this.redirectTo('objetivos-profesionales/add-objetivo-profesional');
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

  /**
   * Redireccionar
   * @param uri url a redireccionar
   */
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
}

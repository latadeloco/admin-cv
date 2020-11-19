import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shared } from 'src/app/app.component';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
})
export class DatosPersonalesComponent implements OnInit {
  
  @Output() cambiarVisualizacion: EventEmitter<Shared>
  datosPersonalesGroup: FormGroup;
  fileUpload: File;

  
  constructor(
    private formBuilder: FormBuilder,
    private datosPersonalesService : DatosPersonalesService,
    private toast : ToastService
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());
    this.datosPersonalesForm();
  }

  
  ngOnInit(): void {
    this.cargarDatosADatosPersonalesForm();
  }

  subirImagenServer(files) {
    this.fileUpload = files;

    let formData = new FormData();
    formData.append("imagen", this.fileUpload[0], this.fileUpload[0].name);

    this.datosPersonalesService.getDatosPersonales().toPromise().then(datosPersonales => {
      if (datosPersonales[0] == undefined) {
        this.updateOInsertImagenPerfil(false, formData);
      } else {
        this.updateOInsertImagenPerfil(true, formData);
      }
    })
  }

  updateOInsertImagenPerfil(updateOInsert: boolean, formData: FormData) {
    this.datosPersonalesService.setTieneImagenPerfil(updateOInsert).toPromise().then(_ => {
      this.datosPersonalesService.setSubirImagenPerfil(formData).toPromise().then(respuesta => {
        console.log(respuesta);
      });
    })
  }

  getValidateFormControl(formControl): boolean {
    return this.datosPersonalesGroup.get(formControl).invalid && this.datosPersonalesGroup.get(formControl).touched;
  }

  datosPersonalesForm() {
    this.datosPersonalesGroup = this.formBuilder.group({
      nombre             : ['', [Validators.required, Validators.maxLength(50)]],
      apellidos          : ['', [Validators.required, Validators.maxLength(60)]],
      puesto             : ['', [Validators.required, Validators.maxLength(100)]],
      nacimiento         : ['', Validators.required],
      telefono           : ['', [Validators.required, Validators.min(100000000), Validators.max(999999999999)]],
      email              : ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9._]+\.[a-z]{2,3}$')]],
      direccion          : ['', [Validators.required, Validators.maxLength(100)]],
      poblacion          : ['', [Validators.required, Validators.maxLength(50)]],
      provincia          : ['', [Validators.required, Validators.maxLength(20)]],
      codigoPostal       : [, [Validators.required, Validators.max(9999999999)]],
      descripcionBreve   : ['', []],
      descripcionSobreMi : ['', []]
    });
  }

  cargarDatosADatosPersonalesForm() {
    this.datosPersonalesService.getDatosPersonales().toPromise().then(datosPersonales => {
      if (datosPersonales[0] != undefined) {
        var fechaNacimiento = datosPersonales[0]['fecha_nacimiento'] == null ? '' : datosPersonales[0]['fecha_nacimiento'];
  
        if (fechaNacimiento != null) {
          var date = new Date(fechaNacimiento);
          fechaNacimiento = date.getFullYear() + '-' + 
                            ((date.getUTCMonth()+1) < 10 ? '0'+(date.getUTCMonth()+1) : date.getUTCMonth()+1) + '-' + 
                            ((date.getUTCDate()+1) < 10 ? '0'+(date.getUTCDate()+1) : (date.getUTCDate()+1));
        }
  
        this.datosPersonalesGroup.setValue({
          nombre             : datosPersonales[0]['nombre'] == null ? '' : datosPersonales[0]['nombre'],
          apellidos          : datosPersonales[0]['apellidos'] == null ? '' : datosPersonales[0]['apellidos'],
          puesto             : datosPersonales[0]['puesto'] == null ? '' : datosPersonales[0]['puesto'],
          nacimiento         : fechaNacimiento,
          telefono           : datosPersonales[0]['telefono'] == null ? '' : datosPersonales[0]['telefono'],
          email              : datosPersonales[0]['email'] == null ? '' : datosPersonales[0]['email'],
          direccion          : datosPersonales[0]['direccion'] == null ? '' : datosPersonales[0]['direccion'],
          poblacion          : datosPersonales[0]['poblacion'] == null ? '' : datosPersonales[0]['poblacion'],
          provincia          : datosPersonales[0]['provincia'] == null ? '' : datosPersonales[0]['provincia'],
          codigoPostal       : datosPersonales[0]['codigo_postal'] == null ? '' : datosPersonales[0]['codigo_postal'], 
          descripcionBreve   : datosPersonales[0]['descripcion_breve'] == null ? '' : datosPersonales[0]['descripcion_breve'],
          descripcionSobreMi : datosPersonales[0]['descripcion_sobre_mi'] == null ? '' : datosPersonales[0]['descripcion_sobre_mi']
        });
      }
    });
  }

  saveDatosPersonalesForm() {
    if (this.datosPersonalesGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.datosPersonalesGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.datosPersonalesService.getDatosPersonales().toPromise().then(datosPersonales => {
        if (datosPersonales[0] == undefined || datosPersonales == null) {
          this.datosPersonalesService.setDatosPersonales(this.datosPersonalesGroup.value).toPromise().then(respuestaDatosPersonales => {
            if (respuestaDatosPersonales['responseKO'] == undefined) {
              this.toast.showSuccess(respuestaDatosPersonales['responseOK'], 3000);
            } else {
              this.toast.showDanger(respuestaDatosPersonales['responseKO'], 3000);
            }
          })
        } else {
          this.datosPersonalesService.setUpdateDatosPersonales(this.datosPersonalesGroup.value).toPromise().then(respuestaActualizadoDatosPersonales => {
            if (respuestaActualizadoDatosPersonales['responseKO'] == undefined) {
              this.toast.showSuccess(respuestaActualizadoDatosPersonales['responseOK'], 3000);
            } else {
              this.toast.showDanger(respuestaActualizadoDatosPersonales['responseKO'], 3000);
            }
          })
        }
      });
    }
  }
}

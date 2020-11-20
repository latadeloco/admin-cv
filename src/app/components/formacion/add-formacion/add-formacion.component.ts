import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Shared } from 'src/app/app.component';
import { FormacionService } from 'src/app/services/formacion.service';
import { ReusableService } from 'src/app/services/reusable.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidadoresService } from 'src/app/services/validadores.service';

@Component({
  selector: 'app-add-formacion',
  templateUrl: './add-formacion.component.html',
})
export class AddFormacionComponent implements OnInit {
  
  @ViewChild('content', {static: true}) content: ElementRef;
  @ViewChild('contentCertificate', {static: true}) contentCertificate: ElementRef;
  @Output() cambiarVisualizacion: EventEmitter<Shared>
  formacionGroup : FormGroup
  fileUpload: File;
  reusable;

  /**
   * Constructor del componente Añadir Formación
   * @param formBuilder Constructor de formulario reactivo
   * @param toast Alerta en caso afirmativo o negativo
   * @param formacionService Servicio necesario para llamadas a API
   * @param validadores Servicio necesario para validar las fechas de inicio y fin
   * @param modal Modal para aprobación o denegación de certificado
   * @param router Necesario para la redirección
   * @param config Configuración del modal
   * @param reusableService servicio necesario para reutilización
   */
  constructor(
    private formBuilder: FormBuilder,
    private toast : ToastService,
    private formacionService : FormacionService,
    private validadores : ValidadoresService,
    private modal : NgbModal,
    private router : Router,
    config: NgbModalConfig,
    private reusableService : ReusableService
  ) {
    this.reusable = this.reusableService;
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    config.backdrop = 'static'; 
    config.keyboard = false;

    this.formacionForm();
  }

  /**
   * Inicio del componente
   */
  ngOnInit(): void {
  }

  /**
   * Necesario para identificar todos los campos del formulario reactivo
   */
  formacionForm() {
    this.formacionGroup = this.formBuilder.group({
      nombreTitulacion  : ['', [Validators.required, Validators.maxLength(100)]],
      nombreInstitucion : ['', [Validators.maxLength(100)]],
      fechaInicio       : [''],
      fechaFin          : [''],
      certificacion     : [false],
      descripcion       : ['']
    }, {validators : this.validadores.validatorDate('fechaInicio', 'fechaFin')});
  }

  /**
   * Guardar la información del formulario después del modal
   */
  saveFormacionForm() {
    if (this.formacionGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.formacionGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.modal.open(this.content, { centered: true });
    }
  }

  /**
   * Guardar la información del formulario
   * @param valor valor si tiene certificado o no
   */
  saveDefinitelyFormacion(valor: boolean) {
    this.formacionGroup.value['certificacion'] = valor;
    this.modal.dismissAll();
    if (valor) {
      this.modal.open(this.contentCertificate, { centered: true });
    } else if (!valor) {
      this.addFormacion(null)
    }
  }

  /**
   * Subir certificado
   * @param files certificado PDF
   */
  subirCertificado(files) {
    this.fileUpload = files;

    let formData = new FormData();
    formData.append("certificado", this.fileUpload[0], this.fileUpload[0].name);

    this.addFormacion(formData);
  }

  /**
   * Añadir certificado
   * @param formData file de PDF
   */
  private addFormacion(formData?: FormData) {
    if (formData == null) {
      this.formacionService.addFormacion(this.formacionGroup.value).toPromise().then(respuestaFormacion => {
        if (respuestaFormacion['responseOK'] != undefined) {
          this.toast.showSuccess(respuestaFormacion['responseOK'], 3000);
          this.router.navigateByUrl('formacion');
        } else {
          this.toast.showDanger(respuestaFormacion['responseKO'], 3000);
          this.router.navigateByUrl('add-formacion');
        }
        this.router.navigateByUrl('formacion');
      });
    } else {
      this.formacionService.addFormacion(this.formacionGroup.value).toPromise().then(respuestaFormacion =>{
        if (respuestaFormacion['responseOK'] != undefined) {
          this.formacionService.uploadCertificate(formData).toPromise().then(respuestaUploadCertificate => {
            this.router.navigateByUrl('formacion');
          })
        } else {
          this.toast.showDanger(respuestaFormacion['responseKO'], 3000);
          this.router.navigateByUrl('add-formacion');
        }
        this.router.navigateByUrl('formacion');
      })
      
    }
  }
}

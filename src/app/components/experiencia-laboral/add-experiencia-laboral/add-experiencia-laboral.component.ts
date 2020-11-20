import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Shared } from 'src/app/app.component';
import { ExperienciaLaboralService } from 'src/app/services/experiencia-laboral.service';
import { ReusableService } from 'src/app/services/reusable.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidadoresService } from 'src/app/services/validadores.service';

@Component({
  selector: 'app-add-experiencia-laboral',
  templateUrl: './add-experiencia-laboral.component.html',
  styleUrls: ['./add-experiencia-laboral.component.css']
})
export class AddExperienciaLaboralComponent implements OnInit {

  @ViewChild('content', {static: true}) content: ElementRef;
  @Output() cambiarVisualizacion: EventEmitter<Shared>;
  experienciaLaboralGroup : FormGroup;
  fileUpload : File;
  reusable;

  /**
   * Constructor del componente
   * @param formBuilder constructor necesario para el formulario reactivo
   * @param toast servicio de alertas
   * @param experienciaLaboralServive servicio necesario para las llamadas a la API
   * @param validadores servicio que valida las fechas
   * @param modal componente necesario para el modal de subida de archivo
   * @param router argumento necesario para la redirección
   * @param config configuración de modales
   * @param reusableService servicio necesario para reutilizar funciones
   */
  constructor(
    private formBuilder : FormBuilder,
    private toast : ToastService,
    private experienciaLaboralServive : ExperienciaLaboralService,
    private validadores : ValidadoresService,
    private modal : NgbModal,
    private router : Router,
    config : NgbModalConfig,
    private reusableService : ReusableService
  ) {
    this.reusable = this.reusableService;
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    config.backdrop = 'static';
    config.keyboard = false;


    this.experienciaLaboralForm();
  }

  /**
   * Inicia el componente
   */
  ngOnInit(): void {
  }

  /**
   * Recoge los argumentos del formulario y los valida
   */
  experienciaLaboralForm() {
    this.experienciaLaboralGroup = this.formBuilder.group({
      nombreEmpresa : ['', [Validators.required]],
      nombrePuesto : ['', [Validators.required]],
      funcionesPuesto : [''],
      fechaInicio : [''],
      fechaFin : [''],
      cronologia : [''],
      observaciones : ['']
    }, {validators : this.validadores.validatorDate('fechaInicio', 'fechaFin')})
  }

  /**
   * Guardar la información del formulario después del modal
   */
  saveExperienciaLaboralForm() {
    if (this.experienciaLaboralGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.experienciaLaboralGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.experienciaLaboralServive.addExperienciaLaboral(this.experienciaLaboralGroup.value).toPromise().then(respuestaSubidaExperienciaLaboral => {
        if (respuestaSubidaExperienciaLaboral['responseOK'] !== undefined) {
          this.toast.showSuccess(respuestaSubidaExperienciaLaboral['responseOK'], 3000);
        } else if (respuestaSubidaExperienciaLaboral['responseKO'] !== undefined) {
          this.toast.showDanger(respuestaSubidaExperienciaLaboral['responseKO'], 3000);
        } else {
          this.toast.showDanger("¡Error desconocido!", 3000);
        }
      }).finally(() => {
        this.modal.open(this.content, { centered: true });
      });
    }
  }

  /**
   * Parametrización del modal donde se pregunta por el logotipo de la empresa
   * @param item argumento necesario para mostrar según que pestaña del modal
   */
  displayTab(item) {
    let formularioPorId = document.getElementById('formularioSubirLogotipoExperiencia');
    let tabs = document.getElementsByClassName('uploadLogo');
    for (let i = 0; i < formularioPorId.children.length; i++) {
      if (formularioPorId.children[i].localName === 'div') 
        formularioPorId.children[i]['style']['display'] = 'none';
    }

    for (let j = 0; j < tabs.length; j++) {
      tabs[j].classList.remove('active');
    }

    tabs[item-1].classList.add('active');
    

    var tab = formularioPorId.children[item];
    tab['style']['display'] = 'inherit'
  }

  /**
   * Subida del logotipo desde local
   * @param file formData necesario para recogida del archivo 
   */
  subirLogotipo(file) {
    this.fileUpload = file;

    let formData = new FormData();
    formData.append("logotipo", this.fileUpload[0], this.fileUpload[0].name);

    this.experienciaLaboralServive.uploadLogo(formData).toPromise().then(respuestaSubidaLogotipo => {
      if (respuestaSubidaLogotipo['responseOK'] != undefined) {
        this.toast.showSuccess(respuestaSubidaLogotipo['responseOK'], 1500);
        this.router.navigateByUrl('experiencia-laboral');
      } else if (respuestaSubidaLogotipo['responseKO'] != undefined) {
        this.toast.showDanger(respuestaSubidaLogotipo['responseKO'], 1500);
      } else {
        this.toast.showDanger("Error desconocido", 1500);
      }
    });
  }

  /**
   * Subida de la URL como logotipo de empresa
   * @param url objeto JSON para completar en servidor la url
   */
  descargarYSubirLogoURL(url) {
    var urlParam = new URL(url.value);

    var urlJSON = {
      'protocolo' : urlParam.protocol,
      'host' : urlParam.hostname,
      'path' : urlParam.pathname,
    }


    this.experienciaLaboralServive.downloadAndUploadLogoURL(urlJSON).toPromise().then(respuestaDescargaYSubidaURL => {
      if (respuestaDescargaYSubidaURL['responseOK'] != undefined) {
        this.toast.showSuccess(respuestaDescargaYSubidaURL['responseOK'], 1500);
        this.modal.dismissAll();
        setTimeout(() => {
          this.router.navigateByUrl('experiencia-laboral');
        }, 1500);
      } else if (respuestaDescargaYSubidaURL['responseKO'] != undefined){
        this.toast.showDanger(respuestaDescargaYSubidaURL['responseOK'], 1500);
      } else {
        this.toast.showDanger("Error desconocido", 1500);
      }
    });
  }
}

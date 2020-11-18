import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Shared } from 'src/app/app.component';
import { ExperienciaLaboralService } from 'src/app/services/experiencia-laboral.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidadoresService } from 'src/app/services/validadores.service';

@Component({
  selector: 'app-update-experiencia-laboral',
  templateUrl: './update-experiencia-laboral.component.html',
})
export class UpdateExperienciaLaboralComponent implements OnInit {

  @ViewChild('content', {static: true}) content: ElementRef;
  @Output() cambiarVisualizacion: EventEmitter<Shared>;
  routeParams;
  experienciaLaboralGroup : FormGroup;
  cargado : boolean = false;
  fileUpload : File;

  /**
   * Constructor del componente
   * @param activeRoute recoge el id del path
   * @param experienciaLaboralService servicio necesario para peticiones a API
   * @param config argumento de configuración de los modales
   * @param formBuilder constructor del formulario reactivo
   * @param validadores servicio necesario para validación de fechas
   * @param toast servicio para alertas
   * @param router necesario para redirecciones
   * @param modal argumento para subir el modal
   */
  constructor(
    private activeRoute : ActivatedRoute,
    private experienciaLaboralService : ExperienciaLaboralService,
    config : NgbModalConfig,
    private formBuilder : FormBuilder,
    private validadores : ValidadoresService,
    private toast : ToastService,
    private router : Router,
    private modal : NgbModal
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.routeParams = this.activeRoute.snapshot.params['id'];

    config.backdrop = 'static'; 
    config.keyboard = false;
  }

  /**
   * Inicia el componente
   */
  ngOnInit(): void {
    this.experienciaLaboralForm(this.routeParams);
  }

  /**
   * Recoge los parámetros de la llamada a la API para aplicarlo al formulario y que se muestren 
   * @param routeParams argumento necesario para obtener el id del path
   */
  experienciaLaboralForm(routeParams) {
    this.experienciaLaboralService.getExperienciaLaboral(routeParams).toPromise().then(experienciaLaboral => {
      var fechaInicio = this.formatDate(new Date(experienciaLaboral[0]['fecha_inicio']));
      var fechaFin =  this.formatDate(new Date(experienciaLaboral[0]['fecha_fin']));


      if( fechaInicio  == 'NaN-NaN-NaN') {
        fechaInicio = ''
      }

      if (fechaFin == 'NaN-NaN-NaN') {
        fechaFin = ''
      }

      this.experienciaLaboralGroup = this.formBuilder.group({
        nombreEmpresa : [experienciaLaboral[0]['empresa'], [Validators.required]],
        nombrePuesto : [experienciaLaboral[0]['puesto'], [Validators.required]],
        funcionesPuesto : [experienciaLaboral[0]['funciones_puesto']],
        fechaInicio : [fechaInicio],
        fechaFin : [fechaFin],
        cronologia : [experienciaLaboral[0]['cronologia']],
        observaciones : [experienciaLaboral[0]['observaciones']]
      }, {validators : this.validadores.validatorDate('fechaInicio', 'fechaFin')});
      this.cargado=true;
    })
  }

  /**
   * Formateo de la fecha para validez en las fechas dadas del formulario
   * @param date fecha
   */
  formatDate(date: Date) : string {
    var day, month, year;
    var dayDate = date.getDate();
    var monthDate = date.getMonth();
    var yearDate = date.getFullYear();
    (dayDate < 10) ? day = '0' + dayDate : day = ""+ dayDate;
    (monthDate < 10) ? month = '0' + ++monthDate : month = ""+ ++monthDate;
    year = ""+yearDate;

    return year + "-" + month + '-' + day;
  }

  /**
   * Validador de campos dinámico
   * @param formControl control dentro del formulario html
   */
  getValidateFormControl(formControl): boolean {
    return this.experienciaLaboralGroup.get(formControl).invalid && this.experienciaLaboralGroup.get(formControl).touched;
  }

  /**
   * Update de la experiencia laboral
   */
  saveUpdateExperienciaLaboral() {
    if (this.experienciaLaboralGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.experienciaLaboralGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.experienciaLaboralService.updateExperienciaLaboral(this.experienciaLaboralGroup.value, this.routeParams).toPromise().then(respuestaSubidaExperienciaLaboral => {
        console.log(respuestaSubidaExperienciaLaboral)
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
   * Subida del archivo local a servidor
   * @param file formData necesario para la subida de la imagen
   */
  subirLogotipo(file) {
    this.fileUpload = file;

    let formData = new FormData();
    formData.append("logotipo", this.fileUpload[0], this.fileUpload[0].name);

    this.experienciaLaboralService.updateLogo(formData, this.routeParams).toPromise().then(respuestaSubidaLogotipo => {
      if (respuestaSubidaLogotipo['responseOK'] != undefined) {
        this.toast.showSuccess(respuestaSubidaLogotipo['responseOK'], 1500);
        this.router.navigateByUrl('experiencia-laboral');
      } else if (respuestaSubidaLogotipo['responseKO'] != undefined) {
        this.toast.showDanger(respuestaSubidaLogotipo['responseKO'], 1500);
      } else {
        this.toast.showDanger("Error desconocido", 1500);
      }

      setTimeout(() => {
        this.router.navigateByUrl('experiencia-laboral');
      }, 1500);
    });
  }

  /**
   * Updatea el logotipo de una URL válida
   * @param url argumento necesario pasado con objeto JSON para completarlo en back
   */
  descargarYSubirLogoURL(url) {
    var urlParam = new URL(url.value);

    var urlJSON = {
      'protocolo' : urlParam.protocol,
      'host' : urlParam.hostname,
      'path' : urlParam.pathname,
      'idExperienciaLaboral' : this.routeParams
    }


    this.experienciaLaboralService.updateDownloadAndUploadLogoURL(urlJSON).toPromise().then(respuestaDescargaYSubidaURL => {
      if (respuestaDescargaYSubidaURL['responseOK'] != undefined) {
        this.toast.showSuccess(respuestaDescargaYSubidaURL['responseOK'], 1500);
        this.modal.dismissAll();
      } else if (respuestaDescargaYSubidaURL['responseKO'] != undefined){
        this.toast.showDanger(respuestaDescargaYSubidaURL['responseOK'], 1500);
      } else {
        this.toast.showDanger("Error desconocido", 1500);
      }

      setTimeout(() => {
        this.router.navigateByUrl('experiencia-laboral');
      }, 1500);
    });
  }
}

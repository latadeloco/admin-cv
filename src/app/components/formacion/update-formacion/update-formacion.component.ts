import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Shared } from 'src/app/app.component';
import { FormacionService } from 'src/app/services/formacion.service';
import { ReusableService } from 'src/app/services/reusable.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidadoresService } from 'src/app/services/validadores.service';

@Component({
  selector: 'app-update-formacion',
  templateUrl: './update-formacion.component.html',
})
export class UpdateFormacionComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>
  formacionGroup : FormGroup
  fileUpload: File;
  routeParams;
  cargado : boolean = false;
  reusable;
  
  /**
   * 
   * @param formBuilder constructor para formulario reactivo
   * @param toast servicio para alertas
   * @param formacionService servicio para peticiones a API
   * @param validadores servicio para validación de fechas
   * @param router necesario para redirecciones
   * @param activeRoute necesario para recoger el parámetro id
   * @param config configuración para el modal
   * @param reusableService servicio necesario para redirecciones y validaciones
   */
  constructor(
    private formBuilder: FormBuilder,
    private toast : ToastService,
    private formacionService : FormacionService,
    private validadores : ValidadoresService,
    private router : Router,
    private activeRoute : ActivatedRoute,
    config: NgbModalConfig,
    private reusableService : ReusableService
  ) {
    this.reusable = this.reusableService;
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());
    this.routeParams = this.activeRoute.snapshot.params['id'];

    config.backdrop = 'static'; 
    config.keyboard = false;
  }

  /**
   * Inicio del componente
   */
  ngOnInit(): void {
    this.formacionForm(this.routeParams);
  }

  /**
   * Recoge todos los datos de la formación
   * @param routeParams parámetro ID que lo recoge del path
   */
  formacionForm(routeParams) {
    this.formacionService.getFormacion(routeParams).toPromise().then(respuestaFormacionActual => {
      if (respuestaFormacionActual['responseKO'] == undefined) {
        this.formacionGroup = this.formBuilder.group({
          nombreTitulacion  : [respuestaFormacionActual[0]['nombre_titulacion'], [Validators.required, Validators.maxLength(100)]],
          nombreInstitucion : [respuestaFormacionActual[0]['nombre_institucion'], [Validators.maxLength(100)]],
          fechaInicio       : [respuestaFormacionActual[0]['fecha_inicio']],
          fechaFin          : [respuestaFormacionActual[0]['fecha_fin']],
          certificacion     : [respuestaFormacionActual[0]['certificacion']],
          descripcion       : [respuestaFormacionActual[0]['descripcion_formacion']]
        }, {validators : this.validadores.validatorDate('fechaInicio', 'fechaFin')});
        this.cargado=true;
      } else {
        this.toast.showDanger(respuestaFormacionActual['responseKO'], 3000);
        this.reusableService.redirectTo('formacion');
      }

    })
  }

  /**
   * Interruptor para verificar la carga completa del formulario
   */
  getCargadoTotally(): boolean{
    return this.cargado;
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
   * Guardar el formulario
   */
  saveFormacionForm() {
    if (this.formacionGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.formacionGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.updateFormacion();
    }
  }

  /**
   * Subir el certificado con la formación ya dada por el routeParams
   * @param files Objeto FormData para la subida del documento (certificado)
   */
  subirCertificado(files) {
    this.fileUpload = files;

    let formData = new FormData();
    formData.append("certificado", this.fileUpload[0], this.fileUpload[0].name);

    this.formacionService.uploadCertificateWithFormacion(formData, this.routeParams).toPromise();
  }

  /**
   * Privada para la actualización de la formación
   */
  private updateFormacion() {
      this.formacionService.updateFormacion(this.formacionGroup.value, this.routeParams).toPromise().then(respuestaFormacion => {
        if (respuestaFormacion['responseOK'] != undefined) {
          this.toast.showSuccess(respuestaFormacion['responseOK'], 3000);
          this.router.navigateByUrl('formacion');
        } else {
          this.toast.showDanger(respuestaFormacion['responseKO'], 3000);
          this.router.navigateByUrl('update-formacion/', this.routeParams);
        }
        this.router.navigateByUrl('formacion');
      });
  }

}

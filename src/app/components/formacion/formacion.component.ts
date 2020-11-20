import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Shared } from 'src/app/app.component';
import { FormacionService } from 'src/app/services/formacion.service';
import { ReusableService } from 'src/app/services/reusable.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-formacion',
  templateUrl: './formacion.component.html',
  styleUrls: ['./formacion.component.css']
})
export class FormacionComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>;
  formacionesDisponibles = new Array();
  @ViewChild('contentCertificate', {static: true}) contentCertificate : ElementRef;
  fileUpload: File;
  idFormacionActual;

  /**
   * Constructor del componente
   * @param formacionService servicio necesario para llamadas a API
   * @param toast servicio de alertas
   * @param modal modal para subida de certificado (PDF)
   * @param reusableService necesario para redirección
   */
  constructor(
    private formacionService : FormacionService,
    private toast : ToastService,
    private modal : NgbModal,
    private reusableService : ReusableService,
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());
    
    this.formacionService.getFormaciones().toPromise().then(formaciones => {
      this.formacionesDisponibles.push(formaciones);
    });
  }

  /**
   * Inicio del componente
   */
  ngOnInit(): void {

  }

  /**
   * Eliminar certificado
   * @param certificado certificado
   * @param only parámetro para saber si solo elimina el certificado
   */
  eliminarCertificado(certificado, only: boolean) {
    certificado = {
      'certificado' : certificado
    };

    if (only) {
      this.formacionService.removeCertificate(certificado).toPromise().then(respuesta => {
        if (respuesta['responseOK'] != undefined) {
          this.toast.showSuccess(respuesta['responseOK'], 4000);
        } else if (respuesta['responseKO'] != undefined) {
          this.toast.showDanger(respuesta['responseKO'], 4000);
        }
      });
    } else {
      this.formacionService.removeCertificate(certificado).toPromise();
    }
    this.reusableService.redirectTo('formacion');
  }

  /**
   * Eliminar la formación
   * @param idFormacion formación a eliminar
   */
  eliminarFormacion(idFormacion) {
    this.eliminarCertificado(idFormacion, false);
    this.formacionService.removeFormacion(idFormacion).toPromise().then(respuestaEliminacionFormacion => {
      if (respuestaEliminacionFormacion['responseOK'] != undefined) {
        this.toast.showSuccess(respuestaEliminacionFormacion['responseOK'], 3000);
      } else if (respuestaEliminacionFormacion['responseKO'] != undefined){
        this.toast.showDanger(respuestaEliminacionFormacion['responseKO'], 3000);
      }

      this.reusableService.redirectTo('formacion')
      
    })
  }

  /**
   * Modal para actualizar el certificado
   * @param idFormacion formación para subir el certificado
   */
  modalUploadCertificado(idFormacion) {
    this.idFormacionActual = idFormacion;
    this.modal.open(this.contentCertificate, { centered: true });
  }

  /**
   * Subir el certificado según la formación
   * @param files objeto FormData (certificado PDF)
   */
  subirCertificado(files) {

    this.fileUpload = files;

    let formData = new FormData();
    formData.append("certificado", this.fileUpload[0], this.fileUpload[0].name);

    this.formacionService.uploadCertificateWithFormacion(formData, this.idFormacionActual).toPromise();
  }

}

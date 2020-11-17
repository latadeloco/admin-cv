import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormacionService {

  slash = "formacion/";
  urlBase = baseUrlApi + this.slash;

  /**
   * Constructor del servicio
   * @param http Parámetro para petición
   */
  constructor(private http : HttpClient) { }

  /**
   * Añadir una formación
   * @param formacion Objecto JSON para añadir formación
   */
  addFormacion(formacion) {
    return this.http.post(this.urlBase + 'add', formacion);
  }

  /**
   * Actualizar formación
   * @param formacion Objeto JSON para actualizar la formación
   * @param idFormacion id de la formación a actualizar
   */
  updateFormacion(formacion, idFormacion) {
    return this.http.post(this.urlBase + 'update/' + idFormacion, formacion);
  }

  /**
   * Subir certificado
   * @param formData Objeto FormData con el documento PDF del certificado
   */
  uploadCertificate(formData) {
    return this.http.post(this.urlBase + 'subirCertificado', formData);
  }

  /**
   * Subir certificado con formación (ID) existente
   * @param formData Objeto FormData con el documento pdf del certificado
   * @param idFormacion id de la formación para identificarlo en los certificados
   */
  uploadCertificateWithFormacion(formData, idFormacion) {
    return this.http.post(this.urlBase + 'subirCertificadoConFormacionExistente/'+idFormacion, formData);
  }

  /**
   * Ver todas las formaciones
   */
  getFormaciones() {
    return this.http.get(this.urlBase + "viewAll");
  }

  /**
   * Ver la formación según ID de formación
   * @param idFormacion id de la formación
   */
  getFormacion(idFormacion) {
    return this.http.get(this.urlBase + "view/" + idFormacion);
  }

  /**
   * Eliminar certificado relacionado con la formación
   * @param certificado id certificado
   */
  removeCertificate(certificado) {
    return this.http.post(this.urlBase + 'removeCertificate', certificado);
  }

  /**
   * Eliminar una formación según su identificado (ID)
   * @param idFormacion id de la formación a eliminar
   */
  removeFormacion(idFormacion) {
    return this.http.get(this.urlBase + 'removeFormacion/' + JSON.stringify(idFormacion));
  }
}

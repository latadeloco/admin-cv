import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaLaboralService {

  slash = "experiencias-laborales/";
  urlBase = baseUrlApi + this.slash;

  /**
   * Constructor del servicio
   * @param http necesario para llamadas a API
   */
  constructor(
    private http : HttpClient
  ) { }

  /**
   * Ver todas las experiencias laborales
   */
  getExperienciasLaborales() {
    return this.http.get( this.urlBase + 'viewAll' );
  }

  /**
   * Ver una experiencia laboral definida por id
   * @param idExperienciaLaboral id experiencia laboral
   */
  getExperienciaLaboral(idExperienciaLaboral) {
    return this.http.get( this.urlBase + 'view/' + idExperienciaLaboral );
  }

  /**
   * Añade una experiencia laboral
   * @param experienciaLaboral objeto JSON para subida a servidor
   */
  addExperienciaLaboral(experienciaLaboral) {
    return this.http.post( this.urlBase + 'add', experienciaLaboral );
  }

  /**
   * Actualiza la experiencia laboral
   * @param experienciaLaboral objeto JSON para subida a servidor
   * @param idExperienciaLaboral id de experiencia laboral
   */
  updateExperienciaLaboral(experienciaLaboral, idExperienciaLaboral) {
    return this.http.post( this.urlBase + 'update' , {
      params : {
        'idExperienciaLaboral' : idExperienciaLaboral,
        'experienciaLaboral' : experienciaLaboral
      }
    } );
  }

  /**
   * Subir logotipo de empresa
   * @param formData objeto formData para subir a servidor
   */
  uploadLogo(formData) {
    return this.http.post( this.urlBase + 'subirLogotipo', formData);
  }

  /**
   * Actualizar logotipo de empresa
   * @param formData objeto formData para subir a servidor
   * @param idExperienciaLaboral id de la experiencia laboral
   */
  updateLogo(formData, idExperienciaLaboral) {
    return this.http.post( this.urlBase + 'updateSubirLogotipo', formData, { params: {'idExperienciaLaboral' : idExperienciaLaboral} });
  }

  /**
   * Sube la url al servidor
   * @param url url de la imagen
   */
  downloadAndUploadLogoURL(url) {
    return this.http.post( this.urlBase + 'addImageURL/', {
      params: url,
    } );
  }

  /**
   * Actualiza la url del servidor
   * @param url url de la imagen
   */
  updateDownloadAndUploadLogoURL(url) {
    return this.http.post( this.urlBase + 'updateImageURL/', {
      params: url
    } );
  }

  /**
   * Eliminar la experiencia laboral
   * @param idExperienciaLaboral id experiencia laboral
   */
  removeExperienciaLaboral(idExperienciaLaboral) {
    return this.http.post( this.urlBase + 'removeExperienciaLaboral', {
      params : idExperienciaLaboral
    } );
  }
}

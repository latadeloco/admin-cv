import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaLaboralService {

  slash = "experiencias-laborales/";
  urlBase = baseUrlApi + this.slash;

  constructor(
    private http : HttpClient
  ) { }

  getExperienciasLaborales() {
    return this.http.get( this.urlBase + 'viewAll' );
  }

  getExperienciaLaboral(idExperienciaLaboral) {
    return this.http.get( this.urlBase + 'view/' + idExperienciaLaboral );
  }

  addExperienciaLaboral(experienciaLaboral) {
    return this.http.post( this.urlBase + 'add', experienciaLaboral );
  }

  updateExperienciaLaboral(experienciaLaboral, idExperienciaLaboral) {
    return this.http.post( this.urlBase + 'update' , {
      params : {
        'idExperienciaLaboral' : idExperienciaLaboral,
        'experienciaLaboral' : experienciaLaboral
      }
    } );
  }

  uploadLogo(formData) {
    return this.http.post( this.urlBase + 'subirLogotipo', formData);
  }

  updateLogo(formData, idExperienciaLaboral) {
    return this.http.post( this.urlBase + 'updateSubirLogotipo', formData, { params: {'idExperienciaLaboral' : idExperienciaLaboral} });
  }

  downloadAndUploadLogoURL(url) {
    return this.http.post( this.urlBase + 'addImageURL/', {
      params: url,
    } );
  }

  updateDownloadAndUploadLogoURL(url) {
    return this.http.post( this.urlBase + 'updateImageURL/', {
      params: url
    } );
  }

  removeExperienciaLaboral(idExperienciaLaboral) {
    return this.http.post( this.urlBase + 'removeExperienciaLaboral', {
      params : idExperienciaLaboral
    } );
  }
}

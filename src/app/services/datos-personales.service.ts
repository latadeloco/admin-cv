import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosPersonalesService {
  
  slash = "datos-personales/";
  urlBase = baseUrlApi + this.slash;

  constructor(private http: HttpClient) { }

  setSubirImagenPerfil(formData) {
    return this.http.post(this.urlBase + "subirImagen", formData);
  }

  setTieneImagenPerfil(updateOInsert) {
    return this.http.get(this.urlBase + 'tieneImagenPerfil/' + updateOInsert);
  }

  getImagenPerfil() {
    return this.http.get(this.urlBase + "imagenPerfil");
  }

  getDatosPersonales() {
    return this.http.get(this.urlBase + 'ver');
  }

  setDatosPersonales(datosPersonales) {
    return this.http.post(this.urlBase + 'crear',
      {
        params: datosPersonales,
        responseType: 'json'
      })
  }

  setUpdateDatosPersonales(datosPersonales) {
    return this.http.post(this.urlBase + 'actualizar',
      {
        params: datosPersonales,
        responseType: 'json'
      })
  }
}

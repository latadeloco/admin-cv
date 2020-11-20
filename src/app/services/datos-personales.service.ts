import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosPersonalesService {
  
  slash = "datos-personales/";
  urlBase = baseUrlApi + this.slash;

  /**
   * Constructor del servicio
   * @param http argumento necesario para llamar a API
   */
  constructor(private http: HttpClient) { }

  /**
   * Subir imagen de perfil
   * @param formData imagen a subir (tipo File)
   */
  setSubirImagenPerfil(formData) {
    return this.http.post(this.urlBase + "subirImagen", formData);
  }

  /**
   * Subir o actualizar imagen de perfil en bd
   * @param updateOInsert boolean para saber si se actualiza o se inserta una nueva imagen de perfil
   */
  setTieneImagenPerfil(updateOInsert) {
    return this.http.get(this.urlBase + 'tieneImagenPerfil/' + updateOInsert);
  }

  /**
   * Obtener imagen de perfil
   */
  getImagenPerfil() {
    return this.http.get(this.urlBase + "imagenPerfil");
  }

  /**
   * Obtener datos personales
   */
  getDatosPersonales() {
    return this.http.get(this.urlBase + 'ver');
  }

  /**
   * Crear datos personales del usuario
   * @param datosPersonales objeto JSON de datos personales de formulario
   */
  setDatosPersonales(datosPersonales) {
    return this.http.post(this.urlBase + 'crear',
      {
        params: datosPersonales,
        responseType: 'json'
      })
  }

  /**
   * Actualizar datos personales
   * @param datosPersonales objeto JSON de datos personales a actualizar
   */
  setUpdateDatosPersonales(datosPersonales) {
    return this.http.post(this.urlBase + 'actualizar',
      {
        params: datosPersonales,
        responseType: 'json'
      })
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObjetivoProfesionalService {

  slash = "objetivo-profesional/";
  urlBase = baseUrlApi + this.slash;

  /**
   * 
   * @param http argumento para llamadas a API
   */
  constructor(
    private http : HttpClient
  ) { }

  /**
   * Obtener todos los objetivos profesionales
   */
  getObjetivosProfesionales() {
    return this.http.get( this.urlBase + 'viewAll' )
  }

  /**
   * Ver un objetivo profesional en concreto
   * @param idObjetivoProfesional id objetivo profesional a ver
   */
  getObjetivoProfesional(idObjetivoProfesional) {
    return this.http.get( this.urlBase + 'view/' + idObjetivoProfesional )
  }

  /**
   * Añadir un objetivo profesional
   * @param objetivoProfesional objeto JSON de objetivo profesional
   */
  addObjetivoProfesional(objetivoProfesional) {
    return this.http.post( this.urlBase + 'add', objetivoProfesional );
  }

  /**
   * Actualizar un objetivo profesional
   * @param objetivoProfesional objeto JSON de objetivo profesional
   * @param idObjetivoProfesional parámetro ID de objetivo profesional a actualizar
   */
  updateObjetivoProfesional(objetivoProfesional, idObjetivoProfesional) {
    return this.http.post( this.urlBase + 'update', 
      {
        params : {
          'objetivoProfesional' : objetivoProfesional,
          'idObjetivoProfesional' : idObjetivoProfesional
        }
      } );
  }

  /**
   * Eliminar un objetivo profesional
   * @param idObjetivoProfesional parámetro ID de objetivo profesional a eliminar
   */
  removeObjetivoProfesional(idObjetivoProfesional) {
    return this.http.post( this.urlBase + 'remove', {
      params : {
        'idObjetivoProfesional' : idObjetivoProfesional
      }
    });
  }
}

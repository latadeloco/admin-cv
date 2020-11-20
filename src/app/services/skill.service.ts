import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  slash = "skills/";
  urlBase = baseUrlApi + this.slash;

  /**
   * Constructor el servicio
   * @param http argumento para llamadas a API
   */
  constructor(
    private http : HttpClient
  ) { }

  /**
   * Añadir un tipo de skill
   * @param tipoSkill objeto JSON de tipo de skill
   */
  addTipoSkill(tipoSkill) {
    return this.http.post( this.urlBase + 'addTipoSkill', tipoSkill );
  }

  /**
   * Añadir una skill
   * @param skill objeto JSON de skill
   */
  addSkill(skill) {
    return this.http.post( this.urlBase + 'addSkill', skill );
  }

  /**
   * Ver todos los tipos de skills
   */
  getViewAllTipoSkill() {
    return this.http.get( this.urlBase + 'viewAllTiposSkill' );
  }

  /**
   * Ver todas las skills
   */
  getViewAllSkill() {
    return this.http.get( this.urlBase + 'viewAllSkills' );
  }

  /**
   * Ver una skill en concreto
   * @param idSkill id skill a ver
   */
  getViewSkill(idSkill) {
    return this.http.get( this.urlBase + 'view/' + idSkill );
  }

  /**
   * Actualizar skill
   * @param skill objeto JSON de skill a actualizar
   * @param idSkill parámetro ID de skill a actualizar
   */
  updateSkill(skill, idSkill) {
    return this.http.post( this.urlBase + 'update' ,{
      params : {
        'skill' : skill,
        'idSkill': idSkill
      }
    } )
  }

  /**
   * Eliminar skill
   * @param idSkill parámetro id de skill a eliminar
   */
  deleteSkill(idSkill) {
    return this.http.post( this.urlBase + 'delete' , {
      params : {
        'idSkill': idSkill
      }
    } )
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  slash = "skills/";
  urlBase = baseUrlApi + this.slash;

  constructor(
    private http : HttpClient
  ) { }

  addTipoSkill(tipoSkill) {
    return this.http.post( this.urlBase + 'addTipoSkill', tipoSkill );
  }

  addSkill(skill) {
    return this.http.post( this.urlBase + 'addSkill', skill );
  }

  getViewAllTipoSkill() {
    return this.http.get( this.urlBase + 'viewAllTiposSkill' );
  }

  getViewAllSkill() {
    return this.http.get( this.urlBase + 'viewAllSkills' );
  }

  getViewSkill(idSkill) {
    return this.http.get( this.urlBase + 'view/' + idSkill );
  }

  updateSkill(skill, idSkill) {
    return this.http.post( this.urlBase + 'update' ,{
      params : {
        'skill' : skill,
        'idSkill': idSkill
      }
    } )
  }
}

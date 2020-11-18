import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObjetivoProfesionalService {

  slash = "objetivo-profesional/";
  urlBase = baseUrlApi + this.slash;
  constructor(
    private http : HttpClient
  ) { }

  getObjetivosProfesionales() {
    return this.http.get( this.urlBase + 'viewAll' )
  }

  getObjetivoProfesional(idObjetivoProfesional) {
    return this.http.get( this.urlBase + 'view/' + idObjetivoProfesional )
  }

  addObjetivoProfesional(objetivoProfesional) {
    return this.http.post( this.urlBase + 'add', objetivoProfesional );
  }

  updateObjetivoProfesional(objetivoProfesional, idObjetivoProfesional) {
    return this.http.post( this.urlBase + 'update', 
      {
        params : {
          'objetivoProfesional' : objetivoProfesional,
          'idObjetivoProfesional' : idObjetivoProfesional
        }
      } );
  }

  removeObjetivoProfesional(idObjetivoProfesional) {
    return this.http.post( this.urlBase + 'remove', {
      params : {
        'idObjetivoProfesional' : idObjetivoProfesional
      }
    });
  }
}

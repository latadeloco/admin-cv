import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpcionesMenuService {

  private optsMenu : Opcion[] = [
    {
      nombre: 'Datos Personales',
      url: 'datos-personales'
    },
    {
      nombre: 'Formación',
      url: 'formacion'
    },
    {
      nombre: 'Experiencia Laboral',
      url: 'experiencia-laboral'
    },
    {
      nombre: 'Objetivos Profesionales',
      url: 'objetivos-profesionales'
    },
    {
      nombre: 'Proyectos',
      url: 'proyectos'
    }
];

  constructor() {
  }

  getOptsMenu():Opcion[] { return this.optsMenu }
}

export interface Opcion {
  nombre: string;
  url: string;
}
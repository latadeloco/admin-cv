import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpcionesMenuService {

  private optsMenu : Opcion[] = [
    {
      nombre: 'Iniciar Sesión',
      url: 'iniciar-sesion'
    },
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

  /**
   * Constructor del servicio
   */
  constructor() {
  }

  /**
   * Retorna las opciones del menú
   */
  getOptsMenu():Opcion[] { return this.optsMenu }
}

/**
 * Interface interna dentro del servicio (que se puede exportar en caso de quererla reutilizar) para mejor estructuración de las opciones de menú
 */
export interface Opcion {
  nombre: string;
  url: string;
}
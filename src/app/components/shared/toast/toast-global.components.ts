import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';


@Component({ selector: 'ngbd-toast-global', templateUrl: './toast-global.components.html' })
export class NgbdToastGlobal {

  /**
   * Método de construcción del componente
   * @param toastService Párametro que añade el servicio ToastService
   */
  constructor(public toastService: ToastService) {}

  /**
   * Añade de forma asíncrona un Toast estándar
   * @param mensaje Parámetro para añadir mensaje al Toast
   */
  async showStandard(mensaje) {
    await this.toastService.show(mensaje);
  }

  /**
   * Añade de forma asíncrona un Toast en caso de que la respuesta esté OK
   * @param mensaje Parámetro para añadir mensaje al Toast
   * @param delay Tiempo activo del componente
   */
  async showSuccess(mensaje, delay) {
    await this.toastService.show(mensaje, { classname: 'bg-success text-light', delay });
  }

  /**
   * Añade de forma asíncrona un Toast en caso de que la respuesta esté KO
   * @param mensaje Parámetro para añadir mensaje al Toast
   * @param delay Tiempo activo del componente
   */
  async showDanger(mensaje, delay) {
    await this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay });
  }
}

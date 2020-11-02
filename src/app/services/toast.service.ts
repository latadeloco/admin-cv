import { Component, Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  toasts: any[] = [];

  /**
   * Hace visible el toast
   * @param textOrTpl Parámetro del texto del Toast
   * @param options Parámetro de opciones del Toast
   */
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  /**
   * Hace visible el toast estándar
   * @param mensaje Parámetro del texto del toast
   */
  showStandard(mensaje) {
    this.show(mensaje);
  }

  /**
   * Hace visible toast en caso de OK
   * @param mensaje Parámetro del texto del toast
   * @param delay Parámetro del tiempo que se quedará el toast visible
   */
  showSuccess(mensaje, delay) {
    this.show(mensaje, { classname: 'bg-success text-light', delay });
  }

  /**
   * Hace visible toast en caso de OK
   * @param mensaje Parámetro del texto del toast
   * @param delay Parámetro del tiempo que se quedará el toast visible
   */
  showDanger(mensaje, delay) {
    this.show(mensaje, { classname: 'bg-danger text-light', delay });
  }

  /**
   * Elimina el toast
   * @param toast Parámetro para eliminar el toast seleccionado
   */
  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}

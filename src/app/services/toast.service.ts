import { Component, Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showStandard(mensaje) {
    this.show(mensaje);
  }
  showSuccess(mensaje, delay) {
    this.show(mensaje, { classname: 'bg-success text-light', delay });
  }
  showDanger(mensaje, delay) {
    this.show(mensaje, { classname: 'bg-danger text-light', delay });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}

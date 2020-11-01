import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';


@Component({ selector: 'ngbd-toast-global', templateUrl: './toast-global.components.html' })
export class NgbdToastGlobal {
  constructor(public toastService: ToastService) {}

  async showStandard(mensaje) {
    await this.toastService.show(mensaje);
  }

  async showSuccess(mensaje, delay) {
    await this.toastService.show(mensaje, { classname: 'bg-success text-light', delay });
  }

  async showDanger(mensaje, delay) {
    await this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay });
  }
}

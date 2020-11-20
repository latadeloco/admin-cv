import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReusableService {

  constructor(
    private router : Router
  ) { }

  /**
   * Redireccionar
   * @param uri url a redireccionar
   */
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
  }

  /**
   * Validador de campos dinámico
   * @param formControl control dentro del formulario html
   */
  getValidateFormControl(formControl, formGroup: FormGroup): boolean {
    return formGroup.get(formControl).invalid && formGroup.get(formControl).touched;
  }
}

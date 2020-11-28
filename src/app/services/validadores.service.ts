import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  /**
   * Constructor del servicio
   */
  constructor(
  ) { }
/**
 * Valida que la fecha de inicio sea menor que la fecha fin
 * @param fechaInicio fecha de inicio
 * @param fechaFin fecha de fin
 */
  validatorDate(fechaInicio, fechaFin) {
    return (group: FormGroup): {[key: string]: any} => {
      let fi = group.controls[fechaInicio];
      let ff = group.controls[fechaFin];
      if (ff.value != null) {
        console.log("entra aqui")
        if (new Date(fi.value) > new Date(ff.value)) {
          ff.setErrors({status : 'INVALID'});
          return {
            dates: "Rango de fechas incorrectas."
          };
        }
      }
      
      ff.setErrors(null);
      return {};
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosPersonalesService {
  
  slash = "datos-personales/";

  constructor(private http: HttpClient) { }

  setSubirImagenPerfil(formData) {
    return this.http.post(baseUrlApi + this.slash + "subirImagen", formData);
  }
}

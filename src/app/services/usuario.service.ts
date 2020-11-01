import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  slash = "usuario/";
  userToken : string;

  constructor(private http: HttpClient) {
  }

  getExisteUsuario() {
    return this.http.get(baseUrlApi + this.slash + 'existe');
  }

  setCreateUsuario(usuario) {
    return this.http.post(baseUrlApi + this.slash + 'crear', 
      {
        params: JSON.stringify(usuario),
        responseType: 'json'
      }
    );
  }

  setLogIn() {
    return this.http.get(baseUrlApi + this.slash + 'logIn');
  }

  getUserToken(): boolean {
    return localStorage.getItem('user-token') == null ? false : true;
  }
}

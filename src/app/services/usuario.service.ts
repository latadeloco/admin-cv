import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrlApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  slash = "usuario/";
  userToken : string;
  urlBase = baseUrlApi + this.slash;

  /**
   * Constructor del servicio
   * @param http Parámetro necesario para las peticiones a API
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Retorna una petición para ver si existen usuarios
   */
  getExisteUsuario() {
    return this.http.get(this.urlBase + 'existe');
  }

  /**
   * Retorna respuesta, petición para crear el usuario
   * @param usuario Parámetro necesario, se envía objeto JSON a API
   */
  setCreateUsuario(usuario) {
    return this.http.post(this.urlBase + 'crear', 
      {
        params: JSON.stringify(usuario),
        responseType: 'json'
      }
    );
  }

  /**
   * Retorna JSON, petición para el logueo del usuario
   */
  setLogIn() {
    return this.http.get(this.urlBase + 'logIn');
  }

  /**
   * Retorna un localStorage con el token del usuario
   */
  getUserToken(): boolean {
    return localStorage.getItem('user-token') == null ? false : true;
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   * Constructor del Guard
   * @param usuarioService Parámetro necesario para establecer el token de usuario
   * @param router Parámetro para la navegación en caso de que el token exista
   */
  constructor (
    private usuarioService : UsuarioService,
    private router : Router
  ) {

  }
  /**
   * Método para añadir en las rutas, obtiene el token si no existe se lo envía sino redirige
   */
  canActivate(): boolean {
    if (this.usuarioService.getUserToken()) {
      return this.usuarioService.getUserToken();
    } else {
      this.router.navigateByUrl('/iniciar-sesion');
    }
  }
  
}

import { Injectable } from '@angular/core';
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
}

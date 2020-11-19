import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
import { ExperienciaLaboralService } from 'src/app/services/experiencia-laboral.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.css']
})
export class ExperienciaLaboralComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>
  experienciasLaborales = new Array();

  /**
   * Constructor del componente
   * @param laboralService servicio necesario para llamadas a API
   * @param toast servicio de alertas
   * @param router necesario para redirecciones
   */
  constructor(
    private laboralService : ExperienciaLaboralService,
    private toast : ToastService,
    private router : Router
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.laboralService.getExperienciasLaborales().toPromise().then(experienciasLaboralesList => {
      if (experienciasLaboralesList['length'] !== 0) {
        this.experienciasLaborales.push(experienciasLaboralesList);
      }
    })
  }

  /**
   * Inicia el componente
   */
  ngOnInit(): void {
  }


  /**
   * Eliminar la experiencia laboral
   * @param idExperienciaLaboral experiencia laboral a eliminar
   */
  eliminarExperienciaLaboral(idExperienciaLaboral) {
    this.laboralService.removeExperienciaLaboral(idExperienciaLaboral).toPromise().then(respuestaEliminacionExperienciaLaboral => {
      if (respuestaEliminacionExperienciaLaboral['responseOK'] !== undefined) {
        this.toast.showSuccess(respuestaEliminacionExperienciaLaboral['responseOK'], 1500);
      }
      this.redirectTo('experiencia-laboral');
    });
  }

  /**
   * Redireccionar
   * @param uri url a redireccionar
   */
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
import { ReusableService } from 'src/app/services/reusable.service';
import { SkillService } from 'src/app/services/skill.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>;
  skills = new Array();

  /**
   * Constructor del componente
   * @param skillsService servicio necesario para llamadas a API
   * @param toast servicio de alertas
   * @param router argumento de redireccionamiento
   * @param reusableService servicio necesario para reutilización y validación
   */
  constructor(
    private skillsService : SkillService,
    private toast : ToastService,
    private router : Router,
    private reusableService : ReusableService
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());
  }

  /**
   * Inicio de componente
   */
  ngOnInit(): void {
    this.skillsService.getViewAllSkill().toPromise().then(respuestaSkills => {
      this.skills.push(respuestaSkills)
    });
  }

  /**
   * Eliminar la skill seleccionada
   * @param idSkill id skill a eliminar
   */
  eliminarSkill(idSkill) {
    this.skillsService.deleteSkill(idSkill).toPromise().then(respuestaRemoveSkill => {
      if (respuestaRemoveSkill['responseOK'] !== undefined) {
        this.toast.showSuccess(respuestaRemoveSkill['responseOK'], 1300);
      } else if (respuestaRemoveSkill['responseKO'] !== undefined) {
        this.toast.showDanger(respuestaRemoveSkill['responseKO'], 1300);
      } else {
        this.toast.showDanger("Error desconocido", 1300);
      }

      this.reusableService.redirectTo('skills');
      //this.redirectTo('skills')
    })
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

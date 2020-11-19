import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
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

  constructor(
    private skillsService : SkillService,
    private toast : ToastService,
    private router : Router
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());
  }

  ngOnInit(): void {
    this.skillsService.getViewAllSkill().toPromise().then(respuestaSkills => {
      this.skills.push(respuestaSkills)
    });
  }

  eliminarSkill(idSkill) {
    this.skillsService.deleteSkill(idSkill).toPromise().then(respuestaRemoveSkill => {
      if (respuestaRemoveSkill['responseOK'] !== undefined) {
        this.toast.showSuccess(respuestaRemoveSkill['responseOK'], 1300);
      } else if (respuestaRemoveSkill['responseKO'] !== undefined) {
        this.toast.showDanger(respuestaRemoveSkill['responseKO'], 1300);
      } else {
        this.toast.showDanger("Error desconocido", 1300);
      }

      this.redirectTo('skills')
    })
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
}

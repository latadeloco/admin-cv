import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Shared } from 'src/app/app.component';
import { SkillService } from 'src/app/services/skill.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>;
  skills = new Array();

  constructor(
    private skillsService : SkillService
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

  }
}

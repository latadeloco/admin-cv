import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from 'src/app/app.component';
import { SkillService } from 'src/app/services/skill.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-update-skill',
  templateUrl: './update-skill.component.html',
  styleUrls: ['./update-skill.component.css']
})
export class UpdateSkillComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>;
  skillGroup : FormGroup;
  tipoSkillGroup : FormGroup;
  tiposSkillArray = new Array();
  exponerTipoSkill : boolean = false;
  routeParams;
  cargado : boolean = false;

  /**
   * Constructor del componente
   * @param toast servicio de alertas
   * @param skillService servicio necesario para llamadas a API
   * @param formBuilder constructor de formulario reactivo
   * @param activatedRoute argumento necesario para obtener el ID
   * @param router argumento de redirección
   */
  constructor(
    private toast : ToastService,
    private skillService : SkillService,
    private formBuilder : FormBuilder,
    private activatedRoute : ActivatedRoute,
    private router : Router
  ) { 
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.routeParams = this.activatedRoute.snapshot.params['id'];
  }

  /**
   * Inicio del componente
   */
  ngOnInit(): void {
    this.skillService.getViewAllTipoSkill().toPromise().then(tiposDeSkills => {
      this.tiposSkillArray = new Array();
      this.tiposSkillArray.push(tiposDeSkills);
      this.tipoSkillForm();
    });
  }

  /**
   * Actualizar skill
   */
  updateSkill() {
    if (this.skillGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.skillGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.skillService.updateSkill(this.skillGroup.value, this.routeParams).toPromise().then(respuestaUpdateSkill => {
        if (respuestaUpdateSkill['responseOK'] !== undefined) {
          this.toast.showSuccess(respuestaUpdateSkill['responseOK'] ,1300);
          this.router.navigateByUrl('skills');
        } else if (respuestaUpdateSkill['responseKO'] !== undefined) {
          this.toast.showDanger(respuestaUpdateSkill['responseKO'] ,1300);
        } else {
          this.toast.showDanger("Error desconocido" ,1300);
        }
      })
    }
  }

  /**
  * Visualizar el formulario de tipo de skill
  * @param exponerTipoSkill valor boolean para ver el formulario de tipo de skill
  */
  setExponerTipoSkill(exponerTipoSkill) : boolean {
    this.tipoSkillForm();
    return this.exponerTipoSkill = exponerTipoSkill;
  }

  /**
   * Inicio del formulario de tipo de skill
   */
  tipoSkillForm() {
    this.skillService.getViewSkill(this.routeParams).toPromise().then(respuestaSkillID => {
      this.skillGroup = this.formBuilder.group({
        tipoSkill : [respuestaSkillID[0]['tipo_skill'], Validators.required],
        nombreSkill: [respuestaSkillID[0]['nombre_skill'], [Validators.required]],
        descripcionSkill: [respuestaSkillID[0]['descripcion'],]
      })
      this.cargado = true;
    })
  }

  /**
   * Guardar tipo de skill
   */
  saveTipoSkill() {
    if (this.tipoSkillGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.tipoSkillGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.skillService.addTipoSkill(this.tipoSkillGroup.value).toPromise().then(respuestaTipoSkill => {
        if (respuestaTipoSkill['responseOK'] != undefined) {
          this.exponerTipoSkill = false;
          this.toast.showSuccess(respuestaTipoSkill['responseOK'], 1300);
          this.skillService.getViewAllTipoSkill().toPromise().then(tiposDeSkills => {
            this.tiposSkillArray = new Array();
            this.tiposSkillArray.push(tiposDeSkills);
          });
        } else if (respuestaTipoSkill['responseKO'] != undefined) {
          this.toast.showDanger(respuestaTipoSkill['responseKO'], 1300);
        } else {
          this.toast.showDanger("Error desconocido", 1300);
        }
      })
    }
  }

  /**
   * Validador de campos dinámico
   * @param formControl control dentro del formulario html
   */
  getValidateFormControl(formControl): boolean {
    return this.skillGroup.get(formControl).invalid && this.skillGroup.get(formControl).touched;
  }

  /**
   * Validador de campos dinámico
   * @param formControl control dentro del formulario html
   */
  getValidateFormControlTipoSkill(formControl): boolean {
    return this.tipoSkillGroup.get(formControl).invalid && this.tipoSkillGroup.get(formControl).touched;
  }
}

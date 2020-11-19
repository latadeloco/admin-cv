import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Thermometer } from 'ngx-bootstrap-icons';
import { Shared } from 'src/app/app.component';
import { SkillService } from 'src/app/services/skill.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.css']
})
export class AddSkillComponent implements OnInit {

  @Output() cambiarVisualizacion: EventEmitter<Shared>;
  skillGroup : FormGroup;
  tipoSkillGroup : FormGroup;
  tiposSkillArray = new Array();
  exponerTipoSkill : boolean = false;
  constructor(
    private formBuilder : FormBuilder,
    private toast : ToastService,
    private skillService : SkillService,
    private router : Router
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());

    this.skillForm();
  }

  ngOnInit(): void {
    this.skillService.getViewAllTipoSkill().toPromise().then(tiposDeSkills => {
      this.tiposSkillArray = new Array();
      this.tiposSkillArray.push(tiposDeSkills);
    });
  }

  saveSkill() {
    if (this.skillGroup.invalid) {
      this.toast.showDanger("Hay campos que no son válido, repásalos", 4000);
      return Object.values( this.skillGroup.controls ).forEach( controles => {
        controles.markAsTouched();
      });
    } else {
      this.skillService.addSkill(this.skillGroup.value).toPromise().then(respuestaSkill => {
        if (respuestaSkill['responseOK'] != undefined) {
          this.toast.showSuccess(respuestaSkill['responseOK'], 1300);
          setTimeout(() => {
            this.router.navigateByUrl('skills');
          }, 1250);
        } else if (respuestaSkill['responseKO'] != undefined) {
          this.toast.showDanger(respuestaSkill['responseKO'] ,1300);
        } else {
          this.toast.showDanger("Error desconocido" ,1300);
        }
      })
    }
  }

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

  skillForm() {
    this.skillGroup = this.formBuilder.group({
      tipoSkill : ['', [Validators.required]],
      nombreSkill : [null, [Validators.required]],
      descripcionSkill : [''],
    });
  }

  tipoSkillForm() {
    this.tipoSkillGroup = this.formBuilder.group({
      nombreTipoSkill: ['', [Validators.required]]
    })
  }

  setExponerTipoSkill(exponerTipoSkill) : boolean {
    this.tipoSkillForm();
    return this.exponerTipoSkill = exponerTipoSkill;
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

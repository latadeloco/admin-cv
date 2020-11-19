import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';

// Para peticiones HTTP

import { HttpClientModule } from "@angular/common/http";

// Para formularios
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Rutas
import { APP_ROUTING } from "./app.routes";

// Servicios

import { OpcionesMenuService } from './services/opciones-menu.service';
import { ToastService } from './services/toast.service';


// Componentes

import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { FormacionComponent } from './components/formacion/formacion.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { ObjetivosProfesionalesComponent } from './components/objetivos-profesionales/objetivos-profesionales.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { UsuarioService } from './services/usuario.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from './components/shared/toast/toast-global.components';
import { ToastsContainer } from './components/shared/toast/toast-container.components';
import { AddFormacionComponent } from './components/formacion/add-formacion/add-formacion.component';
import { UpdateFormacionComponent } from './components/formacion/update-formacion/update-formacion.component';
import { AddExperienciaLaboralComponent } from './components/experiencia-laboral/add-experiencia-laboral/add-experiencia-laboral.component';
import { UpdateExperienciaLaboralComponent } from './components/experiencia-laboral/update-experiencia-laboral/update-experiencia-laboral.component';
import { SkillsComponent } from './components/skills/skills.component';
import { AddObjetivosProfesionalesComponent } from './components/objetivos-profesionales/add-objetivos-profesionales/add-objetivos-profesionales.component';
import { UpdateObjetivosProfesionalesComponent } from './components/objetivos-profesionales/update-objetivos-profesionales/update-objetivos-profesionales.component';
import { AddSkillComponent } from './components/skills/add-skill/add-skill.component';
import { UpdateSkillComponent } from './components/skills/update-skill/update-skill.component';


@NgModule({
  declarations: [
    AppComponent, 
    HeaderComponent, 
    FooterComponent, 
    DatosPersonalesComponent, 
    FormacionComponent, 
    ExperienciaLaboralComponent, 
    ObjetivosProfesionalesComponent, 
    ProyectosComponent, 
    IniciarSesionComponent,
    NgbdToastGlobal,
    ToastsContainer,
    AddFormacionComponent,
    UpdateFormacionComponent,
    AddExperienciaLaboralComponent,
    UpdateExperienciaLaboralComponent,
    SkillsComponent,
    AddObjetivosProfesionalesComponent,
    UpdateObjetivosProfesionalesComponent,
    AddSkillComponent,
    UpdateSkillComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBootstrapIconsModule.pick(allIcons),
    APP_ROUTING,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    OpcionesMenuService,
    UsuarioService,
    ToastService
  ],
  bootstrap: [AppComponent, NgbdToastGlobal],
})
export class AppModule { }

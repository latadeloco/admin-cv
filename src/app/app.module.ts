import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';

// Rutas
import { APP_ROUTING } from "./app.routes";

// Servicios

import { OpcionesMenuService } from './services/opciones-menu.service';

// Componentes

import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { FormacionComponent } from './components/formacion/formacion.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { ObjetivosProfesionalesComponent } from './components/objetivos-profesionales/objetivos-profesionales.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';


@NgModule({
  declarations: [
    AppComponent, HeaderComponent, FooterComponent, DatosPersonalesComponent, FormacionComponent, ExperienciaLaboralComponent, ObjetivosProfesionalesComponent, ProyectosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBootstrapIconsModule.pick(allIcons),
    APP_ROUTING
  ],
  providers: [
    OpcionesMenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

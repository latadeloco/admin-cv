import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { FormacionComponent } from './components/formacion/formacion.component';
import { ObjetivosProfesionalesComponent } from './components/objetivos-profesionales/objetivos-profesionales.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';


const APP_ROUTES: Routes = [
    { path : 'datos-personales', component: DatosPersonalesComponent },
    { path : 'experiencia-laboral', component: ExperienciaLaboralComponent },
    { path : 'formacion', component: FormacionComponent },
    { path : 'objetivos-profesionales', component: ObjetivosProfesionalesComponent },
    { path : 'proyectos', component: ProyectosComponent },
    { path : '**', pathMatch: 'full', redirectTo: 'datos-personales' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });

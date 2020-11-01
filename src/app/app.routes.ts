import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { FormacionComponent } from './components/formacion/formacion.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { ObjetivosProfesionalesComponent } from './components/objetivos-profesionales/objetivos-profesionales.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { AuthGuard } from './guards/auth.guard';


const APP_ROUTES: Routes = [
    { path : 'iniciar-sesion', component: IniciarSesionComponent },
    { path : 'datos-personales', component: DatosPersonalesComponent, canActivate: [AuthGuard] },
    { path : 'experiencia-laboral', component: ExperienciaLaboralComponent, canActivate: [AuthGuard] },
    { path : 'formacion', component: FormacionComponent, canActivate: [AuthGuard] },
    { path : 'objetivos-profesionales', component: ObjetivosProfesionalesComponent, canActivate: [AuthGuard] },
    { path : 'proyectos', component: ProyectosComponent, canActivate: [AuthGuard] },
    { path : '**', pathMatch: 'full', redirectTo: 'iniciar-sesion' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });

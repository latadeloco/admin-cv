import { RouterModule, Routes } from '@angular/router';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { AddExperienciaLaboralComponent } from './components/experiencia-laboral/add-experiencia-laboral/add-experiencia-laboral.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { UpdateExperienciaLaboralComponent } from './components/experiencia-laboral/update-experiencia-laboral/update-experiencia-laboral.component';
import { AddFormacionComponent } from './components/formacion/add-formacion/add-formacion.component';
import { FormacionComponent } from './components/formacion/formacion.component';
import { UpdateFormacionComponent } from './components/formacion/update-formacion/update-formacion.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { AddObjetivosProfesionalesComponent } from './components/objetivos-profesionales/add-objetivos-profesionales/add-objetivos-profesionales.component';
import { ObjetivosProfesionalesComponent } from './components/objetivos-profesionales/objetivos-profesionales.component';
import { UpdateObjetivosProfesionalesComponent } from './components/objetivos-profesionales/update-objetivos-profesionales/update-objetivos-profesionales.component';
import { AddSkillComponent } from './components/skills/add-skill/add-skill.component';
import { SkillsComponent } from './components/skills/skills.component';
import { UpdateSkillComponent } from './components/skills/update-skill/update-skill.component';
import { AuthGuard } from './guards/auth.guard';

/**
 * Constante para parametrizar las rutas (routes)
 */
const APP_ROUTES: Routes = [
    { path : 'iniciar-sesion', component: IniciarSesionComponent },
    { path : 'datos-personales', component: DatosPersonalesComponent, canActivate: [AuthGuard] },
    { path : 'experiencia-laboral', component: ExperienciaLaboralComponent, canActivate: [AuthGuard] },
    { path : 'experiencia-laboral/add-experiencia-laboral', component: AddExperienciaLaboralComponent, canActivate: [AuthGuard] },
    { path : 'experiencia-laboral/update-experiencia-laboral/:id', component: UpdateExperienciaLaboralComponent, canActivate: [AuthGuard] },
    { path : 'formacion', component: FormacionComponent, canActivate: [AuthGuard] },
    { path : 'formacion/add-formacion', component: AddFormacionComponent, canActivate: [AuthGuard] },
    { path : 'formacion/update-formacion/:id', component: UpdateFormacionComponent, canActivate: [AuthGuard] },
    { path : 'skills', component: SkillsComponent, canActivate: [AuthGuard] },
    { path : 'skills/add-skill', component: AddSkillComponent, canActivate: [AuthGuard] },
    { path : 'skills/update-skill/:id', component: UpdateSkillComponent, canActivate: [AuthGuard] },
    { path : 'objetivos-profesionales', component: ObjetivosProfesionalesComponent, canActivate: [AuthGuard] },
    { path : 'objetivos-profesionales/add-objetivo-profesional', component: AddObjetivosProfesionalesComponent, canActivate: [AuthGuard] },
    { path : 'objetivos-profesionales/update-objetivo-profesional/:id', component: UpdateObjetivosProfesionalesComponent, canActivate: [AuthGuard] },
    { path : '**', pathMatch: 'full', redirectTo: 'iniciar-sesion' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegistroModificacionComponent } from './components/registro-modificacion/registro-modificacion.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TipoDePersonaComponent } from './components/tipo-de-persona/tipo-de-persona.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudPageComponent,
  },
  {
    path: 'registro-modificacion',
    component: RegistroModificacionComponent,
  },
  {
    path: 'tipo-de-persona',
    component: TipoDePersonaComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModificacionesImmexProsecRoutingModule { }

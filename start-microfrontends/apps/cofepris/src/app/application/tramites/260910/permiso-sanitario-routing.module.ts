import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PermisoSanitarioSolicitanteComponent } from './pages/permiso-sanitario-solicitante/permiso-sanitario-solicitante';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260910',
      }
    },
    path: 'solicitante',
    component: PermisoSanitarioSolicitanteComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitante',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class PermisoSanitarioRoutingModule {}

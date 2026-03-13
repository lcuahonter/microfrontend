import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PlaguicidasComponent } from './pages/plaguicidas/plaguicidas.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260503'
      }
    },
    path: 'plaguicidas',
    component: PlaguicidasComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'plaguicidas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class PermisoExperimentalesPlaguicidasRoutingModule {}

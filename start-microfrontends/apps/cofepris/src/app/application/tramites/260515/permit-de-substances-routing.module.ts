import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PlaguicidasComponent } from './pages/plaguicidas/plaguicidas.component';

const ROUTES: Routes = [
   {
        path: 'plaguicidas',
        component: PlaguicidasComponent,
        canActivate: [IniciarTramiteResolver],
            data: {
              iniciarConfig: {
                procedureId: '260515'
              }
        },
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'plaguicidas',
      },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermitDeSubstancesRoutingModule { }

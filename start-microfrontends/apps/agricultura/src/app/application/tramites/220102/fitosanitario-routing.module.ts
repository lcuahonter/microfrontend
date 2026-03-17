import { NgModule } from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES_FITOSANITARO: Routes = [
  {
    path: 'invocar-modulo',
    component: SolicitudPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'invocar-modulo',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_FITOSANITARO)],
  exports: [RouterModule]
})
export class FitosanitarioRoutingModule { }

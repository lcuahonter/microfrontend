import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ZoosanitarioPageComponent } from './pages/zoosanitario-page/zoosanitario-page.component';

import { AcusePageComponent } from '@libs/shared/data-access-user/src';



export const ROUTES_ZOOSANITARIO: Routes = [
  {
    path: 'registrozoosanitario',
    component: ZoosanitarioPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registrozoosanitario',
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_ZOOSANITARIO)],
  exports: [RouterModule]
})
export class CertificadoZoosanitario { }

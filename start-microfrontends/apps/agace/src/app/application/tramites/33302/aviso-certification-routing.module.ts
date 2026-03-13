import { AvisoModifyIvaEIepsComponent } from './pages/aviso-modify-iva-eieps/aviso-modify-iva-eieps.component';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

export const ROUTES_AVISO_MODIFY_IVAELEPS: Routes = [
  {
    path: 'aviso-certificacion',
     component: AvisoModifyIvaEIepsComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'aviso-certificacion',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_AVISO_MODIFY_IVAELEPS)],
  exports: [RouterModule]
})
export class AvisoCertificacionRoutingModule { }

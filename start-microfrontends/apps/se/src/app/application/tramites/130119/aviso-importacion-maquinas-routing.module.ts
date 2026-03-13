import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { DatosComponent } from './pages/datos/datos.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [

   {
      canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '130119',
          },
      },
      path: 'registrar-solicitud',
      component: DatosComponent,
  
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'registrar-solicitud',
    },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AvisoImportacionMaquinasRoutingModule { }

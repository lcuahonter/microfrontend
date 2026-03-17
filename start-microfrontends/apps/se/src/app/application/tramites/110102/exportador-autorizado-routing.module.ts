import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DatosComponent } from './pages/datos/datos.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [
  {
    path: 'registrar-solicitud',
    component: DatosComponent,
    resolve: { iniciarResolverData: IniciarTramiteResolver },
    data: {
      iniciarConfig: {
        procedureId: '110102'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ExportadorautorizadoRoutingModule { }

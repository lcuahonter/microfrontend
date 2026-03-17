import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudPageComponent,
    resolve: { iniciarResolverData: IniciarTramiteResolver },
    data: {
      iniciarConfig: {
        procedureId: '701'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RegistroDigitalizarDocumentosRoutingModule { }

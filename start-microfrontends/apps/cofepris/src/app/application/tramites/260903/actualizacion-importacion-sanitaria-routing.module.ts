import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ActualizacionImportacionSanitariaComponent } from './pages/actualizacion-importacion-sanitaria/actualizacion-importacion-sanitaria.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [
   {
      path: 'solictud',
      component: ActualizacionImportacionSanitariaComponent,
      canActivate: [IniciarTramiteResolver],
      resolve: { iniciarResolverData: IniciarTramiteResolver },
      data: {
      iniciarConfig: {
        procedureId: '260903'
      }
      }
    },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ActualizacionImportacionSanitariaRoutingModule { }

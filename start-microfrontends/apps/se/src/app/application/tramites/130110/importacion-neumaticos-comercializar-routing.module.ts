import { RouterModule, Routes } from '@angular/router';
import { ImportacionNeumaticosComercializarComponent } from './pages/importacion-neumaticos-comercializar/importacion-neumaticos-comercializar.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '130110',
      },
    },
    path: 'neumaticos-comercializar',
    component: ImportacionNeumaticosComercializarComponent,
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo: 'neumaticos-comercializar'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ImportacionNeumaticosComercializarRoutingModule { }

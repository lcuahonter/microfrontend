import { RouterModule, Routes } from '@angular/router';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: 'pantallas',
    component: ContenedorDePasosComponent,
      canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '260604'
          }
        },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pantallas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AvisoExportacionRoutingModule { 


}

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ContenedorDePasosComponent } from './pages/contenedor-de-pasos/contenedor-de-pasos.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
export const ROUTES_REGISTRAR_IMMEX: Routes = [
  {
    path: 'contenedor-de-pasos',
    component: ContenedorDePasosComponent,
    canActivate: [IniciarTramiteResolver],
    resolve: { iniciarResolverData: IniciarTramiteResolver },
    data: {
    iniciarConfig: {
      procedureId: '80207'
    }
  }
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_REGISTRAR_IMMEX)],
  exports: [RouterModule],
})
export class SubfabricanteExtentionRoutingModule {}

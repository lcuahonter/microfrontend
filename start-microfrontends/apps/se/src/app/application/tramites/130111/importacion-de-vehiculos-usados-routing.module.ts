import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { ImportacionDeVehiculosUsadosComponent } from './pages/importacion-de-vehiculos-usados/importacion-de-vehiculos-usados.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '130111',
      },
    },

    path: 'importacion-de-vehiculos',
    component: ImportacionDeVehiculosUsadosComponent
  },
  {
    path: 'acuse',
    component: AcusePageComponent,

  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'importacion-de-vehiculos'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ImportacionDeVehiculosUsadosRoutingModule { }

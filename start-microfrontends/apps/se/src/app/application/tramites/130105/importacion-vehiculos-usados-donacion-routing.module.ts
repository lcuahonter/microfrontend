import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { ImportacionVehiculosUsadosDonacionComponent } from './pages/importacion-vehiculos-usados-donacion/importacion-vehiculos-usados-donacion.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '130105',
      },
    }, path: 'solicitud',
    component: ImportacionVehiculosUsadosDonacionComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ImportacionVehiculosUsadosDonacionRoutingModule { }

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { VehiculosUsadosAdaptadosComponent } from './pages/vehiculos-usados-adaptados/vehiculos-usados-adaptados.component';

import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [
  { canActivate: [IniciarTramiteResolver],
      data: {
        iniciarConfig: {
          procedureId: '130109',
        },
      },
    path: 'vehiculos-usados-adaptados',
    component :VehiculosUsadosAdaptadosComponent
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo: 'vehiculos-usados-adaptados'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class VehiculosUsadosAdaptadosRoutingModule {}
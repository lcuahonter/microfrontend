import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  {
      canActivate: [IniciarTramiteResolver],
      data: {
        iniciarConfig: {
          procedureId: '120201',
        },
      },
      path: 'persona-fisica',
      component: PantallasComponent,
    },
      {
    path: 'acuse',
    component: AcusePageComponent,
    
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'persona-fisica',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class CuposRoutingModule { }

import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';


const ROUTES: Routes = [
  {
    path: 'datos-de-la-solicitud',
    component: PantallasComponent,
    canActivate: [IniciarTramiteResolver],
      data: {
      iniciarConfig: {
        procedureId: '260601'
      }
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'datos-de-la-solicitud',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AvisoSanitarioRoutingModule { }
import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
            data: {
              iniciarConfig: {
                procedureId: '261702'
              }
            },
    path: 'pantallas',
    component: PantallasComponent,
  },
  {
    path: 'paso-uno',
    component: PasoUnoComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RetirosCofeprisRoutingModule { }

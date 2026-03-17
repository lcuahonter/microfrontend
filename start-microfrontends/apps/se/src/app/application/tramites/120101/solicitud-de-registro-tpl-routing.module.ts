import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  { canActivate: [IniciarTramiteResolver],
      data: {
        iniciarConfig: {
          procedureId: '120101',
        },
      },
    path: 'pantallas',
    component: PantallasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class SolicitudDeRegistroTplRoutingModule { }

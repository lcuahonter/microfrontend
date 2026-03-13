import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260605'
      }
    },
    path: 'datos-de-la-solicitud',
    component: PantallasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

/**
 * Este módulo se utiliza para configurar las rutas del módulo 220401.
 * Importar las rutas del módulo.
 */
export class PantallasRoutingModule { }

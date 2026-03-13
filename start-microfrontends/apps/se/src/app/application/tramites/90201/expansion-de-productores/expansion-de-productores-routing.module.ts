/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable sort-imports */
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PantallasComponent } from '../pages/pantallas/pantallas.component';

const routes: Routes = [
  {
    path: 'registrar-solicitud',
    component: PantallasComponent,
    canActivate: [IniciarTramiteResolver],
        data: {
        iniciarConfig: {
          procedureId: '90201'
        }
      }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

/**
 * Este módulo se utiliza para configurar las rutas del módulo 90201.
 * Importar las rutas del módulo.
 */
export class ExpansionDeProductoresRoutingModule { }

import { AcusePageComponent, AcuseResolucionPageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PantallasComponent } from '../pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  {
    path: 'datosdecomponentes',
    component: PantallasComponent,
    canActivate: [IniciarTramiteResolver],
    resolve: { iniciarResolverData: IniciarTramiteResolver },
    data: {
      iniciarConfig: {
        procedureId: '110101'
      }
    }
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: 'acuse-resolucion',
    component: AcuseResolucionPageComponent,
  },
   {
    path: '',
    pathMatch: 'full',
    redirectTo: 'datosdecomponentes',
  },
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

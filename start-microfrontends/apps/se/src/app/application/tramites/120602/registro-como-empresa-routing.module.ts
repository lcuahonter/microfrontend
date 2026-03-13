import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// eslint-disable-next-line sort-imports
import { CargarArchivosComponent } from './component/cargar-archivos/cargar-archivos.component';
import { DatosGeneralesSociosComponent } from './component/datos-generales-socios/datos-generales-socios.component';
import { DomicilioComponent } from './component/domicilio/domicilio.component';

import { DatosComponent } from './pages/datos/datos.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '120602'
      }
    },
    path: 'datos-empresa',
    component: DatosComponent,

  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'datos-empresa',
  },
  {
    path: 'domicilio',
    component: DomicilioComponent
  },
  {
    path: 'datos-generales-socios',
    component: DatosGeneralesSociosComponent
  },
  {
    path:'cargar-archivos',
    component:CargarArchivosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RegistroComoEmpresaRoutingModule { }

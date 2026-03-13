import { InicioComponent } from './inicio/inicio.component';

import { RouterModule, Routes } from '@angular/router';
import { ConsultarDocumentosDigitalizadosComponent } from './consultar-documentos-digitalizados/inicio/inicio.component';
import { NgModule } from '@angular/core';


const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: 'caat',
    loadChildren: () =>
      import('./caat/transporte-routing.module').then(
        (m) => m.TransporteModule
      )
  },
  {
    path: 'informacion-registro-proveedores',
    loadChildren : () =>
      import('./consulta-informacion-registro-proveedores/proveedores-routing.module').then(
        (m) => m.ProveedoresModule
      )
  },
  {
    path: 'tramites',
    loadChildren: () =>
      import('./tramites/tramites-routing.module').then(
        (m) => m.tramitesRoutingModule
      )
  },
  {
    path: 'informacion-agace-acna',
    loadChildren: () =>
      import('./consulta-informacion-agace-acna/agace-acna-routing.module').then(
        (m) => m.AgaceAcnaModule
      )
  },
  {
    path: 'consultar-documentos-digitalizados',
    component: ConsultarDocumentosDigitalizadosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
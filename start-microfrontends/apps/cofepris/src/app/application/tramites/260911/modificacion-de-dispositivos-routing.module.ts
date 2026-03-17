import { RouterModule, Routes } from '@angular/router';
import { AgregarFabricanteContenedoraComponent } from './component/agregar-fabricante-contenedora/agregar-fabricante-contenedora.component';

import { AgregarDestinatarioFinalContenedoraComponent } from './component/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from './component/agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';

import { AgregarFacturadorContenedoraComponent } from './component/agregar-facturador-contenedora/agregar-facturador-contenedora.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
// eslint-disable-next-line sort-imports

import { PermisoSanitarioComponent } from './pages/permiso-sanitario/permiso-sanitario.component';

const ROUTES: Routes = [
  {
       canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '260911',
          }
        },
    path: 'permiso-sanitario',
    component: PermisoSanitarioComponent,

  },
  {
    path: '',
    redirectTo: 'sanitary-permit',
    pathMatch: 'full',
   
  },
    {
    path: 'agregar-fabricante',
    component: AgregarFabricanteContenedoraComponent,
  },
  {
    path: 'agregar-destinatario-final',
    component: AgregarDestinatarioFinalContenedoraComponent,
  },
  {
    path: 'agregar-proveedor',
    component: AgregarProveedorContenedoraComponent,
  },
  {
    path: 'agregar-facturador',
    component: AgregarFacturadorContenedoraComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModificacionDeDispositivosRoutingModule { }

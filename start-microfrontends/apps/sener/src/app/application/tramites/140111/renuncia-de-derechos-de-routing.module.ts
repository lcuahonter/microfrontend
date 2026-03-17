import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { RenunciaDeDerechosDePermisosComponent } from './pages/renuncia-de-derechos-de-permisos/renuncia-de-derechos-de-permisos.component';

const ROUTES: Routes = [
  {
    path: 'solicitante',
    component: RenunciaDeDerechosDePermisosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RenunciaDeDerechosDeRoutingModule { }

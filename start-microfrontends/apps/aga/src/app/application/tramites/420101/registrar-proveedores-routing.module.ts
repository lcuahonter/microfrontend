import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegistroDeProveedoresManualComponent } from './components/registro-de-proveedores-manual/registro-de-proveedores-manual.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  },
  {
    path: 'solicitud',
    component: SolicitantePageComponent,
  },
  {
    path: 'registro-de-proveedores-manual',
    component: RegistroDeProveedoresManualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class RegistrarProveedoresRoutingModule {}

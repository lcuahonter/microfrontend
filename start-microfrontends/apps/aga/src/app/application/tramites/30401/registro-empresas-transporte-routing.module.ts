import { NgModule } from '@angular/core';
import { RegistroEmpresasTransporteComponent } from './pages/registro-empresas-transporte/registro-empresas-transporte.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'transporte',
    component: RegistroEmpresasTransporteComponent,
  },
  {
    path: 'transporte',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class RegistroEmpresasTransporteRoutingModule {}

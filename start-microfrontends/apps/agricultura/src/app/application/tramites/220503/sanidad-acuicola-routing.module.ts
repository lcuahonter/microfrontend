import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SanidadAcuicolaCertificadoComponent } from './pages/sanidadAcuicolaCertificado/sanidadAcuicolaCertificado.component';

export const ROUTES_SANIDAD_ACUICOLA: Routes = [
  {
    path: 'certificado',
    component: SanidadAcuicolaCertificadoComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'certificado',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_SANIDAD_ACUICOLA)],
  exports: [RouterModule],
})
export class SanidadAcuicolaRoutingModule {}

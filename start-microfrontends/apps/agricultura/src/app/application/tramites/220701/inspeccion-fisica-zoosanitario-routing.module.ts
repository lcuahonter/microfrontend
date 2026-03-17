import { InspeccionFisicaComponent } from './pages/inspeccion-fisica/inspeccion-fisica.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

export const ROUTES_PERMISO: Routes = [
  {
    path: 'inspeccion-fisica-zoosanitario',
    component: InspeccionFisicaComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inspeccion-fisica-zoosanitario',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_PERMISO)],
  exports: [RouterModule]
})
export class InspeccionFisicaZoosanitarioRoutingModule { }

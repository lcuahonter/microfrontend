import { InspeccionFisicaComponent } from './pages/inspeccion-fisica/inspeccion-fisica.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const ROUTERS: Routes = [
  {
    path: 'pantallas',
    component: InspeccionFisicaComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pantallas',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTERS)],
  exports: [RouterModule]
})
export class InspeccionFisicaRoutingModule { }
import { NgModule } from '@angular/core';
import { OeaTercerizacionLogisticaRegistroComponent } from './pages/oea-textil-registro/oea-tercerizacion-logistica-registro.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'oea-tercerizacion-logistica',
    component: OeaTercerizacionLogisticaRegistroComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class OeaTercerizacionLogisticaRegistroRoutingModule {}

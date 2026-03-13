import { NgModule } from '@angular/core';
import { RenovacionesComponent } from './pages/renovaciones/renovaciones.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'renovaciones',
    component: RenovacionesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class RenovacionesMuestrasMercanciasRoutingModule {}

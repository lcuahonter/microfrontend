import { RouterModule, Routes } from '@angular/router';
import { DestructionODonacionComponent } from './pages/destruccion-o-donacion/destruction-o-donacion.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: 'desrtruccion-o-donacion',
    component: DestructionODonacionComponent,
  },
  {
    path: '',
    redirectTo: 'desrtruccion-o-donacion',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AvisoDeMercanciaRoutingModule { }

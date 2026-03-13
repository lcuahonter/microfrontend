import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InicioComponent } from './inicio/inicio.component';
const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'inicio',
    component: InicioComponent,
  },
  /*{
    path: 'octava-temporal',
    loadChildren: () =>
      import('./tramites/130102/octava-temporal.module').then(
        (m) => m.OctavaTemporalModule
      ),
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
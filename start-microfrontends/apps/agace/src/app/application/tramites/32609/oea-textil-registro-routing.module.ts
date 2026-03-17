import { NgModule } from '@angular/core';
import { OeaTextilRegistroComponent } from './pages/oea-textil-registro/oea-textil-registro.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'operador-economico-autorizado-textil',
    component: OeaTextilRegistroComponent,
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
export class OeaTextilRegistroRoutingModule {}

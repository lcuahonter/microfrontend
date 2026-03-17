import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ProcesoCompletoComponent } from './pages/proceso-completo/proceso-completo.component';

export const ROUTES: Routes = [
  {
    path: 'proceso-completo',
    component: ProcesoCompletoComponent,
  },
  {
    path: 'paso-uno',
    component: PasoUnoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class CertiRegistroRoutingModule { }

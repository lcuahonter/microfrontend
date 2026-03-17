import { RouterModule, Routes } from '@angular/router';
import { AcuicolaPageComponent } from './pages/acuicola-page/acuicola-page.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: 'acuicola',
    component: AcuicolaPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'acuicola',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AcuicolaFisicaRoutingModule { }

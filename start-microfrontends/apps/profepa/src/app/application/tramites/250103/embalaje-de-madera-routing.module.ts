import { RouterModule, Routes } from '@angular/router';
import { EmbalajeDeMaderaComponent } from './pages/embalaje-de-madera/embalaje-de-madera.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path:'solictud',
    component:EmbalajeDeMaderaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class EmbalajeDeMaderaRoutingModule { }
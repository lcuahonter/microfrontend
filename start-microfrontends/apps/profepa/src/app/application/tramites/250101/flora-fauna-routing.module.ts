import { RouterModule, Routes } from '@angular/router';
import { FloraFaunaComponent } from './pages/flora-fauna/flora-fauna.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path:'solictud',
    component:FloraFaunaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class FloraFaunaRoutingModule { }
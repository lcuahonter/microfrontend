import { RouterModule, Routes } from '@angular/router';
import { DesistimientoPageComponent } from './pages/desistimiento-page/desistimiento-page.component';
import { NgModule } from '@angular/core';


export const ROUTES: Routes = [
  {
    path: 'desistimiento-page',
    component: DesistimientoPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class DesistimientoRoutingModule {}

import { RouterModule, Routes } from '@angular/router';
import { CorreccionInternaDeLaCofeprisComponent } from './pages/correccion-interna-de-la-cofepris/correccion-interna-de-la-cofepris.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
      path: 'correccion-interna-de-la-cofepris',
      component: CorreccionInternaDeLaCofeprisComponent,
     },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class CorreccionInternaDeLaCofeprisRoutingModule { }

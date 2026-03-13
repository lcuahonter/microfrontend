
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProsecModificacionComponent } from './pages/prosec-modificacion/prosec-modificacion.component';


const ROUTES: Routes = [
  {
      path: 'solicitante',
      component: ProsecModificacionComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ProsecModificacionRoutingModule { }

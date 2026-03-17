import { RouterModule, Routes } from '@angular/router';
import { ConsultarComponent } from './pages/consultar/consultar.component';
import { ModificarComponent } from './pages/modificar/modificar.component';
import { NgModule } from '@angular/core';
import { RegistrarComponent } from './pages/registrar/registrar.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'consultar' },
  {
    path: 'consultar',
    component: ConsultarComponent
  },
  {
    path: 'registrar',
    component: RegistrarComponent
  },
  {
    path: 'modificar',
    component: ModificarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ProsecRoutingModule {}

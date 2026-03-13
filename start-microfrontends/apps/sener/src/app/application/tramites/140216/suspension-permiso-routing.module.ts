import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  {
      path: 'suspension-permiso',
      component: PantallasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class SuspensionPermisoRoutingModule { }

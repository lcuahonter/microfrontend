import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  {
    path: 'pantallas',
    component: PantallasComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pantallas',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermisoSanitarioRoutingModule { }

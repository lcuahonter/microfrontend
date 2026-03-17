import { NgModule } from '@angular/core';
import { PermisoDeHidrocarburosComponent } from './pages/permiso-de-hidrocarburos/permiso-de-hidrocarburos.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';


const ROUTES: Routes = [
  {
    path: 'datos',
    component: PermisoDeHidrocarburosComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'datos'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermisoDeHidrocarburosRoutingModule { }

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PermisoDeRetiroComponent } from './pages/permiso-de-retiro/permiso-de-retiro.component';


export const ROUTES_PERMISO: Routes = [
  {
    path: 'permiso-de-retiro',
    component: PermisoDeRetiroComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'permiso-de-retiro',
  },

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_PERMISO)],
  exports: [RouterModule]
})
export class RetiroImportacionExportacionPermisoRoutingModule { }
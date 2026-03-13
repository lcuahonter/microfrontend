import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PermisoRemediosHerbalesComponent } from './pages/permiso-remedios-herbales/permiso-remedios-herbales.component';

const ROUTES: Routes = [
  {
    path:'permiso-remedios-herbals',
    component: PermisoRemediosHerbalesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ImportarDeRemediosHerbalsRoutingModule { }

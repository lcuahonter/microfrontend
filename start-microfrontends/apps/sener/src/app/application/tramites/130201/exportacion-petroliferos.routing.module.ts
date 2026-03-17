import { ExportacionPetroliferosComponent } from './pages/exportacion-petroliferos/exportacion-petroliferos.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';


const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: ExportacionPetroliferosComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ExportacionPetroliferosRoutingModule { }

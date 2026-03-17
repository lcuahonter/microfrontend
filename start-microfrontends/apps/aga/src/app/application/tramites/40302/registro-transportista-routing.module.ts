import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegistroTransportistaComponent } from './pages/registro-transportista/registro-transportista.component';

const REGISTRO_TRANSPORTISTA: Routes = [
  {
    path:'solicitante',
    component:RegistroTransportistaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(REGISTRO_TRANSPORTISTA)],
  exports: [RouterModule]
})
export class RegistroTransportistaRoutingModule { }
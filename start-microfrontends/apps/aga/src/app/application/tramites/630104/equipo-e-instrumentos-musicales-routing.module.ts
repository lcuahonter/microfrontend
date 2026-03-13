import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { EquipoEInstrumentosMusicalesComponent } from './pages/equipo-e-instrumentos-musicales/equipo-e-instrumentos-musicales.component';

const ROUTES: Routes = [
  {
    path: 'equipo-e-instrumentos-musicales', 
    component: EquipoEInstrumentosMusicalesComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'equipo-e-instrumentos-musicales'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class EquipoEInstrumentosMusicalesRoutingModule { }

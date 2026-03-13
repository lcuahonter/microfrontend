import { InicioAereoComponent } from './aereo/components/inicio.component';
import { InicioAgentesComponent } from './agentes-consignatarios/components/inicio.component';
import { InicioMaritimoComponent } from './maritimo/components/inicio.component';
import { InicioTerrestreComponent } from './terrestre/components/inicio.component';

import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { Routes } from '@angular/router';





const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'terrestre' },
  {
    path: 'terrestre',
    component: InicioTerrestreComponent,
  },
  {
    path: 'maritimo',
    component: InicioMaritimoComponent,
  },
  {
    path: 'aereo',
    component: InicioAereoComponent
  },

  {
    path:'agentes-consignatarios',
    component: InicioAgentesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class TransporteModule {}
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
export const ROUTES_MODIFICAR: Routes = [
  {
    path: 'solicitante',
    component: SolicitantePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitante',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_MODIFICAR)],
  exports: [RouterModule],
})
export class ModificarCaatTerrestreRoutingModule {}

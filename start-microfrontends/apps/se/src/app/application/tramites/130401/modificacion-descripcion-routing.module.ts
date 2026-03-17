import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { InvocarPageComponent } from './pages/invocar-page/invocar-page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

const ROUTES_CONTENEDOR: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '130401',
      },
    },
    path: 'solicitante',
    component: SolicitantePageComponent,
  },
  {
    path: 'invocar-modulo',
    component: InvocarPageComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'invocar-modulo',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_CONTENEDOR)],
  exports: [RouterModule],
})
export class ModificacionDescripcionRoutingModule {

}
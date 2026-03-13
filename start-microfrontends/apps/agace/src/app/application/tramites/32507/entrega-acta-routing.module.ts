import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { AcusePageComponent } from '@ng-mf/data-access-user';


export const ROUTES_AVISO: Routes = [
  {
    path: 'entrega-acta-solicitante',
    component: SolicitantePageComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'entrega-acta-solicitante',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_AVISO)],
  exports: [RouterModule],
  
})
export class EntregaActaRoutingModule { }

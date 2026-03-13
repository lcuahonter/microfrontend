import { RouterModule, Routes } from '@angular/router';
import { ExportacionDeDiamantesEnBrutoComponent } from './pages/exportacion-de-diamantes-en-bruto/exportacion-de-diamantes-en-bruto.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';


const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '130203',
      },
    },
    path: 'exportacion-de-diamantes-en-bruto',
    component: ExportacionDeDiamantesEnBrutoComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'exportacion-de-diamantes-en-bruto'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ExportaciónDeDiamantesEnBrutoRoutingModule { }

import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { DiamanteBrutoComponent } from './pages/diamante-bruto/diamante-bruto.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'diamante',
    component: DiamanteBrutoComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '130114',
      },
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'diamante',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class DiamanteBrutoRoutingModule { }

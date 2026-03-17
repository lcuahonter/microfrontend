import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { ProgramasProsecComponent } from './components/programas-prosec/programas-prosec.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    path: 'programas-prosec',
    component: ProgramasProsecComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'programas-prosec',
  },
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '90303',
      },
    },
    path: 'solicitud',
    component: SolicitudPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class CatalogosRoutingModule {}

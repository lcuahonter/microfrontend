import { RouterModule, Routes } from '@angular/router';
import { DatosBusquedaComponent } from './components/datos-busqueda/datos-busqueda.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { TecnicosComponent } from './pages/tecnicos/tecnicos.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110203'
      }
    },
    path: 'solicitante',
    component: DatosBusquedaComponent,
  },
  {
    path: 'tecnicosdatos',
    component: TecnicosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class TecnicosRoutingModule {}

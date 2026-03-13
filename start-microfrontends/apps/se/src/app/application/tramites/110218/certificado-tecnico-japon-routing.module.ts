import { RouterModule, Routes} from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { MercanciasSeleccionadasFormComponent } from './components/mercancias-seleccionadas-form/mercancias-seleccionadas-form.component';
import { NgModule } from '@angular/core';
import { ValidarCertificadoTecnicoJaponComponent } from './pages/validar-certificado-tecnico-japon/validar-certificado-tecnico-japon.component';

import { DatosBusquedaComponent } from './components/datos-busqueda/datos-busqueda.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110218',
      },
    },
    path: 'validar-certificado-tecnico-japon',
    component: DatosBusquedaComponent,
  },
  {
    path: 'validar-certificado-tecnico',
    component: ValidarCertificadoTecnicoJaponComponent,
  },
  {
    path: 'mercancias-seleccionadas-form',
    component: MercanciasSeleccionadasFormComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'validar-certificado-tecnico-japon',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class CertificadoTecnicoJaponRoutingModule {}

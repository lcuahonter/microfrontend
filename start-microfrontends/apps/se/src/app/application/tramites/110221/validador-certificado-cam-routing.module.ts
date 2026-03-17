import { RouterModule, Routes } from '@angular/router';
import { CertificadoComponent } from './page/certificado/certificado.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';

/**
 * Define la configuración de enrutamiento para el módulo.
 *
 * @constant
 * @type {Routes}
 * @description
 * - El array `ROUTES` especifica las rutas de navegación y sus componentes correspondientes.
 * - La ruta `path: 'certificado'` se asigna al componente `CertificadoComponent`.
 * - La ruta predeterminada (`path: ''`) redirige a la ruta `certificado` con una coincidencia completa de la ruta.
 */
const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110221',
      },
    },
    path: '',
    component: CertificadoComponent,
  },
  {
    path: '',
    redirectTo: 'solicitud',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ValidadorCertificadoCamRoutingModule {}

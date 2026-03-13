import { RouterModule, Routes } from '@angular/router';  
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RegistroPageComponent } from './pages/registro-page/registro-page.component'; 
/**
 * Módulo de enrutamiento para el registro de certificados zoosanitarios.
 * Define las rutas para la navegación dentro del módulo de registro de certificados.
 */

/**
 * Rutas de navegación para el módulo de registro de certificados zoosanitarios.
 */
export const ROUTES_REGISTRO: Routes = [
  {
    path: 'registro',
    component: RegistroPageComponent,
    canActivate: [IniciarTramiteResolver],
    resolve: { iniciarResolverData: IniciarTramiteResolver },
    data: {
      iniciarConfig: {
        procedureId: '80206'
        }
        
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registro',
  },
];

/**
 * Módulo de enrutamiento para el registro de certificados zoosanitarios.
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES_REGISTRO)],
  exports: [RouterModule]
})
export class CertificadoRegistro { }
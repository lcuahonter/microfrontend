import { RouterModule, Routes } from '@angular/router';  
import { NgModule } from '@angular/core';
import { RegistroPageComponent } from './pages/registro-page/registro-page.component'; 
/**
 * @fileoverview Módulo de enrutamiento para el registro de certificados zoosanitarios.
 * Define las rutas para la navegación dentro del módulo de registro de certificados.
 * @module CertificadoRegistroRoutingModule --80206
 */

/**
 * Rutas de navegación para el módulo de registro de certificados zoosanitarios.
 * @constant {Routes} ROUTES_REGISTRO
 */
export const ROUTES_REGISTRO: Routes = [
  {
    path: 'registro',
    component: RegistroPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registro',
  },
];

/**
 * Módulo de enrutamiento para el registro de certificados zoosanitarios.
 * @class CertificadoRegistro --80206
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES_REGISTRO)],
  exports: [RouterModule]
})
export class CertificadoRegistro { }
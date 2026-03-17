import { RouterModule, Routes } from '@angular/router';
import { AsignciondirectaPageComponent } from './pages/asignciondirecta-page/asignciondirecta-page.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';

/**
 * @description
 * Define las rutas para el módulo de entidad legal, específicamente para el trámite '120403'.
 * 
 * - La ruta 'solicitud' utiliza el componente `AsignciondirectaPageComponent`.
 * - Aplica el guard `IniciarTramiteResolver` para controlar el acceso.
 * - Incluye datos adicionales en la propiedad `data`, como la configuración de inicio del trámite.
 *
 * @see AsignciondirectaPageComponent
 * @see IniciarTramiteResolver
 */
const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '120403',
      },
    },
    path: 'solicitud',
    component: AsignciondirectaPageComponent,
  },
];

/**
 * Módulo de enrutamiento para la entidad legal.
 *
 * Este módulo configura las rutas hijas específicas para la entidad legal,
 * utilizando el arreglo de rutas `ROUTES`. Exporta el `RouterModule` para
 * que las rutas definidas estén disponibles en otros módulos.
 *
 * @remarks
 * Utiliza la función `forChild` de `RouterModule` para registrar rutas
 * secundarias dentro de la aplicación.
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class EntidadLegalRoutingModule {}

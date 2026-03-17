import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

/**
 * Rutas definidas para el módulo de Donación en la Franja Fronteriza.
 * Estas rutas gestionan la navegación dentro del trámite.
 */
export const ROUTES_ATTENTION: Routes = [
    /**
     * Ruta raíz que redirige a la página de solicitud.
     * @type {Route}
     */
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'aviso-mercancia-donada',
    },
    /**
     * Ruta para la página de solicitud.
     * @type {Route}
     */
    {
        path: 'aviso-mercancia-donada',
        component: SolicitantePageComponent,
    },
];

/**
 * Módulo de enrutamiento para el trámite de Donación en la Franja Fronteriza.
 * Este módulo configura las rutas necesarias para la navegación dentro del trámite.
 */
@NgModule({
    /**
     * Importa el módulo de enrutamiento con las rutas definidas.
     * @type {Array<any>}
     */
    imports: [RouterModule.forChild(ROUTES_ATTENTION)],

    /**
     * Exporta el módulo de enrutamiento para que pueda ser utilizado por otros módulos.
     * @type {Array<any>}
     */
    exports: [RouterModule],
})
export class AvisoMercanciaDonadaRoutingModule { }
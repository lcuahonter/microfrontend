import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

// Definición de las rutas para el módulo de solicitudes
export const ROUTES_SOLICITUDES: Routes = [
  {
    // Ruta para el componente de la página del solicitante
    path: 'solicitante',
    component: SolicitudPageComponent,
  },
  {
    // Redirección por defecto a la ruta 'solicitante' si la URL está vacía
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitante',
  },
];

@NgModule({
  // Importa el módulo de rutas hijo con las rutas definidas
  imports: [RouterModule.forChild(ROUTES_SOLICITUDES)],
  // Exporta RouterModule para que esté disponible en otros módulos
  exports: [RouterModule]
})
// Módulo de enrutamiento para la funcionalidad AvisoOpcionSeguroGlobal
export class AvisoOpcionSeguroGlobalRoutingModule { }

import { NgModule } from '@angular/core';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: PasoUnoComponent,
  },
  { path: 'requiremento', component: SolicitudPageComponent },
  { path: 'main', component: PasoUnoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})

/**
 * Este módulo se utiliza para configurar las rutas del módulo 31601.
 * Importar las rutas del módulo.
 */
export class AntecesorRoutingModule {}

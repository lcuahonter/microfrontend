import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  {
    path: 'datosdelasolicitud',
    component: PantallasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

/**
 * Este módulo se utiliza para configurar las rutas del módulo 220401.
 * Importar las rutas del módulo.
 */
export class PantallasRoutingModule { }

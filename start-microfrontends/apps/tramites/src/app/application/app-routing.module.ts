import { RouterModule, Routes } from '@angular/router';
import { AcusesResolucionesComponent } from './solicitudes-subsecuentes/components/acuses-resoluciones/acuses-resoluciones.component';
import { InicioComponent } from './inicio/inicio.component';
import { NgModule } from '@angular/core';
import { RouterOutletComponent } from './solicitudes-subsecuentes/router-outlet/router-outlet.component';
import { SolicitudesSubsecuentesComponent } from './solicitudes-subsecuentes/inicio/inicio.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: InicioComponent },
  { path: 'solicitudes-subsecuentes',
    component: RouterOutletComponent,
    children: [
      { path: '', component: SolicitudesSubsecuentesComponent },
      { path: 'acuses-y-resoluciones', component: AcusesResolucionesComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

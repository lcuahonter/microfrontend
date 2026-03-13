import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegistroTecnicaComponent } from './components/registro-tecnica/registro-tecnica.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
const ROUTES: Routes = [
  {
    component: SolicitudPageComponent,
    path: 'solicitud',
  },
  {
    component: RegistroTecnicaComponent,
    path: 'registro-tecnica',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registro-tecnica',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class JuntaTecnicaRegistroRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitudJuntaTecnicaComponent } from './pages/solicitud-junta-tecnica/solicitud-junta-tecnica.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudJuntaTecnicaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class JuntaTecnicaRoutingModule {}

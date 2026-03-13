import { RouterModule, Routes } from '@angular/router';
import { ComposicionComponent } from './components/composicion/composicion.component';
import { DestinatarioFinalComponent } from './components/destinatario-final/destinatario-final.component';
import { NgModule } from '@angular/core';
import { RepresentanteLegalComponent } from './components/representante-legal/representante-legal.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { UsoFinalComponent } from './components/uso-final/uso-final.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  },
  {
    path: 'composicion',
    component: ComposicionComponent
  },
  {
    path: 'uso-final',
    component: UsoFinalComponent,
  },
  {
    path: 'destinatario-final',
    component: DestinatarioFinalComponent,
  },
  {
    path: 'representante-legal',
    component: RepresentanteLegalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class MaterialesPeligrososRoutingModule {}

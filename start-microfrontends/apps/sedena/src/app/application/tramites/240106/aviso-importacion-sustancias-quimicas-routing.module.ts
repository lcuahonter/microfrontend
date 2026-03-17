import { RouterModule, Routes } from '@angular/router';
import { AgregarDestinatarioFinalContenedoraComponent } from './components/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarProveedorContenedoraComponent } from './components/agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { DatosMercanciaContenedoraComponent } from './components/datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contenedor-de-pasos',
  },
  {
    path: 'contenedor-de-pasos',
    component: SolicitudPageComponent,
  },
  {
      path: 'agregar-datos-mercancia',
      component: DatosMercanciaContenedoraComponent,
   },
    {
      path: 'agregar-destino-final',
      component: AgregarDestinatarioFinalContenedoraComponent,
    },
    {
      path: 'agregar-proveedor',
      component: AgregarProveedorContenedoraComponent,
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AvisoImportacionSustanciasQuimicasRoutingModule { 
  
}

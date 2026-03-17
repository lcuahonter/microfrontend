import { RouterModule, Routes } from '@angular/router';
import { AgregarDestinatarioFinalContenedoraComponent } from './components/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarFabricanteContenedoraComponent } from './components/agregar-fabricante-contenedora/agregar-fabricante-contenedora.component';
import { AgregarFacturadorContenedoraComponent } from './components/agregar-facturador-contenedora/agregar-facturador-contenedora.component';
import { AgregarProveedorContenedoraComponent } from './components/agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { DatosMercanciaContenedoraComponent } from './components/datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { ScianTablaContenedoraComponent } from './components/scian-tabla-contenedora/scian-tabla-contenedora.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudPageComponent,
     canActivate: [IniciarTramiteResolver],
    resolve: { iniciarResolverData: IniciarTramiteResolver },
    data: {
    iniciarConfig: {
      procedureId: '260206'
    }
  }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  },
  {
    path: 'scian-selecion',
    component: ScianTablaContenedoraComponent,
  },
  {
    path: 'mercancia-datos',
    component: DatosMercanciaContenedoraComponent,
  },
  {
    path: 'agregar-fabricante',
    component: AgregarFabricanteContenedoraComponent,
  },
  {
    path: 'agregar-destinatario-final',
    component: AgregarDestinatarioFinalContenedoraComponent,
  },
  {
    path: 'agregar-proveedor',
    component: AgregarProveedorContenedoraComponent,
  },
  {
    path: 'agregar-facturador',
    component: AgregarFacturadorContenedoraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class MaquilaMateriasPrimasModuleRoutingModule {}

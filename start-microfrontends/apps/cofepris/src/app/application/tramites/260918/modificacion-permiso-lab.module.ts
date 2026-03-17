import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  PasoCargaDocumentoComponent, 
  PasoFirmaComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
 
} from '@libs/shared/data-access-user/src';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { CommonModule } from '@angular/common';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { ManifiestosComponent } from "../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component";
import { ModificacionPermisoLabComponent } from './pages/modificacion-permiso-lab/modificacion-permiso-lab.component';
import { ModificacionPermisoLabRoutingModule } from './modificacion-permiso-lab-routing.module';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent} from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import {TercerosRelacionadosVistaComponent} from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';

import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

@NgModule({
  declarations: [
   
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    PasoCargaDocumentoComponent, 
    ModificacionPermisoLabComponent,
    PasoUnoComponent,
    PasoFirmaComponent ,
    CommonModule,
    ModificacionPermisoLabRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    DatosDelSolicitudModificacionComponent,
    TercerosRelacionadosVistaComponent,
    NotificacionesComponent,
    PagoDeDerechosContenedoraComponent,
    TramitesAsociadosSeccionComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    RepresentanteLegalComponent,
    ManifiestosComponent,
    NotificacionesComponent,
    AvisoDePrivacidadComponent
],
})
export class ModificacionPermisoLabModule {}

import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CargaDocumentoComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from './components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoOrdinarioImportacionExlposivoRoutingModule } from './permiso-ordinario-importacion-exlposivo-routing.module';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';


@NgModule({
  declarations: [
    PasoDosComponent,
    PasoUnoComponent,
    SolicitudPageComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    PermisoOrdinarioImportacionExlposivoRoutingModule,
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    SolicitanteComponent,
    DatosDelTramiteContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    PagoDeDerechosContenedoraComponent,
    FirmaElectronicaComponent,
    WizardComponent,
    BtnContinuarComponent,
    NotificacionesComponent,
    CargaDocumentoComponent
  ],
})
export class PermisoOrdinarioImportacionExlposivoModule {}

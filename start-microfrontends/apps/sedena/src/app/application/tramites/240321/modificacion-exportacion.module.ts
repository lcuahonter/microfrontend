import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CargaDocumentoComponent, FirmaElectronicaComponent, NotificacionesComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from './components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { FolioComponent } from './components/folio/folio.component';
import { ModificacionExportacionRoutingModule } from './modificacion-exportacion-routing.module';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';

@NgModule({
  declarations: [
 
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
  ],
  imports: [
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CommonModule,
    DatosDelTramiteContenedoraComponent,
    FirmaElectronicaComponent,
    FolioComponent,
    ModificacionExportacionRoutingModule,
    PagoDeDerechosContenedoraComponent,
    SolicitanteComponent,
    TercerosRelacionadosContenedoraComponent,
    TituloComponent,
    WizardComponent,
    PasoUnoComponent,
    NotificacionesComponent,
    CargaDocumentoComponent
  ],
  exports: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
  ],
})
export class ModificacionExportacionModule {}
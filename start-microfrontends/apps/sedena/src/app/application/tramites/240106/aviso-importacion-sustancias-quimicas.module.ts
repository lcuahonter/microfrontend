import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CargaDocumentoComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  SolicitanteComponent,
  TituloComponent
} from '@ng-mf/data-access-user';
import { AvisoImportacionSustanciasQuimicasRoutingModule } from './aviso-importacion-sustancias-quimicas-routing.module';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from './components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';


@NgModule({
  declarations: [
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent,
        SolicitudPageComponent,
  ],
  imports: [
      CommonModule,
      AvisoImportacionSustanciasQuimicasRoutingModule,
      SolicitanteComponent,
      DatosDelTramiteContenedoraComponent,
      TercerosRelacionadosContenedoraComponent,
      PagoDeDerechosContenedoraComponent,
      AlertComponent,
      TituloComponent,
      AnexarDocumentosComponent,
      FirmaElectronicaComponent,
      WizardComponent,
      BtnContinuarComponent,
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
export class AvisoImportacionSustanciasQuimicasModule { }

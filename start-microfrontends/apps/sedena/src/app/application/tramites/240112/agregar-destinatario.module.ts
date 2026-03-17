import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CargaDocumentoComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  SharedModule,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { AgregarDestinatarioFinalComponent } from '../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { AgregarDestinatarioFinalContenedoraComponent } from './components/agregar-destinatario-final-contenedora/agregar-destinatario-final-contenedora.component';
import { AgregarDestinatarioRoutingModule } from './agregar-destinatario-routing.module';
import { AgregarProveedorComponent } from '../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { AgregarProveedorContenedoraComponent } from './components/agregar-proveedor-contenedora/agregar-proveedor-contenedora.component';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDelTramiteContenedoraComponent } from './components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { DatosMercanciaComponent } from '../../shared/components/datos-mercancia/datos-mercancia.component';
import { DatosMercanciaContenedoraComponent } from './components/datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechocComponent } from './components/pago-de-derechoc/pago-de-derechoc.component';
import { PagoDeDerechosComponent } from '../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosComponent } from '../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';

@NgModule({
  declarations: [
    SolicitudPageComponent,
    PasoDosComponent,
    PasoTresComponent,

  ],
  imports: [
    CommonModule,
    AgregarDestinatarioRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    PagoDeDerechosComponent,
    DatosMercanciaComponent,
    DatosDelTramiteComponent,
    AgregarProveedorComponent,
    AgregarDestinatarioFinalComponent,
    SharedModule,
    TercerosRelacionadosComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    PasoUnoComponent,
    PagoDeDerechocComponent,
    TercerosRelacionadosContenedoraComponent,
    DatosDelTramiteContenedoraComponent,
    DatosMercanciaContenedoraComponent,
    AgregarProveedorContenedoraComponent,
    AgregarDestinatarioFinalContenedoraComponent,
    NotificacionesComponent,
    CargaDocumentoComponent
  ],
})
export class AgregarDestinatarioModule {}

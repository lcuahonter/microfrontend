import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogosService,
  FirmaElectronicaComponent,
  InicioSesionService,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
  SubirDocumentoService,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { CommonModule } from '@angular/common';
import { DatosSolicitudComponent } from './components/datos-solicitud/datos-solicitud.component';
import { NgModule } from '@angular/core';
import { PagoDerechosComponent } from './components/pago-derechos/pago-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoSujetosRoutingModule } from './permiso-sujetos-routing.module';
import { PlaguicidasComponent } from './pages/plaguicidas/plaguicidas.component';
import { TercerosRelacionadosFabricanteComponent } from './components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import {RepresentanteLegalRfcComponent} from '../../shared/components/representante-legal-rfc/representante-legal-rfc.component';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import {DatosDelEstablecimientoRFCComponent} from '../../shared/components/datos-del-establecimiento-rfc/datos-del-establecimiento-rfc.component';
import {DomicilioComponent} from '../../shared/components/domicilio-establecimiento/domicilio-establecimiento.component';
import { TercerosRelacionadosComponent } from '../../shared/components/terceros-fabricante/terceros-fabricante.component';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
    PlaguicidasComponent,
  ],
  imports: [
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    CommonModule,
    PermisoSujetosRoutingModule,
    DatosSolicitudComponent,
    TercerosRelacionadosFabricanteComponent,
    PagoDerechosComponent,
    AvisoDePrivacidadComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    RepresentanteLegalRfcComponent,
    ManifiestosComponent,
    DatosDelEstablecimientoRFCComponent,
    DomicilioComponent,
    TercerosRelacionadosComponent
  ],
  providers: [
    ToastrService,
    CatalogosService,
    InicioSesionService,
    provideHttpClient(),
    SubirDocumentoService,
  ],
})
export class PermisoSujetosModule {}

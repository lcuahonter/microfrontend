import {
  CatalogosService,
  InicioSesionService,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SubirDocumentoService,
} from '@libs/shared/data-access-user/src';
import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src/tramites/components/anexar-documentos/anexar-documentos.component';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { CommonModule } from '@angular/common';
import { DatosDeLaComponent } from '../../shared/components/datos-solicitud/datos-solicitud.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosBancoComponent } from '../../shared/components/pago-de-derechos-banco/pago-de-derechos-banco.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoPlaguicidasImportacionRoutingModule } from './permiso-plaguicidas-importacion-routing.module';
import { PlaguicidasComponent } from './pages/plaguicidas/plaguicidas.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TercerosRelacionadosComponent } from '../../shared/components/terceros-fabricante/terceros-fabricante.component';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { provideHttpClient } from '@angular/common/http';
import {RepresentanteLegalRfcComponent} from '../../shared/components/representante-legal-rfc/representante-legal-rfc.component';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import {DatosDelEstablecimientoRFCComponent} from '../../shared/components/datos-del-establecimiento-rfc/datos-del-establecimiento-rfc.component';
import {DomicilioComponent} from '../../shared/components/domicilio-establecimiento/domicilio-establecimiento.component';
@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
    PlaguicidasComponent
  ],
  imports: [
    CommonModule,
    PermisoPlaguicidasImportacionRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    SolicitanteComponent,
    PagoDeDerechosBancoComponent,
    TercerosRelacionadosComponent,
    DatosDeLaComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
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
export class PermisoPlaguicidasImportacionModule {}

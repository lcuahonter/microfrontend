import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  InicioSesionService,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { CertificadosComponent } from './components/certificados/certificados.component';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DestinatarioAgenteAduanalComponent } from './components/destinatario-agente-adunal/destinatario-agente-aduanal.component';
import { FloraFaunaComponent } from './pages/flora-fauna/flora-fauna.component';
import { FloraFaunaRoutingModule } from './flora-fauna-routing.module';
import { MercanciasComponent } from './components/mercancias/mercancias.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { RequisitosComponent } from '../250102/components/requisitos/requisitos.component';
import { SolicitanteService } from '@ng-mf/data-access-user';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TipoMovimientoComponent } from './components/tipo-movimiento/tipo-movimiento.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [FloraFaunaComponent, DatosComponent, PasoDosComponent,PasoTresComponent],
  imports: [
    CommonModule,
    AlertComponent,
    FloraFaunaRoutingModule,
    WizardComponent,
    TituloComponent,
    CertificadosComponent,
    TipoMovimientoComponent,
    DestinatarioAgenteAduanalComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    PagoDeDerechosComponent,
    MercanciasComponent,
    RequisitosComponent
  ],
  providers: [
    provideHttpClient(),
    ToastrService,
    SolicitanteService,
    InicioSesionService,
    SubirDocumentoService,
  ],

})
export class FloraFaunaModule {}

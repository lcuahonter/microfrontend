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
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DestinatarioAgenteAduanalComponent } from './components/destinatario-agente-adunal/destinatario-agente-aduanal.component';
import { EmbalajeDeMaderaComponent } from './pages/embalaje-de-madera/embalaje-de-madera.component';
import { EmbalajeDeMaderaRoutingModule } from './embalaje-de-madera-routing.module';
import { MercanciasComponent } from './components/mercancias/mercancias.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { RequisitosComponent } from './components/requisitos/requisitos.component';
import { SolicitanteService } from '@ng-mf/data-access-user';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TipoMovimientoComponent } from './components/tipo-movimiento/tipo-movimiento.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [EmbalajeDeMaderaComponent, DatosComponent, PasoDosComponent,PasoTresComponent],
  imports: [
    CommonModule,
    AlertComponent,
    EmbalajeDeMaderaRoutingModule,
    WizardComponent,
    TituloComponent,
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
export class EmbalajeDeMaderaModule {}

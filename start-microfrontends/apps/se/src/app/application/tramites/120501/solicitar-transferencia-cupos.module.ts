import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, FirmaElectronicaComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LicitacionesVigentesComponent } from './component/licitaciones-vigentes/licitaciones-vigentes.component';
import { PasoSolicitanteComponent } from './pages/paso-solicitante/paso-solicitante.component';
import { SolicitarTransferenciaCuposMainComponent } from './pages/solicitar-transferencia-cupos-main/solicitar-transferencia-cupos-main.component';
import { SolicitarTransferenciaCuposRoutingModule } from './solicitar-transferencia-cupos-routing.module';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PasoSolicitanteComponent,
    SolicitarTransferenciaCuposMainComponent
  ],
  imports: [
    CommonModule,
    SolicitarTransferenciaCuposRoutingModule,
    WizardComponent,
    TituloComponent,
    LicitacionesVigentesComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    AlertComponent,
    TablaDinamicaComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
  exports: [TablaDinamicaComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [ToastrService]
})
export class SolicitarTransferenciaCuposModule { }

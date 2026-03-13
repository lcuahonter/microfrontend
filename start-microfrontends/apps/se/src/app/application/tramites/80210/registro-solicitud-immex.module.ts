import {
  AlertComponent,
  AnexarDocumentosComponent,
  CatalogoSelectComponent,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  TablaDinamicaComponent,
} from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { EmpresasTerciarizadasComponent } from './components/empresas-terciarizadas/empresas-terciarizadas.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitarTransferenciaCuposModule } from '../120501/solicitar-transferencia-cupos.module';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';
import { registroSolicitudImmexComponent } from './pages/registro-solicitud-immex/registro-solicitud-immex.component';
import { registroSolicitudImmexRoutingModule } from './registro-solicitud-immex-routing.module';
import { registroSolicitudImmexService } from './services/registro-solicitud-immex.service';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    registroSolicitudImmexComponent,
    EmpresasTerciarizadasComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    registroSolicitudImmexRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    FormsModule,
    AlertComponent,
    AnexarDocumentosComponent,
    CatalogoSelectComponent,
    SolicitarTransferenciaCuposModule,
    TablaDinamicaComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent,
    ToastrModule.forRoot(),
  ],
  exports: [PasoUnoComponent, PasoDosComponent, PasoTresComponent],
  providers: [registroSolicitudImmexService, ToastrService],
})
export class registroSolicitudImmexModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AlertComponent,CargaDocumentoComponent, AnexarDocumentosComponent, BtnContinuarComponent, SolicitanteComponent, TituloComponent, WizardComponent, PasoFirmaComponent } from '@ng-mf/data-access-user';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { TemporalContenedoresRoutingModule } from './temporal-contenedores-routing.module';
import { NotificacionesComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    SolicitantePageComponent,
    PasoDosComponent
  ],
  imports: [
    CommonModule,
    SolicitanteComponent,
    TemporalContenedoresRoutingModule,
    BtnContinuarComponent,
    PasoUnoComponent,
    PasoTresComponent,
    WizardComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    TituloComponent,
    CargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent
  ],
  exports: [],
  providers: [
    ToastrService
  ]
})
export class TemporalContenedoresModule { }

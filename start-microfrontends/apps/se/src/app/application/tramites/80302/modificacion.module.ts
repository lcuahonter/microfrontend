import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ModificacionRoutingModule } from './modificacion.routing.module';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    SolicitantePageComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    SolicitanteComponent,
    ModificacionRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    PasoUnoComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent
  ],
  exports: [],
  providers: [
    ToastrService
  ]
})
export class ModificacionModule { }

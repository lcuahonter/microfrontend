import { 
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  FirmaElectronicaComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SharedModule,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TableComponent,
  TituloComponent,
  WizardComponent
 } from '@ng-mf/data-access-user';
 import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AutorizacionProsecRoutingModule } from './autorizacion-prosec-routing.module';
import { CommonModule } from '@angular/common';
import { DomiciliosDePlantasComponent } from './components/domicilios-de-plantas/domicilios-de-plantas.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ProductorIndirectoComponent } from './components/productor-indirecto/productor-indirecto.component';
import { ProsecComponent } from './pages/prosec/prosec.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SectoresYMercanciasComponent } from './components/sectores-y-mercancias/sectores-y-mercancias.component';

@NgModule({
  declarations: [
    ProsecComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    AutorizacionProsecRoutingModule,
    WizardComponent,
    TituloComponent,
    SharedModule,
    ReactiveFormsModule,
    BtnContinuarComponent,
    RouterModule,
    SolicitanteComponent,
    AlertComponent,
    CatalogoSelectComponent,
    TableComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    TablaDinamicaComponent,
    PasoUnoComponent,
    DomiciliosDePlantasComponent,
    SectoresYMercanciasComponent,
    ProductorIndirectoComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    ToastrModule.forRoot()
  ],
  providers: [
    ToastrService
  ]
})
export class AutorizacionProsecModule { }

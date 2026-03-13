import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  CatalogosService,
  CrosslistComponent,
  FirmaElectronicaComponent,
  InputRadioComponent,
  SolicitanteComponent,
  TableComponent,
  TituloComponent,
  TramiteFolioService,
  WizardComponent
} from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImportadorExportadorRoutingModule } from './importador-exportador-routing.module';
import { ImportadorExportadorService } from './services/importador-exportador.service';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    ImportadorExportadorRoutingModule,
    SolicitanteComponent,
    BtnContinuarComponent,
    WizardComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TableComponent,
    InputRadioComponent,
    CrosslistComponent,
    ReactiveFormsModule,
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,    
    
],
exports:[],
providers: [
  ToastrService,
  ImportadorExportadorService,
  CatalogosService,
  TramiteFolioService,
  provideHttpClient(),
],
schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImportadorExportadorModule { }

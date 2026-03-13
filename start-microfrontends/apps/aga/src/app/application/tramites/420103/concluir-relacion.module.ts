import { AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InputFechaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, TramiteFolioService, WizardComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ConcluirRelacionComponent } from './components/concluir-relacion/concluir-relacion.component';
import { ConcluirRelacionRoutingModule } from './concluir-relacion-routing.module';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    PasoUnoComponent,
    SolicitudPageComponent,
    ConcluirRelacionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ConcluirRelacionRoutingModule,
    SolicitanteComponent,
    BtnContinuarComponent,
    WizardComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    ReactiveFormsModule,
    InputFechaComponent,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    PasoTresComponent
  ],
exports:[],
providers: [
  ToastrService,
  TramiteFolioService
],
schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConcluirRelacionModule { }

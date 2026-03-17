import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import {
  AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent,
  CatalogoSelectComponent, CrosslistComponent, FirmaElectronicaComponent,
  InputFechaComponent, InputRadioComponent, NotificacionesComponent, PasoFirmaComponent,
  TablaDinamicaComponent, TableComponent, TituloComponent, WizardComponent
} from '@ng-mf/data-access-user';

import { CargaDocumentoComponent } from '@libs/shared/data-access-user/src';

import { AutorizacionesDeVidaSilvestreRoutingModule } from './autorizaciones-de-vida-silvestre-routing.module';
import { DatosComponent } from './pages/datos/datos.component';
import { ModalComponent } from './components/modal/modal.component';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

@NgModule({
  declarations: [DatosComponent, PasoDosComponent, PasoTresComponent, ModalComponent, DatosComponent],
  imports: [
    AutorizacionesDeVidaSilvestreRoutingModule,
    WizardComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    AlertComponent,
    CrosslistComponent,
    TableComponent,
    InputFechaComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    ToastrModule.forRoot(),
    NotificacionesComponent,
    InputRadioComponent,
    CargaDocumentoComponent,
    PasoFirmaComponent,
    PasoUnoComponent,

  ],
  providers: [ToastrService]
})
export class AutorizacionesDeVidaSilvestreModule { }

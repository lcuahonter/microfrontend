import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent, CargaDocumentoComponent,
  CatalogoSelectComponent,
  CrosslistComponent,
  FirmaElectronicaComponent,
  InputCheckComponent,
  InputFechaComponent,
  InputRadioComponent, PasoFirmaComponent,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TableComponent,
  TercerosComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ImportacionDeAcuiculturaRoutingModule } from './importacion-de-acuicultura-routing.module';

import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';

import { DatosParaMovilizacionComponent } from './components/datos-para-movilizacion/datos-para-movilizacion.component';

import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ImportacionDeAcuiculturaRoutingModule,
    ReactiveFormsModule,
    DatosDeLaSolicitudComponent,
    DatosParaMovilizacionComponent,
    PagoDeDerechosComponent,
    // UI Components from data-access-user
    TablaDinamicaComponent,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    CrosslistComponent,
    InputCheckComponent,
    AlertComponent,
    InputFechaComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    InputRadioComponent,
    TableComponent,
    CatalogoSelectComponent,
    TercerosComponent,
    ToastrModule.forRoot(),
    CargaDocumentoComponent,
    PasoFirmaComponent,
  ],
  providers: [ToastrService],
})
export class ImportacionDeAcuiculturaModule {}

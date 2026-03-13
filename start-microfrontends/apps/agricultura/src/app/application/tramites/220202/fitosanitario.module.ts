import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { FitosanitarioRoutingModule } from './fitosanitario-routing.module';

import { AgriculturaComponent } from './pages/agricultura/agricultura.component';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';

import { DatosParaMovilizacionNacionalComponent } from './components/datos-para-movilizacion-nacional/datos-para-movilizacion-nacional.component';

import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';


import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CargaDocumentoComponent,
  FirmaElectronicaComponent,
  PasoFirmaComponent,
  SharedModule,
  SolicitanteComponent,
  TercerosComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TercerospageComponent } from './components/tercerospage/tercerospage.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FitosanitarioRoutingModule,
    SharedModule,
    TituloComponent,
    BtnContinuarComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    TercerosComponent,
    ToastrModule.forRoot(),
    DatosDeLaSolicitudComponent,
    DatosParaMovilizacionNacionalComponent,
    PagoDeDerechosComponent,
    TercerospageComponent,
    CargaDocumentoComponent,
    PasoFirmaComponent,
  ],
  providers: [ToastrService],
})
export class FitosanitarioModule {}

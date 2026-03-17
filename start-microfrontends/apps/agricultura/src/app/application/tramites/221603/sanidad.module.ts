import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  InputRadioComponent,
  TablaDinamicaComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';

import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FirmarSolicitudComponent } from './pages/firmar-solicitud/firmar-solicitud.component';
import { InputFechaComponent } from '@ng-mf/data-access-user'
import { NgModule } from '@angular/core';

import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { MovilizacionComponent } from './components/movilizacion/movilizacion.component';
import { SanidadComponent } from './pages/sanidad/sanidad.component';
import { SanidadRoutingModule } from './sanidad-routing.module';

import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from './components/solicitante/solicitante.component';
import { TercerosComponent } from './components/terceros/terceros.component';

@NgModule({
  declarations: [
    DatosComponent,
    DatosDeLaSolicitudComponent,
    FirmarSolicitudComponent,
    SanidadComponent,
    PasoDosComponent,
    PagoDeDerechosComponent,
    MovilizacionComponent,
    TercerosComponent,
    SolicitanteComponent,
  ],
  imports: [
    CommonModule,
    AlertComponent,
    AnexarDocumentosComponent,
    SanidadRoutingModule,
    BtnContinuarComponent,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    WizardComponent,
    FirmaElectronicaComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    InputFechaComponent
  ],
  providers: [ToastrService],
})
export class SanidadModule {}

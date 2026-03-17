import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { DatosComponent } from './pages/datos/datos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { RenewalVatIepsModAAModuleRoutingModule } from './renewal-vat-ieps-mod-aa-routing.module';

import { AvisoDeRenovacionComponent } from './components/aviso-de-renovacion/aviso-de-renovacion.component';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InicioSesionService, ServiciosPantallasService, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';

import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { AvisoUnicoService } from './services/aviso-unico.service';
import { PasoDosComponent } from './components/paso-dos/paso-dos.component';
import { PasoTresComponent } from './components/paso-tres/paso-tres.component';

@NgModule({
  declarations: [
    DatosComponent,
    PantallasComponent,
    PasoDosComponent,
    PasoTresComponent
    ],
  imports: [
  CommonModule,
  RenewalVatIepsModAAModuleRoutingModule,
  AvisoDeRenovacionComponent,
  SolicitanteComponent,
  AlertComponent,
  BtnContinuarComponent,
  TituloComponent,
  WizardComponent,
  TituloComponent,
  AlertComponent,
  AnexarDocumentosComponent,
  FirmaElectronicaComponent
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    ServiciosPantallasService,
    InicioSesionService,
    SubirDocumentoService,
    AvisoUnicoService
  ],
})
export class RenewalVatIepsModAAModule { }

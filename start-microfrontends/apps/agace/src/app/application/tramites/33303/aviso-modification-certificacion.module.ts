import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { AvisoUnicoRenovacionRoutingModule } from './aviso-modification-certificacion-routing.module';
import { DatosComponent } from './pages/datos/datos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

import { AvisoDeRenovacionComponent } from './components/aviso-de-renovacion/aviso-de-renovacion.component';

import { AlertComponent, BtnContinuarComponent, InicioSesionService, ServiciosPantallasService, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';

import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { AvisoUnicoService } from './services/aviso-unico.service';
import { PasoDosComponent } from './components/paso-dos/paso-dos.component';
import { PasoTresComponent } from './components/paso-tres/paso-tres.component';
import { TipoDeAvisoComponent } from './components/tipoDeAviso/tipoDeAviso.component';

@NgModule({
  declarations: [ DatosComponent,PantallasComponent],
  imports: [
    CommonModule,
    AvisoUnicoRenovacionRoutingModule,
    AvisoDeRenovacionComponent,
    SolicitanteComponent,
    AlertComponent,
  BtnContinuarComponent,
  TituloComponent,
  WizardComponent,
  PasoDosComponent,
  PasoTresComponent,
  TipoDeAvisoComponent
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
export class AvisoModificacionCertificacionModule { }

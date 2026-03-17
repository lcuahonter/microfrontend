import { CommonModule } from '@angular/common';

import {
  AlertComponent,
  BtnContinuarComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { NgModule } from '@angular/core';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';

import { AvisoSiglosComponent } from './pages/aviso-siglos/aviso-siglos.component';
import { SolicitanteComponent } from './components/solicitante/solicitante.component';

import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';

import { Datos270201Component } from './pages/datos-270201/datos-270201.component';

import { AvisoSiglosRoutingModule } from './aviso-siglos-routing.module';
import { SolicitudService } from './services/solicitud.service';

@NgModule({
  declarations: [AvisoSiglosComponent, Datos270201Component],
  imports: [
    AlertComponent,
    CommonModule,
    AvisoSiglosRoutingModule,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    DatosDeLaSolicitudComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  providers: [
    provideHttpClient(),
    SolicitudService,
    ToastrService,
    InicioSesionService,
    SubirDocumentoService,
  ],
})
export class AvisoSiglosModule {}

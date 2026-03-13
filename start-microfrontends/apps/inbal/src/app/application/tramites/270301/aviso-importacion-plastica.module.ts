import { CommonModule } from '@angular/common';

import {
  BtnContinuarComponent,
  SolicitanteComponent,
  SolicitanteService,
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

import { PantallasComponent } from './pages/pantallas/pantallas.component';


import { DatosDeLaSolicitudPlasticaComponent } from './components/datos-de-la-solicitud-plastica/datos-de-la-solicitud-plastica.component';

import { DatosComponent } from './pages/datos/datos.component';

import { AvisoImportacionPlasticaRoutingModule } from './aviso-importacion-plastica-routing.module';
import { SolicitudService } from './services/solicitud.service';

@NgModule({
  declarations: [PantallasComponent, DatosComponent],
  imports: [
    CommonModule,
    AvisoImportacionPlasticaRoutingModule,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    DatosDeLaSolicitudPlasticaComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  providers: [
    provideHttpClient(),
    SolicitudService,
    ToastrService,
    InicioSesionService,
    SubirDocumentoService,
    SolicitanteService
  ],
})
export class AvisoImportacionPlasticaModule {}

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { WizardComponent } from '@libs/shared/data-access-user/src';

import { RegistrarSolicitudRoutingModule } from './registrar-solicitud-routing.module';

import { PasoUnoComponent } from '../pages/paso-uno/paso-uno.component';

import { PasoTresComponent } from '../pages/paso-tres/paso-tres.component';
import { SolicitudPageComponent } from '../pages/solicitud-page/solicitud-page.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';

import { AlertComponent, AnexarDocumentosComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { TercerosComponent } from '@libs/shared/data-access-user/src';

import { DatosTramiteComponent } from '../components/datosTramite.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrarSolicitudService } from '../services/registrar-solicitud.service';
import { TercerosRelacionadosComponent } from '../components/terceros-relacionados/terceros-relacionados.component';

import { DatosDeLaSolicitudComponent } from '../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PasoUnoComponent,
    SolicitudPageComponent,
  ],
  imports: [
    PasoTresComponent,
    TituloComponent,
    DatosDeLaSolicitudComponent,
    TercerosRelacionadosComponent,
    DatosTramiteComponent,
    BtnContinuarComponent,
    CommonModule,
    RegistrarSolicitudRoutingModule,
    WizardComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    TercerosComponent,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [RegistrarSolicitudService,ToastrService],

})
export class RegistrarSolicitudModule { }

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SolicitudImportacionAmbulanciaRoutingModule } from './solicitud-importacion-ambulancia-routing.module';

import { AlertComponent, BtnContinuarComponent, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';


import { PasoDosComponent } from '../120402/components/paso-dos/paso-dos.component';

import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudImportacionAmbulanciaComponent } from './pages/solicitud-importacion-ambulancia/solicitud-importacion-ambulancia.component';

@NgModule({
  declarations: [
    SolicitudImportacionAmbulanciaComponent,
    PasoUnoComponent,
    SolicitudComponent
  ],
  imports: [
    CommonModule,
    SolicitudImportacionAmbulanciaRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    InputRadioComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    PasoDosComponent,
    DatosDelTramiteComponent,
    DatosDeLaMercanciaComponent,
    PartidasDeLaMercanciaComponent ,
    TablaDinamicaComponent,
    PaisProcendenciaComponent,
    RepresentacionComponent,
    CrosslistComponent,
    AlertComponent,
    NotificacionesComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent
  ]
})
export class SolicitudImportacionAmbulanciaModule { }

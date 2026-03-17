import { AlertComponent, BtnContinuarComponent, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { ExportacionMineralesDeHierroRoutingModule } from './exportacion-minerales-de-hierro-routing.module';

import { ExportacionMineralesDeHierroComponent } from './pages/exportacion-minerales-de-hierro/exportacion-minerales-de-hierro.component';
import { NgModule } from '@angular/core';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { PasoTresComponent } from '../120402/components/paso-tres/paso-tres.component';

import { PasoDosComponent } from '../120402/components/paso-dos/paso-dos.component';

import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
@NgModule({
  declarations: [
    ExportacionMineralesDeHierroComponent,
    PasoUnoComponent,
    SolicitudComponent
  ],
  imports: [
    CommonModule,
    ExportacionMineralesDeHierroRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    InputRadioComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    PasoTresComponent,
    PasoDosComponent,
    DatosDelTramiteComponent,
    DatosDeLaMercanciaComponent,
    PartidasDeLaMercanciaComponent ,
    TablaDinamicaComponent,
    PaisProcendenciaComponent,
    RepresentacionComponent,
    PasoFirmaComponent,
    CrosslistComponent,
    NotificacionesComponent,
        PasoCargaDocumentoComponent,
    AlertComponent
  ]
})
export class ExportacionMineralesDeHierroModule { }

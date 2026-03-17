import { AlertComponent, BtnContinuarComponent, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { ImportacionNeumaticosComercializarComponent } from './pages/importacion-neumaticos-comercializar/importacion-neumaticos-comercializar.component';
import { ImportacionNeumaticosComercializarRoutingModule } from './importacion-neumaticos-comercializar-routing.module';
import { NgModule } from '@angular/core';
import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PasoDosComponent } from '../120402/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../120402/components/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';


@NgModule({
  declarations: [
    ImportacionNeumaticosComercializarComponent,
    PasoUnoComponent,
    SolicitudComponent
  ],
  imports: [
    CommonModule,
    ImportacionNeumaticosComercializarRoutingModule,
    ReactiveFormsModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    InputRadioComponent,
    SolicitanteComponent, 
    PasoTresComponent,
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
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ]
})
export class ImportacionNeumaticosComercializarModule { }

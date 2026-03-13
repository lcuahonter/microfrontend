import { AlertComponent, BtnContinuarComponent, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { ImportacionDeVehiculosUsadosComponent } from './pages/importacion-de-vehiculos-usados/importacion-de-vehiculos-usados.component';
import { ImportacionDeVehiculosUsadosRoutingModule } from './importacion-de-vehiculos-usados-routing.module';
import { NgModule } from '@angular/core';
import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PasoDosComponent } from '../120402/components/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';

@NgModule({
  declarations: [
    PasoUnoComponent,
    SolicitudComponent,
    ImportacionDeVehiculosUsadosComponent
  ],
  imports: [
    CommonModule,
    ImportacionDeVehiculosUsadosRoutingModule,
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
    PasoFirmaComponent,
    NotificacionesComponent
  ]
})
export class ImportacionDeVehiculosUsadosModule { }

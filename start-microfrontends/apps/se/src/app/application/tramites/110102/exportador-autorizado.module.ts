import { BtnContinuarComponent, NotificacionesComponent } from "@ng-mf/data-access-user";
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDeLaMercanciaComponent } from "./components/datos-de-la-mercancia/datos-de-la-mercancia.component";
import { DatosTratadosAcuerdosComponent } from "./components/datos-tratados-acuerdos/datos-tratados-acuerdos.component";

import { DatosEvaluacionComponent } from "./pages/datos-evaluacion/datos-evaluacion.component";
import { DatosMercanciaComponent } from "./pages/datos-mercancia/datos-mercancia.component";
import { ExportadorautorizadoRoutingModule } from './exportador-autorizado-routing.module';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from "./pages/paso-dos/paso-dos.component";
import { PasoTresComponent } from "./pages/paso-tres/paso-tres.component";
import { RegistroMercanciaComercializadorComponent } from "./components/registro-mercancia-comercializador/registro-mercancia-comercializador.component";
import { RepresentacionFederalComponent } from "./components/representacion-federal/representacion-federal.component";
import { SolicitanteComponent } from "@ng-mf/data-access-user";
import { TablaDinamicaComponent } from "@ng-mf/data-access-user";

import { AlertComponent,AnexarDocumentosComponent,FirmaElectronicaComponent ,TituloComponent,WizardComponent} from "@ng-mf/data-access-user";
import { BsModalService } from "ngx-bootstrap/modal";
import { ExportadorAutorizadoComponent } from "./components/exportador-autorizado/exportador-autorizado.component";
import { InformacionOpcionalComponent } from "./components/informacion-opcional/informacion-opcional.component";









@NgModule({
  declarations: [DatosComponent,DatosMercanciaComponent,PasoDosComponent,PasoTresComponent],
  imports: [
    CommonModule,
    ExportadorautorizadoRoutingModule,
    SolicitanteComponent,
    DatosTratadosAcuerdosComponent,
    RegistroMercanciaComercializadorComponent,
    DatosDeLaMercanciaComponent,
    RepresentacionFederalComponent,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    WizardComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    ExportadorAutorizadoComponent,
    InformacionOpcionalComponent,
    NotificacionesComponent,
    DatosEvaluacionComponent
],
providers: [BsModalService],
})
export class ExportadorautorizadoModule { }

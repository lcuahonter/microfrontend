import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {AlertComponent, BtnContinuarComponent, NotificacionesComponent} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosAdicionalesComponent } from '../components/datos-adicionales/datos-adicionales.component';
import { DatosComponent } from '../pages/datos/datos.component';
import { DatosMercanciaComponent } from '../components/datos-mercancia/datos-mercancia.component';
import { ExportadorAutorizadoComponent } from '../components/exportador-autorizado/exportador-autorizado.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FirmarSolicitudComponent } from '../pages/firmar-solicitud/firmar-solicitud.component';
import { NavComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PantallasComponent } from '../pages/pantallas/pantallas.component';
import { PantallasRoutingModule } from './pantallas-routing.module';
import { ProcesosComponent } from "../components/procesos/procesos.component";
import { ProtestoDecirVerdadComponent } from '../components/protesto-decir-verdad/protesto-decir-verdad.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TratadosComponent } from '../components/tratados/tratados.component';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    DatosComponent,
    PantallasComponent,
    FirmarSolicitudComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PantallasRoutingModule,
    WizardComponent,
    NavComponent,
    SolicitanteComponent,
    DatosMercanciaComponent,
    DatosAdicionalesComponent,
    TratadosComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    ProtestoDecirVerdadComponent,
    ProcesosComponent,
    NotificacionesComponent,
    ExportadorAutorizadoComponent,
    AlertComponent
],
exports: [
    DatosComponent,
  ]
})

/**
 * Este módulo se utiliza para configurar los componentes del módulo 220401.
 * Importar los componentes del módulo.
 */
export class Pantallas110101Module { }

/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OctavaTemporalRoutingModule } from './octava-temporal-routing.module';

import { CriterioDeDictComponent } from './component/criterio-de-dict/criterio-de-dict.component';
import { DetosDelLaMarcaciaComponent } from './component/datos-de-la-mercacia/datos-de-la-mercacia.component';
import { DetosDelTramiteComponent } from './component/datos-del-tramite/datos-del-tramite.component';
import { PaisProcendenciaComponent } from './component/pais-procendencia/pais-procendencia.component';
import { SolicitanteOctavaTemporalComponent } from './component/solicitante-octava-temporal/solicitante-octava-temporal.component';

import { PartidasDeLaComponent } from './component/partidas-de-la/partidas-de-la.component';
import { RepresentacionComponent } from './component/representacion/representacion.component';
import { UsoEspicificoComponent } from './component/uso-especifico/uso-especifico.component';

import { DatosComponent } from './pages/datos/datos.component';

import { OctavaTemporalComponent } from './pages/octava-temporal/octava-temporal.component';
import { Solicitante130102Component } from './pages/solicitante/solicitante.component';

import { BtnContinuarComponent } from 'libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { WizardComponent } from 'libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

import { provideHttpClient } from '@angular/common/http';

import { AlertComponent, NotificacionesComponent, SolicitanteComponent } from '@ng-mf/data-access-user';

//import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component'; 

import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
@NgModule({
  declarations: [
    OctavaTemporalComponent,
    Solicitante130102Component,
    DatosComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    OctavaTemporalRoutingModule,
    BtnContinuarComponent,
    CriterioDeDictComponent,
    DetosDelLaMarcaciaComponent,
    DetosDelTramiteComponent,
    SolicitanteOctavaTemporalComponent,
    PaisProcendenciaComponent,
    PartidasDeLaComponent,
    RepresentacionComponent,
    TituloComponent,
    UsoEspicificoComponent,
    WizardComponent,
    FirmaElectronicaComponent, 
    SolicitanteComponent,
    AlertComponent,
    NotificacionesComponent
  ],
  providers: [
    provideHttpClient(),
  ]
})
export class OctavaTemporalModule { }

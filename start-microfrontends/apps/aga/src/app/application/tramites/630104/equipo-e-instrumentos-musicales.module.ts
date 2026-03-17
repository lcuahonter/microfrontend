import { AlertComponent} from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import {DatosMercanciaComponent} from './components/datos-mercancia/datos-mercancia.component';
import{ManifiestoComponent} from './components/manifiesto/manifiesto.component';

import { EquipoEInstrumentosMusicalesRoutingModule } from './equipo-e-instrumentos-musicales-routing.module'

import { EquipoEInstrumentosMusicalesComponent } from './pages/equipo-e-instrumentos-musicales/equipo-e-instrumentos-musicales.component';


import { BtnContinuarComponent, CrosslistComponent, InputRadioComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoDosComponent} from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';


import { ReactiveFormsModule } from '@angular/forms';

import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';

import { SolicitudTabComponentsComponent } from './pages/solicitud-tab-components/solicitud-tab-components.component';

import {TipoPropietarioComponent} from './components/tipo-propietario/tipo-propietario.component';

import {FechaDeImportacionComponent } from './components/fecha-de-importacion/fecha-de-importacion.component';

import {DatosDelNombreComponent} from './components/datos-del-nombre/datos-del-nombre.component';


@NgModule({
  declarations: [
    EquipoEInstrumentosMusicalesComponent,
    PasoUnoComponent,
    SolicitudTabComponentsComponent
    
  ],
  imports: [
    CommonModule,
    AlertComponent,
    DatosDeLaSolicitudComponent,
    TipoPropietarioComponent,
    FechaDeImportacionComponent,
    DatosDelNombreComponent,
    DatosMercanciaComponent,
    ManifiestoComponent,
    EquipoEInstrumentosMusicalesRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    PasoTresComponent,
    PasoDosComponent,
    TituloComponent,
    InputRadioComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    CrosslistComponent
  ]
})
export class EquipoEInstrumentosMusicalesModule { }

import { AutorizacionImportacionTemporalComponent } from './pages/autorizacion-importacion-temporal/autorizacion-importacion-temporal.component';
import { AutorizacionImportacionTemporalRoutingModule } from './autorizacion-importacion-temporal-routing.module';
import { CommonModule } from '@angular/common';
import { FechaDeImportacionComponent } from './components/fecha-de-importacion/fecha-de-importacion.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertComponent, BtnContinuarComponent, CatalogoSelectComponent, FirmaElectronicaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from "@ng-mf/data-access-user";
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DatosDeLaSolicitudComponent } from "./components/datos-de-la-solicitud/datos-de-la-solicitud.component";
import { TipoPropietarioComponent } from "./components/tipo-propietario/tipo-propietario.component";

import { DatosMercanciaComponent } from "./components/datos-mercancia/datos-mercancia.component";
import { ManifiestoComponent } from "./components/manifiesto/manifiesto.component";






@NgModule({
  declarations: [AutorizacionImportacionTemporalComponent, PasoUnoComponent, SolicitudComponent, PasoDosComponent,
    PasoTresComponent],
  imports: [
    CommonModule,
    AutorizacionImportacionTemporalRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    ToastrModule.forRoot(),
    DatosDeLaSolicitudComponent,
    FechaDeImportacionComponent,
    TipoPropietarioComponent,
    DatosMercanciaComponent,
    ManifiestoComponent,
    AnexarDocumentosComponent
],
  providers: [
    ToastrService,
  ]
})
export class AutorizacionImportacionTemporalModule { }

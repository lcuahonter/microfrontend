import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertComponent, BtnContinuarComponent, CatalogoSelectComponent, FirmaElectronicaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { RetornoImportacionTemporalComponent } from './pages/retorno-importacion-temporal-page/retorno-importacion-temporal-page.component';

import { AnexarDocumentosComponent } from "@ng-mf/data-access-user";
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RetornoImportacionTemporalRoutingModule } from './retorno-importacion-temporal-routing.module';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DatosDeLaSolicitudComponent } from "./components/datos-de-la-solicitud/datos-de-la-solicitud.component";
import { TipoPropietarioComponent } from "./components/tipo-propietario/tipo-propietario.component";

import { DatosMercanciaComponent } from "./components/datos-mercancia/datos-mercancia.component";
import { ManifiestoComponent } from "./components/manifiesto/manifiesto.component";



@NgModule({
  declarations: [RetornoImportacionTemporalComponent, PasoUnoComponent, SolicitudComponent, PasoDosComponent,
    PasoTresComponent],
  imports: [
    CommonModule,
    RetornoImportacionTemporalRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    AlertComponent,
    ToastrModule.forRoot(),
    DatosDeLaSolicitudComponent,
    TipoPropietarioComponent,
    DatosMercanciaComponent,
    ManifiestoComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
],
  providers: [
    ToastrService,
  ]
})
export class RetornoImportacionTemporalModule { }

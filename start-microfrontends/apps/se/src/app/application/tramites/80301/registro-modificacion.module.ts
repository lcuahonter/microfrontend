import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { CommonModule } from '@angular/common';
import { ComplementariaImmexComponent } from './components/complementaria-immex/complementaria-immex.component';
import { ModificacionComponent } from './components/modificacion/modificacion.component';
import { NgModule } from '@angular/core';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroModificacionPageComponent } from './pages/registro-modificacion-page/registro-modificacion-page.component';
import { RegistroModificacionRoutingModule } from './registro-modificacion.routing.module';
import { RegistroSolicitudComponent } from './components/registro-solicitud/registro-solicitud.component';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

/**
 * Módulo para el registro y modificación del trámite 80301.
 * Este módulo incluye todos los componentes, páginas y servicios necesarios
 * para gestionar el proceso de registro y modificación del trámite.
 * @module RegistroModificacionModule
 */
@NgModule({
  declarations: [],
  imports: [
    TablaDinamicaComponent,
    TituloComponent,
    ComplementariaImmexComponent,
    CommonModule,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    ModificacionComponent,
    BtnContinuarComponent,
    FormsModule,
    WizardComponent,
    ReactiveFormsModule,
    RouterModule,
    RegistroModificacionRoutingModule,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    RegistroModificacionPageComponent,
    PasoUnoComponent,
    BitacoraComponent,
    RegistroSolicitudComponent
  ],
  exports: [],
  providers: [ToastrService],
})

/**
 * Clase que representa el módulo de registro y modificación del trámite 80301.
 * @class RegistroModificacionModule
 */
export class RegistroModificacionModule {}

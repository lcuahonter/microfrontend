/**
 * @module ImmexRegistroDeSolicitudModalityModule
 * @description Módulo para el registro de solicitud IMMEX modalidad ampliación subsecuente sensibles.
 * Incluye la configuración de rutas y la declaración de componentes.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { AlertComponent, PasoCargaDocumentoComponent, PasoFirmaComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { Anexo1Component } from './components/anexo-1/anexo-1.component';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { ImmexRegistroDeSolicitudModalityRoutingModule } from './immex-registro-de-solicitud-modalidad-enrutamiento.modulo';
import { ImmexRegistroSolicitudModalityComponent } from './pages/immex-registro-solicitud-modality/immex-registro-solicitud-modality.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';



@NgModule({
  declarations: [
    PasoTresComponent,
    ImmexRegistroSolicitudModalityComponent,
  ],
  imports: [
    CommonModule,
    ImmexRegistroDeSolicitudModalityRoutingModule,
    CommonModule,
    WizardComponent,
    SharedModule,
    BtnContinuarComponent,
    ReactiveFormsModule,
    TituloComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    CatalogoSelectComponent,
    Anexo1Component,
    TablaDinamicaComponent,
    SolicitanteComponent,
    PasoUnoComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent
  ],
  providers: [ToastrService],
})
export class ImmexRegistroDeSolicitudModalityModule { }

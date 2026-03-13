import { AlertComponent, PasoCargaDocumentoComponent } from '@ng-mf/data-access-user';
import { AmpliacionServiciosComponent } from './components/ampliacion-servicios/ampliacion-servicios.component';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CertificadoRegistro } from './certificado-registro-routing.module';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { InputCheckComponent } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroPageComponent } from './pages/registro-page/registro-page.component';
import { ToastrService } from 'ngx-toastr';

/**
 * @fileoverview Módulo para el registro de certificados zoosanitarios.
 * Este módulo declara y exporta los componentes necesarios para el registro de certificados,
 * incluyendo los pasos del asistente y otros componentes compartidos.
 * @module CertificadoRegistroModule --80205
 */

/**
 * Módulo para el registro de certificados zoosanitarios.
 * @class CertificadoRegistroModule --80205
 */

@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    RegistroPageComponent,
  ],
  imports: [
    AlertComponent,
    AmpliacionServiciosComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    CertificadoRegistro,
    CommonModule,
    CrosslistComponent,
    FirmaElectronicaComponent,
    InputCheckComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    SharedModule,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
  ],
  providers: [ToastrService]
})
export class CertificadoRegistroModule { }
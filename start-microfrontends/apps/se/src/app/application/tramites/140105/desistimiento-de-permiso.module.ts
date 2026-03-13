import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { BusquedaFolioComponent } from './pages/busqueda-folio/busqueda-folio.component';
import { CancelacionDeSolicitudComponent } from './components/cancelacion-de-solicitud/cancelacion-de-solicitud.component';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { DesistimientoDePermisoRoutingModule } from './desistimiento-de-permiso-routing.module';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { InputCheckComponent } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@ng-mf/data-access-user';
import { IntroPermisoComponent } from './pages/intro-permiso/intro-permiso.component';
import { NgModule } from '@angular/core';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { PasoCargaDocumentoComponent } from '@ng-mf/data-access-user';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TableComponent } from '@ng-mf/data-access-user';
import { TercerosComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * @fileoverview Módulo para el desistimiento de permiso.
 * Este módulo declara y exporta los componentes necesarios para el desistimiento de permiso,
 * incluyendo los pasos del asistente y otros componentes compartidos.
 * @module DesistimientoDePermisoModule --140105
 */

/**
 * Módulo para el desistimiento de permiso.
 * @class DesistimientoDePermisoModule --140105
 */

@NgModule({
  declarations: [
    IntroPermisoComponent,
    PasoTresComponent,
    PasoUnoComponent,
    PasoDosComponent,
    CancelacionDeSolicitudComponent,
    BusquedaFolioComponent
  ],
  imports: [
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    CommonModule,
    CrosslistComponent,
    DesistimientoDePermisoRoutingModule,
    FirmaElectronicaComponent,
    InputCheckComponent,
    InputFechaComponent,
    InputRadioComponent,
    NotificacionesComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    ReactiveFormsModule,
    SharedModule,
    SolicitanteComponent,
    TablaDinamicaComponent,
    TableComponent,
    TercerosComponent,
    TituloComponent,
    ToastrModule.forRoot(),
    WizardComponent
  ],
  providers: [
    ToastrService
  ]
})
export class DesistimientoDePermisoModule { }

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ImportacionesAgropecuariasRoutingModule } from './importaciones-agropecuarias-routing.module';
import { ImportacionesAgropecuariasService } from '../services/importaciones-agropecuarias.service';
import { NgModule } from '@angular/core';
import { PasoUnoComponent } from '../pages/paso-uno/paso-uno.component';
import { SolicitudComponent } from '../components/solicitud/solicitud.component';
import { TodosPasosComponent } from '../pages/todos-pasos/todos-pasos.component';
import { provideHttpClient } from '@angular/common/http';

/**
 * Módulo para gestionar las importaciones agropecuarias.
 */
@NgModule({
  declarations: [
    TodosPasosComponent,
    PasoUnoComponent
  ],
  imports: [
    CommonModule,
    ImportacionesAgropecuariasRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    SolicitudComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent
  ],
  providers: [
    provideHttpClient(),
    BsModalService,
    ImportacionesAgropecuariasService
  ],
})
/**
 * Clase ImportacionesAgropecuariasModule
 * Módulo que encapsula la funcionalidad relacionada con las importaciones agropecuarias.
 * Incluye componentes, servicios y rutas específicas para este trámite.
 * @export
 * @class ImportacionesAgropecuariasModule
 * @typedef {ImportacionesAgropecuariasModule}
 * @description Módulo que encapsula la funcionalidad relacionada con las importaciones agropecuarias.
 * Incluye componentes, servicios y rutas específicas para este trámite.
 */
export class ImportacionesAgropecuariasModule { }

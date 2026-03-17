/**
 * Módulo de Angular para la funcionalidad de solicitud de modificación de permiso de internación.
 *
 * Este módulo declara y agrupa los componentes, servicios y módulos necesarios para el flujo de
 * solicitud de modificación de permiso de internación, incluyendo el asistente (wizard), los pasos
 * del proceso, la gestión de terceros relacionados, el pago de derechos y la asociación de trámites.
 *
 * Importa módulos compartidos, componentes de pasos, servicios de sesión y carga de documentos,
 * así como utilidades para notificaciones y formularios reactivos.
 *
 * Proporciona los servicios requeridos para la gestión de sesión, carga de documentos y notificaciones.
 *
 * @module SolicitudModificacionPermisoInternacionModule
 */
import { AlertComponent, BtnContinuarComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudContenedoraComponent } from './components/datos-de-la-solicitud-contenedora/datos-de-la-solicitud-contenedora.component';
import { DatosDelSolicituteSeccionStateStore } from '../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDelSolicituteSeccionQuery } from '../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from '../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitudModificacionPermisoInternacionComponent } from './pages/solicitud-modificacion-permiso-internacion/solicitud-modificacion-permiso-internacion.component';
import { SolicitudModificacionPermisoInternacionRoutingModule } from './solicitud-modificacion-permiso-internacion-routing.module';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { TramiteAsociadosComponent } from '../../shared/components/tramite-asociados/tramite-asociados.component';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';

@NgModule({
  declarations: [
    SolicitudModificacionPermisoInternacionComponent,
    PasoUnoComponent
  ],
  imports: [
    CommonModule,
    SolicitudModificacionPermisoInternacionRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    DatosDeLaSolicitudContenedoraComponent,
    ReactiveFormsModule,
    SolicitanteComponent,
    AlertComponent,
    TramiteAsociadosComponent,
    PagoDeDerechosComponent,
    TercerosRelacionadosContenedoraComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    ToastrModule.forRoot()
  ],
  providers: [
    ToastrService,
    InicioSesionService,
    SubirDocumentoService,
    DatosDelSolicituteSeccionStateStore,
    DatosDelSolicituteSeccionQuery
  ]
})
export class SolicitudModificacionPermisoInternacionModule { }

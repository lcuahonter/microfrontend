/**
 * Módulo de Angular para la funcionalidad de solicitud de modificación de permiso de salida del territorio.
 *
 * Este módulo declara y agrupa los componentes, servicios y módulos necesarios para el flujo de
 * solicitud de modificación de permiso de salida del territorio, incluyendo el asistente (wizard), los pasos
 * del proceso, la gestión de terceros relacionados, el pago de derechos y la asociación de trámites.
 *
 * Importa módulos compartidos, componentes de pasos, servicios de sesión y carga de documentos,
 * así como utilidades para notificaciones y formularios reactivos.
 *
 * Proporciona los servicios requeridos para la gestión de sesión, carga de documentos y notificaciones.
 *
 * @module SolicitudModificacionPermisoSalidaTerritorioModule
 */
import { AlertComponent, BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudContenedoraComponent } from './components/datos-de-la-solicitud-contenedora/datos-de-la-solicitud-contenedora.component';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CargaDocumentoComponent } from '@libs/shared/data-access-user/src/tramites/components/carga-documento/carga-documento.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src/tramites/components/paso-firma/paso-firma.component';

import { PagoDeDerechosComponent } from '../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitudModificacionPermisoSalidaTerritorioComponent } from './pages/solicitud-modificacion-permiso-salida-territorio/solicitud-modificacion-permiso-salida-territorio.component';
import { SolicitudModificacionPermisoSalidaTerritorioRoutingModule } from './solicitud-modificacion-permiso-salida-territorio-routing.module';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { TramiteAsociadosComponent } from '../../shared/components/tramite-asociados/tramite-asociados.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';

@NgModule({
  declarations: [
    SolicitudModificacionPermisoSalidaTerritorioComponent,
    PasoUnoComponent,
  ],
  imports: [
    CommonModule,
    SolicitudModificacionPermisoSalidaTerritorioRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    ReactiveFormsModule,
    SolicitanteComponent,
    DatosDeLaSolicitudContenedoraComponent,
    AlertComponent,
    TercerosRelacionadosContenedoraComponent,
    TramiteAsociadosComponent,
    PagoDeDerechosComponent,
    PasoDosComponent,
    PasoTresComponent,
    ToastrModule.forRoot()
    ,CargaDocumentoComponent
    ,PasoFirmaComponent
  ],
  providers: [
    ToastrService,
    InicioSesionService,
    SubirDocumentoService
  ]
  ,schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SolicitudModificacionPermisoSalidaTerritorioModule {}

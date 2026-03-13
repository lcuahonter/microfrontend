/**
 * Componente para la modificación de permisos de importación de tratamientos.
 */
import {
  AlertComponent,
  BtnContinuarComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';


import { DatosDeLaSolicitudComponent } from '../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { ModificacionPermisoImportacionTratamientosComponent } from './pages/modificacion-permiso-importacion-tratamientos/modificacion-permiso-importacion-tratamientos.component';


import { ModificacionPermisoImportacionTratamientosRoutingModule } from './modificacion-permiso-importacion-tratamientos-routing.module';

import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PasoDosComponent } from '../../shared/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../../shared/components/paso-tres/paso-tres.component';
import { PasoUnoPagesComponent } from './pages/paso-uno-pages/paso-uno-pages.component';
import { TercerosRelacionadosFebService } from '../../shared/services/tereceros-relacionados-feb.service';
import { ToastrService } from 'ngx-toastr';

import { TercerosRelacionadosFabSeccionComponent } from '../../shared/components/terceros-relacionados-fab-seccion/terceros-relacionados-fab-seccion.component';

import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';
/*
  * Modulo para la modificación de permisos de importación de tratamientos.
  * Este módulo contiene los componentes y servicios necesarios para la funcionalidad de modificación de permisos.
  * 
  * @export
  * @class ModificacionPermisoImportacionTratamientosModule
  */
@NgModule({
  declarations: [PasoUnoPagesComponent, ModificacionPermisoImportacionTratamientosComponent],
  imports: [
    WizardComponent,
    TituloComponent,
         BtnContinuarComponent,
         CommonModule,
         FormsModule,
         SolicitanteComponent,
         DatosDeLaSolicitudComponent,
         DatosDelSolicitudModificacionComponent,
         TramitesAsociadosSeccionComponent,
         PagoDeDerechosEntradaComponent,
         AlertComponent,
         TercerosRelacionadosFabSeccionComponent,
         PasoDosComponent,
         PasoTresComponent,
    ModificacionPermisoImportacionTratamientosRoutingModule,
  ],
  providers: [
    provideHttpClient(),
    ToastrService,
    TercerosRelacionadosFebService,
  ],
})
/**
 * Módulo para la modificación de permisos de importación de tratamientos.
 * Este módulo contiene los componentes y servicios necesarios para la funcionalidad de modificación de permisos.
 * 
 * @export
 * @class ModificacionPermisoImportacionTratamientosModule
 */
export class ModificacionPermisoImportacionTratamientosModule {}

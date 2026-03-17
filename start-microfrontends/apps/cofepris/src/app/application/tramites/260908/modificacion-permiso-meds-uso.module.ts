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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { DatosDeLaSolicitudComponent } from '../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';

import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PasoDosComponent } from '../../shared/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../../shared/components/paso-tres/paso-tres.component';

import { TercerosRelacionadosFebService } from '../../shared/services/tereceros-relacionados-feb.service';
import { ToastrService } from 'ngx-toastr';

import { TercerosRelacionadosFabSeccionComponent } from '../../shared/components/terceros-relacionados-fab-seccion/terceros-relacionados-fab-seccion.component';

import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import { ModificacionPermisoMedsUsoComponent } from './pages/modificacion-permiso-meds-uso/modificacion-permiso-meds-uso.component';
import { ModificacionPermisoMedsUsoRoutingModule } from './modificacion-permiso-meds-uso.routing.module';
import { provideHttpClient } from '@angular/common/http';

import { PasoUnoPagesComponent } from './pages/paso-uno-pages/paso-uno-pages.component';
@NgModule({
  declarations: [ModificacionPermisoMedsUsoComponent,PasoUnoPagesComponent],
  imports: [ 
           WizardComponent,
           TituloComponent,
           ReactiveFormsModule,
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
    ModificacionPermisoMedsUsoRoutingModule],
     providers: [
        provideHttpClient(),
        ToastrService,
        TercerosRelacionadosFebService,
      ],
})
export class ModificacionPermisoMedsUsoModule {}

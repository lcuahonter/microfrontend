import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

import {
  AlertComponent,
  BtnContinuarComponent,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoSanitarioRoutingModule } from './permiso-sanitario-routing.module';
import { PermisoSanitarioSolicitanteComponent } from './pages/permiso-sanitario-solicitante/permiso-sanitario-solicitante';

import { DatosDeLaSolicitudComponent } from '../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';

import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';

import { TercerosRelacionadosModificacionComponent } from '../../shared/components/shared2609/terceros-relacionados-modificacion/terceros-relacionados.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { ToastrService } from 'ngx-toastr';



@NgModule({
  declarations: [PermisoSanitarioSolicitanteComponent, PasoUnoComponent],
  imports: [
    WizardComponent,
    BtnContinuarComponent,
    CommonModule,
    FormsModule,
    SolicitanteComponent,
    DatosDeLaSolicitudComponent,
    DatosDelSolicitudModificacionComponent,
    PermisoSanitarioRoutingModule,
    TramitesAsociadosSeccionComponent,
    TercerosRelacionadosModificacionComponent,
    PagoDeDerechosEntradaComponent,
    TercerosRelacionadosVistaComponent,
    RepresentanteLegalComponent,
    ManifiestosComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    PagoDeDerechosContenedoraComponent,
    AlertComponent
  ],
   providers: [ToastrService ],
})
export class PermisoSanitarioModule {}
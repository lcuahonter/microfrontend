import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent ,PasoCargaDocumentoComponent,PasoFirmaComponent,} from '@libs/shared/data-access-user/src';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import { PagoDeDerechosContenedoraComponent} from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoSanitarioDispositivosMedicosComponent } from './pages/permiso-sanitario-dispositivos-medicos/permiso-sanitario-dispositivos-medicos.component';

import { PermisoSanitarioDispositivosMedicosRoutingModule } from './permiso-sanitario-dispositivos-medicos-routing.module';
import { PermisoSanitarioDispositivosMedicosService } from './services/permiso-sanitario-dispositivos-medicos.service';
import {TercerosRelacionadosVistaComponent} from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';

import { ToastrService } from 'ngx-toastr';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

@NgModule({
    declarations: [
      PasoUnoComponent,
      PasoDosComponent,
      PasoTresComponent,
      PermisoSanitarioDispositivosMedicosComponent,
    ],
  imports: [
    CommonModule,
    PermisoSanitarioDispositivosMedicosRoutingModule,
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    TercerosRelacionadosVistaComponent,
    AvisoDePrivacidadComponent,
    CommonModule,
   
    FirmaElectronicaComponent,
    InputFechaComponent,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    TramitesAsociadosSeccionComponent,
    RepresentanteLegalComponent,
    DatosDelSolicitudModificacionComponent,
    ManifiestosComponent,
    PagoDeDerechosContenedoraComponent,
    NotificacionesComponent,
    PasoCargaDocumentoComponent,
        PasoFirmaComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ToastrService,PermisoSanitarioDispositivosMedicosService],
})
export class PermisoSanitarioDispositivosMedicosModule { }

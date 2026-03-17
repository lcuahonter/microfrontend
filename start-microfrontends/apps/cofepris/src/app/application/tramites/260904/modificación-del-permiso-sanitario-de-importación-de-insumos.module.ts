import { AlertComponent,BtnContinuarComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { CommonModule } from '@angular/common';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { ModPermisoSanitarioImportacion260904Component } from './pages/mod-permiso-sanitario-importacion-260904/mod-permiso-sanitario-importacion-260904.component';
import { ModificaciónDelPermisoSanitarioDeImportaciónDeInsumosRoutingModule } from './modificación-del-permiso-sanitario-de-importación-de-insumos-routing.module';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent} from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import {TercerosRelacionadosVistaComponent} from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { ToastrService } from 'ngx-toastr';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import { WizardComponent } from '@libs/shared/data-access-user/src';

import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';

import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';


@NgModule({
  declarations: [
    ModPermisoSanitarioImportacion260904Component,
    PasoUnoComponent
  ],
  imports: [
    CommonModule,
    ModificaciónDelPermisoSanitarioDeImportaciónDeInsumosRoutingModule,
    PasoDosComponent,
    PasoTresComponent,
    WizardComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    DatosDelSolicitudModificacionComponent,
    PagoDeDerechosContenedoraComponent,
    TramitesAsociadosSeccionComponent,
    RepresentanteLegalComponent,
    ManifiestosComponent,
    AvisoDePrivacidadComponent,
    TercerosRelacionadosVistaComponent,
    AlertComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent
  ],
  providers: [ToastrService, InicioSesionService, SubirDocumentoService],
})
export class ModificaciónDelPermisoSanitarioDeImportaciónDeInsumosModule {}

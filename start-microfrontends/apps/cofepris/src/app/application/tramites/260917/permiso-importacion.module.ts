import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent,NotificacionesComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { CommonModule } from '@angular/common';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosSolicitudComponent } from './components/datos-solicitud/datos-solicitud.component';
import { ModificacionPermisoImportacionComponent } from './pages/modificacion-permiso-importacion/modificacion-permiso-importacion.component';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { NgModule } from '@angular/core';
import {PasoCargaDocumentoComponent} from '@ng-mf/data-access-user';
import { PagoDeDerechosComponent } from '../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDeDerechosContenedoraComponent} from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoImportacionRoutingModule } from './permiso-importacion-routing.module';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import {TercerosRelacionadosVistaComponent} from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';

import { TercerosRelacionadosComponent } from '../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';


@NgModule({
  declarations: [
    ModificacionPermisoImportacionComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    
  ],
  imports: [CommonModule, PermisoImportacionRoutingModule, BtnContinuarComponent, WizardComponent, SolicitanteComponent, DatosSolicitudComponent,
    AvisoDePrivacidadComponent, DatosDelSolicitudModificacionComponent,
    PagoDeDerechosComponent, AlertComponent, TramitesAsociadosSeccionComponent, TercerosRelacionadosComponent, TituloComponent, AnexarDocumentosComponent, FirmaElectronicaComponent,
    ManifiestosComponent, TercerosRelacionadosVistaComponent,
    RepresentanteLegalComponent,
    PagoDeDerechosContenedoraComponent,
    PasoCargaDocumentoComponent ,
    PasoFirmaComponent,
    NotificacionesComponent

  ],
})
export class PermisoImportacionModule {}

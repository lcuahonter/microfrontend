import { AlertComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

import { BtnContinuarComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ActualizacionImportacionSanitariaComponent } from './pages/actualizacion-importacion-sanitaria/actualizacion-importacion-sanitaria.component';

import { Datos260903Component } from './pages/datos-260903/datos-260903.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { NgModule } from '@angular/core';

import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';

import { ActualizacionImportacionSanitariaRoutingModule } from './actualizacion-importacion-sanitaria-routing.module';
import { PagoDeDerechosBancoComponent } from '../../shared/components/pago-de-derechos-banco/pago-de-derechos-banco.component';

import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DetalleMercanciaComponent } from '../../shared/components/detalle-mercancia/detalle-mercancia.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import { TercerosRelacionadosFabricanteComponent } from '../../shared/components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';
import {TercerosRelacionadosVistaComponent} from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';

import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';

import { PagoDeDerechosContenedoraComponent} from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';



@NgModule({
  declarations: [ActualizacionImportacionSanitariaComponent,
    Datos260903Component
  ],
  imports: [
    CommonModule,
    DetalleMercanciaComponent,
    ActualizacionImportacionSanitariaRoutingModule,
    WizardComponent,
    TituloComponent,
    SolicitanteComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    PagoDeDerechosBancoComponent,
    DatosDelSolicitudModificacionComponent,
    TramitesAsociadosSeccionComponent,
    TercerosRelacionadosFabricanteComponent,
    PagoDeDerechosContenedoraComponent,
    ManifiestosComponent,
    RepresentanteLegalComponent,
    TercerosRelacionadosVistaComponent,
    AlertComponent, 
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent
  ],
  providers: [provideHttpClient(), ToastrService,InicioSesionService,SubirDocumentoService ],
})
export class ActualizacionImportacionSanitariaModule { }

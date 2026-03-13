import { CommonModule } from '@angular/common';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, NotificacionesComponent, PasoCargaDocumentoComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { EnmiendaPermisoSanitarioComponent } from './pages/enmienda-permiso-sanitario/enmienda-permiso-sanitario.component';

import { Datos260914Component } from './pages/datos-260914/datos-260914.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { NgModule } from '@angular/core';

import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';

import { EnmiendaPermisoSanitarioRoutingModule } from './enmienda-permiso-sanitario-routing.module';
import { PagoDeDerechosBancoComponent } from '../../shared/components/pago-de-derechos-banco/pago-de-derechos-banco.component';

import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { PagoDeDerechosContenedoraComponent} from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import {TercerosRelacionadosVistaComponent} from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

@NgModule({
  declarations: [EnmiendaPermisoSanitarioComponent,
    Datos260914Component
  ],
  imports: [
    CommonModule,
    EnmiendaPermisoSanitarioRoutingModule,
    WizardComponent,
    TituloComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    PagoDeDerechosBancoComponent,
    DatosDelSolicitudModificacionComponent,
    TramitesAsociadosSeccionComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent, 
    AlertComponent,
    RepresentanteLegalComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent,
    ManifiestosComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent
  ],
  providers: [provideHttpClient(), ToastrService,InicioSesionService,SubirDocumentoService ],
})
export class EnmiendaPermisoSanitarioModule { }

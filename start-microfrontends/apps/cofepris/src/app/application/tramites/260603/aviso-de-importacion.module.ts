import {
  AlertComponent,
  BtnContinuarComponent,
  InicioSesionService,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SubirDocumentoService,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { AvisoDeImportacionRoutingModule } from './aviso-de-importacion-routing.module';
import { AvisoImportacionService } from './services/aviso-importacion.service';
import { CommonModule } from '@angular/common';
import { DatosDelEstablecimientoComponent } from '../../shared/components/datos-del-establecimiento/datos-del-establecimiento.component';
import { DatosPageComponent } from './pages/datos-page/datos-page.component';
import { DatosService } from '../../shared/services/datos.service';
import { DatosSolicitudComponent } from './components/datos-solicitud/datos-solicitud.component';
import { DomicilioDelEstablecimientoComponent } from '../../shared/components/domicilio-del-establecimiento/domicilio-del-establecimiento.component';
import { ExportacionService } from '../../shared/services/exportacion.service';
import { NgModule } from '@angular/core';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudeComponent } from './pages/solicitude/solicitude.component';
import { TercerosRelacionadoComponent } from '../../shared/components/tercerosRelacionado/tercerosRelacionado.component';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [SolicitudeComponent, DatosPageComponent],
  imports: [
    CommonModule,
    AvisoDeImportacionRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    SolicitanteComponent,
    DatosDelEstablecimientoComponent,
    DomicilioDelEstablecimientoComponent,
    RepresentanteLegalComponent,
    TercerosRelacionadoComponent,
    TercerosRelacionadosVistaComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    AlertComponent,
    NotificacionesComponent,
    DatosSolicitudComponent
  ],
  providers: [provideHttpClient(), DatosService, ExportacionService, InicioSesionService,
    SubirDocumentoService, ToastrService,
    AvisoImportacionService
  ],
})
export class AvisoDeImportacionModule { }

import {
  AlertComponent,
  BtnContinuarComponent,
  CatalogosService,
  FirmaElectronicaComponent,
  InicioSesionService,
  NotificacionesComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
  SubirDocumentoService,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA,NgModule } from '@angular/core';
import { CertificadoDeOrigenComponent } from '../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { CertificadoOrigenComponent } from './components/certificado-origen/certificado-origen.component';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from './components/datosCertificado/datosCertificado.component';
import { DestinatarioDeComponent } from './components/destinatario-de/destinatario-de.component';
import { MercanciaComponent } from '../../shared/components/mercancia/mercancia.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { Solocitud110208Service } from './services/service110208.service';
import { ToastrService } from 'ngx-toastr';
import { ValidarInicalmenteRoutingModule } from './validar-inicalmente-routing.module';
import { ValidarInicalmenteService } from './services/validar-inicalmente/validar-inicalmente.service';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [SolicitudPageComponent, PasoUnoComponent, PasoDosComponent],
  imports: [
    CommonModule,
    ValidarInicalmenteRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    SolicitanteComponent,
    AlertComponent,
    DestinatarioDeComponent,
    DatosCertificadoComponent,
    FirmaElectronicaComponent,
    PasoFirmaComponent,
    MercanciaComponent,
    CertificadoDeOrigenComponent,
    CertificadoOrigenComponent,
    NotificacionesComponent,
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    CatalogosService,
    InicioSesionService,
    SubirDocumentoService,
    ServiciosPantallaService,
    ValidarInicalmenteService,
    Solocitud110208Service
  ],
  schemas: [NO_ERRORS_SCHEMA], 
})
export class ValidarInicalmenteModule {}

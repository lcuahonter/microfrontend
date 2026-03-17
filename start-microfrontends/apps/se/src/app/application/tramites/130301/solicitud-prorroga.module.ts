import {
  AlertComponent,
  BtnContinuarComponent,
  CatalogosService,
  InicioSesionService,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
  SubirDocumentoService,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { CertificadoKimberleyComponent } from './components/certificado-kimberley/certificado-kimberley.component';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from './components/datos-del-tramite/datos-del-tramite.component';
import { InvocarComponent } from './pages/invocar-page/invocar-page.component';
import { NgModule } from '@angular/core';
import { PartidasDeLaMercanciaComponent } from './components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ProrrogasComponent } from './components/prorrogas/prorrogas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { SolicitudProrrogaRoutingModule } from './solicitud-prorroga-routing.module';
import { SolicitudProrrogaService } from './services/solicitudProrroga/solicitud-prorroga.service';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    SolicitudPageComponent,
    PasoUnoComponent,
    InvocarComponent
  ],
  imports: [
    CommonModule,
    SolicitudProrrogaRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    SolicitudComponent,
    DatosDelTramiteComponent,
    PartidasDeLaMercanciaComponent,
    CertificadoKimberleyComponent,
    ProrrogasComponent,
    AlertComponent,
    TituloComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    ReactiveFormsModule
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    CatalogosService,
    InicioSesionService,
    SubirDocumentoService,
    ServiciosPantallaService,
    SolicitudProrrogaService
  ],
})
export class SolicitudProrrogaModule {}

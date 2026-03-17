import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogosService,
  FirmaElectronicaComponent,
  InicioSesionService,
  SolicitanteComponent,
  SubirDocumentoService,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatoComunesComponent } from './components/dato-comunes/dato-comunes.component';
import { EnlaceComponent } from './components/enlace/enlace.component';
import { MensajeriaComponent } from './components/mensajeria/mensajeria.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PerfilesMensajeriaComponent } from './components/perfiles-mensajeria/perfiles-mensajeria.component';
import { PersonaComponent } from './components/persona/persona.component';
import { PlaneacionDelaSeguridadComponent } from './components/planeacion-de-la-seguridad/planeacion-de-la-seguridad.component';
import { ReprestantanteComponent } from './components/represtantante/represtantante.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { SolicitudDeRegistroInvocarRoutingModule } from './solicitud-de-registro-invocar-routing.module';
import { SolicitudDeRegistroInvocarService } from './services/solicitudDeRegistroInvocar/solicitud-de-registro-invocar.service';
import { SolicitudPasoComponent } from './pages/solicitud-paso/solicitud-paso.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    SolicitudPasoComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    AlertComponent,
    CommonModule,
    SolicitudDeRegistroInvocarRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    DatoComunesComponent,
    ReprestantanteComponent,
    EnlaceComponent,
    PersonaComponent,
    MensajeriaComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    PerfilesMensajeriaComponent,
    PlaneacionDelaSeguridadComponent,
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    CatalogosService,
    InicioSesionService,
    SubirDocumentoService,
    ServiciosPantallaService,
    SolicitudDeRegistroInvocarService,
  ],
})
export class SolicitudDeRegistroInvocarModule {}

import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  PasoFirmaComponent,
  SharedModule,
  SolicitanteComponent,
  TercerosComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CertificadoDeOrigenComponent } from './components/certificado-de-origen/certificado-de-origen.component';
import { CertificadoOrigenComponent } from './components/certificado-origen/certificado-origen.component';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from './components/datosCertificado/datosCertificado.component';
import { DestinatarioComponent } from './components/destinatario/destinatario.component';
import { DestinatarioDeComponent } from './components/destinatario-de/destinatario-de.component';
import { NgModule } from '@angular/core';
import { PasoCargaDocumentoComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroRoutingModule } from './registro-routing.module';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PasoTresComponent,
    PasoUnoComponent,
    SolicitudPageComponent,
  ],
  imports: [
    CommonModule,
    PasoCargaDocumentoComponent,
    AnexarDocumentosComponent,
    RegistroRoutingModule,
    CatalogoSelectComponent,
    AlertComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    TercerosComponent,
    WizardComponent,
    CertificadoDeOrigenComponent,
    CertificadoOrigenComponent,
    DestinatarioDeComponent,
    DatosCertificadoComponent,
    DestinatarioComponent,
    BtnContinuarComponent,
    FormsModule,
    ReactiveFormsModule,
    PasoFirmaComponent,
    SharedModule,
    AlertComponent,
    NotificacionesComponent
  ],
  providers: [ToastrService]
})
export class RegistroModule { }

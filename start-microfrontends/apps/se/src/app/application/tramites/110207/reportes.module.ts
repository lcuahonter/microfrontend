import { AlertComponent, BtnContinuarComponent, FirmaElectronicaComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CertificadoOrigenComponent } from './components/certificado-origen/certificado-origen.component';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from './components/datos-certificado/datos_certificado.component';
import { DestinatarioDeComponent } from './components/destinatario-de/destinatario-de.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReportesRoutingModule } from './reportes-routing.module';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SolicitanteComponent,
    DatosCertificadoComponent,
    DestinatarioDeComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    AlertComponent,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    CertificadoOrigenComponent,
    PasoUnoComponent,
    SolicitudPageComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA], 
})
export class ReportesModule { }

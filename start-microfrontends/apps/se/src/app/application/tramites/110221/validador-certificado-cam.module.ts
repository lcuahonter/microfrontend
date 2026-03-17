import { CatalogoSelectComponent, FirmaElectronicaComponent, InputFechaComponent, PasoFirmaComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from "@ng-mf/data-access-user";
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { CertificadoComponent } from './page/certificado/certificado.component';
import { CertificadoDeOrigenComponent } from './components/certificado-de-origen/certificado-de-origen.component';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from './components/datos-certificado/datos-certificado.component';
import { DatosCertificadoDeComponent } from '../../shared/components/datos-certificado-de/datos-certificado-de.component';
import { DatosDelDestinatarioComponent } from '../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { DestinatarioComponent } from '../../shared/components/destinatario/destinatario.component';
import { DestinatarioDeCertificadoComponent } from './components/destinatario/destinatario-de-certificado.component';
import { HistoricoDeProductoresComponent } from './components/historico-de-productores/historico-de-productores.component';
import { HistoricoProductoresComponent } from '../../shared/components/historico-productores/historico-productores.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './page/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './page/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidadorCertificadoCamRoutingModule } from './validador-certificado-cam-routing.module';

import { CertificadoOrigenComponent } from './components/certificado-origen/certificado-origen.component';
import { RepresentanteLegalExportadorComponent } from '../../shared/components/representante-legal-exportador/representante-legal-exportador.component';


@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    DatosCertificadoComponent,
    DestinatarioDeCertificadoComponent,
    CertificadoComponent,
    HistoricoDeProductoresComponent,
    
  ],
  imports: [
    CommonModule,
    ValidadorCertificadoCamRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    WizardComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    CatalogoSelectComponent,
    RouterModule,
    InputFechaComponent,
    DatosCertificadoDeComponent,
    DatosDelDestinatarioComponent,
    HistoricoProductoresComponent,
    RepresentanteLegalComponent,
    TituloComponent,
    AlertComponent,
     RepresentanteLegalExportadorComponent, 
    DestinatarioComponent,
    CertificadoDeOrigenComponent,
    CertificadoOrigenComponent,
    PasoFirmaComponent
  ],
    providers: [
    ToastrService
  ]
})
export class ValidadorCertificadoCamModule { }

import { BtnContinuarComponent, CatalogoSelectComponent, FirmaElectronicaComponent, InputFechaComponent, PasoFirmaComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AcuseCerorComponent } from './components/acuse-ceror/acuse-ceror.component';
import { AlertComponent } from "@ng-mf/data-access-user";
import { CertificadoDeOrigenComponent } from '../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { CertificadoOrigenComponent } from './components/certificado-origen/certificado-origen.component';
import { CommonModule } from '@angular/common';
import { DatosCertificadoDeComponent } from '../../shared/components/datos-certificado-de/datos-certificado-de.component';
import { DatosDelDestinatarioComponent } from '../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { DestinatarioComponent } from '../../shared/components/destinatario/destinatario.component';
import { HistoricoProductoresComponent } from '../../shared/components/historico-productores/historico-productores.component';
import { MercanciaComponent } from '../../shared/components/mercancia/mercancia.component';
import { NgModule } from '@angular/core';
import { NotificacionesComponent } from "@ng-mf/data-access-user";
import { PasoDosComponent } from './page/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './page/paso-uno/paso-uno.component';
import { PeruCertificadoComponent } from './page/peru-certificado/peru-certificado.component';
import { PeruDatosCertificadoComponent } from './components/peru-datos-certificado/peru-datos-certificado.component';
import { PeruDestinatarioComponent } from './components/peru-destinatario/peru-destinatario.component';
import { PeruHistoricoProductoresComponent } from './components/peru-historico-productores/peru-historico-productores.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';
import { RepresentanteLegalExportadorComponent } from "../../shared/components/representante-legal-exportador/representante-legal-exportador.component";
import { RouterModule } from '@angular/router';
import { ValidarCertificadoRoutingModule } from './validar-certificado-routing.module';


@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PeruDestinatarioComponent,
    PeruCertificadoComponent,
    PeruDatosCertificadoComponent,
    PeruHistoricoProductoresComponent,
    CertificadoOrigenComponent,
  ],
  imports: [
    CommonModule,
    ValidarCertificadoRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    WizardComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    CatalogoSelectComponent,
    RouterModule,
    InputFechaComponent,
    CertificadoDeOrigenComponent,
    DatosCertificadoDeComponent,
    DatosDelDestinatarioComponent,
    HistoricoProductoresComponent,
    DestinatarioComponent,
    TituloComponent,
    AlertComponent,
    RepresentanteLegalComponent,
    NotificacionesComponent,
    RepresentanteLegalExportadorComponent,
    MercanciaComponent,
    PasoFirmaComponent,
    AcuseCerorComponent
]
})
export class ValidarCertificadoModule {}

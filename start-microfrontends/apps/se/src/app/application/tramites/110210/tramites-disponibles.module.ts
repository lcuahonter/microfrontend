import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InputCheckComponent, InputFechaComponent, InputHoraComponent, PasoFirmaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SolicitanteComponent } from '@ng-mf/data-access-user';

import { BuscarCertificadoDeOrigenComponent } from './components/buscar-certificado-de-origen/buscar-certificado-de-origen.component';
import { CertificadoDeOrigenComponent } from './pages/certificado-de-origen/certificado-de-origen.component';
import { CertificadoDisponiblesComponent } from "./components/certificado-disponibles/certificado-disponibles.component";
import { DatosDelCertificadoComponent } from './components/datos-del-certificado/datos-del-certificado.component';
import { DatosDelDestinatarioComponent } from './components/datos-del-destinatario/datos-del-destinatario.component';
import { DomicilioDelDestinatarioComponent } from './components/domicilio-del-destinatario/domicilio-del-destinatario.component';
import { DomicilioTablaComponent } from './components/domicilio-tabla/domicilio-tabla.component';
import { DuplicadoDeCertificadoComponent } from './pages/duplicado-de-certificado/duplicado-de-certificado.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TramitesDisponiblesRoutingModule } from './tramites-disponibles-routing.module';
import { CertificadoPantallaDosComponent } from './components/certificado-pantalla-dos/certificado-pantalla-dos.component';

/**
 * @descripcion
 * Módulo `TramitesDisponiblesModule` que agrupa los componentes, servicios y módulos necesarios
 * para gestionar los trámites disponibles en la aplicación.
 *
 * Este módulo incluye componentes para la gestión de certificados de origen, destinatarios,
 * domicilios y otros elementos relacionados con los trámites.
 *
 * @decorador @NgModule
 */
@NgModule({
  declarations: [
    /**
     * @descripcion
     * Componentes declarados en este módulo.
     */
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
    DuplicadoDeCertificadoComponent,
    CertificadoDeOrigenComponent
  ],
  imports: [
    /**
     * @descripcion
     * Módulos importados necesarios para el funcionamiento de este módulo.
     */
    CommonModule,
    TramitesDisponiblesRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    InputCheckComponent,
    InputFechaComponent,
    InputHoraComponent,
    SolicitanteComponent,
    BuscarCertificadoDeOrigenComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    TituloComponent,
    CertificadoDisponiblesComponent,
    DatosDelCertificadoComponent,
    DatosDelDestinatarioComponent,
    DomicilioDelDestinatarioComponent,
    DomicilioTablaComponent,
    PasoFirmaComponent,
    CertificadoPantallaDosComponent
  ]
})
/**
 * @descripcion
 * Clase que define el módulo `TramitesDisponiblesModule`.
 */
export class TramitesDisponiblesModule { }
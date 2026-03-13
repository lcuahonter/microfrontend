import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ImportacionPlafestRoutingModule } from './importacion-plafest-routing.module';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { TercerosRelacionados260507Component } from './components/terceros-relacionados/terceros-relacionados.component';
import {RepresentanteLegalRfcComponent} from '../../shared/components/representante-legal-rfc/representante-legal-rfc.component';
import { ManifiestosComponent } from '../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import {DatosDelEstablecimientoRFCComponent} from '../../shared/components/datos-del-establecimiento-rfc/datos-del-establecimiento-rfc.component';
import {DomicilioComponent} from '../../shared/components/domicilio-establecimiento/domicilio-establecimiento.component';
import { TercerosRelacionadosComponent } from '../../shared/components/terceros-fabricante/terceros-fabricante.component';
@NgModule({
  declarations: [
    PantallasComponent,
    DatosComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    ImportacionPlafestRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    SolicitanteComponent,
    DatosDeLaSolicitudComponent,
    TercerosRelacionados260507Component,
    PagoDeDerechosComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    RepresentanteLegalRfcComponent,
    ManifiestosComponent,
    DatosDelEstablecimientoRFCComponent,
    DomicilioComponent,
    TercerosRelacionadosComponent
  ]
})
export class ImportacionPlafestModule { }

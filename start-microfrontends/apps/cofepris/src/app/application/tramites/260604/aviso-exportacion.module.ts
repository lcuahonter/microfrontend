import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { AvisoExportacionRoutingModule } from './aviso-exportacion-routing.module';
// import { PantallasComponent } from './pages/pantallas/pantallas.component';

// import { DatosComponent } from './pages/datos/datos.component';

import {
  AlertComponent,
  BtnContinuarComponent,
  InicioSesionService,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  ServiciosPantallasService,
  SolicitanteComponent,
  SubirDocumentoService,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';

import { TercerosRelacionadoComponent } from '../../shared/components/tercerosRelacionado/tercerosRelacionado.component';

import { PasoDosComponent } from './components/paso-dos/paso-dos.component';
import { PasoTresComponent } from './components/paso-tres/paso-tres.component';
import { ToastrService } from 'ngx-toastr';

import { HttpClientModule, provideHttpClient } from '@angular/common/http';

import { ExportacionService } from '../../shared/services/exportacion.service';

import { RepresentanteLegalComponent } from '../../shared/components/representante-legal/representante-legal.component';

import { DomicilioDelEstablecimientoComponent } from '../../shared/components/domicilio-del-establecimiento/domicilio-del-establecimiento.component';

import { DatosDelEstablecimientoComponent } from '../../shared/components/datos-del-establecimiento/datos-del-establecimiento.component';

import { ContenedorDeDatosSolicitudComponent } from './components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { DatosDeLaSolicitudComponent } from '../../shared/components/shared2606/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosService } from '../../shared/services/datos.service';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';

@NgModule({
  declarations: [
    // PantallasComponent,
    // DatosComponent,
    ContenedorDePasosComponent,
    PasoUnoComponent
  ],
  imports: [
    ContenedorDeDatosSolicitudComponent,
    PasoCargaDocumentoComponent,
    CommonModule,
    DatosDeLaSolicitudComponent,
    HttpClientModule,
    AvisoExportacionRoutingModule,
    AlertComponent,
    BtnContinuarComponent,
    TituloComponent,
    WizardComponent,
    TercerosRelacionadoComponent,
    SolicitanteComponent,
    PasoDosComponent,
    PasoTresComponent,
    PasoFirmaComponent,
    RepresentanteLegalComponent,
    DomicilioDelEstablecimientoComponent,
    NotificacionesComponent,
    DatosDelEstablecimientoComponent,
    TercerosRelacionadosVistaComponent
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    ServiciosPantallasService,
    ExportacionService,
    DatosService,
    InicioSesionService,
    SubirDocumentoService

  ],
})
export class AvisoExportacionModule { }

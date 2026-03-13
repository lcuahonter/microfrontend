import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BtnContinuarComponent, CrosslistComponent, InputRadioComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { DatosSolicitudComponent } from './components/datos-solicitud/datos-solicitud.component';
import { ManifiestoDeAceptacionComponent } from './components/manifiesto-de-aceptacion/manifiesto-de-aceptacion.component';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoDeHidrocarburosComponent } from './pages/permiso-de-hidrocarburos/permiso-de-hidrocarburos.component';
import { PermisoDeHidrocarburosRoutingModule } from './permiso-de-hidrocarburos-routing.module';

import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { NotificacionesComponent } from "@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component";
import { PaisDeOrigenComponent } from '../../shared/components/pais-de-origen/pais-de-origen.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PasoDosComponent } from '../../shared/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../../shared/components/paso-tres/paso-tres.component';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PermisoDeHidrocarburosComponent,
    PasoUnoComponent,
    DatosSolicitudComponent
  ],
  imports: [
    AlertComponent,
    CommonModule,
    PermisoDeHidrocarburosRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    InputRadioComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    PasoTresComponent,
    PasoDosComponent,
    DatosDelTramiteComponent,
    DatosDeLaMercanciaComponent,
    ManifiestoDeAceptacionComponent,
    PartidasDeLaMercanciaComponent,
    TablaDinamicaComponent,
    PaisDeOrigenComponent,
    RepresentacionComponent,
    CrosslistComponent,
    FormsModule,
    NotificacionesComponent,
],
providers: [ ToastrService ]
})
export class PermisoDeHidrocarburosModule { }
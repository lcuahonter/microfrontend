import { BtnContinuarComponent, CrosslistComponent, InputRadioComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { ExportacionMineralesDeHierroComponent } from './pages/exportacion-minerales-de-hierro/exportacion-minerales-de-hierro.component';
import { ImportacionProductoPetroliferoRoutingModule } from './importacion-producto-petrolifero.routing.module';
import { ManifiestoDeAceptacionComponent } from './components/manifiesto-de-aceptacion/manifiesto-de-aceptacion.component';
import { NgModule } from '@angular/core';
import { NotificacionesComponent } from "@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component";
import { PaisDeOrigenComponent } from '../../shared/components/pais-de-origen/pais-de-origen.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PasoDosComponent } from '../../shared/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../../shared/components/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { ToastrService } from 'ngx-toastr';





@NgModule({
  declarations: [
    ExportacionMineralesDeHierroComponent,
    PasoUnoComponent,
    SolicitudComponent,

  ],
  imports: [
    CommonModule,
    ManifiestoDeAceptacionComponent,
    TituloComponent,
    ImportacionProductoPetroliferoRoutingModule,
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
    PartidasDeLaMercanciaComponent,
    TablaDinamicaComponent,
    PaisDeOrigenComponent,
    RepresentacionComponent,
    CrosslistComponent,
    NotificacionesComponent
  ],
  providers: [ ToastrService ]
})
export class ImportacionProductoPetroliferoModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertComponent, BtnContinuarComponent, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent} from '@ng-mf/data-access-user';
import { ImportacionVehiculosNuevosPageComponent } from './pages/importacion-vehiculos-nuevos-page/importacion-vehiculos-nuevos-page.component';

import { PasoDosComponent } from '../120402/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../120402/components/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { ToastrService } from 'ngx-toastr';

import { ImportacionVehiculosNuevosRoutingModule } from './importacion-vehiculos-nuevos-routing.module';

import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';




@NgModule({
  declarations: [SolicitudComponent,ImportacionVehiculosNuevosPageComponent,PasoUnoComponent],
  imports: [
    CommonModule,
    ImportacionVehiculosNuevosRoutingModule,
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
    PartidasDeLaMercanciaComponent ,
    TablaDinamicaComponent,
    PaisProcendenciaComponent,
    RepresentacionComponent,
    CrosslistComponent,
    NotificacionesComponent,
    AlertComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
  providers: [
    ToastrService
  ]
})
export class ImportacionVehiculosNuevosModule {}

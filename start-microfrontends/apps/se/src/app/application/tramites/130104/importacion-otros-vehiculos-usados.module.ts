import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CrosslistComponent, FirmaElectronicaComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { ToastrService } from 'ngx-toastr';

import { ImportacionOtrosVehiculosUsadosRoutingModule } from './importacion-otros-vehiculos-usados-routing.module';

import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';

import { ImportacionOtrosVehiculosUsadosPageComponent } from './pages/importacion-otros-vehiculos-usados-page/importacion-otros-vehiculos-usados-page.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';


@NgModule({
  declarations: [ImportacionOtrosVehiculosUsadosPageComponent, PasoUnoComponent, SolicitudComponent, PasoTresComponent,
    PasoDosComponent],
  imports: [
    CommonModule,
    ImportacionOtrosVehiculosUsadosRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    InputRadioComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    DatosDelTramiteComponent,
    DatosDeLaMercanciaComponent,
    PartidasDeLaMercanciaComponent,
    TablaDinamicaComponent,
    PaisProcendenciaComponent,
    RepresentacionComponent,
    CrosslistComponent,
    FirmaElectronicaComponent, 
    AnexarDocumentosComponent,
    AlertComponent,
    NotificacionesComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
  providers: [
    ToastrService
  ]
})
export class ImportacionOtrosVehiculosUsadosModule { }

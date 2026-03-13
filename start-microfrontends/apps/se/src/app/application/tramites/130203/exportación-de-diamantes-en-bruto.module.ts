import { CertificadoKimberleyComponent } from './components/certificado-kimberley/certificado-kimberley.component';
import { CommonModule } from '@angular/common';
import { ExportacionDeDiamantesEnBrutoComponent } from './pages/exportacion-de-diamantes-en-bruto/exportacion-de-diamantes-en-bruto.component';
import { ExportaciónDeDiamantesEnBrutoRoutingModule } from './exportación-de-diamantes-en-bruto-routing.module';
import { NgModule } from '@angular/core';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import {
  AlertComponent,
  BtnContinuarComponent,
  CrosslistComponent,
  InputRadioComponent,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PasoDosComponent } from '../120402/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../120402/components/paso-tres/paso-tres.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PasoUnoComponent,
    ExportacionDeDiamantesEnBrutoComponent,
    SolicitudComponent
  ],
  imports: [
    CommonModule,
    ExportaciónDeDiamantesEnBrutoRoutingModule,
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
    CertificadoKimberleyComponent,
    AlertComponent,
    NotificacionesComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
   providers: [ToastrService],
})
export class ExportaciónDeDiamantesEnBrutoModule {}

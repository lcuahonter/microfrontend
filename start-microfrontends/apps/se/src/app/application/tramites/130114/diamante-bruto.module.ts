import { AlertComponent, BtnContinuarComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DiamanteBrutoComponent } from './pages/diamante-bruto/diamante-bruto.component';
import { DiamanteBrutoRoutingModule } from './diamante-bruto-routing.module';
import { InputRadioComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms'
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitanteComponent} from '@ng-mf/data-access-user';
import { SolicitudComponent } from './component/solicitud/solicitud.component';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
    declarations: [
      DiamanteBrutoComponent,
      PasoUnoComponent,
      SolicitudComponent
    ],
  imports: [
        CommonModule,
        DiamanteBrutoRoutingModule,
        WizardComponent,
        BtnContinuarComponent,
        TituloComponent,
        InputRadioComponent,
        SolicitanteComponent,
        ReactiveFormsModule,
        DatosDelTramiteComponent,
        DatosDeLaMercanciaComponent,
        PartidasDeLaMercanciaComponent ,
        TablaDinamicaComponent,
        PaisProcendenciaComponent,
        RepresentacionComponent,
        CrosslistComponent,
        ToastrModule.forRoot(),
        NotificacionesComponent,
        AlertComponent,
        PasoCargaDocumentoComponent,
        PasoFirmaComponent
  ],
  providers: [
    ToastrService
  ]
})
export class DiamanteBrutoModule {}

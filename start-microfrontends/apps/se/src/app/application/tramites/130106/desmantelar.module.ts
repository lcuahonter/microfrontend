import { AlertComponent, BtnContinuarComponent, NotificacionesComponent, PasoFirmaComponent,SolicitanteComponent} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DesmantelarComponent } from './pages/desmantelar/desmantelar.component';
import { DesmantelarRoutingModule } from './desmantelar-routing.module';
import { NgModule } from '@angular/core';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';



@NgModule({
  declarations: [
    DatosComponent, DesmantelarComponent
  ],
  imports: [
    CommonModule,
    DesmantelarRoutingModule,
    BtnContinuarComponent,
    TituloComponent,
    DatosDeLaSolicitudComponent,
    AlertComponent,
    WizardComponent,
    SolicitanteComponent,
    PasoFirmaComponent,
    NotificacionesComponent
],
  providers: [
    ToastrService
  ]
})
export class DesmantelarModule { }

import {
  AlertComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  SolicitanteComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { AvisoDeReciclajeRoutingModule } from './aviso-de-reciclaje-routing.module';
import { CommonModule } from '@angular/common';
import { DatosSolicitudComponent } from './components/datos-solicitud/datos-solicitud.component';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
  ],
  imports: [
    NotificacionesComponent,
    CommonModule,
    WizardComponent,
    AlertComponent,
    SolicitanteComponent,
    DatosSolicitudComponent,
    BtnContinuarComponent,
    AvisoDeReciclajeRoutingModule,
    FirmaElectronicaComponent,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class AvisoDeReciclajeModule { }

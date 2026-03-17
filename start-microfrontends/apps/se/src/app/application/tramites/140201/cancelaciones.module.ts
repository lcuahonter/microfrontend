import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { CancelacionesRoutingModule } from './cancelaciones-routing.module';

import {
  BtnContinuarComponent,
  SolicitanteComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CancelacionDeAutorizacionesComponent } from './components/cancelacion-de-autorizaciones/cancelacion-de-autorizaciones.component';
import { CancelacionesComponent } from './pages/cancelaciones/cancelaciones.component';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosNotificationRecipientsComponent } from './components/datos-notification-recipients/datos-notification-recipients.component';
import { DireccionDeNotificacionesComponent } from './components/direccion-de-notificaciones/direccion-de-notificaciones.component';
import { EntidadExternaComponent } from './components/entidad-externa/entidad-externa.component';
import { provideHttpClient } from '@angular/common/http';

import { PasoTresComponent } from '../90305/component/paso-tres/paso-tres.component';
import { ToastrService } from 'ngx-toastr';

import { PasoDosComponent } from '../90305/component/paso-dos/paso-dos.component';

@NgModule({
  declarations: [
    CancelacionesComponent,
    DatosComponent,
    
  ],
  imports: [
    CommonModule,
    CancelacionesRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    FormsModule,
    ReactiveFormsModule,
    DatosNotificationRecipientsComponent,
    PasoTresComponent,
    PasoDosComponent,
    CancelacionDeAutorizacionesComponent,
    EntidadExternaComponent,
    DireccionDeNotificacionesComponent
  ],
  providers: [provideHttpClient(),ToastrService],
})
export class CancelacionesModule {}

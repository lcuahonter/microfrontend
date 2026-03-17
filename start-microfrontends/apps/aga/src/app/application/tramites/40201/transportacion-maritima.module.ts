import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  AlertComponent,
  BtnContinuarComponent,
  NotificacionesComponent,
  PasoFirmaComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { AsignarCaatMaritimoComponent } from './components/asignar-caat-maritimo/asignar-caat-maritimo.component';
import { DatosComponent } from './pages/datos/datos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { TransportacionMaritimaRoutingModule } from './transportacion-maritima-routing.module';

@NgModule({
  declarations: [DatosComponent, PantallasComponent],
  imports: [
    CommonModule,
    TransportacionMaritimaRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    AlertComponent,
    TituloComponent,
    PasoFirmaComponent,
    SolicitanteComponent,
    AsignarCaatMaritimoComponent,
    NotificacionesComponent,
  ],
})
export class TransportacionMaritimaModule {}

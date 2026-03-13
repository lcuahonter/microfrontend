import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { ModificacionTransportacionMaritimaRoutingModule } from './modificacion-transportacion-maritima-routing.module';
import { ModificarCaatMaritimoComponent } from './components/modificar-caat-maritimo/modificar-caat-maritimo.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModificacionTransportacionMaritimaRoutingModule,
    BtnContinuarComponent,
    AlertComponent,
    WizardComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    ModificarCaatMaritimoComponent
  ]
})
export class ModificacionTransportacionMaritimaModule { }

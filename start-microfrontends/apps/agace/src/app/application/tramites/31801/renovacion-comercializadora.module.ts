import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { DatosComponent } from './pages/datos/datos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { RenovacionComercializadoraRoutingModule } from './renovacion-comercializadora-routing.module';
import { RenovacionComponent } from './components/renovacion/renovacion.component';
import { RenovacionService } from './services/renovacion/renovacion.service';


@NgModule({
  declarations: [
    PantallasComponent,
    DatosComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    RenovacionComercializadoraRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    RenovacionComponent,
    SolicitanteComponent
  ],
  providers: [
    RenovacionService
  ]
})
export class RenovacionComercializadoraModule { }

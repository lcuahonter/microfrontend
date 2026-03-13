import {
  AlertComponent,
  BtnContinuarComponent,
  InicioSesionService,
  ServiciosPantallasService,
  SolicitanteComponent,
  SubirDocumentoService,
  TituloComponent,
  WizardComponent
} from '@libs/shared/data-access-user/src';
import { AvisoDeRenovacionComponent } from './components/aviso-de-renovacion/aviso-de-renovacion.component';
import { AvisoUnicoService } from './services/aviso-unico.service';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './components/paso-dos/paso-dos.component';
import { PasoTresComponent } from './components/paso-tres/paso-tres.component';
import { RenewalVatIepsModAAARoutingModule } from './renewal-vatIeps-mod-aaa-routing.module';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [DatosComponent, PantallasComponent],
  imports: [
    CommonModule,
    RenewalVatIepsModAAARoutingModule,
    AvisoDeRenovacionComponent,
    SolicitanteComponent,
    AlertComponent,
    BtnContinuarComponent,
    TituloComponent,
    WizardComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    ServiciosPantallasService,
    InicioSesionService,
    SubirDocumentoService,
    AvisoUnicoService
  ],
})
export class RenewalVatIepsModAAAModule { }
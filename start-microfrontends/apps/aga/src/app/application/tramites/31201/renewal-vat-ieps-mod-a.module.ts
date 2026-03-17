import { AlertComponent, BtnContinuarComponent, InicioSesionService, NotificacionesComponent, ServiciosPantallasService, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AvisoDeRenovacionComponent } from './components/aviso-de-renovacion/aviso-de-renovacion.component';
import { AvisoUnicoService } from './services/aviso-unico.service';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './components/paso-dos/paso-dos.component';
import { PasoTresComponent } from './components/paso-tres/paso-tres.component';
import { RenewalVatIepsModARoutingModule } from './renewal-vat-ieps-mod-a-routing.module';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [ DatosComponent,PantallasComponent],
  imports: [
    CommonModule,
    RenewalVatIepsModARoutingModule,
    AvisoDeRenovacionComponent,
    SolicitanteComponent,
    AlertComponent,
  BtnContinuarComponent,
  TituloComponent,
  WizardComponent,
  PasoDosComponent,
  PasoTresComponent,
  NotificacionesComponent
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
export class RenewalVatIepsModAModule { }

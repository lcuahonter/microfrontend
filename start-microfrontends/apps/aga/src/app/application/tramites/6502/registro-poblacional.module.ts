import { BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, InicioSesionService, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AvisoDeCambioComponent } from './components/aviso-de-cambio/aviso-de-cambio.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroPoblacionalRoutingModule } from './registro-poblacional-routing.module';
import { RegistroPoblacionalService } from './service/registro-poblacional.service';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { SolicitudPasoComponent } from './pages/solicitud-paso/solicitud-paso.component';
import { Solocitud6502Service } from './service/service6502.service';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    SolicitudPasoComponent,
    PasoUnoComponent,
    PasoDosComponent
  ],
  imports: [
    CommonModule,
    RegistroPoblacionalRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    AvisoDeCambioComponent,
    FirmaElectronicaComponent
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    CatalogosService,
    InicioSesionService,
    ServiciosPantallaService,
    RegistroPoblacionalService,
    Solocitud6502Service
  ],
})
export class RegistroPoblacionalModule {}

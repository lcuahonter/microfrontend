import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComunesComponent } from './components/datos-comunes/datos-comunes.component';
import { EnlaceComponent } from './components/enlace/enlace.component';
import { MensajeriaComponent } from './components/mensajeria/mensajeria.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PerfilesMensajeriaComponent } from './components/perfiles-mensajeria/perfiles-mensajeria.component';
import { PersonaComponent } from './components/persona/persona.component';
import { RecintoFiscalizadoRoutingModule } from './recinto-fiscalizado-routing.module';
import { RecintoFiscalizadoService } from './services/recinto-fiscalizado.service';
import { ReprestantanteComponent } from './components/represtantante/represtantante.component';
import { Solicitud32615Service } from './services/service32615.service';
import { SolicitudPasoComponent } from './pages/solicitud-paso/solicitud-paso.component';


@NgModule({
  declarations: [
    SolicitudPasoComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule, 
    RecintoFiscalizadoRoutingModule,
    AlertComponent,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    DatosComunesComponent,
    EnlaceComponent,
    PersonaComponent,
    ReprestantanteComponent,
    MensajeriaComponent,
    PerfilesMensajeriaComponent
  ],
  providers: [
    Solicitud32615Service,
    RecintoFiscalizadoService
  ],
})
export class RecintoFiscalizadoModule {}

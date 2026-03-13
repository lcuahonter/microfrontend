import { AlertComponent, BtnContinuarComponent, FirmaElectronicaComponent, NotificacionesComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { GestionDeCuentasComponent } from './components/gestion-de-cuentas.component';
import { NgModule } from '@angular/core';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TecnologicosRoutingModule } from './tecnologicos-routing.module';


@NgModule({
  declarations: [PasoUnoComponent,PasoTresComponent,SolicitudPageComponent],
  imports: [
    CommonModule,
    TecnologicosRoutingModule,
    NotificacionesComponent,
    BtnContinuarComponent,
    SharedModule,
    WizardComponent,
    SolicitanteComponent,
    GestionDeCuentasComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    AlertComponent
  ]
})
export class TecnologicosModule { }

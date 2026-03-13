import { AlertComponent, BtnContinuarComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoSanitarioModule } from '../260211/permiso-sanitario.module';
import { RetirosCofeprisRoutingModule } from './retiros-cofepris-routing.module';
import { SolicitudComponent } from './components/solicitud/solicitud.component';


@NgModule({
  declarations: [
    PantallasComponent,
    PasoUnoComponent
  ],
  imports: [
    CommonModule,
    RetirosCofeprisRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    SolicitanteComponent,
    SolicitudComponent,
    AlertComponent,
    PermisoSanitarioModule,
     PasoCargaDocumentoComponent,
      PasoFirmaComponent,
  ]
})
export class RetirosCofeprisModule { }

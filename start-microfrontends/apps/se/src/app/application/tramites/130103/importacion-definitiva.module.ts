import { AlertComponent, BtnContinuarComponent,NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ImportacionDefinitivaRoutingModule } from './importacion-definitiva-routing.module';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from '../120402/components/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudComponent } from "./components/solicitud/solicitud.component";


@NgModule({
  declarations: [
    PantallasComponent,
    PasoUnoComponent
  ],
  imports: [
    CommonModule,
    ImportacionDefinitivaRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    TituloComponent,
    AlertComponent,
    PasoDosComponent,
    PasoFirmaComponent,
    SolicitudComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent
]
})
export class ImportacionDefinitivaModule { }

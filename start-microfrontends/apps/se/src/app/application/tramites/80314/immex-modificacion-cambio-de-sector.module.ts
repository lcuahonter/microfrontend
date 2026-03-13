import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ImmexModificacionCambioDeSectorRoutingModule } from './immex-modificacion-cambio-de-sector.routing.module';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SolicitanteComponent,
    ImmexModificacionCambioDeSectorRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitudPageComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  exports: [],
  providers: [ToastrService],
})
export class ImmexModificacionCambioDeSectorModule {}

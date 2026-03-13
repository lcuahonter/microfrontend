import { BtnContinuarComponent, InicioSesionService, PasoFirmaComponent, SubirDocumentoService } from '@libs/shared/data-access-user/src';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { ProgramaACancelarComponent } from './components/programaACancelar/programaACancelar.component';
import { ProgramaACancelarService } from './services/programACancelar.service';
import { RegistroDeSolicitudRoutingModule } from './registro-de-solicitud-routing.module';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';




@NgModule({
  declarations: [
    PantallasComponent,
    SolicitantePageComponent
  ],
  imports: [
    CommonModule,
    RegistroDeSolicitudRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    SolicitanteComponent,
    InputCheckComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    FirmaElectronicaComponent,
    ProgramaACancelarComponent,
    PasoFirmaComponent
  ],
  providers: [
    ToastrService,
    InicioSesionService,
    SubirDocumentoService,
    ProgramaACancelarService
  ],
})
export class RegistroDeSolicitudModule { }

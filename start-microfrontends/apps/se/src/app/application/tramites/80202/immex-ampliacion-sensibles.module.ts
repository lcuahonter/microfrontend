import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  PasoCargaDocumentoComponent,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, forwardRef } from '@angular/core';
import { AnexoComponent } from './components/anexo.component';
import { CommonModule } from '@angular/common';
import { ImmexAmpliacionSensiblesRoutingModule } from './immex-ampliacion-sensibles-routing.module';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';
@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
  ],
  imports: [
    AlertComponent,
    BtnContinuarComponent,
    CommonModule,
    AnexoComponent,
    PasoFirmaComponent,
    PasoUnoComponent,
    FirmaElectronicaComponent,
    ImmexAmpliacionSensiblesRoutingModule,
    ReactiveFormsModule,
    SolicitanteComponent,
    TablaDinamicaComponent,
    TituloComponent,
    WizardComponent,
    PasoCargaDocumentoComponent,
    forwardRef(() => AnexarDocumentosComponent),
  ],
   providers: [
    ToastrService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImmexAmpliacionSensiblesModule {}

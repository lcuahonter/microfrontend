import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  CatalogosService,
  CrosslistComponent,
  FirmaElectronicaComponent,
  InputRadioComponent,
  SolicitanteComponent,
  TableComponent,
  TituloComponent,
  TramiteFolioService,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SolicitudComponent } from './components/solicitud/solicitud.component';

import { CancelacionDonacionesRoutingModule } from './cancelacion-donaciones-routing.module';
import { CancelacionDonacionesService } from './services/cancelacion-donaciones.service';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    CancelacionDonacionesRoutingModule,
    SolicitanteComponent,
    BtnContinuarComponent,
    WizardComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TableComponent,
    InputRadioComponent,
    CrosslistComponent,
    ReactiveFormsModule,
    PasoUnoComponent,
    SolicitantePageComponent,
    PasoTresComponent,
    SolicitudComponent,
  ],
  exports: [],
  providers: [
    ToastrService,
    CancelacionDonacionesService,
    CatalogosService,
    TramiteFolioService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CancelacionDonacionesModule {}

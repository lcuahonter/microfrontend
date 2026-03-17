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
import { DatosDelTramiteComponent } from './components/datos-del-tramite/datos-del-tramite.component';
import { ModificacionDonacionesImmexRoutingModule } from './modificacion-donaciones-immex-routing.module';
import { ModificacionDonacionesImmexService } from './services/modificacion-donaciones-immex.service';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ModificacionDonacionesImmexRoutingModule,
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
    PasoDosComponent,
    PasoUnoComponent,
    PasoTresComponent,
    SolicitantePageComponent,
    DatosDelTramiteComponent,
  ],
  exports: [],
  providers: [
    ToastrService,
    ModificacionDonacionesImmexService,
    CatalogosService,
    TramiteFolioService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModificacionDonacionesImmexModule {}

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
import { DatosGeneralesDeLaSolicitudComponent } from './components/datos-generales-de-la-solicitud/datos-generales-de-la-solicitud.component';
import { DesistimientoComponent } from './components/desistimiento/desistimiento.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RetiradaDeLaAutorizacionDeDonacioneRoutingModule } from './retirada-de-la-autorizacion-de-donaciones-routing.module';
import { RetiradaDeLaAutorizacionDeDonacionesService } from './services/retirad-de-la-autorizacion-de-donaciones.service';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    RetiradaDeLaAutorizacionDeDonacioneRoutingModule,
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
    DatosGeneralesDeLaSolicitudComponent,
    DesistimientoComponent
  ],
  exports: [],
  providers: [
    ToastrService,
    RetiradaDeLaAutorizacionDeDonacionesService,
    CatalogosService,
    TramiteFolioService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RetiradaDeLaAutorizacionDeDonacioneModule {}

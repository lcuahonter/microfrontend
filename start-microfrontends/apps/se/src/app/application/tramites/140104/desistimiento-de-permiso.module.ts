import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, CrosslistComponent, FirmaElectronicaComponent, InputCheckComponent, InputFechaComponent, InputRadioComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SharedModule, SolicitanteComponent, TablaDinamicaComponent, TableComponent, TercerosComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BusquedaFolioComponent } from './pages/busqueda-folio/busqueda-folio.component';
import { CancelacionDeSolicitudComponent } from './components/cancelacion-de-solicitud/cancelacion-de-solicitud.component';
import { CommonModule } from '@angular/common';
import { DesistimientoDePermisoRoutingModule } from './desistimiento-de-permiso-routing.module';
import { IntroPermisoComponent } from './pages/intro-permiso/intro-permiso.component';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    IntroPermisoComponent,
    PasoUnoComponent,
    CancelacionDeSolicitudComponent,
    BusquedaFolioComponent
  ],
  imports: [
    CommonModule,
    DesistimientoDePermisoRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    ReactiveFormsModule,
    SharedModule,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    CrosslistComponent,
    InputCheckComponent,
    AlertComponent,
    InputFechaComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    TercerosComponent,
    CatalogoSelectComponent,
    TableComponent,
    InputRadioComponent,
    ToastrModule.forRoot(),
    TablaDinamicaComponent,
    TituloComponent,
    NotificacionesComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ToastrService
  ]
})
export class DesistimientoDePermisoModule { }

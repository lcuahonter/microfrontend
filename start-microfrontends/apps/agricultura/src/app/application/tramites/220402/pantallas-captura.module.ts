import { CUSTOM_ELEMENTS_SCHEMA, NgModule, forwardRef } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PantallasCapturaRoutingModule } from './pantallas-captura-routing.module';

// Standalone Components from @ng-mf/data-access-user
import {
  AgregarTransporteComponent,
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CargaDocumentoComponent,
  CatalogoSelectComponent,
  CrosslistComponent,
  FirmaElectronicaComponent,
  InputCheckComponent,
  InputFechaComponent,
  InputHoraComponent,
  InputRadioComponent,
  NavComponent,
  NotificacionesComponent,
  RepresentanteFiscalComponent,
  SelectPaisesComponent,
  SharedModule,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TituloComponent,
  WizardComponent
} from '@ng-mf/data-access-user';

import { AgregarDestinatarioComponent } from './components/agregar-destinatario/agregar-destinatario.component';
import { PagoDeDerechoComponent } from './components/pago-de-derecho/pago-de-derecho.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TransporteComponent } from './components/transporte/transporte.component';

import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    PantallasCapturaRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    TooltipModule,
    SolicitudPageComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    TransporteComponent,
    PagoDeDerechoComponent,
    AgregarDestinatarioComponent,
    SolicitudComponent,
    NavComponent,
    WizardComponent,
    TituloComponent,
    BtnContinuarComponent,
    AlertComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    AnexarDocumentosComponent,
    InputCheckComponent,
    InputHoraComponent,
    InputFechaComponent,
    CrosslistComponent,
    AgregarTransporteComponent,
    RepresentanteFiscalComponent,
    SelectPaisesComponent,
    CatalogoSelectComponent,
    forwardRef(() => CargaDocumentoComponent),
    NotificacionesComponent,
    InputRadioComponent,
    TablaDinamicaComponent
  ],
  providers: [ToastrService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
})
export class PantallasCapturaModule { }
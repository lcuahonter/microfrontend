import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, CrosslistComponent, FirmaElectronicaComponent, InputFechaComponent, NotificacionesComponent, SharedModule, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosSolicitudComponent } from './component/datos-solicitud/datos-solicitud.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from './component/pago-de-derechos/pago-de-derechos.component';
import { PantallasActionService } from './services/pantallas-action.service';
import { PantallasModuloRoutingModule } from './pantallas-modulo-routing.module';
import { PasoCapturarSolicitudComponent } from './pages/paso-capturar-solicitud/paso-capturar-solicitud.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmarSolicitudComponent } from './pages/paso-firmar-solicitud/paso-firmar-solicitud.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoCsComponent } from './pages/paso-uno-cs/paso-uno-cs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    DatosSolicitudComponent,
    PagoDeDerechosComponent,
    PasoCapturarSolicitudComponent,
    PasoDosComponent,
    PasoFirmarSolicitudComponent,
    PasoTresComponent,
    PasoUnoCsComponent,
  ],
  imports: [
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    CommonModule,
    CrosslistComponent,
    FirmaElectronicaComponent,
    PantallasModuloRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    NotificacionesComponent
  ],
  providers: [
    PantallasActionService,
    ToastrService,
  ]
})
export class PantallasModuloModule { }

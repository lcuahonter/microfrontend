import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, CrosslistComponent, FirmaElectronicaComponent, InputCheckComponent, InputFechaComponent, InputRadioComponent, NotificacionesComponent, SolicitanteComponent, TablaDinamicaComponent, TableComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DatosSolicitudComponent } from './components/datos-solicitud/datos-solicitud.component';
import { ModalComponent } from './components/modal/modal.component';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { TercerosComponent } from './components/terceros/terceros.component';

import { DatosComponent } from './pages/datos/datos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoCitesRoutingModule } from './permiso-cites-routing.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [DatosComponent, PasoUnoComponent, PasoTresComponent, PasoDosComponent, DatosSolicitudComponent, ModalComponent, PagoDeDerechosComponent,PagoDeDerechosComponent,TercerosComponent],
  imports: [
    CommonModule,
    PermisoCitesRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    CrosslistComponent,
    TableComponent,
    NotificacionesComponent,
    InputCheckComponent,
    InputFechaComponent,
    ToastrModule.forRoot(),
    TooltipModule,
    InputRadioComponent
   
],
providers: [ToastrService]
})
export class PermisoCitesModule {}

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { DesistimientoSolicitudService } from './services/desistimiento-solicitud.service';
import { SemarnatDesistimientoRoutingModule } from './desistimiento-routing.module';

import {
  AcuseComponent,
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  SharedModule,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent
} from '@ng-mf/data-access-user';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { provideHttpClient } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';

import { ToastrModule, ToastrService } from 'ngx-toastr';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SemarnatDesistimientoRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    SharedModule,
    BtnContinuarComponent,
    ReactiveFormsModule,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    ToastrModule.forRoot(),
    PasoDosComponent,
    AcuseComponent,
    NotificacionesComponent,
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    DesistimientoSolicitudService,
  ],
})
export class DesistimientoModule {}


import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  InputFechaComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';import { CommonModule } from '@angular/common';
import { CorreccionInternaDeLaCofeprisService } from './services/correccion-interna-de-la-cofepris.service';

import { CorreccionInternaDeLaCofeprisRoutingModule } from './correccion-interna-de-la-cofepris-routing.module';

import { CorreccionInternaDeLaCofeprisComponent } from './pages/correccion-interna-de-la-cofepris/correccion-interna-de-la-cofepris.component';
import { NgModule } from '@angular/core';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { SolicitudComponent } from './components/Solicitud/solicitud.component';
import { ToastrService } from 'ngx-toastr';

import { TramitesAsociadosComponent } from './components/Tramitesasociados/tramites-asociados.component';


@NgModule({
  declarations: [
    PasoUnoComponent, 
    PasoDosComponent, 
    PasoTresComponent,
    CorreccionInternaDeLaCofeprisComponent
    
  ],
  imports: [
    SolicitudComponent,
    CommonModule,
    CorreccionInternaDeLaCofeprisRoutingModule,
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CommonModule,
    TramitesAsociadosComponent,
    FirmaElectronicaComponent,
    InputFechaComponent,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
  ],
  
    providers: [ToastrService,CorreccionInternaDeLaCofeprisService],
})
export class CorreccionInternaDeLaCofeprisModule {}

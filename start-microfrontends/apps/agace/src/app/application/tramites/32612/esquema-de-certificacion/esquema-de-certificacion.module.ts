import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AgenteAduanalComponent } from '../components/agente-aduanal/agente-aduanal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { DatosComunesComponent } from '../../../shared/components/datos-comunes/datos-comunes.component';
import { EsquemaDeCertificacionRoutingModule } from './esquema-de-certificacion-routing.module';
import { EsquemaDeCertificacionService } from '../services/esquema-de-certificacion.service';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from '../pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../pages/paso-uno/paso-uno.component';
import { PerfilesComponent } from '../components/perfiles/perfiles.component';
import { TercerosRelacionadosComponent } from '../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TodosPasosComponent } from '../pages/todos-pasos/todos-pasos.component';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [TodosPasosComponent, PasoUnoComponent,PasoDosComponent, PasoTresComponent],
  imports: [
    CommonModule,
    EsquemaDeCertificacionRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    TercerosRelacionadosComponent,
    DatosComunesComponent,
    AgenteAduanalComponent,
    PerfilesComponent,
    ToastrModule.forRoot()
  ],
    providers: [
      ToastrService,
      provideHttpClient(),
      EsquemaDeCertificacionService,
      BsModalService
    ],
})
export class EsquemaDeCertificacionModule { }

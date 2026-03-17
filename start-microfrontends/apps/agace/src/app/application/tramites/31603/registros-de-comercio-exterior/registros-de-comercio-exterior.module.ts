import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { DatosComunesComponent } from '../../../shared/components/datos-comunes/datos-comunes.component';
import { DatosComunesService } from '../../../shared/services/datos-comunes.service';
import { DatosPorRegimenComponent } from '../components/datos-por-regimen/datos-por-regimen.component';
import { IvaeiepsComponent } from '../components/ivaeieps/ivaeieps.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from '../pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../pages/paso-uno/paso-uno.component';
import { RegistrosDeComercioExteriorRoutingModule } from './registros-de-comercio-exterior-routing.module';
import { RegistrosDeComercioExteriorService } from '../services/registros-de-comercio-exterior.service';
import { SharedModalComponent } from '../components/shared-modal/shared-modal.component';
import { TercerosRelacionadosComponent } from '../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TercerosRelacionadosService } from '../../../shared/services/terceros-relacionados.service';
import { TodosPasosComponent } from '../pages/todos-pasos/todos-pasos.component';
import { provideHttpClient } from '@angular/common/http';



@NgModule({
  declarations: [TodosPasosComponent,PasoUnoComponent,PasoDosComponent,PasoTresComponent],
  imports: [
    CommonModule,
    RegistrosDeComercioExteriorRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    SolicitanteComponent,
    DatosComunesComponent,
    TercerosRelacionadosComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    DatosPorRegimenComponent,
    IvaeiepsComponent,
    SharedModalComponent
  ],
    providers: [
    provideHttpClient(),
    BsModalService,
    TercerosRelacionadosService,
    DatosComunesService,
    RegistrosDeComercioExteriorService
  ],
})
export class RegistrosDeComercioExteriorModule { }

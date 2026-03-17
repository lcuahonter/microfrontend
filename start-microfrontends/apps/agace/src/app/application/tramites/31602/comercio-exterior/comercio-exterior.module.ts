import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, InicioSesionService, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ComercioExteriorRoutingModule } from './comercio-exterior-routing.module';
import { ComercioExteriorService } from '../services/comercio-exterior.service';
import { CommonModule } from '@angular/common';
import { DatosComunesComponent } from '../../../shared/components/datos-comunes/datos-comunes.component';
import { DatosComunesService } from '../../../shared/services/datos-comunes.service';
import { DatosPorRegimenComponent } from '../components/datos-por-regimen/datos-por-regimen.component';
import { IvaeiepsComponent } from '../components/ivaeieps/ivaeieps.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from '../pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../pages/paso-uno/paso-uno.component';
import { SharedModalComponent } from '../components/shared-modal/shared-modal.component';
import { TercerosRelacionadosComponent } from '../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TercerosRelacionadosService } from '../../../shared/services/terceros-relacionados.service';
import { TodospasosComponent } from '../pages/todos-pasos/todos-pasos.component';
import { provideHttpClient } from '@angular/common/http';



@NgModule({
  declarations: [TodospasosComponent,PasoUnoComponent,PasoDosComponent,PasoTresComponent],
  imports: [
    CommonModule,
    ComercioExteriorRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    IvaeiepsComponent,
    DatosPorRegimenComponent,
    TercerosRelacionadosComponent,
    DatosComunesComponent,
    SharedModalComponent,
    ToastrModule.forRoot()
  ],
  providers: [
    ToastrService,
    provideHttpClient(),
    CatalogosService,
    InicioSesionService,
    SubirDocumentoService,
    ComercioExteriorService,
    BsModalService,
    TercerosRelacionadosService,
    DatosComunesService
  ],
})
export class ComercioExteriorModule { }

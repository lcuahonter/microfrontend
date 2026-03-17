import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CargaDocumentoComponent,
  CatalogoSelectComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  SharedModule,
  SolicitanteComponent,
  TablaDinamicaComponent,
  TituloComponent
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from './components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SustanciasQuimicasComponent } from './pages/sustancias-quimicas/sustancias-quimicas.component';
import { SustanciasQuimicasRoutingModule } from './sustancias-quimicas-routing.module';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';


@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    SustanciasQuimicasComponent,
  ],
  imports: [
    CommonModule,
    SustanciasQuimicasRoutingModule,
    WizardComponent,
    SharedModule,
    BtnContinuarComponent,
    ReactiveFormsModule,
    TituloComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    SolicitanteComponent,
    DatosDelTramiteContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    NotificacionesComponent,
    CargaDocumentoComponent
  ],
  exports:[RouterModule],
  providers: [ToastrService],
})
export class SustanciasQuimicasModule { }

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
  TituloComponent,
  WizardComponent
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from './components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoOrdinarioExportacionExplosivoRoutingModule } from './permiso-ordinario-exportacion-explosivo-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,  
    PasoUnoComponent,
    SolicitudPageComponent,
  ],
  imports: [
    CommonModule,
    PermisoOrdinarioExportacionExplosivoRoutingModule,
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
    PagoDeDerechosContenedoraComponent,
    NotificacionesComponent,
    CargaDocumentoComponent
  ],
  exports:[RouterModule],
  providers: [ToastrService],
})
export class PermisoOrdinarioExportacionExplosivoModule { }

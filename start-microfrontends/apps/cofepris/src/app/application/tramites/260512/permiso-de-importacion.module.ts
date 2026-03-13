import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InicioSesionService, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosSolicitudComponent } from './components/datos-solicitud/datos-solicitud.component';
import { ExportacionService } from '../../shared/services/exportacion.service';
import { NgModule } from '@angular/core';
import { PaginasComponent } from './pages/paginas/paginas.component';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PermisoDeImportacionRoutingModule } from './permiso-de-importacion-routing.module';
import { TercerosRelacionadosFabricanteComponent } from './components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    DatosComponent,
    PaginasComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    PermisoDeImportacionRoutingModule,
    SolicitanteComponent,
    BtnContinuarComponent,
    WizardComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    DatosSolicitudComponent,
    TercerosRelacionadosFabricanteComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    AvisoDePrivacidadComponent,
    PagoDeDerechosContenedoraComponent,
    NotificacionesComponent
  ],
  providers: [
    provideHttpClient(),
    InicioSesionService,
    SubirDocumentoService,
    ExportacionService, 
    ToastrService
  ],

})
export class PermisoDeImportacionModule { }

import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src/tramites/components/anexar-documentos/anexar-documentos.component';
import { AvisoDePrivacidadComponent } from '../../shared/components/aviso-de-privacidad/aviso-de-privacidad.component';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from './components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { NgModule } from '@angular/core';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoCargaDocumentoComponent } from '@libs/shared/data-access-user/src/tramites/components/paso-carga-documento/paso-carga-documento.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src/tramites/components/paso-firma/paso-firma.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoSanitarioImportacionRoutingModule } from './permiso-sanitario-importacion-routing.module';
import { SanitarioComponent } from './pages/sanitario/sanitario.component';
import { ServiciosPermisoSanitarioService } from './services/servicios-permiso-sanitario.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PasoUnoComponent,
    SanitarioComponent,
  ],
  imports: [
    CommonModule,
    PermisoSanitarioImportacionRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    NotificacionesComponent,
    PagoDeDerechosContenedoraComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    TituloComponent,
    AvisoDePrivacidadComponent,
    TercerosRelacionadosVistaComponent,
    ContenedorDeDatosSolicitudComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent

  ],
  providers: [
    ServiciosPermisoSanitarioService,
    ToastrService,
    CatalogosService,
    InicioSesionService,
    provideHttpClient(),
    SubirDocumentoService,
  ],
})
export class PermisoSanitarioImportacionModule {}

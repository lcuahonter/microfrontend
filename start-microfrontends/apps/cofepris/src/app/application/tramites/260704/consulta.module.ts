import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SharedModule, SolicitanteComponent, TituloComponent, TramiteFolioService, WizardComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaRoutingModule } from './consulta-routing.module';
import { ConsultaService } from './service/consulta.service';
import { ContenedorDeDatosSolicitudComponent } from './components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { DatosdelasolicitudComponent } from '../../shared/components/shared2607/datos-del/datos-de-la-solicitud.component';
import { NgModule } from '@angular/core';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { PagoDeDerechoComponent } from '../../shared/components/shared2607/pagodederechos/pago-de-derecho.component';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosTwoComponent } from '../../shared/components/shared2607/terceros relacionados two/terceros-relacionados-two.component';
import { TercerosrelacionadosComponent } from '../../shared/components/shared2607/terceros relacionados/terceros-relacionados.component';
import { ToastrService } from 'ngx-toastr';
import { TramitesAsociadosComponent } from '../../shared/components/shared2607/tramitesasociados/tramites-asociados.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

/**
 * Módulo para el feature de Consulta.
 *
 * Este módulo agrupa las rutas, formularios reactivos y módulos compartidos necesarios para el
 * feature de consulta. Además, provee los servicios requeridos en este feature.
 */
@NgModule({
  declarations: [PasoUnoComponent, SolicitudPageComponent, PasoDosComponent, PasoTresComponent,
],
  imports: [
    CommonModule,
    ConsultaRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SolicitanteComponent,
    DatosdelasolicitudComponent,
    PagoDeDerechoComponent,
    TercerosRelacionadosTwoComponent,
    TercerosrelacionadosComponent,
    TramitesAsociadosComponent,
    TramitesAsociadosSeccionComponent,
    TituloComponent,
    WizardComponent,
    CommonModule,
    BtnContinuarComponent,
    FormsModule,
    CommonModule,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    ReactiveFormsModule,
    AlertComponent,
    FirmaElectronicaComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    ContenedorDeDatosSolicitudComponent,
    PagoDeDerechosContenedoraComponent,
    NotificacionesComponent
    
  ],
  providers: [
    ToastrService,
    CatalogosService,
    TramiteFolioService,
    ConsultaService,
  ],
})
export class ConsultaModule { }

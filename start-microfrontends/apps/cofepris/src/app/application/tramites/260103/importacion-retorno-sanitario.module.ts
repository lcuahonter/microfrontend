import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from './components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { ImportacionRetornoSanitarioRoutingModule } from './importacion-retorno-sanitario-routing.module';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vistas/terceros-relacionados-vista.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PasoUnoComponent,
    ContenedorDePasosComponent
  ],
  imports: [
    CommonModule,
    ImportacionRetornoSanitarioRoutingModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent,
    WizardComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent
  ],
  providers: [
    ToastrService
  ],
})
export class ImportacionRetornoSanitarioModule {}

import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  FirmaElectronicaComponent,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from './components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { ImportacionMateriasPrimasRoutingModule } from './importacion-materias-primas-routing.module';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoTresComponent,
    ContenedorDePasosComponent,
  ],
  imports: [
    CommonModule,
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
    ImportacionMateriasPrimasRoutingModule,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent
  ],
  providers: [ToastrService],
})
export class ImportacionMateriasPrimasModule {}

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from './components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { ImportacionTratamientosEspecialesRoutingModule } from './importacion-tratamientos-especiales-routing.module';
import { NgModule } from '@angular/core';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [ 
    PasoDosComponent,
    PasoTresComponent,
    
  ],
  imports: [
    CommonModule,
    PasoUnoComponent,
    ContenedorDePasosComponent,
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
    ImportacionTratamientosEspecialesRoutingModule,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
     NotificacionesComponent
   
  ],
  providers: [
    ToastrService
  ],
})
export class ImportacionTratamientosEspecialesModule {}

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from './components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PermisoSanitarioProductosRoutingModule } from './permiso-sanitario-productos-routing.module';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosVistaComponent } from './components/terceros-relacionados-vistas/terceros-relacionados-vista.component';

@NgModule({
  declarations: [
    PasoUnoComponent,
    SolicitudPageComponent
  ],
  imports: [
    CommonModule, 
    TercerosRelacionadosVistaComponent,
    PermisoSanitarioProductosRoutingModule,
    PagoDeDerechosContenedoraComponent,
    ContenedorDeDatosSolicitudComponent,
    SolicitanteComponent,
    WizardComponent,
    BtnContinuarComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    TituloComponent, 
    ToastrModule.forRoot(),
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent
  ],
  providers: [ToastrService],
})
export class PermisoSanitarioProductosModule {}

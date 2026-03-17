import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AsociadosComponent } from './components/asociados/asociados.component';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDelSolicitudModificacionComponent } from '../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosEstablecimientoComponent } from './components/datos-establecimiento/datos-establecimiento.component';
import { DerechosComponent } from './components/derechos/derechos.component';
import { HttpClientModule } from '@angular/common/http';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { ModificacionPermisoSanitarioRoutingModule } from './modificacion-permiso-sanitario-routing.module';
import { NgModule } from '@angular/core';
import { PagoDeDerechosEntradaComponent } from '../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoduosComponent } from './pages/paso-dos/paso-dos.component';
import { PasotresComponent } from './pages/paso-tres/paso-tres.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SanitarioService } from './services/sanitario.service';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TercerosRelacionadoesComponent } from './components/terceros-Relacionados/terceros-Relacionados.component';
import { TercerosRelacionadosFabSeccionComponent } from '../../shared/components/terceros-relacionados-fab-seccion/terceros-relacionados-fab-seccion.component';
import { TramitesAsociadosSeccionComponent } from '../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';
import { forwardRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PantallasComponent,
    DatosComponent,
    PasoduosComponent,
    PasotresComponent,
  ],
  imports: [
    CommonModule, 
    HttpClientModule,
    ModificacionPermisoSanitarioRoutingModule, 
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    TercerosRelacionadoesComponent,
    DatosEstablecimientoComponent,
    DerechosComponent,
    AsociadosComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    ToastrModule.forRoot(),
    FirmaElectronicaComponent,
    AlertComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    DatosDelSolicitudModificacionComponent,
    TercerosRelacionadosFabSeccionComponent,
    PagoDeDerechosEntradaComponent,
    TramitesAsociadosSeccionComponent,
    forwardRef(() => InputRadioComponent)    
  ],
  
  providers: [
      ToastrService,
      provideHttpClient(),
      CatalogosService,
      InicioSesionService,
      SubirDocumentoService,
      ServiciosPantallaService,
      SanitarioService
    ],
})
export class ModificacionPermisoSanitarioModule {}

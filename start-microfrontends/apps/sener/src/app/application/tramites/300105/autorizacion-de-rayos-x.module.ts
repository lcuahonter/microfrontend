import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertComponent, BtnContinuarComponent, CatalogoSelectComponent, CrosslistComponent, InputFechaComponent, InputRadioComponent, NotificacionesComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AutorizacionDatosComponent } from './pages/autorizacion-datos/autorizacion-datos.component';
import { AutorizacionDeRayosXRoutingModule } from './autorizacion-de-rayos-x-routing.module';
import { DatosDelSolicitanteComponent } from './components/datos-del-solicitante/datos-del-solicitante.component';
import { DatosSolicitudComponent } from './components/datos-solicitud/datos-solicitud.component';
import { DerechosComponent } from './pages/derechos/derechos.component';
import { DestinatariosComponent } from './components/destinatarios/destinatarios.component';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { ModalComponent } from './components/modal/modal.component';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TercerosRelacionadosComponent } from './pages/terceros-relacionados/terceros-relacionados.component';

@NgModule({
  declarations: [
    AutorizacionDatosComponent, 
    PasoUnoComponent, 
    SolicitudComponent,
    TercerosRelacionadosComponent,
    DerechosComponent,
    PagoDeDerechosComponent,
    DatosDelSolicitanteComponent,
    DatosSolicitudComponent,
    ModalComponent,
    DestinatariosComponent,
  ],
  imports: [
    CommonModule,
    AutorizacionDeRayosXRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
    TablaDinamicaComponent,
    PasoDosComponent,
    PasoTresComponent,
    InputFechaComponent,
    AlertComponent,
    ToastrModule.forRoot(),
    InputRadioComponent,
    TablaDinamicaComponent,
    CrosslistComponent,
    NotificacionesComponent
],
  providers: [
    ToastrService,
    InicioSesionService,
    SubirDocumentoService
  ]
})
export class AutorizacionDeRayosXModule {}

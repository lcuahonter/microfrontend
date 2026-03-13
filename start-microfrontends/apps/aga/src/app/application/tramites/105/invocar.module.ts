import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { AnexarDocumentosComponent } from '@libs/shared/data-access-user/src/tramites/components/anexar-documentos/anexar-documentos.component';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDelTramiteDosComponent } from './components/datos-del-tramite-dos/datos-del-tramite-dos.component';
import { DatosDelTramiteUnoComponent } from './components/datos-del-tramite-uno/datos-del-tramite-uno.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';
import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { InvocarRoutingModule } from './invocar-routing.module';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { provideHttpClient } from '@angular/common/http';
import { PasoCargaDocumentoComponent, PasoFirmaComponent,} from '@libs/shared/data-access-user/src';
import {

  NotificacionesComponent,

} from '@libs/shared/data-access-user/src';
@NgModule({
  declarations: [
    DatosComponent,
    PantallasComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    NotificacionesComponent,
    InvocarRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    BtnContinuarComponent,
    AnexarDocumentosComponent,
    DatosDelTramiteUnoComponent,
    DatosDelTramiteDosComponent,
    AlertComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
  providers:[
    provideHttpClient(),
    CatalogosService,
    ToastrService,
    InicioSesionService,
    SubirDocumentoService,
    ServiciosPantallaService
  ]
})
export class InvocarModule { }

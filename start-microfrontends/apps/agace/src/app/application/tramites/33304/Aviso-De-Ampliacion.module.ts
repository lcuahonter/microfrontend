import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, SharedModule, SolicitanteComponent, TituloComponent, TramiteFolioService, WizardComponent } from '@libs/shared/data-access-user/src';
import { AcuseYResolucionesFolioTramiteService } from '@libs/shared/data-access-user/src/core/services/shared/acuses-y-resolucions-folio-tramite/acuses-y-resoluciones-folio-tramite.service';
import { AvisoDeAdicionComponent } from './components/aviso-de-adicion/aviso-de-adicion.component';
import { AvisoDeAmpliacionRoutingModule } from './Aviso-De-Ampliacion-routing.module';
import { AvisoDeModificacionComponent } from './components/aviso-de-modificacion/aviso-de-modificacion.component';
import { AvisoPorFusionComponent } from './components/aviso-por-fusion/aviso-por-fusion.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TipoDeAvisoComponent } from './components/tipo-de-aviso/tipo-de-aviso.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent    
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AvisoDeAmpliacionRoutingModule,
    HttpClientModule,
    WizardComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    WizardComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    TipoDeAvisoComponent,
    AvisoDeModificacionComponent,
    AvisoPorFusionComponent,
    AvisoDeAdicionComponent
  ],
  providers: [
    ToastrService,
    CatalogosService,
    TramiteFolioService,
    AcuseYResolucionesFolioTramiteService
  ],
})
export class AvisoDeAmpliacionModule { }

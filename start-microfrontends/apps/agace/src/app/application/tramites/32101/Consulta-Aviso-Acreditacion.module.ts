import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, SharedModule, SolicitanteComponent, TituloComponent, TramiteFolioService, WizardComponent } from '@libs/shared/data-access-user/src';
import { AcuseYResolucionesFolioTramiteService } from '@libs/shared/data-access-user/src/core/services/shared/acuses-y-resolucions-folio-tramite/acuses-y-resoluciones-folio-tramite.service';
import { CommonModule } from '@angular/common';
import { ConsultaAvisoAcreditacionRoutingModule } from './Consulta-Aviso-Acreditacion-routing.module';
import { ConsultaAvisoAcreditacionService } from './services/consulta-aviso-acreditacion.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudComponent } from './components/solicitud/Solicitud.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [

    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ConsultaAvisoAcreditacionRoutingModule,
    SolicitudComponent,
    HttpClientModule,
    WizardComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    WizardComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    
  ],
  providers: [ToastrService,ConsultaAvisoAcreditacionService,CatalogosService,
    TramiteFolioService,AcuseYResolucionesFolioTramiteService],
})
export class ConsultaAvisoAcreditacionModule { }

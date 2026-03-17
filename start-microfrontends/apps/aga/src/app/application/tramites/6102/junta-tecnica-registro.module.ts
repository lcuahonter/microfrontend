import { AlertComponent, AnexarDocumentosComponent, CatalogosService, FirmaElectronicaComponent, SharedModule, SolicitanteComponent, TituloComponent, TramiteFolioService, WizardComponent } from '@libs/shared/data-access-user/src';
import { AcuseYResolucionesFolioTramiteService } from '@libs/shared/data-access-user/src/core/services/shared/acuses-y-resolucions-folio-tramite/acuses-y-resoluciones-folio-tramite.service';
import { BtnContinuarComponent } from './components/btn-continuar/btn-continuar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JuntaTecnicaRegistroRoutingModule } from './junta-tecnica-registro-routing.module.';
import { JuntaTecnicaRegistroService } from './service/junta-tecnica-registro.service';
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
    HttpClientModule,
    WizardComponent,
    SolicitudComponent,
    JuntaTecnicaRegistroRoutingModule,
    AnexarDocumentosComponent,
    AlertComponent,
    WizardComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    
  ],
  providers: [ToastrService,CatalogosService,JuntaTecnicaRegistroService,
    TramiteFolioService,AcuseYResolucionesFolioTramiteService],
})
export class JuntaTecnicaRegistroModule { }

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, InicioSesionService, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AmpliacionProsecProductorRoutingModule } from './ampliacion-prosec-productor-routing.module';
import { PasoCargaDocumentoComponent } from '@libs/shared/data-access-user/src/tramites/components/paso-carga-documento/paso-carga-documento.component';

import { CommonModule } from '@angular/common';
import { DomiciliosDePlantasComponent } from './components/domicilios-de-plantas/domicilios-de-plantas.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ProsecComponent } from './pages/prosec/prosec.component';
import { SectoresYMercanciasComponent } from './components/sectores-y-mercancias/sectores-y-mercancias.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
    ProsecComponent,
  ],
  imports: [
    PasoFirmaComponent,
    CommonModule,
    AmpliacionProsecProductorRoutingModule,
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    DomiciliosDePlantasComponent,
    SectoresYMercanciasComponent,
    PasoCargaDocumentoComponent,
  ],
  providers: [
    ToastrService,
    CatalogosService,
    InicioSesionService,
    provideHttpClient(),
    SubirDocumentoService,
  ],
})
export class AmpliacionProsecProductorModule { }

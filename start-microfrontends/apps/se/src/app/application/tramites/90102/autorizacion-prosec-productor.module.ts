import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogosService, FirmaElectronicaComponent, InicioSesionService, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AutorizacionProsecProductorRoutingModule } from './autorizacion-prosec-productor-routing.module';
import { CommonModule } from '@angular/common';
import { DomiciliosDePlantasComponent } from './component/domicilios-de-plantas/domicilios-de-plantas.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ProsecComponent } from './pages/prosec/prosec.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { SectoresYMercanciasComponent } from './component/sectores-y-mercancias/sectores-y-mercancias.component';


@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoTresComponent,
    PasoDosComponent,
    ProsecComponent,
  ],
  imports: [
    CommonModule,
    AutorizacionProsecProductorRoutingModule,
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    SectoresYMercanciasComponent,
    DomiciliosDePlantasComponent,
    ReactiveFormsModule,
    PasoFirmaComponent,
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
export class AutorizacionProsecProductorModule { }

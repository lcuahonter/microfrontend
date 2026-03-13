import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, CrosslistComponent, FirmaElectronicaComponent, InputCheckComponent, InputFechaComponent, InputHoraComponent, SelectPaisesComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CertificadoOrigenComponent } from './components/certificado-origen/certificado-origen.component';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from './components/datos-certificado/datos-certificado.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PeximRoutingModule } from './pexim-routing.module';
import { RouterModule } from '@angular/router';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    WizardComponent,
    PeximRoutingModule,
    SharedModule,
    SolicitanteComponent,
    BtnContinuarComponent,
    InputCheckComponent,
    InputFechaComponent,
    InputHoraComponent,
    CrosslistComponent,
    ReactiveFormsModule,
    TituloComponent,
    SelectPaisesComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    DatosCertificadoComponent,
    CatalogoSelectComponent,
    CertificadoOrigenComponent,
    PasoUnoComponent,
    PasoFirmaComponent
  ],
  exports: [
    DatosCertificadoComponent,
    CertificadoOrigenComponent
  ],
  providers: [
    ToastrService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PeximModule { }

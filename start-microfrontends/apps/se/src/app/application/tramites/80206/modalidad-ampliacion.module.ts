import { AlertComponent, CargaDocumentoComponent,FirmaElectronicaComponent, PasoCargaDocumentoComponent } from '@ng-mf/data-access-user';
import { Ampliacion3RsComponent } from './components/ampliacion-3Rs/ampliacion-3rs.component';
import { AmpliacionAnexoComponent } from './components/ampliacion-anexo/ampliacion-anexo.component';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CertificadoRegistro } from './certificado-registro-routing.module';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@ng-mf/data-access-user';
import { FormsModule} from '@angular/forms';
import { InputCheckComponent } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RegistroPageComponent } from './pages/registro-page/registro-page.component';
import { ToastrService } from 'ngx-toastr';

/**
 * Módulo para el registro de certificados zoosanitarios.
 * Este módulo declara y exporta los componentes necesarios para el registro de certificados,
 * incluyendo los pasos del asistente y otros componentes compartidos.
 */

/**
 * Módulo para el registro de certificados zoosanitarios.
 */

@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    RegistroPageComponent,
    Ampliacion3RsComponent,
    AmpliacionAnexoComponent,

  ],
  imports: [
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CatalogoSelectComponent,
    CertificadoRegistro,
    CommonModule,
    CrosslistComponent,
    FormsModule,
    InputCheckComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    SharedModule,
    SolicitanteComponent,
    TablaDinamicaComponent,
    TituloComponent,
    WizardComponent,
    CargaDocumentoComponent,
    PasoCargaDocumentoComponent,
    FirmaElectronicaComponent,
    PasoFirmaComponent
  ],
  providers: [ToastrService]
})
export class ModalidadAmpliacionModule { }
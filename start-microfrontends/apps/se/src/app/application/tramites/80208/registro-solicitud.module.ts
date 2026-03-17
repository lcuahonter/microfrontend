import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AlertComponent, PasoCargaDocumentoComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

import { CambioDeModalidadComponent } from './component/cambio-de-modalidad/cambio-de-modalidad.component';

import { PasoCuatroComponent } from './pages/paso-cuatro/paso-cuatro.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { RegistroSolicitudRoutingModule } from './registro-solicitud-routing.module';
import { SolicitudModalidadPageComponent } from './pages/solicitud-modalidad-page/solicitud-modalidad-page.component';

@NgModule({
  declarations: [
    SolicitudModalidadPageComponent,
    PasoUnoComponent,
    PasoCuatroComponent,
    PasoDosComponent,

  ],
  imports: [
    CommonModule,
    RegistroSolicitudRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    AlertComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    TablaDinamicaComponent,
    CambioDeModalidadComponent,
    SharedModule,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],

  providers: [ToastrService],

})
export class RegistroSolicitudModule { }
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnexarDocumentosComponent } from "@ng-mf/data-access-user";
import { CommonModule } from '@angular/common';

import { NgModule, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AlertComponent, BtnContinuarComponent, CargaDocumentoComponent, CatalogoSelectComponent, CrosslistComponent, FirmaElectronicaComponent, InputCheckComponent, InputFechaComponent, InputHoraComponent, SelectPaisesComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PeximRoutingModule } from './pexim-routing.module';

import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { ToastrService } from 'ngx-toastr';

import { NotificacionesComponent } from "@ng-mf/data-access-user";

import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
    SolicitudComponent,
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
    AlertComponent,
    CatalogoSelectComponent,
    AnexarDocumentosComponent,
    NotificacionesComponent,
    TooltipModule,
    forwardRef(() => CargaDocumentoComponent),
    PasoFirmaComponent
],
  exports: [
    SolicitudComponent
  ],
  providers: [
    ToastrService
  ]
})
export class PeximModule { }

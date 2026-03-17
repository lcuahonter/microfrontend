
import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, CatalogoSelectComponent, FirmaElectronicaComponent, InputFechaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CafeExportadoresComponent } from './pages/cafe-exportadores/cafe-exportadores.component';

import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';


import { NacionalRegistroDelCafeExportadoresRoutingModule } from './nacional-registro-del-cafe-exportadores-routing.module';
import { NacionalRegistroDelCafeExportadoresService } from './services/nacional-registro-del-cafe-exportadores.service';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';

import {ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    CafeExportadoresComponent,
    
  ],
  imports: [
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CommonModule,
    DatosDeLaSolicitudComponent,
    FirmaElectronicaComponent,
    InputFechaComponent,
    SolicitanteComponent,
    TituloComponent,
    WizardComponent,
    NacionalRegistroDelCafeExportadoresRoutingModule,
    ReactiveFormsModule,
    CatalogoSelectComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ToastrService,NacionalRegistroDelCafeExportadoresService,
],
})
export class NacionalRegistroDelCafeExportadoresModule { }

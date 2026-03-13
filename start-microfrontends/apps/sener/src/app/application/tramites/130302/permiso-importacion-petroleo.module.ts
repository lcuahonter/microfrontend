import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { PermisoImportacionPetroleoRoutingModule } from './permiso-importacion-petroleo-routing.module';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InicioSesionService, ServiciosPantallasService, SolicitanteComponent, SubirDocumentoService, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { ImportacionExportacionPetroleoComponent } from './components/importacion-exportacion-petroleo/importacion-exportacion-petroleo.component';

import { DatosComponent } from './pages/datos/datos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

@NgModule({
  declarations: [ DatosComponent,PantallasComponent,PasoDosComponent,PasoTresComponent],
  imports: [
    CommonModule,
    PermisoImportacionPetroleoRoutingModule,
    SolicitanteComponent,
    ImportacionExportacionPetroleoComponent,
    AlertComponent,
    BtnContinuarComponent,
    TituloComponent,
    WizardComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent
    ],
  providers: [ 
    ToastrService,
    provideHttpClient(),
      ServiciosPantallasService,
      InicioSesionService,
      SubirDocumentoService,
  ]
})
export class PermisoImportacionPetroleoModule { }

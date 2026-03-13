
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogosService,
  FirmaElectronicaComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { DatosComponent } from './pages/datos/datos.component';

import { DatosEstablecimientoComponent } from './components/datosEstablecimiento/datosEstablecimiento.component';
import { DerechosComponent } from './components/derechos/derechos.component';
import { SanitarioService } from './services/sanitario.service';

import { InicioSesionService } from '@libs/shared/data-access-user/src/core/services/shared/inicio-sesion/inicio-sesion.service';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoduosComponent } from './pages/pasoduos/pasoduos.component';
import { PasotresComponent } from './pages/paso-tres/paso-tres.component';
import { PermisoSanitarioRoutingModule } from './permiso-sanitario-routing.module';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { SubirDocumentoService } from '@libs/shared/data-access-user/src/core/services/shared/subir-documento/subir-documento.service';
import { provideHttpClient } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { TercerosRelacionadoesComponent } from './components/terceros-Relacionados/terceros-Relacionados.component';



@NgModule({
  declarations: [
    PantallasComponent,
    DatosComponent,
    PasoduosComponent,
    PasotresComponent,
  ],
  imports: [
    CommonModule, 
    HttpClientModule,
    PermisoSanitarioRoutingModule, 
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    TercerosRelacionadoesComponent,
    DatosEstablecimientoComponent,
    DerechosComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    ToastrModule.forRoot(),
    FirmaElectronicaComponent,
    AlertComponent
  ],

  exports: [
    PasoduosComponent,
    PasotresComponent
  ],
  
  providers: [
      ToastrService,
      provideHttpClient(),
      CatalogosService,
      InicioSesionService,
      SubirDocumentoService,
      ServiciosPantallaService,
      SanitarioService
    ],
})
export class PermisoSanitarioModule {}

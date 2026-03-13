/**
 * Componente para la modificación de permisos de importación de tratamientos.
 */
import {
  AlertComponent,
  BtnContinuarComponent,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { RenunciaDePermisoComponent } from './pages/renuncia-de-permiso/renuncia-de-permiso.component';

import { RenunciaDePermisoRoutingModule } from './renuncia-de-permiso-routing.module';

import { PasoUnoPagesComponent } from './pages/paso-uno-pages/paso-uno-pages.component';

import { PasoDosComponent } from '../../shared/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../../shared/paso-tres/paso-tres.component';
import { RenunciaDeDerechosComponent } from './components/renuncia-de-derechos/renuncia-de-derechos.component';
import { ToastrService } from 'ngx-toastr';


/*
  * Modulo para la modificación de permisos de importación de tratamientos.
  * Este módulo contiene los componentes y servicios necesarios para la funcionalidad de modificación de permisos.
  * 
  * @export
  * @class RenunciaDePermisoModule
  */
@NgModule({
  declarations: [PasoUnoPagesComponent, RenunciaDePermisoComponent],
  imports: [
    WizardComponent,
    TituloComponent,
         BtnContinuarComponent,
         CommonModule,
         FormsModule,
         SolicitanteComponent,
         AlertComponent,
         PasoDosComponent,
         PasoTresComponent,
         RenunciaDeDerechosComponent,
    RenunciaDePermisoRoutingModule,
  ],
  providers: [
    provideHttpClient(),
    ToastrService
  ],
})
/**
 * Módulo para la modificación de permisos de importación de tratamientos.
 * Este módulo contiene los componentes y servicios necesarios para la funcionalidad de modificación de permisos.
 * 
 * @export
 * @class RenunciaDePermisoModule
 */
export class RenunciaDePermisoModule {}

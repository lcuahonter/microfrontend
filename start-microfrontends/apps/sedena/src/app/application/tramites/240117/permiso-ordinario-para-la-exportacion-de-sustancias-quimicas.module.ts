import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PermisoOrdinarioParaLaExportacionDeSustanciasQuimicasRoutingModule } from './permiso-ordinario-para-la-exportacion-de-sustancias-quimicas-routing.module';
import { CargaDocumentoComponent, CargarDocumentoService } from '@libs/shared/data-access-user/src';

@NgModule({
  imports: [
    CommonModule,
    PermisoOrdinarioParaLaExportacionDeSustanciasQuimicasRoutingModule
  ]
})
export class PermisoOrdinarioParaLaExportacionDeSustanciasQuimicasModule { }

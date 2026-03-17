import { CommonModule } from '@angular/common';
import { ImportacionDeMaterialExplosivoRoutingModule } from './importacion-de-material-explosivo-routing.module';
import { NgModule } from '@angular/core';
import { CargaDocumentoComponent } from '@libs/shared/data-access-user/src';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ImportacionDeMaterialExplosivoRoutingModule,
    CargaDocumentoComponent
  ],
})
export class ImportacionDeMaterialExplosivoModule {}

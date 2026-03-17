import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RetiroImportacionExportacionPermisoRoutingModule } from './retiro-importacion-exportacion-permiso-routing.module';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RetiroImportacionExportacionPermisoRoutingModule,
    WizardComponent
  ],
  providers: [ToastrService]
})
export class RetiroImportacionExportacionPermisoModule { }
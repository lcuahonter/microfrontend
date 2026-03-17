import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PermisoImportacionRoutingModule } from './permiso-importacion-routing.module';

import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermisoImportacionRoutingModule,
    WizardComponent
  ],
})
export class PermisoImportacionModule { }
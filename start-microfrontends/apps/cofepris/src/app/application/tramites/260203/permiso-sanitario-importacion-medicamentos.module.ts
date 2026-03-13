import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { PermisoSanitarioImportacion260203RoutingModule } from './permiso-sanitario-importacion-medicamentos-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermisoSanitarioImportacion260203RoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class PermisoSanitarioImportacion260203Module {}

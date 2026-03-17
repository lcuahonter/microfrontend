import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

import { PermisoSanitarioImportacionMedicamentosRoutingModule } from './permiso-sanitario-importacion-medicamentos-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermisoSanitarioImportacionMedicamentosRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class PermisoSanitarioImportacionMedicamentosModule {}

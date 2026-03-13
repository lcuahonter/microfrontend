import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { PermisoSanitarioMedicosUsoPersonalRoutingModule } from './permiso-sanitario-medicos-uso-personal-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermisoSanitarioMedicosUsoPersonalRoutingModule,
    ContenedorDePasosComponent,
  ],
  providers: [ToastrService],
})
export class PermisoSanitarioMedicosUsoPersonalModule {}

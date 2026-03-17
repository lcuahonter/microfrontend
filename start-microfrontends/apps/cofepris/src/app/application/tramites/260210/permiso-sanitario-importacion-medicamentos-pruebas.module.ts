import { CommonModule } from '@angular/common';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { PermisoSanitarioImportacionMedicamentosPruebasRoutingModule } from './permiso-sanitario-importacion-medicamentos-pruebas-routing.module';

import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermisoSanitarioImportacionMedicamentosPruebasRoutingModule,
    ContenedorDePasosComponent,
  ],
  providers: [ToastrService],
})
export class PermisoSanitarioImportacionMedicamentosPruebasModule {}

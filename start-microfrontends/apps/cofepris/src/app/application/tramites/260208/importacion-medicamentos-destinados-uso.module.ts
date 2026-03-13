import { CommonModule } from '@angular/common';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { ImportacionMedicamentosDestinadosUsoRoutingModule } from './importacion-medicamentos-destinados-uso-routing.module';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ImportacionMedicamentosDestinadosUsoRoutingModule,
    ContenedorDePasosComponent,
  ],
  providers: [
    ToastrService
  ],
})
export class ImportacionMedicamentosDestinadosUsoModule {}


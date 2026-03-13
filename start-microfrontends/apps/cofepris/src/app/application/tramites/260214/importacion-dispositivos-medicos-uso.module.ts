import { CommonModule } from '@angular/common';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { ImportacionDispositivosMedicosUsoRoutingModule } from './importacion-dispositivos-medicos-uso-routing.module';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ImportacionDispositivosMedicosUsoRoutingModule,
    ContenedorDePasosComponent,
  ],
  providers: [
    ToastrService
  ],
})
export class ImportacionDispositivosMedicosUsoModule {}

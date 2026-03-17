import { CommonModule } from '@angular/common';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { ImportacionDispositivosMedicosLaboratorioRoutingModule } from './importacion-dispositivos-mediocos-laboratorio-routing.module';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ImportacionDispositivosMedicosLaboratorioRoutingModule,
    ContenedorDePasosComponent,
  ],
  providers: [
    ToastrService
  ],
})
export class ImportacionDispositivosMedicosLaboratorioModule {}

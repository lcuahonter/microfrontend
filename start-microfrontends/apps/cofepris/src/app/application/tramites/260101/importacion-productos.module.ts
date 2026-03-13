import { CommonModule } from '@angular/common';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { NgModule } from '@angular/core';
import { ServiciosExtraordinariosRoutingModule } from './importacion-productos-routing.module';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ServiciosExtraordinariosRoutingModule,
    ContenedorDePasosComponent,
  ],
  providers: [ToastrService],
})
export class ServiciosExtraordinariosModule {}

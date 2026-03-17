import { CommonModule } from '@angular/common';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { NgModule } from '@angular/core';
import { PermisoMaquilaRoutingModule } from './permiso-maquila-routing.module';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PermisoMaquilaRoutingModule,
    ContenedorDePasosComponent
  ],
  providers: [ToastrService],
})
export class PermisoMaquilaModule { }

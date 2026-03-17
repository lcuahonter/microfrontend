import { CommonModule } from '@angular/common';
import { ContenedorDePasosComponent } from './pages/contenedor-de-paso/contenedor-de-pasos.component';
import { ImportacionDispositivosMedicosUsoRoutingModule } from './importacion-dispositivos-medicos-donacion-routing.module';
import { NgModule } from '@angular/core';
import { PasoCargaDocumentoComponent} from '@ng-mf/data-access-user';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src'
import { ToastrService } from 'ngx-toastr';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ImportacionDispositivosMedicosUsoRoutingModule,
    ContenedorDePasosComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ],
  providers: [
    ToastrService
  ],
})
export class ImportacionDispositivosMedicosDonacionModule {}

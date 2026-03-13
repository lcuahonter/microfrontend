import { AlertComponent, TituloComponent } from '@ng-mf/data-access-user';
import { AutorizacionProgrmaNuevoRoutingModule } from './autorizacion-programa-nuevo-routing.module';
import { AutorizacionProgrmaNuevoService } from './services/autorizacion-programa-nuevo.service';
import { CargaDocumentoComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ContenedorComplementarPlantasComponent } from './components/contenedor-complementar-plantas/contenedor-complementar-plantas.component';
import { EmpresasSubfabricanteComponent } from './components/empresas-subfabricante/empresas-subfabricante.component';
import { NgModule } from '@angular/core';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [],
  imports: [CommonModule,AutorizacionProgrmaNuevoRoutingModule,
     EmpresasSubfabricanteComponent,
     ContenedorComplementarPlantasComponent,
    PasoFirmaComponent,
    CargaDocumentoComponent,
    TituloComponent,
    AlertComponent,
    ],
  providers: [ToastrService,AutorizacionProgrmaNuevoService]
})
export class AutorizacionProgrmaNuevoModule {}

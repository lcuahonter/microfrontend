import {PasoCargaDocumentoComponent, PasoFirmaComponent} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ModificacionSolicitudRoutingModule } from './modificacion-solicitud-routing.module';
import { ModificacionSolicitudeService } from './services/modificacion-solicitude.service';
import { NgModule } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [],
  imports: [CommonModule,ModificacionSolicitudRoutingModule,PasoCargaDocumentoComponent,PasoFirmaComponent],
  providers: [ModificacionSolicitudeService,ToastrService]
})
export class ModificacionSolicitudModule { }

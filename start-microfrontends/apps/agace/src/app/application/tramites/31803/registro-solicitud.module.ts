import { CatalogosService, SharedModule, TramiteFolioService } from '@libs/shared/data-access-user/src';
import { AcuseYResolucionesFolioTramiteService } from '@libs/shared/data-access-user/src/core/services/shared/acuses-y-resolucions-folio-tramite/acuses-y-resoluciones-folio-tramite.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RegistroSolicitudRoutingModule } from './registro-solicitud-routing.module';
import { RegistroSolicitudService } from './services/registro-solicitud-service.service';
import { SolicitudComponent } from './components/Solicitud.component';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RegistroSolicitudRoutingModule,
    SolicitudComponent,
    HttpClientModule
  ],
  providers: [ToastrService,RegistroSolicitudService,CatalogosService,
    TramiteFolioService,AcuseYResolucionesFolioTramiteService],
})
export class RegistroSolicitudModule { }

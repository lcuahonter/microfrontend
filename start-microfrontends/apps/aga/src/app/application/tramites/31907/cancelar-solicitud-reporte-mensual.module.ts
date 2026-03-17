import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CancelarSolicitudReporteMensualRoutingModule } from './cancelar-solicitud-reporte-mensual-routing.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    CancelarSolicitudReporteMensualRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class CancelarSolicitudReporteMensualModule {}

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { ReactivarReporteMensualRoutingModule } from './reactivar-reporte-mensual-routing.module';

@NgModule({
  declarations: [],
  imports: [
    ReactivarReporteMensualRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class ReactivarReporteMensualModule {}

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { RenovarReporteMensualRoutingModule } from './renovar-reporte-mensual-routing.module';

@NgModule({
  declarations: [],
  imports: [
    RenovarReporteMensualRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class RenovarReporteMensualModule {}

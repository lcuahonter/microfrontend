import { DesistirSolicitudInformacionHistoricaRoutingModule } from './desistir-solicitud-informacion-historica-routing.module';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    DesistirSolicitudInformacionHistoricaRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrModule],
})
export class DesistirSolicitudInformacionHistoricaModule {}

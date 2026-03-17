import { AvisoTesoreriaRoutingModule } from './aviso-tesoreria-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AvisoTesoreriaRoutingModule,
    SolicitudPageComponent,
  ]
})
export class AvisoTesoreriaModule { }

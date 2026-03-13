import { AvisoRetornoRoutingModule } from './aviso-retorno-routing.module';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
  ],
  imports: [
    AvisoRetornoRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers:[ToastrService]
})
export class AvisoRetornoModule {}

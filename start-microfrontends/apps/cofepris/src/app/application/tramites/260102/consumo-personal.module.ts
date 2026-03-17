import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ConsumoPersonalRoutingModule } from './consumo-personal-routing.module';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConsumoPersonalRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class ConsumoPersonalModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SanidadAcuicolaRoutingModule } from './sanidad-acuicola-routing.module';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [CommonModule, SanidadAcuicolaRoutingModule,],
    providers: [
      ToastrService
    ]
})
export class SanidadAcuicolaModule {}

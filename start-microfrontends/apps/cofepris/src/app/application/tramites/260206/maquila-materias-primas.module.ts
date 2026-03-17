import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

import { MaquilaMateriasPrimasModuleRoutingModule } from './maquila-materias-primas-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaquilaMateriasPrimasModuleRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class MaquilaMateriasPrimasModule {}

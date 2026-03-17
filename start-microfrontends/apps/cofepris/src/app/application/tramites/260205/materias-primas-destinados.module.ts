import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { MateriasPrimasDestinadosRoutingModule } from './materias-primas-destinados-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MateriasPrimasDestinadosRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class MateriasPrimasDestinadosModule {}

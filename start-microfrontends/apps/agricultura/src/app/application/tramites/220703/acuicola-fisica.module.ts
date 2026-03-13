import { AcuicolaFisicaRoutingModule } from './acuicola-fisica-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AcuicolaFisicaRoutingModule
  ],
  providers: [ToastrService]
})
export class AcuicolaFisicaModule { }

import { CommonModule } from '@angular/common';
import { InspeccionFitosanitarioRoutingModule } from './inspeccionfitosanitario-routing.module';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InspeccionFitosanitarioRoutingModule
  ],
  providers: [ToastrService]
})
export class InspeccionFitosanitarioModule { }

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MaterialesPeligrososRoutingModule } from './materiales-peligrosos-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '@libs/shared/data-access-user/src';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MaterialesPeligrososRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],

})
export class MaterialesPeligrososModule {}

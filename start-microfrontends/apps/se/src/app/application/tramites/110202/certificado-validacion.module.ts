import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


import { CertificadoValidacionRoutingModule } from './certificado-validacion-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CertificadoValidacionRoutingModule
  ],
  providers: [ToastrService]
})
export class CertificadoValidacionModule { }

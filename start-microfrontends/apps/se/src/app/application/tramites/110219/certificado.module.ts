import { AlertComponent, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { CertificadoRoutingModule } from './certificado-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CertificadoRoutingModule,
    AlertComponent,
    TablaDinamicaComponent,
  ],
})
export class CertificadoModule { }

import { SharedModule, WizardComponent } from '@ng-mf/data-access-user';
import { AvisoCertificacionRoutingModule } from './aviso-certification-routing.module';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
  ],
  imports: [
    FirmaElectronicaComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    WizardComponent,
    AvisoCertificacionRoutingModule,
    SharedModule,
   
  ],
  exports: [],
})
export class AvisoCertificacionModule {}

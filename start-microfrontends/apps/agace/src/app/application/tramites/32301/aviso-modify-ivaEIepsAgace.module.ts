import {
  FirmaElectronicaComponent,
  SharedModule,
  WizardComponent
} from '@ng-mf/data-access-user';
import { AvisoModifyIvaEIepsAgaceRoutingModule } from './aviso-modify-ivaEIepsAgace-routing.module';
import { CommonModule } from '@angular/common';
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
    AvisoModifyIvaEIepsAgaceRoutingModule,
    SharedModule,
   
  ],
  exports: [],
})
export class AvisoModifyIvaElepsAgaceModule {}

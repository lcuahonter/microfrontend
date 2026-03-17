import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AvisoProcesosRoutingModule } from './aviso-procesos-routing.module';
import { AvisoService } from './services/aviso.service';
import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AvisoProcesosRoutingModule,
    WizardComponent
  ],
  providers:[AvisoService]
})
export class AvisoProcesosModule { }

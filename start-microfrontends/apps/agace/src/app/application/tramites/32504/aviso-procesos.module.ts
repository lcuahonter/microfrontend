import { AvisoProcesosRoutingModule } from './aviso-procesos-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AvisoProcesosRoutingModule,
    WizardComponent
  ],
  providers:[]
})
export class AvisoProcesosModule { }

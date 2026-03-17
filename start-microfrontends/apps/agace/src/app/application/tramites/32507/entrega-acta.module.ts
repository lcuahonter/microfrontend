import { CommonModule } from '@angular/common';
import { EntregaActaRoutingModule } from './entrega-acta-routing.module';
import { EntregaActaService } from './services/entrega-acta.service';
import { NgModule } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    EntregaActaRoutingModule,
    WizardComponent,
    
    
  ],
  providers:[EntregaActaService]
})
export class EntregaActaModule { }

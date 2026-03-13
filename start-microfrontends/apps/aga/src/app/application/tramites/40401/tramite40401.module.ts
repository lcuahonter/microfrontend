
import { AlertComponent, CatalogosService } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { forwardRef } from '@angular/core';

import { NgModule } from '@angular/core';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { Tramite40401RoutingModule } from './tramite40401-routing.module';
import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [
    
   ],
  imports: [
    forwardRef(() => AlertComponent),
    SolicitudPageComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    CommonModule,
    FirmaElectronicaComponent,
    FormsModule,
    PasoUnoComponent,
    Tramite40401RoutingModule,
    PasoTresComponent,
    ReactiveFormsModule,
  
  
    forwardRef(() => TituloComponent),
    WizardComponent,
    SharedModule,
    
  ],
  providers: [ToastrService,CatalogosService],
})
export class Tramite40401Module {}

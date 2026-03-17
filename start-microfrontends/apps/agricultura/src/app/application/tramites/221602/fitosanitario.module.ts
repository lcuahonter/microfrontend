import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';


import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FirmarSolicitudComponent } from './pages/firmar-solicitud/firmar-solicitud.component';

import { NgModule } from '@angular/core';

import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { FitosanitarioComponent } from './pages/fitosanitario/fitosanitario.component';
import { FitosanitarioRoutingModule } from './fitosanitario-routing.module';
import { MovilizacionComponent } from './components/movilizacion/movilizacion.component';
import { PagoDeDerechos221602Component } from './components/pago-de-derechos221602/pago-de-derechos221602.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { TercerosComponent } from './components/terceros/terceros.component';

@NgModule({
  declarations: [    
    DatosComponent,FirmarSolicitudComponent,FitosanitarioComponent,PasoDosComponent
  ],
  imports: [
    CommonModule,AlertComponent,AnexarDocumentosComponent,
    FitosanitarioRoutingModule,
    BtnContinuarComponent,   
    TituloComponent,
    WizardComponent,FirmaElectronicaComponent,
    SolicitanteComponent,DatosDeLaSolicitudComponent,MovilizacionComponent,TercerosComponent,PagoDeDerechos221602Component
  ],
  providers: [
    ToastrService
  ]
})
export class FitosanitarioModule { }

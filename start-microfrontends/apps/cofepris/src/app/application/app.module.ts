
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BreadcrumbComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { EstablecimientoService } from './shared/services/establecimiento.service';
import { FooterComponent } from '@ng-mf/data-access-user';
import { HeaderComponent } from '@ng-mf/data-access-user';
import { InformacionUsuarioComponent } from "@ng-mf/data-access-user";
import { ModificacionDeDispositivosModule } from './tramites/260911/modificacion-de-dispositivos.module';
import { NavComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { SolicitanteService } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';

import { TituloComponent } from "@ng-mf/data-access-user";

import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';

import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';


import { SeleccionTramiteComponent } from './seleccion-tramite/seleccion-tramite.component';


import { PagoDeDerechosEntradaService } from './shared/services/pago-de-derechos-entrada.service';
import { RfcSolicitanteComponent } from '@libs/shared/data-access-user/src';

@NgModule({
  declarations: [
    AppComponent,
    SeleccionTramiteComponent,
    
  ],
  imports: [
    AkitaNgDevtools,
    AppRoutingModule,
    BreadcrumbComponent,
    ModificacionDeDispositivosModule,
    FooterComponent,
    HeaderComponent,
    InformacionUsuarioComponent,
    InformacionUsuarioComponent,
    NavComponent,
    TituloComponent,
    ToastrModule.forRoot(),
    WizardComponent,
    SolicitanteComponent,
    BtnContinuarComponent,
    RfcSolicitanteComponent
],
  providers: [
    EstablecimientoService,
    PagoDeDerechosEntradaService,
    provideToastr({
      positionClass: 'toast-top-right',
    }),
    provideHttpClient(),
    SolicitanteService,
  ],
  bootstrap: [AppComponent],
})
export class AppCofeprisModule {}

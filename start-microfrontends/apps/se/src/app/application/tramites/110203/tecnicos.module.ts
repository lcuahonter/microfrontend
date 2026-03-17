import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AlertComponent, BtnContinuarComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';

import { DatosBusquedaComponent } from './components/datos-busqueda/datos-busqueda.component';
import { DatosCertificado110203Component } from './components/datos-certificado-110203/datos-certificado-110203.component';
import { DatosComponent } from './pages/datos/datos.component';
import { Destinatario110203Component } from './components/destinatario-110203/destinatario-110203.component';
import { FirmarSolicitudComponent } from './pages/firmar-solicitud/firmar-solicitud.component';
import { TecnicosComponent } from './pages/tecnicos/tecnicos.component';
import { TecnicosRoutingModule } from './tecnicos-routing.module';
import { Transporte110203Component } from './components/transporte-110203/transporte-110203.component';
import { Tratados110203Component } from './components/tratados-110203/tratados-110203.component';


@NgModule({
  declarations: [    
    DatosComponent,FirmarSolicitudComponent,TecnicosComponent
  ],
  imports: [
    AlertComponent,
    CommonModule,DatosBusquedaComponent,
    TecnicosRoutingModule,
    BtnContinuarComponent,   
    TituloComponent,  
    PasoFirmaComponent,
    WizardComponent,FirmaElectronicaComponent,Destinatario110203Component,
    SolicitanteComponent,Tratados110203Component,DatosCertificado110203Component,Transporte110203Component
  ],
  providers: [
    ToastrService
  ]
})
export class TecnicosModule { }

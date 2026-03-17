import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FirmarSolicitudComponent } from './pages/firmar-solicitud/firmar-solicitud.component';
import { MovilizacionComponent } from './components/movilizacion/movilizacion.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechos221601Component } from './components/pago-de-derechos221601/pago-de-derechos221601.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { TercerosComponent } from './components/terceros/terceros.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';
import { ZoosanitarioParaImportacionComponent } from './pages/zoosanitario-para-importacion/zoosanitario-para-importacion.component';
import { ZoosanitarioParaImportacionRoutingModule } from './zoosanitario-para-importacion-routing.module';

@NgModule({
  declarations: [    
    DatosComponent,FirmarSolicitudComponent,ZoosanitarioParaImportacionComponent,PasoDosComponent
  ],
  imports: [
    CommonModule,AlertComponent,AnexarDocumentosComponent,
    ZoosanitarioParaImportacionRoutingModule,
    BtnContinuarComponent,   
    TituloComponent,
    WizardComponent,FirmaElectronicaComponent,
    SolicitanteComponent,TercerosComponent,PagoDeDerechos221601Component,MovilizacionComponent,DatosDeLaSolicitudComponent
  ],
  providers: [
    ToastrService
  ]
})
export class ZoosanitarioParaImportacionModule { }

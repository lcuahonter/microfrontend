import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosDelInmuebleComponent } from '../components/datos-del-inmueble/datos-del-inmueble.component';
import { DepositoFiscalManufacturaVehiculosRoutingModule } from './deposito-fiscal-manufactura-vehiculos-routing.module';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from '../pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from '../pages/solicitud-page/solicitud-page.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';

@NgModule({
  declarations: [SolicitudPageComponent,PasoUnoComponent,PasoDosComponent,PasoTresComponent],
  imports: [
    CommonModule,
    DepositoFiscalManufacturaVehiculosRoutingModule,
    WizardComponent,
    SolicitanteComponent,
    DatosDelInmuebleComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    TituloComponent
  ]
})
export class DepositoFiscalManufacturaVehiculosModule { }

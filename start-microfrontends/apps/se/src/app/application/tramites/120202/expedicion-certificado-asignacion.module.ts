import { AlertComponent, BtnContinuarComponent, FirmaElectronicaComponent,NotificacionesComponent, PasoFirmaComponent, SolicitanteComponent, WizardComponent, } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { ExpedicionCertificadoAsignacionRoutingModule } from './expedicion-certificado-asignacion-routing.module';
import { ExpedicionCertificadosAsignacionDirectaComponent } from '../../shared/components/expedicion-certificados-asignacion-directa/expedicion-certificados-asignacion-directa.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PantallasComponent,
    DatosComponent,
    PasoDosComponent
  ],
  imports: [
    CommonModule,
    ExpedicionCertificadoAsignacionRoutingModule,
    WizardComponent,
    AlertComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    ExpedicionCertificadosAsignacionDirectaComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    ReactiveFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ExpedicionCertificadoAsignacionModule { }

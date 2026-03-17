import { AlertComponent, BtnContinuarComponent, FirmaElectronicaComponent, NotificacionesComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuposRoutingModule } from './cupos-routing.module';
import { DatosComponent } from './pages/datos/datos.component';
import { ExpedicionCertificadosAsignacionDirectaComponent } from '../../shared/components/expedicion-certificados-asignacion-directa/expedicion-certificados-asignacion-directa.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DatosComponent,
    PantallasComponent,
    PasoDosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CuposRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    AlertComponent,
    ExpedicionCertificadosAsignacionDirectaComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CuposModule { }

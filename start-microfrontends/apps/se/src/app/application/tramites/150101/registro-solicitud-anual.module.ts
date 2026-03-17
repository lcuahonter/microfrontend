import { AcuseComponent, AlertComponent, BtnContinuarComponent, FirmaElectronicaComponent, InputFechaComponent, PasoFirmaComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { AcusePageComponent } from './components/acuse-page/acuse-page.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDeReporteAnnualComponent } from './components/datos-de-reporte-anual/datos-de-reporte-anual.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { ProgramasReporteAnnualComponent } from './components/programas-reporte-anual/programas-reporte-anual.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReporteAnualRoutingModule } from './registro-solicitud-anual-routing.module';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitudDeReporteComponent } from './pages/registro-solicitud-anual/solicitud-de-reporte.component';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    SolicitudDeReporteComponent,
    DatosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    FormsModule,
    ReactiveFormsModule,
    ReporteAnualRoutingModule,
    FirmaElectronicaComponent,
    TituloComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    AcuseComponent,
    AcusePageComponent,
    BsDatepickerModule.forRoot(),
    NotificacionesComponent,
    AlertComponent,
    ProgramasReporteAnnualComponent,
    DatosDeReporteAnnualComponent,
    PasoFirmaComponent
  ],
  providers: [provideHttpClient(), ToastrService],
})
export class ReporteAnualModule {}

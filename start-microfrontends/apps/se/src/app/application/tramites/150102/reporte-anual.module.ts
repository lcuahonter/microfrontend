import { AcuseComponent } from '@libs/shared/data-access-user/src';
import { AcusePageComponent } from './components/acuse-page/acuse-page.component';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDeReporteAnnualComponent } from './components/datos-de-reporte-annual/datos-de-reporte-annual.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { FormsModule } from '@angular/forms';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { ProgramasReporteAnnualComponent } from './components/programas-reporte-annual/programas-reporte-annual.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReporteAnualRoutingModule } from './reporte-anual-routing.module';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitudDeReporteComponent } from './pages/solicitud-de-reporte/solicitud-de-reporte.component';
import { TablaConEntradaComponent } from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
     
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
    TablaConEntradaComponent,
    AcuseComponent,
    AlertComponent,
    AcusePageComponent,
    BsDatepickerModule.forRoot(),
    SolicitudDeReporteComponent,
    ProgramasReporteAnnualComponent,
    DatosDeReporteAnnualComponent,
    DatosComponent,
    PasoTresComponent,  
  ],
  providers: [provideHttpClient(), ToastrService],
})
export class ReporteAnualModule {}

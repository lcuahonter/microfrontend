import { AlertComponent, 
  AnexarDocumentosComponent, 
  BtnContinuarComponent, 
  FirmaElectronicaComponent, 
  InputFechaComponent, 
  NotificacionesComponent, 
  PasoFirmaComponent,
  SolicitanteComponent, 
  TablaDinamicaComponent, 
  TituloComponent,
   WizardComponent } from '@libs/shared/data-access-user/src';
   import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CommonModule } from '@angular/common';
import { DatosDeReporteAnualComponent } from './components/datos-de-reporte-anual/datos-de-reporte-anual.component';
import { InformeAnualProgramaService } from './services/informe-anual-programa.service';

import { InformeAnualProgramaRoutingModule } from './informe-anual-programa-routing.module';

import { NgModule } from '@angular/core';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';

import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ProgramasReporteAnualComponent } from './components/programas-reporte-anual/programas-reporte-anual.component';
import { ReactiveFormsModule } from '@angular/forms';

import { SolicitudDeReporteComponent } from './pages/solicitud-de-reporte/solicitud-de-reporte.component';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';


@NgModule({  
  declarations: [
    PasoUnoComponent, 
    PasoTresComponent,
    SolicitudDeReporteComponent,
    ProgramasReporteAnualComponent,
  ],
  imports: [
    CommonModule,
    InformeAnualProgramaRoutingModule,
    ReactiveFormsModule,
    DatosDeReporteAnualComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    BtnContinuarComponent,
    FirmaElectronicaComponent,
    InputFechaComponent,
    PasoFirmaComponent,
    SolicitanteComponent,
    TituloComponent,
    TablaDinamicaComponent,
    WizardComponent,
    BsDatepickerModule.forRoot(),
    NotificacionesComponent
  ],
  providers: [provideHttpClient(),ToastrService,InformeAnualProgramaService],
})
export class InformeAnualProgramaModule { }

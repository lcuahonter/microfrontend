import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AduanaComponent } from './components/aduana/aduana.component';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ExportarIlustracionesRoutingModule } from './exportar-ilustraciones-routing.module';
import { ExportarIlustracionesService } from './services/exportar-ilustraciones.service';
import { LugarDeDestinoComponent } from './components/lugar-de-destino/lugar-de-destino.component';
import { MotivoDeLaExportacionComponent } from './components/motivo-de-la-exportacion/motivo-de-la-exportacion.component';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { PeriodoEnElExtranjeroComponent } from './components/periodo-en-el-extranjero/periodo-en-el-extranjero.component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PantallasComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    ExportarIlustracionesRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    TituloComponent,
    AlertComponent,
    DatosDeLaSolicitudComponent,
    PeriodoEnElExtranjeroComponent,
    MotivoDeLaExportacionComponent,
    LugarDeDestinoComponent,
    AduanaComponent,
    PagoDeDerechosComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent
  ],
  providers: [
    provideHttpClient(),
    ExportarIlustracionesService
  ],
})

export class ExportarIlustracionesModule { }

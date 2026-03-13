import { AlertComponent, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ConsolidacionDeCargasComponent } from './components/consolidacion-de-cargas/consolidacion-de-cargas.component';
import { EmpresasTransportistasComponent } from './components/empresas-transportistas/empresas-transportistas.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PagoDeDerechosComponent } from './components/pago-de-derechos/pago-de-derechos.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroEmpresasTransporteComponent } from './pages/registro-empresas-transporte/registro-empresas-transporte.component';
import { RegistroEmpresasTransporteRoutingModule } from './registro-empresas-transporte-routing.module';
import { RegistroEmpresasTransporteService } from './services/registro-empresas-transporte.service';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TableComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { WizardComponent } from '@ng-mf/data-access-user';

@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    RegistroEmpresasTransporteComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegistroEmpresasTransporteRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    TituloComponent,
    FormsModule,
    TableComponent,
    AlertComponent,
    AnexarDocumentosComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    EmpresasTransportistasComponent,
    VehiculosComponent,
    PagoDeDerechosComponent,
    ConsolidacionDeCargasComponent,
    ToastrModule.forRoot()
  ],
  exports: [
    PasoUnoComponent, 
    PasoDosComponent, 
    PasoTresComponent,
  ],
  providers: [RegistroEmpresasTransporteService, ToastrService],
})
export class RegistroEmpresasTransporteModule {}

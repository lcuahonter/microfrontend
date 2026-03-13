import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BeneficiosComponent } from './pages/beneficios/beneficios.component';
import { BodegasComponent } from './pages/bodegas/bodegas.component';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CafeDeExportadoresComponent } from './pages/cafe-de-exportadores/cafe-de-exportadores.component';
import { CafeExportadoresComponent } from './pages/cafe-exportadores/cafe-exportadores.component';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent} from './components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
import { SharedModule } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

import { NacionalCafeExportadoresRoutingModule } from './nacional-cafe-exportadores-routing.module';
import {RegionesComponent} from './pages/regiones/regiones.component'
@NgModule({
  declarations: [
    PasoDosComponent,
    PasoTresComponent,
    PasoUnoComponent,
    CafeExportadoresComponent,
    BodegasComponent,
    CafeDeExportadoresComponent,
    BeneficiosComponent,
    RegionesComponent,
  ],
  imports: [
    CommonModule,
    WizardComponent,
    SharedModule,
    BtnContinuarComponent,
    ReactiveFormsModule,
    TituloComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    SolicitanteComponent,
    NacionalCafeExportadoresRoutingModule,
    DatosDeLaSolicitudComponent,
  
  ],
  exports:[RouterModule],
  providers: [ToastrService],
})
export class NacionalCafeExportadoresModule { }

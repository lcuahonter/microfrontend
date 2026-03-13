import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InputRadioComponent, SolicitanteComponent, TituloComponent } from '@ng-mf/data-access-user';
import { ComercializadoraImportadoraComponent } from './components/comercializadora-importadora/comercializadora-importadora.component';
import { CommonModule } from '@angular/common';
import { DatosComunesComponent } from './components/datos-comunes/datos-comunes.component';
import { EmpresasComercializadorasRoutingModule } from './empresas-comercializadoras-routing.module';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { TercerosRelacionadosComponent } from './components/terceros-relacionados/terceros-relacionados.component';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';


@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent
  ],
  imports: [
    CommonModule,
    EmpresasComercializadorasRoutingModule,
    ReactiveFormsModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    TercerosRelacionadosComponent,
    DatosComunesComponent,
    ComercializadoraImportadoraComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    InputRadioComponent,
  ],
  providers: [ToastrService],
})
export class EmpresasComercializadorasModule { }

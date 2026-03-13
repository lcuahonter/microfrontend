import { AlertComponent, BtnContinuarComponent, FirmaElectronicaComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CancelacionDeCertificateComponent } from './components/cancelacionde/cancelacion-de-certificado.component';
import { CancelacionDeCupoComponent } from './pages/cancelacion-de-cupo/cancelacion-de-cupo.component';
import { CancelacionDeRoutingModule } from './cancelacion-de-routing.module';
import { CommonModule } from '@angular/common';
import { DatosEmpresaComponent } from './components/datos-empresa/datos-empresa.component';
import { NgModule } from '@angular/core';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    CancelacionDeCupoComponent,
    PasoUnoComponent
  ],
  imports: [
    AlertComponent,
    BtnContinuarComponent,
    CancelacionDeCertificateComponent,
    CancelacionDeRoutingModule,
    CommonModule,
    DatosEmpresaComponent,
    FirmaElectronicaComponent,
    FormsModule,
    PasoFirmaComponent,
    ReactiveFormsModule,
    SolicitanteComponent,
    TablaDinamicaComponent,
    TituloComponent,
    WizardComponent
  ],
  providers: [
    ToastrService
  ]
})
export class CancelacionDeModule { }

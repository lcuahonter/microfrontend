import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, InputFechaComponent, InputRadioComponent, SharedModule, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AvisoDeMercanciaRoutingModule } from './aviso-de-mercancia-routing.module';
import { CommonModule } from '@angular/common';
import { DestructionODonacionComponent } from './pages/destruccion-o-donacion/destruction-o-donacion.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TipoDeAvisoComponent } from './components/tipo-de-aviso/tipo-de-aviso.component';





@NgModule({
  declarations: [
    DestructionODonacionComponent,
    PasoDosComponent,
    PasoTresComponent,
  ],
  imports: [
    CommonModule,
    AvisoDeMercanciaRoutingModule,
    SharedModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    RouterModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    AlertComponent,
    InputFechaComponent,
    FirmaElectronicaComponent,
    AnexarDocumentosComponent,
    PasoUnoComponent,
    TipoDeAvisoComponent,
  ]
})
export class AvisoDeMercanciaModule { }

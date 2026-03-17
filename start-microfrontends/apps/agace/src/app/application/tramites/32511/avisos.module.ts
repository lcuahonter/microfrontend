import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { AvisosRoutingModule } from './avisos-routing.module';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { TipoDeAvisoComponent } from './components/tipo-de-aviso/tipo-de-aviso.component';


@NgModule({
  declarations: [
    PantallasComponent,
    DatosComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    AvisosRoutingModule,
    BtnContinuarComponent,
    WizardComponent,
    AnexarDocumentosComponent,
    AlertComponent,
    TituloComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    TipoDeAvisoComponent
  ]
})
export class AvisosModule { }

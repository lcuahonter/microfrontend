import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizacionMercanciaDonadaRoutingModule } from './autorizacion-mercancia-donada-routing.module';
import { CommonModule } from '@angular/common';
import { ExencionImpuestosComponent } from './components/exencion-impuestos.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AutorizacionMercanciaDonadaRoutingModule,
    PasoUnoComponent,
    AlertComponent,
    WizardComponent,
    BtnContinuarComponent,
    FormsModule,
    ReactiveFormsModule,
    ExencionImpuestosComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    PasoDosComponent
  ],
})
export class AutorizacionMercanciaDonadaModule { }

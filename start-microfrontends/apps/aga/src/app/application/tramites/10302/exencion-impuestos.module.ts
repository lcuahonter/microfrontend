import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatosTramiteComponent } from './components/datosTramite.component';
import { ExencionImpuestosRoutingModule } from './exencion-impuestos-routing.module';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ExencionImpuestosRoutingModule,
    PasoUnoComponent,
    AlertComponent,
    WizardComponent,
    BtnContinuarComponent,
    FormsModule,
    ReactiveFormsModule,
    DatosTramiteComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    PasoDosComponent
  ],
})
export class ExencionImpuestosModule { }

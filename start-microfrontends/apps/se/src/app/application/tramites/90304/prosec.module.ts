import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { ComplementariaComponent } from './components/complementaria/complementaria.component';
import { DatosComponent } from './pages/datos/datos.component';
import { ModificacionComponent } from './components/modificacion/modificacion.component';
import { PantallasComponent } from './pages/pantallas/pantallas.component';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { ProsecRoutingModule } from './prosec-routing.module';


@NgModule({
  declarations: [
    PantallasComponent,
    DatosComponent,
    PasoDosComponent,
    PasoTresComponent
  ],
  imports: [
    CommonModule,
    ProsecRoutingModule,
    TituloComponent,
    AlertComponent,
    BtnContinuarComponent,
    WizardComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    SolicitanteComponent,
    ModificacionComponent,
    BitacoraComponent,
    ComplementariaComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ]
})
export class ProsecModule { }

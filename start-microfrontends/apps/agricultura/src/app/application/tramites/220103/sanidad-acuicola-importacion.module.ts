import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SanidadAcuicolaImportacionRoutingModule } from './sanidad-acuicola-importacion-routing.module';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';

import { AlertComponent,AnexarDocumentosComponent,BtnContinuarComponent,FirmaElectronicaComponent,SolicitanteComponent,TituloComponent,WizardComponent } from '@ng-mf/data-access-user';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';

import { SanidadAcuicolaImportacionComponent } from './pages/sanidad-acuicola-importacion-page/sanidad-acuicola-importacion.component';

import { DatosDeInstalacionComponent } from './components/datos-de-instalacion/datos-de-instalacion.component';
import { DatosDelTramiteComponent } from './components/datos-del-tramite/datos-del-tramite.component';

import {DatosDelTercerosComponent} from "./components/datos-del-terceros/datos-del-terceros.component";


@NgModule({
  declarations: [PasoDosComponent,PasoUnoComponent,PasoTresComponent,SanidadAcuicolaImportacionComponent],
  imports: [
    CommonModule,
    SanidadAcuicolaImportacionRoutingModule,
    AlertComponent,
    AnexarDocumentosComponent,
    TituloComponent,
    SolicitanteComponent,
    FirmaElectronicaComponent,
    BtnContinuarComponent,
    WizardComponent,
    DatosDelTramiteComponent,
    DatosDeInstalacionComponent,
    DatosDelTercerosComponent
]
})
export class SanidadAcuicolaImportacionModule { }

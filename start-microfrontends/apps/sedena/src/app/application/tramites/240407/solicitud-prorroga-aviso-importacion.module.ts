import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

import { DatosDelTramiteContenedoraComponent } from './components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { TercerosRelacionadosContenedoraComponent } from './components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';

import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

import { SolicitudeDeArtificiosPirotecnicosRoutingModule } from './solicitud-prorroga-aviso-importacion-routing.module';


@NgModule({
  declarations: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
  ],
  imports: [
    CommonModule,
    SolicitudeDeArtificiosPirotecnicosRoutingModule,
    SolicitanteComponent,
    DatosDelTramiteContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    WizardComponent,
    BtnContinuarComponent,
  ],
  exports: [
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    SolicitudPageComponent,
  ],
})
export class SolicitudProrrogaAvisoImportacionModule { 

}

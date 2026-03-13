import { AlertComponent, AnexarDocumentosComponent, BtnContinuarComponent, FirmaElectronicaComponent ,NotificacionesComponent,PasoCargaDocumentoComponent,PasoFirmaComponent,SolicitanteComponent,TituloComponent, WizardComponent} from "@libs/shared/data-access-user/src";
import { AvisoImportacionMaquinasRoutingModule } from './aviso-importacion-maquinas-routing.module';
import { CommonModule } from '@angular/common';
import { DatosComponent } from './pages/datos/datos.component';
import { DatosDeLaMercanciaComponent } from './components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDeLaSolicitudComponent } from './pages/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDelTramiteComponent } from "./components/datos-del-tramite/datos-del-tramite.component";
import { NgModule } from '@angular/core';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RepresentacionFederalComponent } from "./components/representacion-federal/representacion-federal.component";

@NgModule({
  declarations: [DatosComponent,PasoUnoComponent,DatosDeLaSolicitudComponent],
  imports: [
    CommonModule,
    AvisoImportacionMaquinasRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    DatosDeLaMercanciaComponent,
    DatosDelTramiteComponent,
    RepresentacionFederalComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    AlertComponent,
    TituloComponent,
    NotificacionesComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
]
})
export class AvisoImportacionMaquinasModule { }

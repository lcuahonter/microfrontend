import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertComponent, BtnContinuarComponent, CrosslistComponent, InputRadioComponent, NotificacionesComponent, PasoCargaDocumentoComponent, PasoFirmaComponent, SolicitanteComponent, TablaDinamicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { DatosDeLaMercanciaComponent } from '../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { ImportacionMaterialDeInvestigacionCientificaComponent } from './pages/importacion-material-de-investigacion-cientifica/importacion-material-de-investigacion-cientifica.component';
import { ImportacionMaterialDeInvestigacionCientificaRoutingModule } from './importacion-material-de-investigacion-cientifica-routing.module';
import { PaisProcendenciaComponent } from '../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PasoDosComponent } from '../120402/components/paso-dos/paso-dos.component';
import { PasoTresComponent } from '../120402/components/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { RepresentacionComponent } from '../../shared/components/representacion/representacion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';

/**
 * @descripcion
 * El módulo `ImportacionMaterialDeInvestigacionCientificaModule` agrupa los componentes, servicios y módulos necesarios
 * para gestionar el trámite de importación de material de investigación científica.
 *
 * Este módulo incluye componentes para la gestión de datos del trámite, datos de la mercancía, representación,
 * partidas de la mercancía, y otros elementos relacionados con el trámite.
 *
 * @decorador @NgModule
 */
@NgModule({
  declarations: [
    /**
     * @descripcion
     * Componentes declarados en este módulo.
     */
    ImportacionMaterialDeInvestigacionCientificaComponent,
    PasoUnoComponent,
    SolicitudComponent
  ],
  imports: [
    /**
     * @descripcion
     * Módulos importados necesarios para el funcionamiento de este módulo.
     */
    CommonModule,
    ImportacionMaterialDeInvestigacionCientificaRoutingModule,
    WizardComponent,
    AlertComponent,
    BtnContinuarComponent,
    TituloComponent,
    InputRadioComponent,
    SolicitanteComponent,
    ReactiveFormsModule,
    PasoTresComponent,
    PasoDosComponent,
    DatosDelTramiteComponent,
    DatosDeLaMercanciaComponent,
    PartidasDeLaMercanciaComponent,
    TablaDinamicaComponent,
    PaisProcendenciaComponent,
    RepresentacionComponent,
    CrosslistComponent,
    NotificacionesComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent
  ]
})
/**
 * @descripcion
 * Clase que define el módulo `ImportacionMaterialDeInvestigacionCientificaModule`.
 */
export class ImportacionMaterialDeInvestigacionCientificaModule { }
import { AnexarDocumentosComponent, FirmaElectronicaComponent, TituloComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AvisoMercanciaDonadaRoutingModule } from './aviso-mercancia-donada-routing.module';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { CommonModule } from '@angular/common';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoTresComponent } from './pages/paso-tres/paso-tres.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitanteComponent } from './components/solicitante/solicitante.component';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
import { TipodeAvisoComponent } from './components/aviso/tipode-aviso.component';
import { Tramite11101Store } from './estados/tramite11101.store';

/**
 * Módulo para gestionar el trámite de Donación en la Franja Fronteriza.
 * Este módulo incluye componentes, servicios y configuraciones necesarias para el trámite.
 */
@NgModule({
    /**
     * Declaraciones de los componentes utilizados en este módulo.
     * @type {Array<any>}
     */
    declarations: [
        SolicitantePageComponent,
        PasoUnoComponent,
        PasoDosComponent,
    ],

    /**
     * Módulos y componentes importados necesarios para este módulo.
     * @type {Array<any>}
     */
    imports: [
        FirmaElectronicaComponent,
        TipodeAvisoComponent,
        TituloComponent,
        BtnContinuarComponent,
        SolicitanteComponent,
        CommonModule,
      AvisoMercanciaDonadaRoutingModule,
        WizardComponent,
        AnexarDocumentosComponent,
        PasoTresComponent
    ],

    /**
     * Exportaciones de componentes o módulos que pueden ser utilizados por otros módulos.
     * @type {Array<any>}
     */
    exports: [],

    /**
     * Proveedores de servicios utilizados en este módulo.
     * @type {Array<any>}
     */
    providers: [Tramite11101Store],

    /**
     * Esquemas personalizados para permitir el uso de elementos personalizados en este módulo.
     * @type {Array<any>}
     */
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AvisoMercanciaDonadaModule { }
/* eslint-disable @nx/enforce-module-boundaries */

/**
 * Módulo CertiRegistroModule
 * 
 * Este módulo se encarga de gestionar las funcionalidades relacionadas con el trámite
 * de Certificación de Registro. Incluye componentes y páginas específicas para guiar
 * al usuario a través del proceso.
 * 
 * Componentes declarados:
 * - ProcesoCompletoComponent: Página que muestra el estado final del trámite.
 * - PasoUnoComponent: Página inicial del trámite donde se recopilan datos básicos.
 * 
 * Módulos importados:
 * - CommonModule: Proporciona directivas comunes de Angular.
 * - CertiRegistroRoutingModule: Configuración de rutas específicas para este módulo.
 * - WizardComponent: Componente reutilizable para guiar al usuario en pasos.
 * - BtnContinuarComponent: Botón reutilizable para avanzar en los pasos.
 * - SolicitanteComponent: Componente para capturar información del solicitante.
 * - DatosDelTramiteComponent: Componente para mostrar o capturar datos del trámite.
 * - Pantallas301Module: Módulo relacionado con pantallas del trámite 301.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BtnContinuarComponent } from '../../../../../../../libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { CertiRegistroRoutingModule } from './certi-registro-routing.module';
import { DatosDelTramiteComponent } from './components/datos-del-tramite/datos-del-tramite.component';
import { Pantallas301Module } from '../301/pantallas.module';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { ProcesoCompletoComponent } from './pages/proceso-completo/proceso-completo.component';
import { SolicitanteComponent } from '../../../../../../../libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { WizardComponent } from '../../../../../../../libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

@NgModule({
  declarations: [
    ProcesoCompletoComponent,
    PasoUnoComponent
  ],
  imports: [
    CommonModule,
    CertiRegistroRoutingModule,
    WizardComponent,
    BtnContinuarComponent,
    SolicitanteComponent,
    DatosDelTramiteComponent,
    Pantallas301Module
  ]
})
export class CertiRegistroModule { }

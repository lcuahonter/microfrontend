/**
 * Componente para la gestión y registro de choferes en el trámite 40102.
 *
 * Este componente maneja la interfaz de usuario para el registro de choferes tanto
 * nacionales como extranjeros en el sistema de trámites aduaneros. Proporciona
 * una interfaz con pestañas para alternar entre los diferentes tipos de choferes
 * y gestiona el estado de la pestaña activa.
 *
 * @file choferes.component.ts
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 */

import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CHOFERES_PAGE } from '../../enum/transportista-terrestre.enum';
import { ChofereAltaDeExtranjerosComponent } from './extranjero/alta-de-extranjeros/chofere.alta.de.extranjeros.component';
import { ChofereNacionalComponent } from './chofere.nacional/chofere.nacional.component';
import { CommonModule } from '@angular/common';
import {
  Component,
} from '@angular/core';
import { SharedModule } from '@ng-mf/data-access-user';
import { TEXTOS } from '../../enum/choferes.enum';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente standalone para la gestión integral de choferes.
 *
 * Este componente implementa una interfaz con pestañas que permite a los usuarios
 * registrar y gestionar información de choferes nacionales y extranjeros para
 * operaciones de transporte en trámites aduaneros. Utiliza componentes hijos
 * especializados para cada tipo de chofer y mantiene el estado de navegación
 * entre las diferentes secciones.
 *
 * @component
 * @example
 * ```html
 * <app-choferes></app-choferes>
 * ```
 *
 * @since 1.0.0
 */
@Component({
  selector: 'app-choferes',
  templateUrl: './choferes.component.html',
  styleUrls: ['./choferes.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    FormsModule,
    TituloComponent,
    ChofereNacionalComponent,
    ChofereAltaDeExtranjerosComponent,
  ],
})
/**
 * Clase del componente ChoferesComponent.
 *
 * Implementa la lógica para la gestión de choferes en el trámite 40102,
 * proporcionando funcionalidad para alternar entre diferentes tipos de
 * choferes y mantener el estado de la interfaz de usuario.
 *
 * @class ChoferesComponent
 * @since 1.0.0
 */
export class ChoferesComponent {
  /**
   * Constantes de páginas de choferes importadas del enum.
   *
   * Contiene las configuraciones y constantes relacionadas con las páginas
   * de gestión de choferes del transportista terrestre.
   *
   * @property {Object} CHOFERES_PAGE
   * @readonly
   */
  CHOFERES_PAGE = CHOFERES_PAGE;

  /**
   * Textos y etiquetas utilizados en el componente.
   *
   * Contiene todas las cadenas de texto, etiquetas y mensajes utilizados
   * en la interfaz de usuario del componente de choferes.
   *
   * @property {Object} TEXTOS
   * @readonly
   */
  TEXTOS = TEXTOS;

  /**
   * Identificador de la pestaña actualmente activa.
   *
   * Controla qué sección del formulario de choferes está visible para el usuario.
   * Los valores típicos son 'nacional' para choferes nacionales y 'extranjero'
   * para choferes extranjeros.
   *
   * @property {string} activeTab
   * @default 'nacional'
   */
  activeTab: string = 'nacional';

  /**
   * Establece la pestaña activa en el componente.
   *
   * Este método permite cambiar entre las diferentes secciones del formulario
   * de choferes, actualizando el estado de la pestaña activa para mostrar
   * el contenido correspondiente al tipo de chofer seleccionado.
   *
   * @method setActiveTab
   * @param {string} tab - Identificador de la pestaña que se establecerá como activa.
   *                       Valores esperados: 'nacional' | 'extranjero'
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Cambiar a la pestaña de choferes nacionales
   * this.setActiveTab('nacional');
   *
   * // Cambiar a la pestaña de choferes extranjeros
   * this.setActiveTab('extranjero');
   * ```
   *
   * @since 1.0.0
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}

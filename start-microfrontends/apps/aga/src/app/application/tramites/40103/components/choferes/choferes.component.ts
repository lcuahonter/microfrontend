/**
 * Componente principal para la gestión de choferes en el trámite 40103.
 *
 * Este archivo contiene el componente Angular que maneja la interfaz de usuario para la gestión
 * de choferes nacionales y extranjeros en el sistema de transportistas terrestres. Proporciona
 * funcionalidades para alta, modificación, retirada y notificaciones de choferes.
 *
 * El componente incluye:
 * - Gestión de pestañas para choferes nacionales y extranjeros
 * - Componentes especializados para diferentes operaciones de choferes
 * - Integración con enumeraciones y constantes del sistema
 * - Manejo del estado activo de las pestañas de navegación
 *
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module ChoferesComponent
 */

import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CHOFERES_PAGE } from '../../enum/transportista-terrestre.enum';
import { ChofereAltaDeExtranjerosComponent } from './extranjero/alta-de-extranjeros/chofere.alta.de.extranjeros.component';
import { ChofereModificationDeChoferesComponent } from './extranjero/modification-de-choferes/chofere.modification.de.choferes.component';
import { ChofereNacionalComponent } from './chofere.nacional/chofere.nacional.component';
import { ChofereNacionalModificacionComponent } from './chofere.nacional/chofere.nacional.modificacion/chofere.nacional.modificacion.component';
import { ChofereNacionalNotificationComponent } from './chofere.nacional.nofitication/chofere.nacional.notification.component';
import { ChofereNacionalRetiradaComponent } from './chofere.nacional/chofere.nacional.retirada/chofere.nacional.retirada.component';
import { ChofereRetiradaDeChoferesComponent } from './extranjero/retirada-de-choferes/chofere.retirada.de.choferes.component';
import { CommonModule } from '@angular/common';
import {
  Component,
} from '@angular/core';
import { SharedModule } from '@ng-mf/data-access-user';
import { TEXTOS } from '../../enum/choferes.enum';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente Angular para la gestión integral de choferes en el trámite 40103.
 *
 * Este componente proporciona una interfaz de usuario completa para la administración
 * de choferes nacionales y extranjeros en el sistema de transportistas terrestres.
 * Incluye funcionalidades para registro, modificación, retirada y notificaciones
 * de conductores profesionales.
 *
 * Características principales:
 * - Sistema de pestañas para navegación entre tipos de choferes
 * - Integración con componentes especializados para cada operación
 * - Manejo de estado para la pestaña activa
 * - Acceso a constantes y enumeraciones del sistema
 *
 * @component
 * @selector app-choferes
 * @standalone true
 * 
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
    ChofereNacionalNotificationComponent,
    ChofereNacionalModificacionComponent,
    ChofereNacionalRetiradaComponent,
    ChofereRetiradaDeChoferesComponent,
    ChofereModificationDeChoferesComponent
  ],
})
export class ChoferesComponent {
  /**
   * Constante con las páginas de choferes.
   * @type {typeof CHOFERES_PAGE}
   */
  CHOFERES_PAGE = CHOFERES_PAGE;

  /**
   * Constante con los textos utilizados en el componente.
   * @type {typeof TEXTOS}
   */
  TEXTOS = TEXTOS;

  /**
   * Pestaña activa en la interfaz de choferes ('nacional' o 'extranjero').
   * @type {string}
   */
  activeTab: string = 'nacional';

  /**
   * Lista de choferes nacionales registrados.
   * @type {any[]}
   */
  choferesNacionales: Array<{ nombre: string; nacionalidad: string }> = [];

  /**
   * Lista de choferes extranjeros registrados.
   * @type {any[]}
   */
  choferesExtranjeros: Array<{ nombre: string; nacionalidad: string }> = [];

  /**
   * Cambia la pestaña activa entre choferes nacionales y extranjeros.
   * @param {string} tab - Nombre de la pestaña a activar ('nacional' o 'extranjero').
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Agrega un chofer nacional a la lista de choferes nacionales.
   * @param {any} chofer - Objeto con los datos del chofer nacional.
   */
  onAgregarChoferNacional(chofer: { nombre: string; nacionalidad: string }): void {
    this.choferesNacionales = [...this.choferesNacionales, chofer];
  }

  /**
   * Agrega un chofer extranjero a la lista de choferes extranjeros.
   * @param {any} chofer - Objeto con los datos del chofer extranjero.
   */
  onAgregarChoferExtranjero(chofer: { nombre: string; nacionalidad: string }): void {
    this.choferesExtranjeros = [...this.choferesExtranjeros, chofer];
  }

  /**
   * Cancela la operación de alta o edición de chofer nacional.
   */
  static onCancelarChoferNacional(): void {
  // Lógica de cancelación no implementada
  }

  /**
   * Cancela la operación de alta o edición de chofer extranjero.
   */
  static onCancelarChoferExtranjero(): void {
  // Lógica de cancelación no implementada
  }

  /**
   * Valida los formularios de choferes.
   * En este componente se valida que exista al menos un chofer registrado.
   * @returns {boolean} true si hay al menos un chofer registrado, false en caso contrario.
   */
  public validarFormularios(): boolean {
    // Validar que exista al menos un chofer nacional o extranjero
    const TIENE_CHOFERES_NACIONALES = this.choferesNacionales && this.choferesNacionales.length > 0;
    const TIENE_CHOFERES_EXTRANJEROS = this.choferesExtranjeros && this.choferesExtranjeros.length > 0;
    
    return TIENE_CHOFERES_NACIONALES || TIENE_CHOFERES_EXTRANJEROS;
  }
}

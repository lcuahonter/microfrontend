/**
 * @fileoverview Componente de datos de autorización para el trámite 300105
 * 
 * Este archivo contiene el componente principal que gestiona el proceso de múltiples pasos
 * para la captura de datos de autorización de equipos de rayos X en el trámite 300105.
 * 
 * Funcionalidades principales:
 * - Gestión de wizard de múltiples pasos
 * - Navegación entre pantallas del trámite
 * - Control de flujo de datos de autorización
 * 
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { Component, ViewChild } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS_REGISTRO } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * @interface AccionBoton
 * @description Interfaz que define la estructura de una acción de botón en el wizard.
 * Representa las acciones que se pueden realizar en los botones de navegación
 * del proceso de autorización de equipos de rayos X.
 * 
 * @example
 * ```typescript
 * const accion: AccionBoton = {
 *   accion: 'cont', // Continuar al siguiente paso
 *   valor: 2        // Índice del paso destino
 * };
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
interface AccionBoton {
  /**
   * @property {string} accion
   * @description La acción que se va a realizar en el wizard.
   * Puede ser 'cont' para continuar al siguiente paso o 'ant' para retroceder.
   * 
   * @example
   * ```typescript
   * // Acciones válidas
   * accion: 'cont' // Avanzar al siguiente paso
   * accion: 'ant'  // Retroceder al paso anterior
   * ```
   * 
   * @since 1.0.0
   */
  accion: string;
  
  /**
   * @property {number} valor
   * @description El valor numérico asociado a la acción que indica el índice del paso.
   * Representa el número del paso en el wizard (1-4 para el trámite 300105).
   * 
   * @example
   * ```typescript
   * // Valores válidos para el trámite 300105
   * valor: 1 // Primer paso: datos del solicitante
   * valor: 2 // Segundo paso: datos de solicitud
   * valor: 3 // Tercer paso: destinatarios
   * valor: 4 // Cuarto paso: pago de derechos
   * ```
   * 
   * @since 1.0.0
   */
  valor: number;
}

/**
 * @class AutorizacionDatosComponent
 * @description Componente principal que gestiona el proceso de múltiples pasos para la autorización
 * de equipos de rayos X en el trámite 300105. Este componente actúa como contenedor
 * del wizard que guía al usuario a través de los diferentes pasos necesarios
 * para completar la solicitud de autorización.
 * 
 * Funcionalidades principales:
 * - Gestión del flujo de navegación entre pasos
 * - Control de estados del wizard
 * - Integración con componentes hijo de cada paso
 * - Validación de progreso del usuario
 * 
 * @example
 * ```typescript
 * // Uso del componente en template
 * // <app-autorizacion-datos></app-autorizacion-datos>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
@Component({
  selector: 'app-autorizacion-datos',
  templateUrl: './autorizacion-datos.component.html',
})
export class AutorizacionDatosComponent {
  /**
   * @property {ListaPasosWizard[]} pasos
   * @description Lista de pasos en el asistente del trámite 300105.
   * Define la estructura y configuración de cada paso del proceso de autorización,
   * incluyendo títulos, descripción y estado de cada etapa.
   * 
   * @example
   * ```typescript
   * // Los pasos típicos incluyen:
   * // 1. Datos del solicitante
   * // 2. Datos de solicitud y mercancías
   * // 3. Destinatarios
   * // 4. Pago de derechos
   * ```
   * 
   * @since 1.0.0
   * @readonly
   */
  pasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente WizardComponent para controlar la navegación.
   * Esta referencia permite invocar métodos del wizard como siguiente(), atras()
   * y otras funcionalidades de navegación programática.
   * 
   * @example
   * ```typescript
   * // Uso de la referencia para navegación
   * this.wizardComponent.siguiente(); // Avanzar paso
   * this.wizardComponent.atras();     // Retroceder paso
   * ```
   * 
   * @since 1.0.0
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {ListaPasosWizard[]} pantallasPasos
   * @description Variable utilizada para almacenar la lista de pasos del wizard.
   * Copia de la configuración de pasos que puede ser modificada dinámicamente
   * según las necesidades del flujo de autorización.
   * 
   * @example
   * ```typescript
   * // Modificación dinámica de pasos
   * this.pantallasPasos = this.pantallasPasos.filter(paso => paso.activo);
   * ```
   * 
   * @since 1.0.0
   */
  pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * @property {number} indice
   * @description Variable utilizada para almacenar el índice del paso actual.
   * Controla qué paso del wizard está actualmente visible y activo.
   * El valor inicial es 1 (primer paso del proceso).
   * 
   * @example
   * ```typescript
   * // Control del paso actual
   * this.indice = 1; // Mostrar primer paso
   * this.indice = 2; // Mostrar segundo paso
   * ```
   * 
   * @since 1.0.0
   */
  indice: number = 1;

  /**
   * @property {DatosPasos} datosPasos
   * @description Datos de configuración para los pasos en el asistente.
   * Contiene la información necesaria para renderizar correctamente
   * el wizard, incluyendo número total de pasos, índice actual y textos de botones.
   * 
   * @example
   * ```typescript
   * // Estructura de datos típica
   * datosPasos = {
   *   nroPasos: 4,
   *   indice: 1,
   *   txtBtnAnt: 'Anterior',
   *   txtBtnSig: 'Continuar'
   * };
   * ```
   * 
   * @since 1.0.0
   */
  /**
   * @property {DatosPasos} datosPasos
   * @description Datos de configuración para los pasos en el asistente.
   * Contiene la información necesaria para renderizar correctamente
   * el wizard, incluyendo número total de pasos, índice actual y textos de botones.
   * 
   * @example
   * ```typescript
   * // Estructura de datos típica
   * datosPasos = {
   *   nroPasos: 4,
   *   indice: 1,
   *   txtBtnAnt: 'Anterior',
   *   txtBtnSig: 'Continuar'
   * };
   * ```
   * 
   * @since 1.0.0
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @method getValorIndice
   * @description Actualiza el valor del índice según el evento del botón de acción.
   * Este método gestiona la navegación entre pasos del wizard basándose en la acción
   * del usuario (continuar o retroceder) y el valor del índice destino.
   * 
   * Funcionalidades:
   * - Validación del rango de índices válidos (1-4)
   * - Actualización del índice actual
   * - Invocación de métodos de navegación del wizard
   * 
   * @param {AccionBoton} e - El evento del botón de acción que contiene la acción y el valor
   * 
   * @example
   * ```typescript
   * // Navegar al siguiente paso
   * this.getValorIndice({ accion: 'cont', valor: 2 });
   * 
   * // Navegar al paso anterior
   * this.getValorIndice({ accion: 'ant', valor: 1 });
   * ```
   * 
   * @example
   * ```html
   * <!-- Uso en template con eventos -->
   * <button (click)="getValorIndice({accion: 'cont', valor: 2})">
   *   Continuar
   * </button>
   * ```
   * 
   * @since 1.0.0
   * @returns {void} No retorna valor, modifica el estado interno del componente
   */
  public getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
}

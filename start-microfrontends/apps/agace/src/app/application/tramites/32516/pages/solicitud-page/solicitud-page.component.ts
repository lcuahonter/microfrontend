/**
 * Componente de página de solicitud para el trámite 32516 - Registro nacional de exportadores.
 *
 * Este archivo contiene el componente principal que maneja el flujo del wizard para el proceso de solicitud,
 * incluyendo la navegación entre pasos, gestión del estado del wizard y configuración de los datos de cada paso.
 * 
 * El componente implementa un sistema de wizard con múltiples pasos que permite al usuario navegar
 * entre diferentes etapas del proceso de solicitud, desde la captura inicial hasta la firma final.
 *
 * @fileoverview Componente de página de solicitud con wizard multi-paso para exportación de armas y explosivos.
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 */

import { Component, ViewChild } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '../../modelos/acta-de-hechos.model';
import { PASOS } from '../../constantes/exportacion-armas-explosivo.enum';
import { TITULOMENSAJE } from '../../constantes/exportacion-armas-explosivo.enum';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * Interfaz para manejar las acciones de los botones del wizard.
 * 
 * Define la estructura de datos necesaria para gestionar las acciones de navegación
 * en el wizard, permitiendo tanto avanzar como retroceder entre pasos.
 * 
 * @interface AccionBoton
 * @since 1.0.0
 */
interface AccionBoton {
  /**
   * Acción a realizar en el wizard.
   * 
   * Valores permitidos:
   * - 'cont': Para continuar al siguiente paso
   * - 'atras': Para retroceder al paso anterior
   * 
   * @type {string}
   * @example 'cont' | 'atras'
   */
  accion: string;

  /**
   * Índice del paso al que se desea navegar.
   * 
   * Representa la posición del paso en el flujo del wizard (base 1).
   * Debe estar dentro del rango válido de pasos disponibles.
   * 
   * @type {number}
   * @minimum 1
   * @maximum 4
   * @example 1, 2, 3, 4
   */
  valor: number;
}

/**
 * Componente para la página de solicitud del trámite 32516.
 * 
 * Este componente Angular maneja el flujo completo del wizard para el proceso de solicitud
 * de registro nacional de exportadores. Implementa un sistema de navegación por pasos
 * que permite al usuario avanzar y retroceder a través de diferentes etapas del proceso.
 * 
 * Funcionalidades principales:
 * - Gestión del estado del wizard (paso actual, validaciones, etc.)
 * - Navegación bidireccional entre pasos
 * - Configuración dinámica de botones y mensajes
 * - Integración con el componente WizardComponent compartido
 * 
 * @class SolicitudPageComponent
 * @implements {OnInit}
 * @since 1.0.0
 * @example
 * ```html
 * <app-solicitud-page></app-solicitud-page>
 * ```
 */
@Component({
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss'
})
export class SolicitudPageComponent {

  /**
   * Configuración de los pasos del wizard.
   * 
   * Array que contiene la definición de todos los pasos disponibles en el wizard,
   * importado desde las constantes del trámite. Cada paso incluye información
   * sobre su índice, título, estado activo y estado de completado.
   * 
   * @type {Array<ListaPasosWizard>}
   * @readonly
   * @see {@link PASOS} - Constantes de configuración de pasos
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * Título del mensaje principal mostrado en la página.
   * 
   * Texto descriptivo que se muestra como encabezado principal de la solicitud.
   * Puede ser null durante la inicialización del componente.
   * 
   * @type {string | null}
   * @default 'Registro nacional de exportadores'
   */
  tituloMensaje: string | null = 'Registro nacional de exportadores';

  /**
   * Referencia al componente hijo WizardComponent.
   * 
   * Permite acceder directamente a los métodos y propiedades del wizard
   * para controlar la navegación programáticamente. Se inicializa automáticamente
   * por Angular después de la vista.
   * 
   * @type {WizardComponent}
   * @readonly
   * @see {@link WizardComponent} - Componente wizard compartido
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Índice del paso actual en el wizard.
   * 
   * Representa la posición actual del usuario en el flujo del wizard.
   * Se utiliza para determinar qué paso mostrar y qué acciones están disponibles.
   * 
   * @type {number}
   * @default 1
   * @minimum 1
   * @maximum 4
   */
  indice: number = 1;

  /**
   * Configuración de datos para el wizard.
   * 
   * Objeto que contiene toda la configuración necesaria para el funcionamiento
   * del wizard, incluyendo el número total de pasos, el índice actual y los
   * textos de los botones de navegación.
   * 
   * @type {DatosPasos}
   * @readonly
   * @see {@link DatosPasos} - Interfaz de configuración del wizard
   */
  datosPasos: DatosPasos = {
    /**
     * @property {number} nroPasos
     * Número total de pasos en el wizard.
     */
    nroPasos: this.pasos.length,
    
    /**
     * @property {number} indice
     * Índice del paso actual.
     */
    indice: this.indice,
    
    /**
     * @property {string} txtBtnAnt
     * Texto del botón para ir al paso anterior.
     */
    txtBtnAnt: 'Anterior',
    
    /**
     * @property {string} txtBtnSig
     * Texto del botón para ir al siguiente paso.
     */
    txtBtnSig: 'Continuar',
  };

  /**
   * Maneja las acciones de navegación del wizard.
   * 
   * Procesa las acciones de los botones del wizard (continuar/anterior) y actualiza
   * el estado del componente según la acción solicitada. Valida que el índice del paso
   * esté dentro del rango válido antes de ejecutar la navegación.
   * 
   * Flujo del método:
   * 1. Valida que el valor del paso esté en el rango válido (1-4)
   * 2. Actualiza el índice actual del componente
   * 3. Ejecuta la acción correspondiente en el wizard (siguiente/anterior)
   * 
   * @method getValorIndice
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del paso
   * @param {string} e.accion - Tipo de acción ('cont' para continuar, 'atras' para retroceder)
   * @param {number} e.valor - Índice del paso al que navegar (1-4)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Avanzar al siguiente paso
   * this.getValorIndice({ accion: 'cont', valor: 2 });
   * 
   * // Retroceder al paso anterior
   * this.getValorIndice({ accion: 'atras', valor: 1 });
   * ```
   * 
   * @since 1.0.0
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Obtiene el título correspondiente a un paso específico del wizard.
   * 
   * Método estático que mapea el índice de un paso a su título descriptivo correspondiente.
   * Utiliza una estructura switch para determinar qué título mostrar según el paso actual.
   * Si el índice no coincide con ningún caso específico, retorna el título por defecto.
   * 
   * Mapeo de pasos a títulos:
   * - Paso 1: Título del mensaje principal (desde constantes)
   * - Paso 2: "Anexar requisitos"
   * - Paso 3: "Firmar"
   * - Por defecto: Título del mensaje principal
   * 
   * @static
   * @method obtenerNombreDelTítulo
   * @param {number} valor - Índice del paso (1-3)
   * @returns {string} Título descriptivo correspondiente al paso
   * 
   * @example
   * ```typescript
   * // Obtener título del primer paso
   * const titulo1 = SolicitudPageComponent.obtenerNombreDelTítulo(1);
   * // Retorna: valor de TITULOMENSAJE
   * 
   * // Obtener título del segundo paso
   * const titulo2 = SolicitudPageComponent.obtenerNombreDelTítulo(2);
   * // Retorna: "Anexar requisitos"
   * 
   * // Obtener título del tercer paso
   * const titulo3 = SolicitudPageComponent.obtenerNombreDelTítulo(3);
   * // Retorna: "Firmar"
   * ```
   * 
   * @since 1.0.0
   * @see {@link TITULOMENSAJE} - Constante que contiene el título principal
   */
  public static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULOMENSAJE;
      case 2:
        return 'Anexar requisitos';
      case 3:
        return 'Firmar';
      default:
        return TITULOMENSAJE;
    }
  }
}

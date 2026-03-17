/**
 * @fileoverview Componente principal de la página del solicitante para el trámite 420102.
 * Gestiona la navegación mediante un asistente (wizard) y la interacción del usuario.
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 */

/**
 * Importaciones de tipos y componentes del módulo de acceso a datos de usuario
 */
import { AccionBoton, DatosPasos, ListaPasosWizard, Notificacion, VistaEmergente, WizardComponent } from '@ng-mf/data-access-user';

/**
 * Importación del decorador Component de Angular Core
 */
import { Component } from '@angular/core';

/**
 * Importación de la constante PASOS que define los pasos del wizard
 */
import { PASOS } from '../../constantes/concluir-relacion.enum';

/**
 * Importación de interfaces de ciclo de vida de Angular Core
 */
import { ViewChild } from '@angular/core';

/**
 * @class SolicitantePageComponent
 * @description Componente Angular que gestiona la página principal del solicitante en el trámite 420102.
 * Este componente incluye un asistente (wizard) para navegar entre los pasos del trámite,
 * manejar la interacción con el usuario, mostrar notificaciones y gestionar vistas emergentes.
 * Proporciona funcionalidad para la navegación paso a paso y validación de datos.
 * 
 * @example
 * ```typescript
 * // Uso del componente en una plantilla
 * <app-solicitante-page></app-solicitante-page>
 * ```
 * 
 * @since 1.0.0
 * @author Sistema VUCEM 3.0
 */
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})

/**
 * @class SolicitantePageComponent
 * @description Componente Angular que representa la página de solicitantes.
 * Este componente gestiona la interfaz y lógica relacionada con la visualización
 * y manejo de datos de solicitantes en la aplicación.
 * @implements {OnInit}
 */
export class SolicitantePageComponent {
  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente del asistente (wizard) para manejar la navegación entre pasos.
   * Utiliza ViewChild para obtener acceso directo al componente hijo WizardComponent.
   * @readonly
   * @since 1.0.0
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {number} indice
   * @description Índice actual del paso seleccionado en el asistente. 
   * Representa la posición actual del usuario en el flujo del wizard.
   * El valor por defecto es 1, indicando el primer paso.
   * @default 1
   * @public
   * @since 1.0.0
   */
  indice: number = 1;

  /**
   * @property {VistaEmergente} vistaEmergente
   * @description Configuración para la vista emergente utilizada en la página.
   * Controla si la vista emergente está abierta y en qué índice se encuentra.
   * @public
   * @since 1.0.0
   */
  vistaEmergente: VistaEmergente = {
    /** @description Indica si la vista emergente está abierta */
    abierto: true,
    /** @description Índice de la vista emergente actual */
    indice: 1,
  };

  /**
   * @property {ListaPasosWizard[]} pasos
   * @description Lista de pasos del asistente (wizard) configurados para el trámite.
   * Esta lista se importa desde las constantes y define la estructura y orden de los pasos.
   * @readonly
   * @public
   * @since 1.0.0
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {boolean} continueTrigger
   * @description Indicador para habilitar o deshabilitar el botón de continuar en el asistente.
   * Cuando es true, permite al usuario avanzar al siguiente paso.
   * @default false
   * @public
   * @since 1.0.0
   */
  continueTrigger: boolean = false;

  /**
   * @property {DatosPasos} datosPasos
   * @description Configuración de los datos de los pasos del asistente, incluyendo textos de los botones.
   * Define el número total de pasos, el índice actual y los textos de los botones de navegación.
   * @public
   * @since 1.0.0
   */
  datosPasos: DatosPasos = {
    /** @description Número total de pasos en el wizard */
    nroPasos: this.pasos.length,
    /** @description Índice del paso actual */
    indice: this.indice,
    /** @description Texto del botón para ir al paso anterior */
    txtBtnAnt: 'Anterior',
    /** @description Texto del botón para ir al siguiente paso */
    txtBtnSig: 'Continuar',
  };

  /**
   * @property {Notificacion} nuevaAlertaNotificacion
   * @description Configuración para la notificación de alerta mostrada al usuario.
   * Define el tipo, categoría, modo y contenido de la notificación de confirmación
   * para terminar la relación con el proveedor.
   * @public
   * @since 1.0.0
   */
  public nuevaAlertaNotificacion: Notificacion = {
    /** @description Tipo de notificación - alerta */
    tipoNotificacion: 'alert',
    /** @description Categoría de peligro para indicar acción importante */
    categoria: 'danger',
    /** @description Modo de acción que requiere respuesta del usuario */
    modo: 'action',
    /** @description Título de la notificación */
    titulo: 'Confirmar',
    /** @description Mensaje principal de la notificación */
    mensaje: '¿Deseas terminar relación con el proveedor?',
    /** @description Indica si se puede cerrar la notificación sin acción */
    cerrar: false,
    /** @description Tiempo de espera en milisegundos antes de auto-cerrar */
    tiempoDeEspera: 2000,
    /** @description Texto del botón de aceptar */
    txtBtnAceptar: 'Aceptar',
    /** @description Texto del botón de cancelar */
    txtBtnCancelar: 'Cancelar',
  };

  /**
   * @constructor
   * @description Constructor del componente SolicitantePageComponent.
   * Inicializa el componente y sus propiedades por defecto.
   * No requiere inyección de dependencias adicionales en esta implementación.
   * @since 1.0.0
   */
  constructor() {
    // Constructor vacío - la inicialización se realiza en las propiedades
  }

  /**
   * @method getValorIndice
   * @description Método para actualizar el índice del paso actual en el asistente (wizard).
   * También maneja la navegación hacia adelante o hacia atrás según la acción seleccionada.
   * Valida que el índice esté dentro del rango permitido (1-4) antes de realizar la navegación.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del índice y la acción a realizar.
   * @param {number} e.valor - Valor del índice del paso (debe estar entre 1 y 4).
   * @param {string} e.accion - Acción a realizar: 'cont' para continuar, cualquier otro valor para retroceder.
   * 
   * @returns {void} Este método no retorna ningún valor.
   * 
   * @example
   * ```typescript
   * // Navegación hacia adelante
   * this.getValorIndice({ valor: 2, accion: 'cont' });
   * 
   * // Navegación hacia atrás
   * this.getValorIndice({ valor: 1, accion: 'atras' });
   * ```
   * 
   * @throws {Error} No lanza errores explícitamente, pero ignora valores fuera del rango.
   * @public
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
}

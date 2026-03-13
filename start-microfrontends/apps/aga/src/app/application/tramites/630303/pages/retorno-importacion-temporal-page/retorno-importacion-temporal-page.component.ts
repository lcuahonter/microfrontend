/**
 * Componente que representa la página de retorno de importación temporal.
 * Permite gestionar los pasos del asistente y la navegación entre ellos.
 */
import { Component, ViewChild } from '@angular/core';

import { AVISO, DatosPasos, ListaPasosWizard, SeccionLibStore } from '@libs/shared/data-access-user/src';

import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import { ERROR_FORMA_ALERT, PASOS_REGISTRO, TODOS_PASOS} from '../../enum/retorno-importacion-temporal.enum';
import { WizardComponent } from '@libs/shared/data-access-user/src';

import { Tramite630303Store } from '../../estados/tramite630303.store';

/**
 * Interfaz que representa la acción de un botón.
 */
interface AccionBoton {
  /**
   * La acción que se va a realizar.
   */
  accion: string;
  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

/**
 * Componente que representa los pasos de datos en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-retorno-importacion-temporal',
  templateUrl:'./retorno-importacion-temporal-page.component.html',
  standalone:false
})
export class RetornoImportacionTemporalComponent {


  /**
   * Mensaje de información para la alerta.
   */
  public infoAlert = 'alert-info';

  /**
   * Textos de aviso utilizados en el componente.
   */
  TEXTOS = AVISO.Aviso;
  /**
   * Lista de pasos en el asistente.
   */
  pasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * Referencia al componente WizardComponent.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Variable utilizada para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;

  /**
   * Variable utilizada para almacenar el tipo de alerta.
   */
  alerta = TODOS_PASOS.Importante;

  /**
   * Índice actual del paso en el wizard.
   * 
   * Representa el paso actualmente seleccionado o en progreso dentro del wizard.
   * El índice es base 1 (comienza en 1 en lugar de 0) para coincidir con la
   * numeración visual mostrada al usuario.
   *
   * @property {number} indice
   * 
   * @example
   * ```typescript
   * this.indice = 1; // Primer paso del wizard
   * this.indice = 2; // Segundo paso del wizard
   * ```
   * 
   * @default 1
   * @since 1.0.0
   */
  indice: number = 1;

  /**
   * Datos para los pasos en el asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Método para actualizar el índice del paso actual en el asistente.
   * También navega al siguiente o al paso anterior según la acción especificada.
   *
   * Objeto de tipo `AccionBoton` que contiene:
   *  - `valor`: El nuevo índice del paso.
   *  - `accion`: La acción a realizar ('cont' para continuar o 'ant' para retroceder).
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.pasoUnoComponent?.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        this.pasoUnoComponent.indice = 2;

        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          if (this.pasoUnoComponent?.solicitudComponent) {
            this.pasoUnoComponent.solicitudComponent.validarFormularios();
          }
        }, 150);
        return;
        
      }
      this.obtenerDatosDelStore(e);
    } else if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      this.pasoNavegarPor(e);
    }
  }    
  /**
     * Indica si el formulario actual es válido. Se utiliza para mostrar alertas cuando faltan campos por capturar.
     * @type {boolean}
     */
    esFormaValido: boolean = false;
  
    /**
     * Mensaje de alerta para campos obligatorios no capturados.
     * @type {string}
     */
    readonly formErrorAlert: string = ERROR_FORMA_ALERT;
  
    /**
     * Constructor del componente RetornoImportacionTemporalComponent.
     * Inicializa las dependencias necesarias para el manejo del estado y la sección.
     * 
     * @param {SeccionLibStore} seccionStore - Store para el manejo del estado de la sección.
     * @param {Tramite630303Store} tramite630303Store - Store específico para el trámite 630303.
     */
    constructor(private seccionStore: SeccionLibStore, 
      public tramite630303Store: Tramite630303Store) {
    } 

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.pasoNavegarPor(e);
  }

  /**
   * Navega por los pasos del asistente.
   */
  pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = this.indice;

    if (e.accion === 'cont') {
      this.wizardComponent.siguiente();
    } else if (e.accion === 'ant') {
      this.wizardComponent.atras();
    }
  }
  
    /**
     * Método que se ejecuta cuando cambia de tab en paso-uno.
     * Oculta el mensaje de error de validación.
     */
    onTabChanged(): void {
      this.esFormaValido = false;
    }

    /**
     * Método que se ejecuta cuando PasoUnoComponent emite el evento continuarPaso.
     * Navega al siguiente paso usando la lógica existente del botón continuar.
     */
    continuarPaso(): void {
      const ACCION: AccionBoton = {
        accion: 'cont',
        valor: this.indice + 1
      };
      this.getValorIndice(ACCION);
    }

    /**
     * Método que maneja el evento del btn-continuar con tipo explícito.
     * @param event El evento AccionBoton emitido por el btn-continuar
     */
    onContinuarEvento(event: AccionBoton): void {
      this.getValorIndice(event);
    }
  }
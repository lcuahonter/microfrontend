
/**
 * @fileoverview
 * Este archivo contiene las importaciones necesarias para el componente `MedicamentosDonacionComponent`.
 * 
 * Las importaciones incluyen:
 * - Decoradores y utilidades de Angular.
 * - Constantes y enumeraciones específicas del módulo.
 * - Modelos de datos utilizados en el componente.
 * - Componentes hijos como `PasoUnoPagesComponent`.
 */

import { Component, ViewChild } from '@angular/core';

import { AVISO, AccionBoton, DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
import { MODIFICACION_PERMISO_DATA, MODIFICACION_PERMISO_ENUM } from '../../constantes/medicamentos-donacion.enum';

import { CompleteForm, PagoDeDerechos, SolicitanteData, TercerosRelacionados, Tramite } from '../../models/modificacion-permiso.model';
import { PasoUnoPagesComponent } from '../paso-uno-pages/paso-uno-pages.component';

/**
 * Clase que representa el componente de modificación de permisos de importación de tratamientos.
 */
@Component({
  selector: 'app-medicamentos-donacion',
  templateUrl: './medicamentos-donacion.component.html',
})

/**
 * Componente que representa la primera sección de un formulario de modificación de permisos de importación.
 * Este componente incluye varios subcomponentes para recopilar información del solicitante, datos de la solicitud,
 * terceros relacionados, pagos de derechos y trámites asociados.
 *
 * @export
 * @class MedicamentosDonacionComponent
 */

export class MedicamentosDonacionComponent {

  /**
   * Referencia al componente `PasoUnoPagesComponent` dentro de la plantilla.
   * 
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener una instancia del componente
   * `PasoUnoPagesComponent` que se encuentra en la plantilla del componente actual.
   * 
   * Uso:
   * - Se utiliza para acceder a los métodos y propiedades del componente `PasoUnoPagesComponent`.
   * - Por ejemplo, se llama al método `collectFormValues()` para recopilar los valores del formulario.
   * 
   * Nota:
   * - Esta propiedad se inicializa después de que Angular haya renderizado la vista.
   * - Asegúrese de que el componente `PasoUnoPagesComponent` esté presente en la plantilla.
   */
  @ViewChild(PasoUnoPagesComponent) pasoUnoComponent!: PasoUnoPagesComponent;

  /**
     * 
     * Una cadena que representa la clase CSS para una alerta de información.
     * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
     */
  public infoAlert = 'alert-info';

  /*
   *  * Se define el mensaje de datos para la modificación del permiso sanitario.
   *  * Este mensaje se utiliza para mostrar información relevante al usuario.
   */
  msgData = MODIFICACION_PERMISO_DATA;

/**
* Referencia al componente `WizardComponent` dentro de la plantilla.
* 
* Esta propiedad utiliza el decorador `@ViewChild` para obtener una instancia del componente
* `WizardComponent` que se encuentra en la plantilla del componente actual.
* 
* Uso:
* - Se utiliza para acceder a los métodos y propiedades del componente `WizardComponent`.
* - Por ejemplo, se llama a los métodos `siguiente()` y `atras()` para navegar entre los pasos
*   del asistente (wizard).
* 
* Nota:
* - Esta propiedad se inicializa después de que Angular haya renderizado la vista.
* - Asegúrese de que el componente `WizardComponent` esté presente en la plantilla.
*/
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * 
   * Lista de pasos del asistente (wizard) para la modificación PROSEC.
   * Se obtiene a partir de la enumeración `PROSEC_MODIFICACION`.
   * 
   * @type {ListaPasosWizard[]}
   */
  pantallasPasos: ListaPasosWizard[] = MODIFICACION_PERMISO_ENUM;


  /**
   * @comboind {number} indice
   * @description Índice utilizado para rastrear o identificar un elemento en una lista o colección.
   * @default 1
   */
  indice: number = 1;

  /**
   * Objeto que contiene los textos de aviso utilizados en el componente.
   * 
   * Este objeto se utiliza para mostrar mensajes de aviso o información al usuario
   * en diferentes partes del componente.
   * 
   * Uso:
   * - Los textos se obtienen de la constante `AVISO` importada desde el módulo compartido.
   * - Se pueden utilizar en la plantilla para mostrar mensajes dinámicos.
   */
  TEXTOS = AVISO;

  /**
    * Objeto que contiene los datos de configuración para los pasos del asistente (wizard).
    * 
    * Propiedades:
    * - `nroPasos`: Número total de pasos en el asistente.
    * - `indice`: Índice del paso actual.
    * - `txtBtnAnt`: Texto para el botón "Anterior".
    * - `txtBtnSig`: Texto para el botón "Continuar".
    */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property {SolicitanteData} [solicitante] - Información del solicitante (opcional).
   * @property {CompleteForm[]} [datosSolicitud] - Lista de formularios completos relacionados con la solicitud (opcional).
   * @property {TercerosRelacionados[]} [tercerosRelacionados] - Información de terceros relacionados con la solicitud (opcional).
   * @property {PagoDeDerechos[]} [pagoDeDerechos] - Detalles de los pagos de derechos asociados (opcional).
   * @property {Tramite[]} [tramitesAsociados] - Lista de trámites asociados a la solicitud (opcional).
   */
  payload: {
    solicitante?: SolicitanteData;
    datosSolicitud?: CompleteForm[];
    tercerosRelacionados?: TercerosRelacionados[];
    pagoDeDerechos?: PagoDeDerechos[];
    tramitesAsociados?: Tramite[];
  } = {};

  /**
 * Método para actualizar el índice del paso actual en el asistente (wizard) y recopilar los valores del formulario.
 * 
 * Este método se ejecuta cuando se realiza una acción en el asistente, como avanzar al siguiente paso
 * o retroceder al paso anterior. También recopila los valores del formulario del componente `PasoUnoPagesComponent`.
 * 
 * @param e - Objeto de tipo `AccionBoton` que contiene:
 *   - `accion`: La acción a realizar ('cont' para continuar o cualquier otro valor para retroceder).
 *   - `valor`: El índice del paso al que se desea navegar.
 * 
 * Comportamiento:
 * - Si el componente `PasoUnoPagesComponent` está inicializado, se llama al método `collectFormValues()` para
 *   recopilar los valores del formulario y se almacenan en la propiedad `payload`.
 * - Si el valor del índice está entre 1 y 4 (inclusive), actualiza el índice actual.
 * - Si la acción es 'cont', avanza al siguiente paso utilizando el método `siguiente` del componente `WizardComponent`.
 * - Si la acción no es 'cont', retrocede al paso anterior utilizando el método `atras` del componente `WizardComponent`.
 * 
 * Manejo de errores:
 * - Si el componente `PasoUnoPagesComponent` no está inicializado, se registra un mensaje de error en la consola.
 */
  getValorIndice(e: AccionBoton): void {
    if (this.pasoUnoComponent) {
      this.payload = this.pasoUnoComponent.collectFormValues()

    } else {
      console.error('PasoUnoPagesComponent is not initialized.');
    }

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
   * Recopila todos los valores de los formularios de los diferentes pasos del componente.
   *
   * @returns Un objeto que contiene los valores del formulario del paso uno, incluyendo:
   * - `solicitante`: Información del solicitante.
   * - `datosSolicitud`: Lista de formularios completos relacionados con la solicitud.
   * - `tercerosRelacionados`: Lista de terceros relacionados con la solicitud.
   * - `pagoDeDerechos`: Lista de pagos de derechos asociados.
   * - `tramitesAsociados`: Lista de trámites asociados.
   */
  collectAllFormValues(): {
    pasoUno?: {
      solicitante?: SolicitanteData;
      datosSolicitud?: CompleteForm[];
      tercerosRelacionados?: TercerosRelacionados[];
      pagoDeDerechos?: PagoDeDerechos[];
      tramitesAsociados?: Tramite[];
    };
  } {
    const ALL_FORM_VALUES: {
      pasoUno?: {
        solicitante?: SolicitanteData;
        datosSolicitud?: CompleteForm[];
        tercerosRelacionados?: TercerosRelacionados[];
        pagoDeDerechos?: PagoDeDerechos[];
        tramitesAsociados?: Tramite[];
      };
    } = {};

    if (this.pasoUnoComponent) {
      const PASO_UNO_VALUES = this.pasoUnoComponent.collectFormValues();
      ALL_FORM_VALUES.pasoUno = PASO_UNO_VALUES;
    }

    return ALL_FORM_VALUES;
  }
}

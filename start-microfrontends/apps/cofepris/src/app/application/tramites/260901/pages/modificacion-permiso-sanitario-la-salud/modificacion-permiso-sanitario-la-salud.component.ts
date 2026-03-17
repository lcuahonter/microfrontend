
/**
 * ModificacionPermisoSanitarioLaSaludComponent
 */
import { AVISO,AccionBoton, DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
import { CompleteForm, PagoDeDerechos, SolicitanteData, TercerosRelacionados, Tramite } from '../../models/mod-permiso.model';
import { Component, ViewChild } from '@angular/core';
import {MODIFICACION_PERMISO_DATA, MODIFICACION_PERMISO_ENUM } from '../../constantes/mod-permiso.enum';
import { PasoUnoPagesComponent } from '../paso-uno-pages/paso-uno-pages.component';
/**
 * Component 
 */
@Component({
  selector: 'app-modificacion-permiso-sanitario-la-salud',
  templateUrl: './modificacion-permiso-sanitario-la-salud.component.html',
})
/**
  *ModificacionPermisoSanitarioLaSaludComponent 
 * 
 */
export class ModificacionPermisoSanitarioLaSaludComponent {
  /**
 * Referencia al componente `PasoUnoPagesComponent` dentro de la plantilla.
 * 
 * Esta propiedad utiliza el decorador `@ViewChild` para obtener una instancia del componente
 * `PasoUnoPagesComponent` que se encuentra en la plantilla del componente actual.
 * 
 * Uso:
 * - Se utiliza para acceder a los métodos y propiedades del componente `PasoUnoPagesComponent`.
 * - Por ejemplo, se llama al método `collectFormValues()` para recopilar los valores del formulario
 *   del paso uno.
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
    msgData =MODIFICACION_PERMISO_DATA;
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
     * Índice del paso actual dentro del asistente.
     * 
     * @type {number}
     * @default 1
     */
    indice: number = 1;
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
   * Objeto para almacenar todos los valores recopilados de los formularios.
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
      // Call collectFormValues() from PasoUnoPagesComponent
      this.payload = this.pasoUnoComponent.collectFormValues();
      
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
 * Método para recopilar todos los valores de los formularios de los pasos del asistente (wizard).
 * 
 * Este método recopila los valores de los formularios de los componentes hijos, como `PasoUnoPagesComponent`,
 * y los organiza en un objeto que contiene los datos de cada paso.
 * 
 * @returns Un objeto que contiene los valores de los formularios de todos los pasos del asistente.
 * 
 * Comportamiento:
 * - Si el componente `PasoUnoPagesComponent` está inicializado, se llama al método `collectFormValues()` 
 *   para recopilar los valores del formulario del paso uno y se almacenan en la propiedad `pasoUno` 
 *   del objeto `ALL_FORM_VALUES`.
 * 
 * Uso:
 * - Este método se utiliza para consolidar los datos de todos los pasos del asistente en un único objeto,
 *   que puede ser enviado a un backend o utilizado para otras operaciones.
 * 
 * Manejo de errores:
 * - Si el componente `PasoUnoPagesComponent` no está inicializado, no se recopilan los valores de ese paso.
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

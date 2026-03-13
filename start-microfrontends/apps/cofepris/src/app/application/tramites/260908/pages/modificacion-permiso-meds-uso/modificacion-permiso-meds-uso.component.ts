/**
 * Componente para la modificación de permisos de importación de tratamientos.
 */
import { Component, ViewChild } from '@angular/core';

import { AVISO ,AccionBoton, DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';



import { PasoUnoPagesComponent } from '../paso-uno-pages/paso-uno-pages.component';

import { MODIFICACION_PERMISO_DATA, MODIFICACION_PERMISO_ENUM } from '../../constantes/mod-permiso.enum';

import { CompleteForm, PagoDeDerechos, SolicitanteData, TercerosRelacionados, Tramite } from '../../models/mod-permiso.model';
/*
* Componente para la modificación de permisos de medicamentos de uso. 
*/
@Component({
  selector: 'app-modificacion-permiso-meds-uso',
  templateUrl: './modificacion-permiso-meds-uso.component.html',
})
/**
 * Clase que representa el componente de modificación de permisos de medicamentos de uso.
 * Este componente incluye un asistente (wizard) para guiar al usuario a través del proceso de modificación.
 * 
 * @export
 * @class ModificacionPermisoMedsUsoComponent
 */
export class ModificacionPermisoMedsUsoComponent {
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
      /**
       * Contiene los datos relacionados con la modificación de permisos.
       * 
       * Esta variable almacena la información necesaria para actualizar
       * o modificar los permisos existentes en el sistema.
       * 
       * @type {TipoDeDato} - Reemplaza con el tipo real de MODIFICACION_PERMISO_DATA si es necesario.
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
  
}

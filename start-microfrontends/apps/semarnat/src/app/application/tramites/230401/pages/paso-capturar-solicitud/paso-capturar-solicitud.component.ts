import { Component, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, PAGO_DE_DERECHOS, PASOS4, WizardComponent } from '@ng-mf/data-access-user';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AccionBoton } from '../../enum/pantallas-constante.enum';

/**
 * Componente que representa el segundo paso en el flujo de trámites.
 * 
 * Este componente contiene un objeto con los textos de los requisitos necesarios
 * para completar el trámite. Los textos son accesibles a través de la propiedad `TEXTOS`.
 *
 * Se espera que sea utilizado dentro de un flujo paso a paso para visualizar
 * los requisitos necesarios antes de continuar con la solicitud.
 *
 * @class PasoCapturarSolicitudComponent
 */
@Component({
  selector: 'app-paso-capturar-solicitud',
  templateUrl: './paso-capturar-solicitud.component.html',
})
/**
 * Actualiza el índice del paso actual y realiza una acción en el componente Wizard.
 * 
 * Este método permite cambiar el índice del paso actual dentro del asistente de la aplicación,
 * siempre que el valor proporcionado esté dentro del rango permitido (entre 1 y 4, inclusive).
 * Además, ejecuta una acción específica en el componente Wizard, como avanzar o retroceder
 * entre los pasos del asistente.
 * 
 * @param e - Objeto de tipo `AccionBoton` que contiene los siguientes atributos:
 *   - `valor`: Número que representa el índice del paso al que se desea cambiar. Debe estar
 *     entre 1 y 4 para que la acción sea válida.
 *   - `accion`: Cadena que indica la acción a realizar. Si el valor es `'cont'`, el asistente
 *     avanza al siguiente paso. Si es cualquier otro valor, el asistente retrocede al paso anterior.
 * 
 * @remarks
 * Si el valor proporcionado está fuera del rango permitido (menor o igual a 0, o mayor o igual a 5),
 * el método no realiza ninguna acción y el índice permanece sin cambios.
 * 
 * @example
 * ```typescript
 * const accion: AccionBoton = { valor: 3, accion: 'cont' };
 * getValorIndice(accion); // Actualiza el índice a 3 y avanza en el asistente.
 * 
 * const accionRetroceso: AccionBoton = { valor: 2, accion: 'retroceso' };
 * getValorIndice(accionRetroceso); // Actualiza el índice a 2 y retrocede en el asistente.
 * ```
 */
export class PasoCapturarSolicitudComponent {

  /**
   * Propiedad que representa los pasos del asistente (wizard) en el componente.
   * 
   * Esta propiedad utiliza la estructura `ListaPasosWizard` para definir los pasos
   * que se deben seguir en el flujo del asistente. Los pasos son inicializados con
   * la constante `PASOS4`, que contiene la configuración específica de los pasos
   * para este componente.
   * 
   * @type {ListaPasosWizard[]} - Lista de pasos del asistente.
   * 
   */
  pasos: ListaPasosWizard[] = PASOS4;
  
  /**
   * Índice actual del paso en el asistente.
   * 
   * Esta propiedad se utiliza para rastrear el paso actual en el flujo del asistente.
   * El valor inicial es 1, lo que indica que el primer paso está activo al cargar el componente.
   * 
   * @type {number} - Índice del paso actual, comenzando desde 1.
   */
  indice: number = 1;

  /**
   * Datos de los pasos del asistente.
   * 
   * Esta propiedad contiene la información necesaria para gestionar los pasos del asistente,
   * incluyendo el número total de pasos, el índice actual, y los textos de los botones de navegación.
   * 
   * @type {DatosPasos} - Objeto que contiene la configuración de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Referencia al componente WizardComponent utilizado en el flujo de la aplicación.
   * 
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener una instancia del componente
   * WizardComponent dentro del contexto del componente actual. Permite interactuar directamente
   * con las funcionalidades del componente Wizard, como avanzar o retroceder entre los pasos del
   * asistente.
   * 
   * @type {WizardComponent} - Instancia del componente WizardComponent.
   * @decorator `@ViewChild` - Decorador para acceder al componente hijo en la vista.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
 * 
 * Una cadena que representa la clase CSS para una alerta de información.
 * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
 */
  public infoAlert = 'alert-info';

  /**
   * Una constante que contiene el valor del objeto 'PROTESTA'.
   * Se utiliza para almacenar datos adicionales relacionados con el componente.
   */
  TEXTOS = PAGO_DE_DERECHOS;


  /**
   * Método para actualizar el índice basado en el valor proporcionado y realizar una acción en el componente del asistente.
   * 
   * @param e - Objeto de tipo `AccionBoton` que contiene el valor y la acción a realizar.
   *   - `valor`: Número que debe estar entre 1 y 4 (inclusive) para actualizar el índice.
   *   - `accion`: Cadena que indica la acción a realizar, puede ser 'cont' para avanzar o cualquier otro valor para retroceder.
   * 
   * @remarks
   * Si el valor proporcionado está fuera del rango permitido (menor o igual a 0, o mayor o igual a 5), no se realiza ninguna acción.
   * 
   * @example
   * ```typescript
   * const accion: AccionBoton = { valor: 3, accion: 'cont' };
   * getValorIndice(accion); // Actualiza el índice a 3 y avanza en el asistente.
   * ```
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

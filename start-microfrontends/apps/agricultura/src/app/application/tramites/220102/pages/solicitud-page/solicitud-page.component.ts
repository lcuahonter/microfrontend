import {
  AccionBoton,
  DatosPasos,
  ListaPasosWizard,
  WizardComponent
} from '@ng-mf/data-access-user';
import {
  Component,
  ViewChild
} from '@angular/core';
import { PASOS } from '../../constantes/fitosanitario.enum';

/**
 * Componente principal de la página de solicitud, que gestiona la navegación de pasos dentro de un formulario tipo wizard.
 * 
 * Este componente gestiona el flujo de pasos dentro de un formulario de solicitud utilizando el componente `WizardComponent`. 
 * Permite la navegación entre pasos y la validación de la sección actual.
 */
@Component({
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
export class SolicitudPageComponent {
  /**
   * Lista de los pasos definidos en el formulario para el wizard de solicitud.
   * Esta lista está obtenida de la constante `PASOSACUICULTURA`.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice actual del paso en el formulario. Comienza en 1.
   */
  indice: number = 1;

  /**
   * Objeto que contiene la información de los botones de navegación.
   * - `nroPasos`: Total de pasos en el wizard.
   * - `indice`: Índice del paso actual.
   * - `txtBtnAnt`: Texto para el botón "Anterior".
   * - `txtBtnSig`: Texto para el botón "Siguiente".
   */

  valorDelBoton: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Guardar',
    txtBtnSig: 'Continuar',
  };

  /**
   * Referencia al componente `WizardComponent` para poder controlar la navegación entre pasos.
   * 
   * El componente `WizardComponent` es utilizado para realizar las acciones de "siguiente" y "anterior".
   * 
   * @ViewChild WizardComponent - La referencia al componente del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Función que maneja la acción de navegación en el wizard.
   * 
   * Dependiendo del valor de la acción (`cont` o `atras`), se navega hacia el siguiente paso o el anterior.
   * 
   * @param e - El objeto de tipo `AccionBoton` que contiene el valor de la acción y el índice del paso.
   *    - `valor`: Indica el número del paso al que se desea navegar.
   *    - `accion`: Indica si la acción es "cont" (continuar) o "atras" (retroceder).
   */
  getValorIndice(e: AccionBoton):void {
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

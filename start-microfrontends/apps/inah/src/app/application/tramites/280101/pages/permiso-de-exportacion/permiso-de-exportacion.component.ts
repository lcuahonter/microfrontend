import { Component, ViewChild } from '@angular/core'; // Importa las clases base para componentes de Angular.
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum'; // Importa los textos del aviso de privacidad.
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model'; // Importa el modelo para las acciones de los botones.
import { DatosPasos } from '@libs/shared/data-access-user/src'; // Importa la interfaz para los datos de los pasos del wizard.
import { ListaPasosWizard } from '@libs/shared/data-access-user/src'; // Importa la lista de pasos del wizard.
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/303/pasos.enums'; // Importa la configuración de los pasos del wizard.
import { WizardComponent } from '@libs/shared/data-access-user/src'; // Importa el componente del wizard.

/**
 * Componente que representa el permiso de exportación.
 * Este componente utiliza un wizard para guiar al usuario a través de varios pasos.
 */
@Component({
  selector: 'app-permiso-de-exportacion', // Define el selector del componente.
  templateUrl: './permiso-de-exportacion.component.html', // Ruta al archivo de plantilla HTML del componente.
})
export class PermisoDeExportacionComponent {
  /**
   * Lista de pasos del wizard.
   * Cada paso está definido en la lista `PASOS`.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice actual del paso en el wizard.
   * Representa el paso en el que se encuentra el usuario actualmente.
   */
  indice: number = 1;

  /**
   * Textos del aviso de privacidad.
   * Contiene los textos que se mostrarán relacionados con el aviso de privacidad.
   */
  public TEXTOS = AVISO;

  /**
   * Referencia al componente del wizard.
   * Permite interactuar con el wizard para avanzar o retroceder entre los pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos de configuración para los pasos del wizard.
   * Incluye información como el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    /**
     * Número total de pasos en el wizard.
     */
    nroPasos: this.pantallasPasos.length,

    /**
     * Índice actual del paso.
     */
    indice: this.indice,

    /**
     * Texto del botón "Anterior".
     */
    txtBtnAnt: 'Anterior',

    /**
     * Texto del botón "Continuar".
     */
    txtBtnSig: 'Continuar',
  };

  /**
   * Maneja el cambio de índice en el wizard.
   * Este método se ejecuta cuando el usuario interactúa con los botones del wizard.
   * 
   * @param e Acción del botón que contiene el índice y la acción a realizar.
   *          - `e.valor`: Índice del paso al que se desea mover.
   *          - `e.accion`: Acción a realizar, puede ser "cont" (continuar) o "atrás".
   */
  getValorIndice(e: AccionBoton): void {
    // Verifica que el índice esté dentro del rango permitido.
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor; // Actualiza el índice actual.

      if (e.accion === 'cont') {
        // Si la acción es "continuar", avanza al siguiente paso.
        this.wizardComponent.siguiente();
      } else {
        // Si la acción es "atrás", retrocede al paso anterior.
        this.wizardComponent.atras();
      }
    }
  }
}

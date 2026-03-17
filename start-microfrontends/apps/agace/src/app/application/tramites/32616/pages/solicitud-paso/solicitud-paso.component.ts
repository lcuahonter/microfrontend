import { AccionBoton, DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
import { Component, ViewChild } from '@angular/core';
import { PASOS } from "@libs/shared/data-access-user/src/core/enums/32616/modificacion.enum";

/**
 * Componente que representa el contenedor principal del asistente (wizard)
 * para la solicitud del trámite 32616. Controla el flujo entre los pasos,
 * actualiza el índice del paso actual y coordina las acciones de navegación.
 *
 * @export
 * @class SolicitudPasoComponent
 */
@Component({
  selector: 'app-solicitud-paso',
  templateUrl: './solicitud-paso.component.html',
})
export class SolicitudPasoComponent {

  /**
   * Índice actual del paso en el asistente.
   *
   * @type {number}
   * @memberof SolicitudPasoComponent
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente (wizard).
   * Se utiliza para interactuar con el wizard y controlar su flujo (pasar al siguiente paso, ir al anterior, etc.).
   *
   * @type {WizardComponent}
   * @memberof SolicitudPasoComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Lista de pasos del asistente.
   * Contiene un arreglo con los pasos definidos en `PASOS` que será utilizado en el wizard.
   *
   * @type {ListaPasosWizard[]}
   * @memberof SolicitudPasoComponent
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Datos de los pasos del asistente.
   * Incluye el número total de pasos, el índice del paso actual y los textos de los botones de navegación.
   *
   * @type {DatosPasos}
   * @memberof SolicitudPasoComponent
   */
  datosPasos: DatosPasos = {
    /** Número total de pasos en el asistente. */
    nroPasos: this.pasos.length,
    /** Índice del paso actual. */
    indice: this.indice,
    /** Texto del botón "Anterior". */
    txtBtnAnt: 'Anterior',
    /** Texto del botón "Continuar". */
    txtBtnSig: 'Continuar',
  };

  /**
   * Obtiene el valor del índice de la acción del botón.
   * Este método controla el cambio de paso en el wizard dependiendo de la acción del botón presionado.
   *
   * Si la acción es `'cont'`, pasa al siguiente paso.
   * Si la acción es `'atras'`, regresa al paso anterior.
   *
   * @param {AccionBoton} e - Acción del botón (cont o atras) y el valor asociado a la acción.
   * @returns {void}
   * @memberof SolicitudPasoComponent
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

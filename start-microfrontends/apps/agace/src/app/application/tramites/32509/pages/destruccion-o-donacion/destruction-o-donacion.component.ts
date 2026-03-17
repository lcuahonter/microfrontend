import { ACCIONBOTON, LISTAPASOWIZARD } from '../../models/destruccion-o-donacion';
import { Component, ViewChild } from '@angular/core';
import { DatosPasos, WizardComponent } from '@libs/shared/data-access-user/src';
import { PASOS } from '../../constantes/destruccion-o-donacion';



/**
 * Componente principal para el flujo de destrucción o donación.
 * Gestiona los pasos del wizard y la navegación entre ellos.
 *
 * @component
 * @example
 * <app-destruction-o-donacion></app-destruction-o-donacion>
 */
@Component({
  selector: 'app-destruction-o-donacion',
  templateUrl: './destruction-o-donacion.component.html',
  styleUrl: './destruction-o-donacion.component.scss',
})
export class DestructionODonacionComponent {
  /**
   * Array de pasos del wizard.
   * @type {Array<LISTAPASOWIZARD>}
   */
  pasos: LISTAPASOWIZARD[] = PASOS;

  /**
   * El título del mensaje.
   * @type {string | null}
   */
  tituloMensaje: string | null = 'Zoosanitario para importación';

  /**
   * Referencia al componente Wizard.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * El índice del paso actual.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Datos de los pasos del wizard.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Maneja la acción del botón y determina la navegación (siguiente o anterior).
   * @param {ACCIONBOTON} e Objeto de acción que contiene la acción y el valor a manejar.
   * @returns {void}
   */
  getValorIndice(e: ACCIONBOTON): void {
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

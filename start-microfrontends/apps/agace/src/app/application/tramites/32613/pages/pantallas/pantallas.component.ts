import { AccionBoton, DatosPasos, ListaPasosWizard, PASOS, WizardComponent } from '@libs/shared/data-access-user/src';
import { Component, ViewChild } from '@angular/core';

/**
 * Componente que gestiona las pantallas del asistente para el trámite 32613.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
})

export class PantallasComponent {
  /**
   * Referencia al componente del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
   * Lista de pasos del asistente.
   */
  public pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  public indice: number = 1;

  /**
   * Datos de los pasos del asistente.
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && this.pasos.length) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent?.siguiente();
      } else {
        this.wizardComponent?.atras();
      }
    }
  }
}

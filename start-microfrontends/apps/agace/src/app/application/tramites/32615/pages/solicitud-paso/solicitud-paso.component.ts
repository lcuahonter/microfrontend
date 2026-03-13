import { AccionBoton, DatosPasos, ListaPasosWizard, PASOS, WizardComponent } from '@libs/shared/data-access-user/src';
import { Component, ViewChild } from '@angular/core';
/**
 * Componente principal para el formulario de solicitud de despacho de exportación.
 */
@Component({
  selector: 'app-solicitud-paso',
  templateUrl: './solicitud-paso.component.html',
})
export class SolicitudPasoComponent {
  
  /** Lista de pasos del wizard. */
  pasos: ListaPasosWizard[] = PASOS;

  /** Índice actual del paso activo en el wizard. */
  indice: number = 1;

  /** Referencia al componente del wizard. */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

 /**
   * Datos de configuración para el componente de pasos (wizard),
   * incluyendo número total de pasos, índice actual y textos de botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Cambia el índice del paso actual y navega al siguiente o anterior
   * según la acción recibida ('cont' para continuar, otro para retroceder).
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

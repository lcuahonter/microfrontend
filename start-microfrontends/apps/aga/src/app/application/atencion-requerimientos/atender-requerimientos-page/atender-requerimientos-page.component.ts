import { Component, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, PASOS_REQUERIMIENTOS, SeccionLibState, WizardComponent } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';

interface AccionBoton {
  accion: string;
  valor: number;
}

@Component({
  templateUrl: './atender-requerimientos-page.component.html',
  styles: ``,
})
export class AtenderRequerimientosPageComponent {
  pasos: ListaPasosWizard[] = PASOS_REQUERIMIENTOS;

  indice: number = 1;
  public seccion!: SeccionLibState;
  private destroyNotifier$: Subject<void> = new Subject();

  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Actualiza el índice basado en el valor de la acción proporcionada y navega en el componente wizard.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene el valor y la acción a realizar.
   *   - `valor`: Número que debe estar entre 1 y 4 (inclusive).
   *   - `accion`: Cadena que indica la acción a realizar ('cont' para siguiente, cualquier otro valor para atrás).
   * @return {void}
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

  /* eslint-disable class-methods-use-this */  
  /**
   * Guarda los datos necesarios.
   *
   * @param _ev - Evento que desencadena la acción de guardar. Actualmente no se utiliza.
   * @returns {void}
   */
  guardar(_ev: void) : void {
    // Aquí puedes agregar el código adicional que necesites para guardar los datos
  }

  /**
  * Maneja el evento para obtener la firma y realiza acciones adicionales.
  * @param ev - La cadena de texto que representa la firma obtenida.
  * @return {void}
  */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    // Aquí puedes agregar el código adicional que necesites para manejar la firma
  }
}

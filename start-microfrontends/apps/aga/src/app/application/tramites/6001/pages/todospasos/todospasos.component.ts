/* eslint-disable sort-imports */
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, TODOS_PASOS, WizardComponent } from '@libs/shared/data-access-user/src';
import { PANTA_PASOS } from '../../services/registro-cuentas-bancarias.enum';
import { AccionBoton } from 'libs/shared/data-access-user/src/core/models/31601/servicios-pantallas.model';



/**
 * Componente Todospasos que se utiliza para mostrar y gestionar los Todospasos.
 * 
 * @component
 */
@Component({
  selector: 'app-todospasos',
  templateUrl: './todospasos.component.html',
})
export class TodospasosComponent {

 /**
* Esta variable se utiliza para almacenar la lista de pasos.
*/
 pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
 /**
  * Esta variable se utiliza para almacenar el índice del paso.
  */
 indice: number = 1;

/**
 * Una propiedad pública que contiene la referencia al objeto `Todospasos`.
 * Esta propiedad se utiliza para acceder a varios textos o constantes definidos en el objeto `Todospasos`.
 */
 public TEXTOS = TODOS_PASOS;


   /**
   * Esta variable se utiliza para almacenar el componente wizard.
   * @param wizardComponent - El componente wizard.
   */
   @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

   /**
    * Esta variable se utiliza para almacenar los datos de los pasos.
    * @param datosPasos - Los datos de los pasos.
    * @param nroPasos - El número de pasos.
    * @param indice - El índice.
    * @param txtBtnAnt - El texto del botón anterior.
    * @param txtBtnSig - El texto del botón siguiente.
    */

  /**
   * Represents the data for the steps in the process.
   * 
   * @property {number} nroPasos - The number of steps.
   * @property {number} indice - The current index of the step.
   * @property {string} txtBtnAnt - The text for the "Previous" button.
   * @property {string} txtBtnSig - The text for the "Continue" button.
   */
   public datosPasos: DatosPasos = {
     nroPasos: this.pantallasPasos.length,
     indice: this.indice,
     txtBtnAnt: 'Anterior',
     txtBtnSig: 'Continuar',
   };

   /**
   * Este método se utiliza para inicializar el componente.
   */
   public getValorIndice(e: AccionBoton): void {
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

import { AccionBoton } from '@libs/shared/data-access-user/src';
import { Component } from '@angular/core';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { PANTA_PASOS } from '../../services/comercio-exterior.enum';
import { Subject } from 'rxjs';
import { TITULO_PASO_DOS } from '../../services/comercio-exterior.enum';
import { TITULO_PASO_TRES } from '../../services/comercio-exterior.enum';
import { TITULO_PASO_UNO } from '../../services/comercio-exterior.enum';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src';


@Component({
  selector: 'app-todos-pasos',
  templateUrl: './todos-pasos.component.html',
})
export class TodospasosComponent implements OnDestroy {

   /**
* Esta variable se utiliza para almacenar la lista de pasos.
*/
 pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
 /**
  * Esta variable se utiliza para almacenar el índice del paso.
  */
 indice: number = 1;
 /**
 * Representa el título del paso actual en el proceso.
 * Este valor se inicializa con una constante que representa el título del primer paso.
 */
 public titulo: string = TITULO_PASO_UNO;

  /**
   * Notificador para destruir observables activos.
   */
  private destroyed$ = new Subject<void>();



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

  constructor() {
//
  }


   /**
   * Este método se utiliza para inicializar el componente.
   */
   public getValorIndice(e: AccionBoton) : void{
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if(this.indice === 2) {
        this.titulo = TITULO_PASO_DOS;
      } else if(this.indice === 3) {
        this.titulo = TITULO_PASO_TRES;
      } else {
        this.titulo = TITULO_PASO_UNO;
      }
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

    /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }

}

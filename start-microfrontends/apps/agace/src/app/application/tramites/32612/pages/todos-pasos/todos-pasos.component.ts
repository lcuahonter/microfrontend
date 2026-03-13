import { AccionBoton, DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { PANTA_PASOS, TITULO_PASO_DOS, TITULO_PASO_TRES, TITULO_PASO_UNO } from '../../services/esquema-de-certificacion.enum';
import { Subject } from 'rxjs';

/**
 * Componente que gestiona el flujo de pasos en el proceso de trámites.
 * 
 * @remarks
 * Este componente utiliza un wizard para navegar entre diferentes pasos definidos en el proceso.
 * Permite avanzar y retroceder entre los pasos, actualizando el título y los datos asociados al paso actual.
 * 
 * @example
 * <app-todos-pasos></app-todos-pasos>
 * 
 * @property {ListaPasosWizard[]} pantallasPasos - Lista de pasos disponibles en el wizard.
 * @property {number} indice - Índice del paso actual.
 * @property {string} titulo - Título del paso actual.
 * @property {DatosPasos} datosPasos - Datos asociados al paso actual, incluyendo textos de botones y número de pasos.
 * @property {WizardComponent} wizardComponent - Referencia al componente wizard para controlar la navegación.
 * @property {Subject<void>} destroyed$ - Notificador para destruir observables activos al destruir el componente.
 * 
 * @method getValorIndice - Actualiza el índice y título del paso según la acción recibida, y navega en el wizard.
 * @method ngOnDestroy - Completa el observable destroyed$ para cancelar suscripciones activas al destruir el componente.
 */
@Component({
  selector: 'app-todos-pasos',
  templateUrl: './todos-pasos.component.html',
})
export class TodosPasosComponent implements OnDestroy {

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

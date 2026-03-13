import {AccionBoton,DatosPasos,ListaPasosWizard,SeccionLibState,} from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { PASOS } from '@ng-mf/data-access-user'
import { WizardComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
})
export class SolicitudPageComponent {

  /**
  * **Lista de pasos del asistente (Wizard)**  
  * Contiene los diferentes pasos que conforman el flujo del asistente.
  */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * **Índice del paso actual**  
   * Indica en qué paso del asistente se encuentra el usuario.  
   * Por defecto, inicia en `1`.
   */
  indice: number = 1;

  /**
   * **Sección actual del estado**  
   * Almacena los datos de la sección activa en el asistente.  
   * Se inicializa posteriormente en el ciclo de vida del componente.
   */
  public seccion!: SeccionLibState;


  /**
   * **Referencia al componente del asistente (Wizard)**  
   * Permite acceder a los métodos y propiedades del `WizardComponent` dentro del componente actual.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * **Configuración de los pasos del asistente**  
   * Almacena información sobre el número total de pasos, el índice actual  
   * y los textos de los botones de navegación dentro del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length, // Total de pasos en el asistente
    indice: this.indice, // Paso actual en el asistente
    txtBtnAnt: 'Anterior', // Texto del botón para retroceder
    txtBtnSig: 'Continuar', // Texto del botón para avanzar
  };

  /**
   * **Actualiza el índice del asistente y navega entre los pasos**  
   * 
   * - Verifica que el valor del índice (`e.valor`) esté dentro del rango permitido (1-4).
   * - Si la acción (`e.accion`) es `'cont'`, avanza al siguiente paso del asistente.
   * - Si la acción no es `'cont'`, retrocede al paso anterior.
   * 
   * @param e - Objeto `AccionBoton` que contiene la acción a realizar y el nuevo índice del paso.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) { // Asegura que el índice esté en el rango válido
      this.indice = e.valor; // Actualiza el índice del paso actual
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente(); // Avanza al siguiente paso
      } else {
        this.wizardComponent.atras(); // Retrocede al paso anterior
      }
    }
  }

}



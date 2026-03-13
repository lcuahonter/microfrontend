import { Component, ViewChild } from '@angular/core';
import { AccionBoton } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '../../constants/exencion-impuestos.module.enum';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { WizardComponent } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-solicitud-page',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    BtnContinuarComponent,
    PasoTresComponent,
    PasoDosComponent,
    PasoUnoComponent,
  ],
  templateUrl: './solicitud-page.component.html',
})
export class SolicitudPageComponent {
  /** Lista de pasos para el wizard */
  pasos: ListaPasosWizard[] = PASOS;

  /** Índice actual del paso que se está visualizando */
  indice: number = 1;

  /**
   * Objeto `datosPasos` que contiene información sobre los pasos del proceso.
   * Se utiliza para gestionar la navegación dentro de un flujo de pasos.
   */
  datosPasos: DatosPasos = {
    /**
     * Número total de pasos en el proceso.
     * Se obtiene dinámicamente a partir de la longitud del arreglo `pasos`.
     */
    nroPasos: this.pasos.length,

    /**
     * Índice del paso actual dentro del proceso.
     */
    indice: this.indice,

    /**
     * Texto que se muestra en el botón para retroceder al paso anterior.
     */
    txtBtnAnt: 'Anterior',

    /**
     * Texto que se muestra en el botón para avanzar al siguiente paso.
     */
    txtBtnSig: 'Continuar',
  };

  /** Referencia al componente Wizard, utilizado para la navegación entre pasos */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Método que recibe un objeto `AccionBoton` y actualiza el índice basado en su valor.
   *
   * @param e - Objeto `AccionBoton` que contiene el valor e información de la acción a realizar.
   */
  getValorIndice(e: AccionBoton): void {
    /**
     * Validación del valor recibido.
     * Se actualiza el índice solo si el valor está dentro del rango permitido (entre 1 y 4).
     */
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;

      /**
       * Se verifica la acción especificada en `e.accion`.
       * Si la acción es 'cont', se avanza al siguiente paso.
       * En caso contrario, se retrocede al paso anterior.
       */
      if (e.accion === 'cont') {
        /**
         * Llama al método `siguiente()` para avanzar al siguiente paso en el componente de asistente.
         */
        this.wizardComponent.siguiente();
      } else {
        /**
         * Llama al método `atras()` para volver al paso anterior en el componente de asistente.
         */
        this.wizardComponent.atras();
      }
    }
  }
}

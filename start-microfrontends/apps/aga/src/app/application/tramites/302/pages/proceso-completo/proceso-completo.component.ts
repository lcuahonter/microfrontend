/* eslint-disable @nx/enforce-module-boundaries */
import { Component, ViewChild } from '@angular/core';
import { DatosPasos } from '../../../../../../../../../libs/shared/data-access-user/src/core/models/shared/components.model';
import { ListaPasosWizard } from '../../../../../../../../../libs/shared/data-access-user/src/core/models/forma-render.model';
import { PASOS } from '../../../../../../../../../libs/shared/data-access-user/src/core/enums/constantes-alertas.enum';
import { WizardComponent } from '../../../../../../../../../libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';

/**
 * Representa una acción asociada a un botón, incluyendo el tipo de acción y su valor numérico.
 *
 * @property {string} accion - El nombre o identificador de la acción que realiza el botón.
 * @property {number} valor - El valor numérico asociado a la acción del botón.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}
/**
 * Componente encargado de gestionar el flujo completo del proceso en el asistente (wizard).
 *
 * Este componente administra los pasos del asistente, el índice actual, y la interacción con el componente hijo `WizardComponent`.
 * Permite seleccionar pestañas específicas, actualizar el índice del paso actual y controlar la navegación entre los pasos del asistente.
 *
 * @component
 * @selector proceso-completo
 * @templateUrl ./proceso-completo.component.html
 */
@Component({
  selector: 'proceso-completo',
  templateUrl: './proceso-completo.component.html',
})

export class ProcesoCompletoComponent {
 
  /**
   * Arreglo que contiene la lista de pasos del asistente (wizard) para el proceso actual.
   * Cada elemento del arreglo es de tipo `ListaPasosWizard` y representa un paso específico dentro del flujo.
   * Se inicializa con la constante `PASOS`.
   */
  public pasos: Array<ListaPasosWizard> = PASOS;
 
  /**
   * Índice actual del proceso.
   * 
   * Esta propiedad representa el número de paso o etapa en la que se encuentra el proceso.
   * El valor inicial es 1.
   */
  public indice: number = 1;

  /**
   * Referencia al componente `WizardComponent` dentro de la plantilla.
   * 
   * Esta propiedad permite acceder a los métodos y propiedades públicos del componente
   * `WizardComponent` hijo, facilitando la interacción y el control del flujo del asistente
   * desde este componente principal.
   * 
   * @see WizardComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
 
  /**
   * Objeto que contiene la información relevante para el control de los pasos en un proceso.
   *
   * @property {number} nroPasos - Número total de pasos en el proceso.
   * @property {number} indice - Índice actual del paso en el que se encuentra el usuario.
   * @property {string} txtBtnAnt - Texto que se muestra en el botón para retroceder al paso anterior.
   * @property {string} txtBtnSig - Texto que se muestra en el botón para avanzar al siguiente paso.
   */
   public datosPasos: DatosPasos = {
    /** Número total de pasos en el asistente */
    nroPasos: this.pasos.length,
    /** Índice del paso actual */
    indice: this.indice,
    /** Texto del botón para retroceder */
    txtBtnAnt: 'Anterior',
    /** Texto del botón para avanzar */
    txtBtnSig: 'Continuar',
  };

  /**
   * Selecciona una pestaña específica estableciendo el índice actual.
   *
   * @param i - Índice de la pestaña que se desea seleccionar.
   */
  public seleccionaTab(i: number): void {
    /** Actualiza el índice del paso actual al valor proporcionado */
    this.indice = i;
  }
 
  /**
   * Actualiza el índice del asistente (`wizard`) basado en la acción recibida.
   * 
   * @param e Objeto de tipo `AccionBoton` que contiene el valor y la acción a realizar.
   * 
   * Si `e.valor` está entre 1 y 4 (inclusive), se actualiza el índice interno (`indice`) con dicho valor.
   * Si la acción (`e.accion`) es 'cont', avanza al siguiente paso del asistente llamando a `siguiente()`.
   * En caso contrario, retrocede al paso anterior llamando a `atras()`.
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



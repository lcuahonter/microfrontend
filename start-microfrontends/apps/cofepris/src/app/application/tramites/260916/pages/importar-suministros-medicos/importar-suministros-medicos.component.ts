/**
 * @file
 * Este archivo define el componente `ImportarSuministrosMedicosComponent` que gestiona el asistente
 */
import { Component, ViewChild } from '@angular/core';
import { PERMISO_MAQUILA } from '../../constantes/importar-suministros-medicos.enum';

import { DatosPasos, ListaPasosWizard, WizardComponent } from '@libs/shared/data-access-user/src';
/**
 * Representa una acción que se puede ejecutar mediante un botón.
 * 
 * @property accion - El nombre o tipo de la acción a realizar (por ejemplo, "sumar", "restar").
 * @property valor - El valor asociado a la acción, usado como entrada para ejecutar la acción.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * @descripción
 * Este componente se encarga de gestionar la funcionalidad del asistente (wizard) "Permiso Maquila".
 * Proporciona la lista de pasos del asistente y administra el índice del paso actual.
 */

@Component({
  selector: 'app-importar-suministros-medicos',
  templateUrl: './importar-suministros-medicos.component.html',
})
/**
 * @class ImportarSuministrosMedicosComponent
 * @description
 */
export class ImportarSuministrosMedicosComponent {
  /**
   * Referencia al componente del asistente (wizard) para controlar sus acciones.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
     * Esta variable se utiliza para almacenar la lista de pasos.
     */
  pantallasPasos: ListaPasosWizard[] = PERMISO_MAQUILA;

  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice = 1;


  /**
   * @propiedades
   * - `nroPasos`: Número total de pasos basado en la longitud de `pantallasPasos`.
   * - `indice`: Índice actual del paso.
   * - `txtBtnAnt`: Texto que se muestra en el botón para retroceder al paso anterior.
   * - `txtBtnSig`: Texto que se muestra en el botón para avanzar al siguiente paso.
   *
   * @descripción
   * Objeto que contiene la configuración y estado de los pasos en el flujo de la aplicación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  /**
   * @descripción
   * Método para actualizar el índice del paso actual basado en la acción y el valor proporcionados.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene la acción a realizar y el valor asociado.
   * 
   * @detalles
   * - Si el valor está entre 1 y 4 (exclusivo), actualiza el índice.
   * - Si la acción es 'cont', avanza al siguiente paso.
   * - Si la acción no es 'cont', retrocede al paso anterior.
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

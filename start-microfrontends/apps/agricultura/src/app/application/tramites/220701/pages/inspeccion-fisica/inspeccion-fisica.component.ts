/**
 * @component ImmexRegistroSolicitudModalityComponent
 * @description Este componente es responsable de manejar el flujo de pasos para el registro de solicitud IMMEX.
 * Incluye la lógica para la navegación entre pasos y la obtención de títulos.
 */
/* eslint-disable @nx/enforce-module-boundaries */

import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { Component } from '@angular/core';
import { DatosPasos } from '@libs/shared/data-access-user/src';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { PASOS } from '@libs/shared/data-access-user/src';

import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src';
/**
 * Interfaz para definir la acción y el valor del botón.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

@Component({
  selector: 'app-inspeccion-fisica',
  standalone: true,
  imports: [WizardComponent, PasoUnoComponent, PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,],
  templateUrl: './inspeccion-fisica.component.html',
})
export class InspeccionFisicaComponent {
  /**
    * @description Array de objetos que definen los pasos del formulario.
    * Cada objeto contiene información sobre un paso específico,
    * incluyendo su número, título y si está completado.
    * @type {ListaPasosWizard[]}
    */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @description Referencia al componente Wizard.
   * Esta referencia permite acceder a los métodos y propiedades del componente Wizard,
   * como `siguiente()` y `atras()`, para controlar la navegación entre los pasos.
   * @type {WizardComponent}
   * @viewChild WizardComponent
   */
  @ViewChild(WizardComponent) componenteWizard!: WizardComponent;

  /**
   * @description Índice actual del paso en el que se encuentra el usuario.
   * Este índice se utiliza para determinar qué paso se muestra en cada momento.
   * @type {number}
   * @default 1
   */
  indice: number = 1;

  /**
   * @description Objeto que contiene los datos de los pasos del formulario.
   * Este objeto se utiliza para comunicar información entre el componente Agricultura
   * y el componente Wizard, como el número de pasos, el índice actual y los textos
   * para los botones de navegación.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Guardar',
    txtBtnSig: 'Continuar',
  };

  /**
   * @description Maneja la acción del botón y determina la navegación (siguiente o anterior).
   * Este método se llama cuando el usuario hace clic en uno de los botones de navegación.
   * Recibe un objeto `AccionBoton` que contiene la acción a realizar (`cont` o `atras`)
   * y el valor del índice del paso al que se debe navegar.
   * @param {AccionBoton} e - Objeto de acción que contiene la acción y el valor a manejar.
   * El `valor` representa el índice del paso al que ir.
   * La `accion` determina si avanzar (`cont`) o retroceder (`atras`).
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      // Calcular el nuevo índice basado en la acción
      let indiceActualizado = e.valor;
      if (e.accion === 'cont') {
        indiceActualizado = e.valor + 1;
      } else if (e.accion === 'ant') {
        indiceActualizado = e.valor - 1;
      }

      // Validar rango del índice
      if (indiceActualizado > 0 && indiceActualizado <= this.pasos.length) {
        this.indice = indiceActualizado;
        this.datosPasos.indice = this.indice;
        
        if (e.accion === 'cont') {
          this.componenteWizard.siguiente();
        } else {
          this.componenteWizard.atras();
        }
      }
    }
  }
}
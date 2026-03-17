import {
  BtnContinuarComponent,
  DatosPasos,
  ListaPasosWizard,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/paso-tres-steps.enum';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud31101Store } from '../../estados/solicitud31101.store';

/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

@Component({
  templateUrl: './solicitud-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    WizardComponent,
    BtnContinuarComponent,
  ],
  styles: ``,
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnDestroy {
  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @description Constructor del componente.
   * Inicializa la inyección de dependencias necesarias para manejar el estado de `Solicitud31101Store`.
   *
   * @param {Solicitud31101Store} solicitud31101Store - Servicio de la tienda encargado de gestionar y mantener el estado de la solicitud 31101.
   */
  constructor(public solicitud31101Store: Solicitud31101Store) {}

  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
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

  /**
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se encarga de reiniciar el estado de la tienda `solicitud31101Store` para liberar memoria
   * y evitar inconsistencias en los datos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.solicitud31101Store.resetStore();
  }
}

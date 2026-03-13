import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '../../models/pantallas-captura.model';
import { PASOS } from '@ng-mf/data-access-user';
import { SECCIONES_TRAMITE_220402 } from '@ng-mf/data-access-user';
import { SeccionQuery } from '../../../../estados/queries/seccion.query';
import { SeccionState } from '../../../../estados/seccion.store';
import { SeccionStore } from '../../../../estados/seccion.store';
import { Subject } from 'rxjs';
import { WizardComponent } from '@ng-mf/data-access-user';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 *
 * Interfaz que define la estructura de un objeto de acción de botón.
 */
interface AccionBoton {
  /**
   * @property {string} accion - El accion del paso.
   */
  accion: string;
  /**
   * @property {number} valor - El valor del paso en el asistente.
   */
  valor: number;
}

/**
 * Componente para la vista de la solicitud-page de la sección de "220402".
 */

@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})

/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnInit{

  /**
   * @property {ListaPasosWizard[]} pasos - Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice - Índice actual del paso.
   */
  indice: number = 1;

  /**
   * @property {SeccionState} seccion - Estado de la sección actual.
   */
  public seccion: SeccionState = {
    seccion: [],
    formaValida: []
  };

  private destroyNotifier$: Subject<void> = new Subject();

  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {number} nroPasos - Número total de pasos.
   * @property {number} indice - Índice actual del paso.
   * @property {string} txtBtnAnt - Texto del botón para ir al paso anterior.
   * @property {string} txtBtnSig - Texto del botón para ir al siguiente paso.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @ignore
   * @private
   * @property {Subject<void>} destroyNotifier$ - Un `Subject` utilizado para notificar la destrucción del componente.
   */
  /**
   * @description Constructor del componente. Inyecta las dependencias necesarias.
   * @param {SeccionQuery} seccionQuery - Servicio para consultar el estado de la sección.
   * @param {SeccionStore} seccionStore - Servicio para manejar el estado de la sección.
   */
  constructor(
    private seccionQuery: SeccionQuery,
    private seccionStore: SeccionStore
  ) {
    // no hacer nada
  }

  /**
   * @ignore
   * @description Método que se ejecuta al inicializar el componente.
   * Suscribe al estado de la sección y asigna las secciones.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

    this.asignarSecciones();
  }

  /**
   * @description Método para seleccionar una pestaña específica.
   * @param {number} i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Actualiza el índice basado en el valor de la acción proporcionada y navega en el componente wizard.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor y la acción del botón.
   * @param {number} e.valor - Valor del índice que debe estar entre 1 y 4.
   * @param {string} e.accion - Acción a realizar, puede ser 'cont' para avanzar o cualquier otro valor para retroceder.
   *
   * @returns {void}
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
   * Método para asignar las secciones existentes al stored
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = Object.values(SECCIONES_TRAMITE_220402.PASO_1);
    const FORM_VALIDA: boolean[] = [];
    for (const LLAVE_SECCIONE in SECCIONES_TRAMITE_220402.PASO_1) {
      if(LLAVE_SECCIONE) {
        FORM_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORM_VALIDA);
  }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatosPasos,
  ListaPasosWizard,
  PASOS,
  WizardComponent
} from '@ng-mf/data-access-user';
import { Subject, map,takeUntil} from 'rxjs';
import { Tramite11101Query } from '../../estados/tramite11101.query';
import { Tramite11101Store } from '../../estados/tramite11101.store';

/**
 * Interfaz que define la estructura de un botón de acción en el asistente.
 */
interface AccionBoton {
  /**
   * Acción que se debe realizar (por ejemplo, "cont" para continuar o "atras" para retroceder).
   */
  accion: string;

  /**
   * Valor asociado al botón, que indica el índice del paso al que se debe mover el asistente.
   */
  valor: number;
}
/**
 * Componente para gestionar la página del solicitante en el trámite.
 * Este componente utiliza un asistente (wizard) para navegar entre los pasos del trámite.
 */
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos del asistente (wizard) que se mostrarán en la página.
   * @type {Array<ListaPasosWizard>}
   */
  pasos: Array<ListaPasosWizard> = PASOS.slice(0, 4);

  /**
   * Índice actual del paso seleccionado en el asistente.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Estado actual de las secciones del formulario, gestionado por el store.
   * @type {unknown}
   */
  seccion: unknown;

  /**
   * Notificador para gestionar la destrucción de suscripciones activas.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente del asistente (wizard) en la vista.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos relacionados con los pasos del asistente, como el número total de pasos y los textos de los botones.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * @param {Tramite11101Query} tramite11101Query - Consulta para obtener datos del estado del trámite.
   * @param {Tramite11101Store} tramite11101Store - Almacén para gestionar el estado del trámite.
   */
  constructor(
    private tramite11101Query: Tramite11101Query,
    private tramite11101Store: Tramite11101Store
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura los pasos del asistente y asigna las secciones al store.
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite11101Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas para evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Cambia el índice actual del asistente al valor proporcionado.
   * @param {number} i - Índice del paso seleccionado.
   * @returns {void}
   */
  seleccionadosTodos(i: number): void {
    this.indice = i;
  }

  /**
   * Cambia el índice actual del asistente según la acción realizada (continuar o retroceder).
   * 
   * Este método utiliza el componente del asistente (wizard) para avanzar o retroceder entre los pasos.
   * 
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del índice.
   * @returns {void}
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 6) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
}
/**
 * @fileoverview
 * Este archivo define el componente `DesistimientoPageComponent`, que gestiona la lógica y la interfaz
 * de la página de desistimiento en el trámite 220404. Proporciona un asistente (wizard) para navegar
 * entre los pasos del proceso de desistimiento.
 * 
 * @module DesistimientoPageComponent
 * @description
 * Este archivo contiene la implementación del componente `DesistimientoPageComponent`, que incluye
 * la configuración de los pasos, la navegación entre ellos y la interacción con el estado de las secciones.
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, ListaPasosWizard, SeccionLibQuery, SeccionLibState, SeccionLibStore, WizardComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DESISTIMIENTO_PASOS } from '../../enum/desistimiento.enum';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

/**
 * @description
 * Interfaz que representa una acción de un botón en el asistente (wizard).
 */
interface AccionBoton {
  /**
   * Acción del botón (e.g., 'cont' para continuar, 'ant' para retroceder).
   */
  accion: string;

  /**
   * Valor asociado a la acción (e.g., índice del paso al que se debe navegar).
   */
  valor: number;
}

/**
 * @class DesistimientoPageComponent
 * @description
 * Componente que gestiona la página de desistimiento del trámite 220404.
 * Proporciona un asistente (wizard) para navegar entre los pasos del proceso.
 */
@Component({
  templateUrl: './desistimiento-page.component.html',
  styles: ``,
})
export class DesistimientoPageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos para el asistente de desistimiento.
   * Se inicializa con los pasos definidos en la constante `DESISTIMIENTO_PASOS`.
   */
  pasos: ListaPasosWizard[] = DESISTIMIENTO_PASOS;

  /**
   * Índice del paso activo en el asistente.
   * Se inicializa con el valor 1 (primer paso).
   */
  indice: number = 1;

  /**
   * Objeto que almacena los datos del asistente (wizard).
   * Incluye el número total de pasos, el índice actual,
   * y los textos para los botones de navegación (anterior y continuar).
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Objeto que representa la acción y el valor asociado del botón.
   * Se utilizará para gestionar las acciones del asistente.
   */
  accionBoton!: AccionBoton;

  /**
   * Estado de las secciones obtenidas del store.
   * Incluye información sobre las secciones visibles y su estado de validación.
   */
  public seccion!: SeccionLibState;

  /**
   * Subject para controlar las suscripciones y evitar fugas de memoria.
   * Se utiliza para cancelar todas las suscripciones al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente de asistente (wizard).
   * Se utiliza para acceder a los métodos y propiedades del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente del primer paso del asistente.
   * Se utiliza para interactuar directamente con el contenido y la lógica del paso uno.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  /**
   * Constructor del componente.
   * Inyecta los servicios necesarios para gestionar el estado de las secciones.
   * 
   * @param {SeccionLibQuery} seccionQuery - Servicio para consultar el estado de las secciones.
   * @param {SeccionLibStore} seccionStore - Servicio para gestionar el estado de las secciones.
   */
  constructor(
    public seccionQuery: SeccionLibQuery,
    public seccionStore: SeccionLibStore
  ) {
    /** El constructor está intencionalmente vacío para la inyección de dependencias */
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Este método se utiliza para suscribirse al estado de las secciones y asignarlas al componente.
   */
  ngOnInit(): void {
    /** Suscribe a los cambios en el estado de las secciones desde el store. */
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Cambia la pestaña activa al índice proporcionado.
   * 
   * @param {number} i - Índice de la pestaña a activar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Actualiza el índice en base al valor y ejecuta acciones de navegación.
   * 
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor asociado.
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
   * Método que se ejecuta cuando se destruye el componente.
   * Libera los recursos y notifica a todos los observadores.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
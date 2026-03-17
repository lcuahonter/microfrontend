import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../components/datos-mercancia/datos-mercancia.component';
import { DatosMercanciaService } from '../../services/datos-mercancia/datos-mercancia.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

/**
 * @fileoverview
 * Componente que representa la primera sección de un formulario paso a paso.
 * Este componente se encarga de gestionar el estado y la navegación entre las pestañas del formulario,
 * así como la obtención y actualización de los datos de mercancía.
 *
 * Cobertura compodoc 100%: cada método, propiedad y constructor está documentado.
 *
 * @module PasoUnoComponent
 */

/**
 * Componente que representa la primera sección de un formulario paso a paso.
 * Este componente se encarga de gestionar el estado y la navegación entre las pestañas del formulario.
 *
 * @component PasoUnoComponent
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 * @styleUrls ./paso-uno.component.scss
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SolicitanteComponent,
    DatosMercanciaComponent,
    CommonModule,
  ],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Subject para notificar la destrucción del componente y desuscribir observables.
   * @private
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Indica si se recibieron datos de respuesta del servidor para actualizar el formulario.
   * @property {boolean} esDatosRespuesta
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Índice de la pestaña seleccionada.
   * Este índice indica cuál pestaña está actualmente seleccionada en el formulario.
   *
   * @property {number} indice
   * @default 1
   */
  indice: number = 1;

  /**
   * Lista de las secciones del formulario, cada sección tiene su índice, título y componente asociado.
   * Esta lista define el flujo y los pasos del formulario.
   *
   * @property {Array<{ index: number; title: string; component: string; }>} seccionesDeLaSolicitud
   * - Lista de objetos que representan cada sección del formulario.
   * - Cada objeto contiene:
   *    - `index`: El índice de la sección.
   *    - `title`: El título de la sección.
   *    - `component`: El componente que se muestra en esa sección.
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    {
      index: 2,
      title: 'Datos de la solicitud',
      component: 'datos-de-la-solicitud',
    },
  ];

  /**
   * Estado de la consulta actual.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * Inyecta el servicio DatosMercanciaService para obtener los datos de mercancía
   * y el servicio ConsultaioQuery para consultar el estado de la sección.
   *
   * @param {DatosMercanciaService} datosMercanciaService Servicio encargado de obtener los datos de mercancía desde una fuente externa.
   * @param {ConsultaioQuery} consultaQuery Servicio para consultar el estado de la sección.
   */
  constructor(
    private readonly datosMercanciaService: DatosMercanciaService,
    private readonly consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable de estado de la sección y decide si debe guardar los datos del formulario
   * o marcar que ya existen datos de respuesta.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;
        if (seccionState.update) {
          this.guardarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
      });

    this.seccionesDeLaSolicitud = this.seccionesDeLaSolicitud.map((tab) => {
      if (tab.index === 2) {
        tab.title =
          this.consultaState.parameter === 'READ_PROCEDURE'
            ? 'Datos generales'
            : 'Datos de la solicitud';
      }
      return tab;
    });
  }

  /**
   * Guarda los datos del formulario de mercancía obteniéndolos del servicio correspondiente.
   * Este método suscribe al observable que retorna los datos de mercancía, y si la respuesta es válida,
   * actualiza el formulario de movilización con los datos obtenidos. Además, controla la suscripción
   * utilizando el observable `destroyNotifier$` para evitar fugas de memoria.
   *
   * @method guardarDatosFormulario
   * @returns {void}
   * @step Paso 1: Llama al servicio para obtener los datos de mercancía.
   * @step Paso 2: Si la respuesta es válida, actualiza el formulario de movilización.
   * @step Paso 3: Controla la suscripción para evitar fugas de memoria.
   */
  guardarDatosFormulario(): void {
    this.datosMercanciaService
      .obtenerDatosMercancia()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        if (data) {
          this.esDatosRespuesta = true;
          this.datosMercanciaService.actualizarFormularioMovilizacion(
            data?.datos
          );
        }
      });
  }

  /**
   * Método que cambia el índice de la pestaña seleccionada en función del valor recibido.
   * Este método se utiliza para navegar entre las diferentes pestañas del formulario.
   *
   * @method seleccionaTab
   * @param {number} i - El índice de la pestaña que se desea seleccionar.
   * @returns {void} No retorna nada. Solo actualiza el valor del índice de la pestaña.
   * @step Paso 1: Recibe el índice de la pestaña a seleccionar.
   * @step Paso 2: Actualiza la propiedad `indice` con el nuevo valor.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   * Se utiliza para emitir una notificación y completar el observable `destroyNotifier$`,
   * permitiendo limpiar suscripciones y evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   * @step Paso 1: Emite una notificación a los observadores.
   * @step Paso 2: Completa el observable para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
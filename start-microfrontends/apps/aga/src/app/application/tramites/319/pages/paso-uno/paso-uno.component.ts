import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OperacionService } from '../../services/operacion.service';
import { OperacionesDeComercioExterioComponent } from '../../components/operaciones-de-comercio-exterior/operaciones-de-comercio-exterior.component';
import { Tramite319Store } from '../../estados/tramite319Store.store';
import { Solicitar } from '../../models/personas';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OperacionesDeComercioExterioComponent,
    SolicitanteComponent,
  ],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice de la pestaña seleccionada.
   * Este índice indica cuál pestaña está actualmente seleccionada en el formulario.
   *
   * @property {number} indice - El índice de la pestaña seleccionada.
   * @default 1
   */
  indice: number = 1;
  /**
   * @property destroyNotifier$
   * @private
   * @description
   * Sujeto utilizado para cancelar suscripciones activas y prevenir fugas de memoria.
   * Generalmente se utiliza con el operador `takeUntil` en observables dentro del ciclo de vida del componente.
   *
   * @example
   * this.observable$.pipe(takeUntil(this.destroyNotifier$)).subscribe(...);
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * @property esDatosRespuesta
   * @public
   * @description
   * Bandera booleana que indica si existen datos disponibles como respuesta de una consulta.
   * Se puede usar para mostrar u ocultar secciones del template dependiendo del resultado.
   *
   * @example
   * *ngIf="esDatosRespuesta"
   */
  public esDatosRespuesta: boolean = false;

  /**
   * @property consultaState
   * @public
   * @description
   * Estado actual de la consulta relacionado con el trámite.
   */
  consultaState!: ConsultaioState

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
      title: 'Operaciones de Comercio Exterior',
      component: 'app-operaciones-de-comercio-exterior',
    },
  ];
  /**
   * @constructor
   * @param consultaQuery - Servicio para consultar información relacionada con el trámite.
   * @param operacionService - Servicio encargado de gestionar las operaciones del trámite.
   *
   * @description
   * Constructor de la clase. Inicializa los servicios necesarios para la gestión y consulta de información en el paso uno del trámite.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private readonly operacionService: OperacionService,
    private readonly tramite319Store: Tramite319Store
  ) { }
  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable del estado de consulta y actualiza la propiedad local `consultaState`.
   * Si el estado indica que se debe actualizar, guarda los datos del formulario;
   * de lo contrario, establece la bandera `esDatosRespuesta` en verdadero.
   *
   * @memberof PasoUnoComponent
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
  }

  @ViewChild('operaciones')
  operacionesDeComercioExteriorComponent!: OperacionesDeComercioExterioComponent;


  /**
   * valida el formulario de operaciones de comercio exterior.
   *
   * @method esFormValido
   * @returns valido - verdadero si el formulario es válido, falso en caso contrario.
   */
  esFormValido(): boolean {
    const ES_VALIDO =
      this.operacionesDeComercioExteriorComponent?.esFormularioValido();
    if (!ES_VALIDO) {
      this.operacionesDeComercioExteriorComponent.miformulario.markAllAsTouched();
    }
    return ES_VALIDO;
  }

  /**
   * revisa si la tabla de operaciones de comercio exterior es válida.
   *
   * @method esTablaValida
   * @returns verdadero si la tabla es válida, falso en caso contrario.
   */
  esTablaValida(): boolean {
    if (this.operacionesDeComercioExteriorComponent) {
      const ES_VALIDO =
        this.operacionesDeComercioExteriorComponent?.esTablaValida();
      return ES_VALIDO;
    }
    return false;
  }

  /**
   * Método que cambia el índice de la pestaña seleccionada en función del valor recibido.
   * Este método se utiliza para navegar entre las diferentes pestañas del formulario.
   *
   * @method seleccionaTab
   * @param {number} i - El índice de la pestaña que se desea seleccionar.
   *
   * @returns {void} No retorna nada. Solo actualiza el valor del índice de la pestaña.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente o servicio es destruido.
   *
   * Se utiliza para limpiar suscripciones y liberar recursos, evitando fugas de memoria.
   * Emite un valor en `destroyNotifier$` y luego completa el observable, lo cual se usa comúnmente
   * con el operador `takeUntil` para cancelar suscripciones activas.
   *
   * @example
   * this.miObservable$
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe(...);
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

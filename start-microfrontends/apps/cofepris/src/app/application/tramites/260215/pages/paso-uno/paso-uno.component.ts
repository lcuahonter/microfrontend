
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,

} from '@angular/core';

import {
  ConsultaioQuery,
  ConsultaioState,
  RegistroSolicitudService
} from '@ng-mf/data-access-user';
import {
  Subject,
  map,
  takeUntil
} from 'rxjs';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { GuardarAdapter_260215 } from '../../adapters/ampliacion-servicios.adapter';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260215Query } from '../../estados/queries/tramite260215.query';
import { Solicitud260215State, Tramite260215Store } from '../../estados/tramites/tramite260215.store';
import { ID_PROCEDIMIENTO } from '../../models/permiso-sanitario.model';


@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.css',
})
export class PasoUnoComponent implements OnDestroy, OnInit, OnChanges {
  /**
     * The index of the currently selected tab.
     * 
     * @type {number | undefined}
     * @default 1
     */
  indice: number | undefined = 1;

  /**
   * A `Subject` used as a notifier to signal the destruction of the component.
   * This is typically used to unsubscribe from observables to prevent memory leaks.
   * 
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
    * @property {ContenedorDeDatosSolicitudComponent} contenedorDeDatosSolicitudComponent
    * @description
    * Referencia al componente hijo `ContenedorDeDatosSolicitudComponent` obtenida
    * mediante el decorador `@ViewChild`.
    */

  @ViewChild(ContenedorDeDatosSolicitudComponent)
  contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;

  /**
   * @property {PagoDeDerechosContenedoraComponent} pagoDeDerechosContenedoraComponent
   * @description
   * Referencia al componente hijo `PagoDeDerechosContenedoraComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */

  @ViewChild(PagoDeDerechosContenedoraComponent)
  pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  /**
   * @property {TercerosRelacionadosVistaComponent} tercerosRelacionadosVistaComponent
   * @description
   * Referencia al componente hijo `TercerosRelacionadosVistaComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild(TercerosRelacionadosVistaComponent)
  tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
    * Identificador del procedimiento actual.
    *
    * Se inicializa con la constante global `ID_PROCEDIMIENTO`.
    * Esta propiedad se utiliza para determinar el flujo o tipo de trámite
    * que se debe ejecutar en el sistema.
    */
  idProcedimiento: number = ID_PROCEDIMIENTO;
  /**
    * Indica si el formulario está deshabilitado.
    */
  formularioDeshabilitado: boolean = false;
  /**
   * Constructor que inyecta las dependencias necesarias para el manejo del estado del trámite.
   * @constructor
   * @param {Tramite260215Query} tramite260215Query - Query para acceder al estado del trámite
   * @param {Tramite260215Store} tramite260215Store - Store para actualizar el estado del trámite
   * @param {ConsultaioQuery} consultaQuery - Query para acceder al estado de la consulta
   */
  constructor(
    private tramite260215Query: Tramite260215Query,
    private tramite260215Store: Tramite260215Store,
    private consultaQuery: ConsultaioQuery,
    private registroSolicitudService: RegistroSolicitudService,
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.formularioDeshabilitado = seccionState.readonly;
        })
      )
      .subscribe();
  }


  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Subscribes to the `getTabSeleccionado$` observable from the `tramite260215Query` service to track the selected tab index.
   * The subscription is automatically unsubscribed when the component is destroyed to prevent memory leaks.
   *
   * @remarks
   * - The `takeUntil` operator is used to manage the subscription lifecycle.
   * - Updates the `indice` property with the value of the selected tab.
   */
  ngOnInit(): void {
    if (
      this.consultaState &&
      this.consultaState.procedureId === this.idProcedimiento.toString() &&
      this.consultaState.update
    ) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
    this.tramite260215Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
  }

  /**
    * Método del ciclo de vida OnInit de Angular.
    * Se suscribe a los cambios en la pestaña seleccionada del trámite.
    * @method ngOnInit
    */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }

  /**
  * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
  * Luego reinicializa el formulario con los valores actualizados desde el store.
  */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID = Number(this.consultaState.id_solicitud)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registroSolicitudService.parcheOpcionesPrellenadas(260215, SOLICITUDE_ID).subscribe((res: any) => {
      if (res && res.datos) {
        GuardarAdapter_260215.patchToStore(res.datos, this.tramite260215Store);
        this.esDatosRespuesta = true;
      }
    });
  }

  /**
     * Actualiza el estado del formulario con los datos proporcionados.
     *
     * @param DATOS - Estado de la solicitud `Tramite260216State` con la información
     *                del tipo de solicitud a actualizar en el store.
     */
  actualizarEstadoFormulario(DATOS: Solicitud260215State): void {
    this.tramite260215Store.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }

  /**
   * Updates the currently selected tab in the store.
   *
   * @param i - The index of the tab to select.
   */
  seleccionaTab(i: number): void {
    this.tramite260215Store.updateTabSeleccionado(i);
  }

  /**
   * Valida los datos del paso uno del formulario.
   * @returns {boolean} True si la validación es exitosa, false en caso contrario.
   */
  validarPasoUno(): boolean {
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (
      (ESTABVALIDO && ESTERCEROSVALIDO) ? true : false

    );
  }
  /**
    * Valida todos los pasos del formulario.
    *
    * Invoca los métodos de validación de los componentes hijos:
    * - ContenedorDeDatosSolicitudComponent
    * - TercerosRelacionadosVistaComponent
    * - PagoDeDerechosContenedoraComponent
    *
    * @returns {boolean}
    * - `true` si todos los componentes son válidos.
    * - `false` si alguno no es válido o no está disponible.
    */
  validarTodosLosPasos(): boolean {
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
    const PAGOVALIDO = this.pagoDeDerechosContenedoraComponent?.validarContenedor() ?? false;
    return ESTABVALIDO && ESTERCEROSVALIDO && PAGOVALIDO;
  }
  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

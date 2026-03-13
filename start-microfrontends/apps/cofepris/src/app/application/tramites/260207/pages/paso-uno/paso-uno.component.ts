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
  RegistroSolicitudService,
  SolicitanteComponent
} from '@ng-mf/data-access-user';
import {
  Subject,
  map,
  takeUntil
} from 'rxjs';
import { Tramite260207State, Tramite260207Store } from '../../estados/tramite260207Store.store';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { GuardarAdapter_260207 } from '../../adapters/guardar-payload.adapter';
import { ImportacionDestinadosDonacioService } from '../../services/importacion-destinados-donacio.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260207Query } from '../../estados/tramite260207Query.query';

import { ID_PROCEDIMIENTO } from '../../constants/tratamientos-especiales.enum';



@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent,
    SolicitanteComponent
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.css',
})

export class PasoUnoComponent implements OnDestroy, OnInit, OnChanges {
  @Input() confirmarSinPagoDeDerechos: number = 0;
  /**
   * Represents the current index or step in a process.
   *
   * @remarks
   * This property is used to track the position or progress within a sequence of steps.
   * It can be `undefined` if the index is not set.
   *
   * @defaultValue 1
   */
  indice: number | undefined = 1;

  /**
 * @property {PagoDeDerechosContenedoraComponent} pagoDeDerechosContenedoraComponent
 * @description
 * Referencia al componente hijo `PagoDeDerechosContenedoraComponent` obtenida
 * mediante el decorador `@ViewChild`.
 */

  @ViewChild(PagoDeDerechosContenedoraComponent)
  pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  /**
    * @property {ContenedorDeDatosSolicitudComponent} contenedorDeDatosSolicitudComponent
    * @description
    * Referencia al componente hijo `ContenedorDeDatosSolicitudComponent` obtenida
    * mediante el decorador `@ViewChild`.
    */

  @ViewChild(ContenedorDeDatosSolicitudComponent)
  contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;
  /**
     * @property {TercerosRelacionadosVistaComponent} tercerosRelacionadosVistaComponent
     * @description
     * Referencia al componente hijo `TercerosRelacionadosVistaComponent` obtenida
     * mediante el decorador `@ViewChild`.
     */
  @ViewChild(TercerosRelacionadosVistaComponent)
  tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

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
    * Indica si el formulario está deshabilitado.
    */
  formularioDeshabilitado: boolean = false;
  /**
   * Identificador del procedimiento actual.
   *
   * Se inicializa con la constante global `ID_PROCEDIMIENTO`.
   * Esta propiedad se utiliza para determinar el flujo o tipo de trámite
   * que se debe ejecutar en el sistema.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;
  /**
   * Constructor que inyecta las dependencias necesarias para el manejo del estado del trámite.
   * @constructor
   * @param {Tramite260207Query} tramite260207Query - Query para acceder al estado del trámite
   * @param {Tramite260207Store} tramite260207Store - Store para actualizar el estado del trámite
   * @param {ConsultaioQuery} consultaQuery - Query para acceder al estado de la consulta
   * @param {ImportacionDestinadosDonacioService} importacionDestinadosDonacioService - Servicio para importar datos de donación
   */
  constructor(
    private tramite260207Query: Tramite260207Query,
    private tramite260207Store: Tramite260207Store,
    private consultaQuery: ConsultaioQuery,
    private importacionDestinadosDonacioService: ImportacionDestinadosDonacioService,
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Subscribes to the `getTabSeleccionado$` observable from the `tramite260207Query` service to track the selected tab index.
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
    this.tramite260207Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
  }

  /**
  * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
  * Luego reinicializa el formulario con los valores actualizados desde el store.
  */

 guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.registroSolicitudService.parcheOpcionesPrellenadas(260207,SOLICITUDE_ID).subscribe((res:any) => {
                if(res && res.datos){
                  GuardarAdapter_260207.patchToStore(res.datos, this.tramite260207Store);
                }
              });
              this.esDatosRespuesta = true;
  
    }

  /**
    * Actualiza el estado del formulario con los datos proporcionados.
    *
    * @param DATOS - Estado de la solicitud `Tramite260207State` con la información
    *                del tipo de solicitud a actualizar en el store.
    */
  actualizarEstadoFormulario(DATOS: Tramite260207State): void {
    this.tramite260207Store.update((state) => ({
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
    this.tramite260207Store.updateTabSeleccionado(i);
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

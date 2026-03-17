import { Component, Input,OnChanges, OnDestroy, OnInit,SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite260209State, Tramite260209Store } from '../../estados/tramite260209Store.store';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { GuardarAdapter_260209 } from '../../adapters/guardar-payload.adapter';
import { ID_PROCEDIMIENTO } from '../../constants/destinados-donacio.enum';
import { ImportacionDestinadosDonacioService } from '../../services/importacion-destinados-donacio.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260209Query } from '../../estados/tramite260209Query.query';




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
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnChanges, OnInit {

  @Input() confirmarSinPagoDeDerechos: number = 0;
   /**
     * The index of the currently selected tab.
     * 
     * @type {number | undefined}
     * @default 1
     */
  indice: number | undefined = 1;



  /**
       * @property {ContenedorDeDatosSolicitudComponent} contenedorDeDatosSolicitudComponent
       * @description
       * Referencia al componente hijo `ContenedorDeDatosSolicitudComponent` obtenida
       * mediante el decorador `@ViewChild`.
       *
       * Esta propiedad permite invocar métodos públicos del contenedor y acceder
       * a sus propiedades, por ejemplo para delegar la validación del formulario
       * interno (`validarContenedor()`).
       *
       * > Nota: Angular inicializa esta referencia después de que la vista
       * ha sido cargada, comúnmente en el ciclo de vida `ngAfterViewInit`.
       */
  @ViewChild(ContenedorDeDatosSolicitudComponent)
  contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;

  @ViewChild(PagoDeDerechosContenedoraComponent)
  pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  @ViewChild(TercerosRelacionadosVistaComponent)
  tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

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
   * Subject utilizado para manejar la desuscripción de observables
   * cuando el componente es destruido.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;




  /**
   * Constructor que inyecta las dependencias necesarias para el manejo del estado del trámite.
   * @constructor
   * @param {Tramite260209Query} tramite260209Query - Query para acceder al estado del trámite
   * @param {Tramite260209Store} tramite260209Store - Store para actualizar el estado del trámite
   * @param {ConsultaioQuery} consultaQuery - Query para acceder al estado de la consulta
   * @param {ImportacionDestinadosDonacioService} importacionDestinadosDonacioService - Servicio para importar datos de donación
   */
  constructor(
    private tramite260209Query: Tramite260209Query,
    private tramite260209Store: Tramite260209Store,
    private consultaQuery: ConsultaioQuery,
    private registroSolicitudService: RegistroSolicitudService,
    private importacionDestinadosDonacioService: ImportacionDestinadosDonacioService,
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
    this.tramite260209Query.getTabSeleccionado$
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
     const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   this.registroSolicitudService.parcheOpcionesPrellenadas(260209,SOLICITUDE_ID).subscribe((res:any) => {
                     if(res && res.datos){
                       GuardarAdapter_260209.patchToStore(res.datos, this.tramite260209Store);
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
    actualizarEstadoFormulario(DATOS: Tramite260209State): void {
      this.tramite260209Store.update((state) => ({
        ...state,
        ...DATOS,
      }));
    }

   /**
   * Actualiza la pestaña seleccionada en el store del trámite.
   * @method seleccionaTab
   * @param {number} i - Índice de la nueva pestaña a seleccionar
   */
  seleccionaTab(i: number): void {
    this.tramite260209Store.updateTabSeleccionado(i);
  }

  
  /**
 * @description
 * Método que se encarga de validar el primer paso del flujo.
 *
 * Invoca al método `validarContenedor()` del componente hijo
 * `ContenedorDeDatosSolicitudComponent` para comprobar si los
 * datos del formulario son correctos.
 *
 * En caso de que el componente hijo no esté disponible o
 * retorne `null/undefined`, se devuelve `false` por defecto.
 *
 * @returns {boolean}
 * - `true`: si el contenedor y su formulario interno son válidos.
 * - `false`: si el contenedor no es válido o no está disponible.
 */
  validarPasoUno(): boolean {
     const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
  const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
      return (
        (ESTABVALIDO && ESTERCEROSVALIDO)? true : false
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
   * Método del ciclo de vida OnDestroy de Angular.
   * Limpia las suscripciones activas emitiendo un valor al destroyNotifier$
   * y completando el subject.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

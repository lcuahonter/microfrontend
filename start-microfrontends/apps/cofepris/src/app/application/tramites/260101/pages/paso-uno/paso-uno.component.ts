import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Tramite260101State, Tramite260101Store } from '../../estados/tramite260101Store.store';
import { CommonModule } from '@angular/common'
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { ImportacionProductosService } from '../../services/importacion-productos.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';

/**
 * @component PasoUnoComponent
 * @description Componente que representa el primer paso del flujo del trámite.
 * Gestiona la selección de pestañas y la interacción con el estado del trámite a través del store y las consultas.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.css',
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * @property {number | undefined} indice
   * @description Índice de la pestaña seleccionada actualmente.
   */
  indice: number | undefined = 1;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Observable utilizado para notificar y cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  
  /**
   * Subject utilizado para notificar la destrucción del componente y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  public formularioDeshabilitado: boolean = false;
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
  /**
   * Initializes the PasoUnoComponent.
   *
   * @param tramite260101Query - Service for querying tramite260101 state.
   * @param tramite260101Store - Store for managing tramite260101 state.
   * @param consultaQuery - Service for querying consultaio state.
   * @param http - Angular HttpClient for making HTTP requests.
   *
   * Subscribes to the `selectConsultaioState$` observable to update the local `consultaState`
   * and `formularioDeshabilitado` properties based on the latest state. The subscription is
   * automatically unsubscribed when `destroyNotifier$` emits to prevent memory leaks.
   */
  constructor(
    private tramite260101Query: Tramite260101Query,
    private tramite260101Store: Tramite260101Store,
    private consultaQuery: ConsultaioQuery,
    private importacionProductosService: ImportacionProductosService
  ) {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
        this.formularioDeshabilitado = seccionState.readonly;
      })).subscribe();
  }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la pestaña seleccionada y actualiza el índice.
   */
  ngOnInit(): void {
    if (this.consultaState && this.consultaState.procedureId === '260101' &&
      this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
    this.tramite260101Query.getTabSeleccionado$
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
    this.getRegistroTomaMuestrasMercanciasData().pipe(
      takeUntil(this.destroyNotifier$)).subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
 * Actualiza el estado del formulario con los datos proporcionados.
 * 
 * @param DATOS - Estado de la solicitud `Tramite260101State` con la información 
 *                del tipo de solicitud a actualizar en el store.
 */
  actualizarEstadoFormulario(DATOS: Tramite260101State): void {
    this.tramite260101Store.update((state) => ({
      ...state,
      ...DATOS
    }))

  }

  /**
  * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
  * 
  * @returns Observable con los datos del estado de la solicitud `Solicitud260101State`,
  *          cargados desde el archivo JSON especificado en la ruta de `assets`.
  */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260101State> {
    return this.importacionProductosService.getRegistroTomaMuestrasMercanciasData();
  }

  /**
   * @method seleccionaTab
   * @description Actualiza el índice de la pestaña seleccionada en el store del trámite.
   *
   * @param {number} i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.tramite260101Store.updateTabSeleccionado(i);
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
    return (
      this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false
    );
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

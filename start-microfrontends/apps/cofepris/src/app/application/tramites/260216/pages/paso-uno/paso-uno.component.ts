import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  RegistroSolicitudService,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import {
  Tramite260216State,
  Tramite260216Store,
} from '../../estados/tramite260216Store.store';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { GuardarAdapter_260216 } from '../../adapters/guardar-payload.adapter';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { ImportacionDispositivosMedicosDonacionService } from '../../services/importacion-dispositivos-medicos-donacion.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260216Query } from '../../estados/tramite260216Query.query';

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
export class PasoUnoComponent implements OnDestroy, OnInit, OnChanges {

    @Input() confirmarSinPagoDeDerechos: number = 0;

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
     
      @ViewChild(PagoDeDerechosContenedoraComponent)
      pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;
  
      @ViewChild(TercerosRelacionadosVistaComponent)
      tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;
  
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
   * Subject used to notify and complete all active subscriptions when the component is destroyed.
   * This helps prevent memory leaks by unsubscribing from observables in the `ngOnDestroy` lifecycle hook.
   *
   * @private
   * @remarks
   * Emit a value and complete this subject in `ngOnDestroy` to clean up subscriptions.
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
   * Identificador del procedimiento actual.
   *
   * Se inicializa con la constante global `ID_PROCEDIMIENTO`.
   * Esta propiedad se utiliza para determinar el flujo o tipo de trámite
   * que se debe ejecutar en el sistema.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

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
   * Initializes the PasoUnoComponent with required services and sets up a subscription
   * to the consultaQuery's state observable. Updates the local consultaState and
   * formularioDeshabilitado properties based on the emitted state.
   *
   * @param tramite260216Query - Service for querying tramite260216 state.
   * @param tramite260216Store - Store for managing tramite260216 state.
   * @param consultaQuery - Service for querying consultaio state.
   * @param http - Angular HttpClient for making HTTP requests.
   */
  constructor(
    private tramite260216Query: Tramite260216Query,
    private tramite260216Store: Tramite260216Store,
    private consultaQuery: ConsultaioQuery,
    private importacionDispositivosMedicosDonacionService: ImportacionDispositivosMedicosDonacionService,
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
   * @inheritdoc
   *
   * Inicializa el componente verificando el estado de la consulta.
   *
   * - Si `consultaState` existe, el `procedureId` coincide con el `idProcedimiento`
   *   y la bandera `update` está activa, se ejecuta el método `guardarDatosFormulario()`
   *   para almacenar la información del formulario.
   * - En caso contrario, se marca la variable `esDatosRespuesta` en `true`.
   *
   * Además, se suscribe al observable `getTabSeleccionado$` del query `tramite260216Query`
   * para actualizar el índice (`indice`) del tab seleccionado, gestionando la
   * desuscripción con `destroyNotifier$` al destruirse el componente.
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
    this.tramite260216Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
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
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
              this.registroSolicitudService.parcheOpcionesPrellenadas(260216,SOLICITUDE_ID).subscribe((res:any) => {
                if(res && res.datos){
                  GuardarAdapter_260216.patchToStore(res.datos, this.tramite260216Store);
                }
              });
              this.esDatosRespuesta = true;
  
    }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param DATOS - Estado de la solicitud `Tramite260216State` con la información
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Tramite260216State): void {
    this.tramite260216Store.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   *
   * @returns Observable con los datos del estado de la solicitud `Solicitud230401State`,
   *          cargados desde el archivo JSON especificado en la ruta de `assets`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260216State> {
    return this.importacionDispositivosMedicosDonacionService.getRegistroTomaMuestrasMercanciasData();
  }

  /**
   * Selects a tab by its index and updates the selected tab in the tramite260216Store.
   *
   * @param i - The index of the tab to select.
   */
  seleccionaTab(i: number): void {
    this.tramite260216Store.updateTabSeleccionado(i);
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

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { GuardarAdapter_260918 } from '../../adapters/guardar-payload.adapter';
import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { ModificacionPermisoLabService } from '../../services/modificacion-permiso-lab.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260918Store } from '../../estados/tramite260918.store';
import { TramitesAsociadosSeccionComponent } from '../../../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';



/**
 * Componente que representa el paso uno del formulario.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent,
    SolicitanteComponent,
    DatosDelSolicitudModificacionComponent,
    ManifiestosComponent,
    RepresentanteLegalComponent,
    TramitesAsociadosSeccionComponent
  ],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnChanges {
  /**
  * showPreFillingOptions
  * Indica si se deben mostrar las opciones de prellenado.
  */
  showPreFillingOptions: boolean = false;

  /**
   * Indica si se debe confirmar la acción sin pago de derechos.
   * Valor predeterminado: 0.
   * @input confirmarSinPagoDeDerechos Número que representa el estado de confirmación sin pago de derechos.
   */
  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
   * Identificador único del procedimiento.
   * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
   */
  public readonly idProcedimiento = 260918;

  /**
   * Holds the current radio value for tipoTramite, used for child component binding.
   */
  public tipoTramite: string = '';

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
  /**
     * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
     */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
  @ViewChild('DatosDelSolicitudModificacion') datosSolicitudComponent!: DatosDelSolicitudModificacionComponent;
  @ViewChild(ManifiestosComponent) manifiestosComponent!: ManifiestosComponent;
  @ViewChild(RepresentanteLegalComponent) representanteLegalComponent!: RepresentanteLegalComponent;

  /**
    * @ViewChild(TercerosRelacionadosVistaComponent)
    * Referencia al componente hijo `TercerosRelacionadosVistaComponent` obtenida
    * mediante el decorador `@ViewChild`.
    */
  @ViewChild(TercerosRelacionadosVistaComponent)
  tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

  /**
    * @ViewChild(PagoDeDerechosContenedoraComponent)
    * Referencia al componente hijo `PagoDeDerechosContenedoraComponent` obtenida
    * mediante el decorador `@ViewChild`.
    */
  @ViewChild(PagoDeDerechosContenedoraComponent)
  pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  /**
  * Indica si se están mostrando los datos de respuesta.
  */
  public esDatosRespuesta: boolean = false;

  /**
      * The index of the currently selected tab.
      * 
      * @type {number}
      * @default 1
      */
  indice: number = 1;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado actual de la consulta obtenido del store. */
  public consultaState!: ConsultaioState;


  /**
   * Método para seleccionar una pestaña específica.
   *
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param modificacionPermisoLabService Servicio para manejar la modificación del permiso de laboratorio.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private modificacionPermisoLabService: ModificacionPermisoLabService,
    private tramiteStore: Tramite260918Store,
    public registroSolicitudService: RegistroSolicitudService,
    private datosDelSolicitudStore: DatosDelSolicituteSeccionStateStore,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioStore: DomicilioStore,
  ) {

  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la consulta y actualiza la propiedad consultaState.
   * Si el estado indica que hay una actualización, guarda los datos del formulario y de pago de derechos.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState.update) {
          this.guardarDatosFormulario(this.consultaState.id_solicitud, this.consultaState.procedureId);
        } else {
          this.esDatosRespuesta = true;
          this.guardarDatosFormulario('203060807', '260218');
        }
      })
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
         * @method datasolicituActualizar
         * Actualiza el estado del formulario de datos de la solicitud en el store.
         *
         * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
         */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramiteStore.updateDatosSolicitudFormState(event);
  }
  /**
   * Método para guardar los datos iniciales del formulario.
   * Obtiene los datos iniciales del formulario desde el servicio y actualiza el estado del formulario.
   */
  guardarDatosFormulario(ID_SOLICITUD: string, PROCEDURE_ID: string): void {
    this.registroSolicitudService.parcheOpcionesPrellenadas(
      Number(PROCEDURE_ID),
      Number(ID_SOLICITUD)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ).subscribe((res: any) => {
      if (res && res.datos) {
        GuardarAdapter_260918.patchToStore(res.datos, this.tramiteStore);
        GuardarAdapter_260918.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicitudStore);
        GuardarAdapter_260918.patchToStoreManifestos(res.datos, this.manifestoStore);
        GuardarAdapter_260918.patchToStoreDomicilio(res.datos, this.domicilioStore);
      }
    });
  }


  /**
   * Método para guardar los datos del formulario de pago de derechos.
   * Obtiene los valores del formulario de pago de derechos desde el servicio y actualiza el estado correspondiente.
   */
  guardarDatosFormularioPagoDerechos(): void {
    this.modificacionPermisoLabService
      .obtenerValoresFormularioPagoDerechos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.modificacionPermisoLabService.actualizarValoresFormularioPagoDerechos(resp);
        }
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
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    const ESTERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && ESTERCEROS_VALIDO && REPRESENTANTE_LEGAL_VALIDO) ? true : false;
  }

  validarContenedor(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    return (
      DATOS_SOLICITUD_VALIDO &&
      MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO
    ) ? true : false;
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
      const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
      const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
      const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
      const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
      const PAGOVALIDO = this.pagoDeDerechosContenedoraComponent?.validarContenedor() ?? false;
      return (ESTERCEROSVALIDO && PAGOVALIDO && DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO )? true : false;
    }
  
 
}

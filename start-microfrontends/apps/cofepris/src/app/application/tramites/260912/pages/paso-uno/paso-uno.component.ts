import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosSolicitudFormState } from '../../../../shared/components/shared26010/models/datos-solicitud.model';
import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { PagoDeDerechosContenedoraComponent } from '../../component/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';
import { Solocitud260912Service } from '../../services/service260912.service';
import { TercerosRelacionadosVistaComponent } from '../../component/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260912Store } from '../../estados/tramite-260912.store';

/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy, OnChanges {
  /** 
   * Evento que se emite cuando cambia la pestaña activa.
   * Comunica al componente padre el índice de la nueva pestaña seleccionada.
   */
  @Output() tabChanged = new EventEmitter<number>();

  /** Tipo de trámite seleccionado por el usuario */
  public tipoTramite: string = '';
  
  /** Bandera que indica si hay un radio button seleccionado globalmente */
  isRadioButtonSelectedGlobal: boolean = false;

  /** Índice privado de la pestaña actual */
  public indice: number = 1;

  /**
   * Setter para el índice de la subpestaña activa.
   * Emite un evento cuando el valor cambia.
   * @param value - Nuevo índice de la subpestaña
   */
  @Input()
  set subTabIndex(value: number) {
    if (value && value !== this.indice) {
      this.indice = value;
      this.tabChanged.emit(this.indice);
    }
  }

  /**
   * Getter para obtener el índice actual de la subpestaña.
   * @returns El índice de la pestaña activa
   */
  get subTabIndex(): number {
    return this.indice;
  }

  /** Bandera que indica si los datos de respuesta están disponibles */
  esDatosRespuesta: boolean = false;
  
  /** Subject para manejar la destrucción de suscripciones */
  destroyNotifier$: Subject<void> = new Subject<void>();
  
  /** Estado actual de la consulta */
  consultaioState!: ConsultaioState;

  /**
   * @property {DatosDelSolicitudModificacionComponent} datosSolicitudComponent
   * @description
   * Referencia al componente hijo `DatosDelSolicitudModificacionComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('datosdelmodification') datosSolicitudComponent!: DatosDelSolicitudModificacionComponent;
  
  /**
   * @property {ManifiestosComponent} manifiestosComponent
   * @description
   * Referencia al componente hijo `ManifiestosComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('manifestosDeclaraciones') manifiestosComponent!: ManifiestosComponent;
  
  /**
   * @property {RepresentanteLegalComponent} representanteLegalComponent
   * @description
   * Referencia al componente hijo `RepresentanteLegalComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('representeLegal') representanteLegalComponent!: RepresentanteLegalComponent;

  /**
   * @ViewChild(TercerosRelacionadosVistaComponent)
   * Referencia al componente hijo `TercerosRelacionadosVistaComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('tercerosRelacionadosVistaComponent') tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

  /**
   * @ViewChild(PagoDeDerechosContenedoraComponent)
   * Referencia al componente hijo `PagoDeDerechosContenedoraComponent` obtenida
   * mediante el decorador `@ViewChild`.
   */
  @ViewChild('pagoDeDerechosContenedoraComponent') pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  /**
   * @property {number} confirmarSinPagoDeDerechos
   * @description
   * Indica si se ha confirmado la continuación sin pago de derechos.
   */
  @Input() confirmarSinPagoDeDerechos: number = 0;

/**
 * Identificador del procedimiento asociado.
 * Valor por defecto: `260912`.
 */
  idProcedimiento: number = 260912;

/**
 * Identificador del base procedimiento asociado.
 * Valor por defecto: `260212`.
 */
  idBaseProcedimiento: number = 260212;

  /**
   * showPreFillingOptions
   * Indica si se deben mostrar las opciones de prellenado.
   */
  showPreFillingOptions: boolean = true; 

   /**
   * showProgramaImmexFields
   * Indica si se deben mostrar las opciones de prellenado.
   */
  showProgramaImmexFields: boolean = true;

  /**
   * Constructor del componente.
   * @param consultaQuery - Servicio de consulta para obtener el estado
   * @param Solocitud260912Service - Servicio para gestionar la modificación del permiso sanitario
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud260912Service: Solocitud260912Service,
    private tramiteStore: Tramite260912Store,
  ) {}

  /**
   * Hook de inicialización del componente.
   * Configura la suscripción al estado de consulta y carga los datos iniciales.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaioState = seccionState;
        })
      )
      .subscribe();

    if (this.consultaioState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

/**
 * Detecta cambios en la propiedad `confirmarSinPagoDeDerechos` y, cuando su valor es verdadero,
 * ejecuta la selección automática de la pestaña correspondiente.
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
   * @method datasolicituActualizar
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
  */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramiteStore.updateDatosSolicitudFormState(event);
  }

  /**
   * Maneja el cambio de tipo de trámite seleccionado.
   * @param tipo - Nuevo tipo de trámite seleccionado
   */
  onTipoTramiteChange(tipo: string): void {
    this.tipoTramite = tipo;
  }

  /**
   * Maneja el cambio en la selección global de radio buttons.
   * @param selected - Estado de selección del radio button
   */
  onRadioButtonSelectedChange(selected: boolean): void {
    this.isRadioButtonSelectedGlobal = selected;
  }

  /**
   * Guarda los datos del formulario utilizando el servicio de modificación.
   * Se suscribe al servicio para obtener los datos y actualizar el estado del formulario.
   */
  guardarDatosFormulario(): void {
    this.solocitud260912Service
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solocitud260912Service.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Selecciona una pestaña específica y emite el evento de cambio.
   * @param i - Índice de la pestaña a seleccionar
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }

/**
 * Valida el paso uno del flujo verificando la información de solicitud,
 * manifiestos y terceros relacionados antes de continuar.
 */
  validarPasoUno():boolean{
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    const ESTERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && ESTERCEROS_VALIDO) ? true : false;
  }
 
/**
 * Valida el contenedor verificando los datos de la solicitud y los manifiestos
 * para determinar si el formulario cumple con los requisitos mínimos.
 */
  validarContenedor(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    return (
      DATOS_SOLICITUD_VALIDO &&
      MANIFIESTOS_VALIDO
    ) ? true : false;
  }

/**
 * Libera los recursos del componente emitiendo y completando el notifier
 * para cancelar suscripciones activas al destruirse.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
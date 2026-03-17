import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  CONFIGURACION_PERSONAS_COLUMNAS,
  CONFIGURACION_SOLICITAR_COLUMNAS,
  INFO_ALERT,
  OPERACION_HISTORICA,
  TIPO_OPERACION_ENUM,
} from '../../constantes/operaciones-de-comercio-exterior.enum';
import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  Notificacion,
  NotificacionesComponent,
  REGEX_FECHA_MES_ANO,
  SeccionLibStore,
  SharedModule,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

import { ConsultaioQuery, LoginQuery } from '@ng-mf/data-access-user';
import { Personas, Solicitar } from '../../models/personas';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OperacionService } from '../../services/operacion.service';
import { PeriodosComponent } from '../periodos/periodos.component';
import { Tramite319Query } from '../../estados/tramite319Query.query';
import { Tramite319Store } from '../../estados/tramite319Store.store';
import { PeriodoCatalogo } from '../../models/tramite319-state.model';

/**
 * @fileoverview
 * Componente para la gestión de operaciones de comercio exterior en el trámite 319.
 * Este componente maneja la lógica y la presentación del formulario de operaciones,
 * incluyendo la inicialización, la obtención de datos y la gestión de los controles del formulario.
 * @module OperacionesDeComercioExteriorComponent
 */

/**
 * Componente para el formulario de operaciones de comercio exterior.
 * @class OperacionesDeComercioExterioComponent
 * @implements {OnInit, OnDestroy, AfterViewInit}
 */
@Component({
  selector: 'app-operaciones-de-comercio-exterior',
  templateUrl: './operaciones-de-comercio-exterior.component.html',
  styleUrl: './operaciones-de-comercio-exterior.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    TituloComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
    PeriodosComponent,
  ],
})
export class OperacionesDeComercioExterioComponent
  implements OnInit, OnDestroy {
  /**
   * Referencia al elemento del DOM del modal para agregar mercancías.
   */
  @ViewChild('modalPeriodos') modalElement!: ElementRef;
  /**
   * Formulario principal para operaciones.
   * @property {FormGroup} miformulario
   */
  public miformulario!: FormGroup;

  /**
   * Lista de países para el select.
   * @property {Catalogo[]} optionsPaisList
   */
  public optionsPaisList: Catalogo[] = [];

  /**
   * Sujeto para destruir suscripciones.
   * @property {Subject<void>} destroyNotifier$
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Tipo de selección para la tabla de personas.
   * @property {TablaSeleccion} tipoPersonasSeleccion
   */
  public tipoPersonasSeleccion: TablaSeleccion = TablaSeleccion.UNDEFINED;

  /**
   * Configuración de columnas para la tabla de personas.
   * @property {ConfiguracionColumna<Personas>[]} configuracionPersonasColumnas
   */
  public configuracionPersonasColumnas: ConfiguracionColumna<Personas>[] =
    CONFIGURACION_PERSONAS_COLUMNAS;

  /**
   * Tipo de selección para la tabla de solicitudes.
   * @property {TablaSeleccion} tipoSolicitarSeleccion
   */
  public tipoSolicitarSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla de solicitudes.
   * @property {ConfiguracionColumna<Solicitar>[]} configuracionSolicitarColumnas
   */
  public configuracionSolicitarColumnas: ConfiguracionColumna<Solicitar>[] =
    CONFIGURACION_SOLICITAR_COLUMNAS;

  /**
   * Lista de acciones disponibles.
   * @property {string[]} acciones
   */
  public acciones: string[] = [];

  /**
   * Datos de la tabla de personas.
   * @property {Personas[]} cuerpoPersonasTablaFila
   */
  public cuerpoPersonasTablaFila: Personas[] = [];

  /**
   * Datos de la tabla de solicitudes.
   * @property {Solicitar[]} cuerpoSolicitarTablaFila
   */
  public cuerpoSolicitarTablaFila: Solicitar[] = [];

  /**
   * Indica si se muestra el formulario de periodo.
   * @property {boolean} periodoView
   */
  public periodoView: boolean = false;

  /**
   * Lista de solicitudes seleccionadas.
   * @property {Solicitar[]} listaDeTablasSeleccionadas
   */
  public listaDeTablasSeleccionadas: Solicitar[] = [];

  /**
   * Nueva notificación para mostrar en el componente.
   * @property {Notificacion} nuevaAlertaNotificacion
   */
  /** Objeto de notificación para mostrar popup */
  public nuevaAlertaNotificacion: Notificacion = {} as Notificacion;

  /**
   * Texto para mostrar en la alerta.
   * @property {string} textos
   */
  public textos: string = '';

  /**
   * Información de alerta.
   * @property {string} infoAlerta
   */
  public infoAlerta: string = INFO_ALERT;

  /**
   * Indica si el modal emergente está visible.
   * @property {boolean} modalEmergente
   */
  public modalEmergente: boolean = false;

  /**
   * Indica si el formulario es de solo lectura.
   * @property {boolean} esFormularioSoloLectura
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Notificación para mostrar alertas generales.
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Notificación para mostrar información específica.
   * @property {Notificacion} nuevaNotificacionInfo
   */
  public nuevaNotificacionInfo!: Notificacion;

  /**
   * Indica si se debe mostrar la alerta general.
   * @property {boolean} mostrarAlerta
   */
  mostrarAlerta: boolean = false;

  /**
   * Indica si se debe mostrar la información específica.
   * @property {boolean} mostrarInfo
   */
  mostrarInfo: boolean = false;

  /**
   * RFC del usuario logueado.
   * @type {string}
   */
  rfcLogueado: string = '';

  /** Lista de elementos seleccionados en la tabla */
  itemsSeleccionados: Set<number> = new Set();


  /**
   * Lista de periodos obtenidos del servicio.
   */
  periodoList: PeriodoCatalogo[] = [];

  /**
   * RFC del solicitante.
   */
  rfcSolicitante: string = '';

  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para la creación de formularios.
   * @param {OperacionService} operacionService - Servicio para operaciones.
   * @param {Tramite319Query} tramite319Query - Query para el estado del trámite.
   * @param {Tramite319Store} tramite319Store - Store para el trámite.
   * @param {SeccionLibStore} seccionStore - Store para la sección.
   * @param {ConsultaioQuery} consultaioQuery - Query para el estado de solo lectura.
   */
  constructor(
    public readonly fb: FormBuilder,
    public readonly operacionService: OperacionService,
    public readonly tramite319Query: Tramite319Query,
    public readonly tramite319Store: Tramite319Store,
    public readonly consultaioQuery: ConsultaioQuery,
    private loginQuery: LoginQuery
  ) {

  }

  /**
   * Inicializa el componente.
   * @method ngOnInit
   */
  public ngOnInit(): void {
    this.miformulario = this.fb.group({
      operacion: ['', Validators.required],
    });
    this.obtenerRfcLogueado();
    this.getperiodoList();
    this.obtenerPeriodoHistoricoActual();
    if (this.consultaioQuery.getValue().readonly) {
      this.esFormularioSoloLectura = true;
      this.guardarDatosFormulario(this.consultaioQuery.getValue().folioTramite);
    } else {
      this.getPersonasTablaData(this.rfcLogueado);
      this.getOperacionList(this.rfcLogueado);
    }
  }





  /**
   * @description
   * Guarda los datos del formulario obteniendo la información desde un archivo JSON
   * y actualiza el estado del formulario en el servicio correspondiente.
   *
   * @remarks
   * Utiliza el servicio `operacionService` para obtener los datos de muestra de mercancías
   * y actualiza el estado del formulario si la respuesta es válida.
   *
   * @returns {void}
   */
  guardarDatosFormulario(folioTramite: string): void {
    this.operacionService.obtenerDetalleDeSolicitud(folioTramite)
      .subscribe(resp => {
        this.rfcSolicitante = resp.datos?.rfc_solicitante || '';
        if (resp.datos?.periodos) {
          const PERIODOS = resp.datos?.periodos.map(periodo => {
            return {
              id_solicitud: null,
              id_periodo_solicitud: 0,
              periodo: periodo.periodo,
              fechas_periodo: periodo.periodo_inicio + ' al ' + periodo.periodo_fin,
              periodo_inicio: periodo.periodo_inicio,
              periodo_fin: periodo.periodo_fin,
              periodo_desc: this.periodoList.find(p => p.clave === periodo.periodo)?.descripcion || '',
            }
          }) as Solicitar[];
          this.cuerpoSolicitarTablaFila = PERIODOS;
        }

        this.getPersonasTablaData(this.rfcSolicitante);

        this.miformulario.patchValue({
          operacion: resp.datos?.operacion,
        });
        const TIPO_DESC = TIPO_OPERACION_ENUM[resp.datos?.operacion as keyof typeof TIPO_OPERACION_ENUM];
        const TIPO = {clave: resp.datos?.operacion, descripcion: TIPO_DESC || ''};
        this.optionsPaisList = [...this.optionsPaisList, TIPO as Catalogo];

      });
  }


  /**
   * Obtiene el RFC del usuario logueado.
   * @return void
   */
  obtenerRfcLogueado(): void {
    this.loginQuery.selectLoginState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((loginState) => {
        this.rfcLogueado = loginState.rfc;
      });
  }


  /**
     * Obtiene la lista de periodos desde el servicio.
     * @method getperiodoList
     */
  public getperiodoList(): void {
    this.operacionService
      .obtenerPeriodoList<PeriodoCatalogo[]>()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.periodoList = data.datos || [];
      });
  }




  /**
   * Obtiene la lista de países desde el servicio.
   * use usa RFC estatico para pruebas.
   * @method getOperacionList
   */
  public getOperacionList(rfc: string): void {
    this.operacionService
      .obtenerTipoOperacion<Catalogo[]>(rfc)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.optionsPaisList = data.datos || [];
      });
  }

  /**
   * Obtiene los datos de la tabla de personas desde el servicio.
   * use usa RFC estatico para pruebas.
   * @method getPersonasTablaData
   */
  public getPersonasTablaData(rfc: string): void {
    this.operacionService
      .obtenerPersonas<Personas[]>(rfc)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.cuerpoPersonasTablaFila = data.datos || [];
      });
  }

  /**
   * Recibe las filas seleccionadas de la tabla y las almacena en la propiedad `listaDeTablasSeleccionadas`.
   * @method onListaDeFilaSeleccionada
   * @param {Solicitar[]} filasSeleccionadas - Lista de las filas seleccionadas en la tabla.
   */
  public onListaDeFilaSeleccionada(filasSeleccionadas: Solicitar[]): void {
    this.itemsSeleccionados.clear();
    // Agregar nuevas selecciones
    filasSeleccionadas.forEach((materia) => {
      const INDEX = this.cuerpoSolicitarTablaFila.findIndex(
        (m) => m.fechas_periodo === materia.fechas_periodo
      );
      if (INDEX !== -1) {
        this.itemsSeleccionados.add(INDEX);
      }
    });
  }

  /**
   * Elimina los periodos seleccionados de la tabla de solicitudes.
   * @method eliminarPeriodoPorId
   */
  public eliminarPeriodoPorId(): void {
    if (this.cuerpoSolicitarTablaFila.length === 0) {
      this.mostrarAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Sin informacion.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else if (
      this.cuerpoSolicitarTablaFila.length > 0 &&
      this.itemsSeleccionados.size === 0
    ) {
      this.mostrarAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona un registro.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else {
      this.mostrarAlerta = false;
      this.mostrarInfo = true;
      this.nuevaNotificacionInfo = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Desea eliminar el periodo seleccionada?.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }
  }

  /**
   * Cierra la alerta modal.
   * @method aceptar
   */
  aceptar(): void {
    this.mostrarAlerta = false;
  }

  /**
   * Maneja la acción de aceptar en la información mostrada.
   * @param event Evento que indica si se aceptó la acción.
   */
  aceptarInfo(event: boolean): void {
    if (event) {
      this.mostrarInfo = false;

      if (this.itemsSeleccionados.size === 0) {
        return;
      }
      // Convertir a array y ordenar de mayor a menor para eliminar correctamente
      const INDICES_A_ELIMINAR = Array.from(this.itemsSeleccionados).sort(
        (a, b) => b - a
      );
      INDICES_A_ELIMINAR.forEach((index) => {
        this.cuerpoSolicitarTablaFila.splice(index, 1);
      });
      this.itemsSeleccionados.clear();
      this.cuerpoSolicitarTablaFila = [...this.cuerpoSolicitarTablaFila];

      this.tramite319Store.actualizarCampo(
        'lista_periodos_solicitud',
        this.cuerpoSolicitarTablaFila
      );
      this.periodoView = false;
    }
  }

  /**
   * Actualiza la operación seleccionada desde el formulario actual y la envía al store de trámite 319.
   * @method actualizarOperacionDesdeSeleccion
   */
  public actualizarOperacionDesdeSeleccion(): void {
    this.tramite319Store.actualizarOperacion(
      this.miformulario?.value?.operacion || ''
    );
  }

  /**
   * Abre una alerta modal de selección con un mensaje predefinido.
   * @method abrirAlertaSeleccionModal
   */
  public abrirAlertaSeleccionModal(): void {
    this.nuevaAlertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'El periodo se agregó correctamente.',
      cerrar: false,
      tiempoDeEspera: 1000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * es formularioValido
   * @description
   * Valida el formulario actual.
   * @returns verdadero si el formulario es válido, falso en caso contrario.
   */
  esFormularioValido(): boolean {
    const IS_VALID = this.miformulario.valid;
    if (!IS_VALID) {
      this.miformulario.markAllAsTouched();
    }
    return IS_VALID;
  }

  /**
   * verifica si la tabla es válida.
   * @returns {boolean} verdadero si la tabla es válida, falso en caso contrario.
   */
  esTablaValida(): boolean {
    const VALOR = this.miformulario.get('operacion')?.value;
    if (VALOR !== OPERACION_HISTORICA) {
      return true;
    }
    if (VALOR === OPERACION_HISTORICA) {
      return this.cuerpoSolicitarTablaFila.length > 0;
    }

    return false;
  }

  /**
   * Obtiene el periodo histórico actual y actualiza el store del trámite 319.
   */
  obtenerPeriodoHistoricoActual(): void {
    this.operacionService
      .obtenerPeriodoHistoricoActual<Catalogo[]>()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.tramite319Store.actualizarCampo(
          'clave_per_historico_actual',
          data.datos?.[0]?.clave || ''
        );
      });
  }

  /**
   * Cierra el modal de forma segura
   */
  private cerrarModal(): void {
    (
      document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement
    )?.click();
  }

  /**
   * agrega los periodos recibidos al arreglo de la tabla de solicitudes.
   * @param event Evento que contiene los periodos a agregar.
   */
  agregarPeriodos(event: Solicitar): void {
    this.cuerpoSolicitarTablaFila = [...this.cuerpoSolicitarTablaFila, event];
    this.tramite319Store.actualizarCampo(
      'lista_periodos_solicitud',
      this.cuerpoSolicitarTablaFila
    );
    this.cerrarModal();
    setTimeout(() => {
      this.abrirAlertaSeleccionModal();
    }, 300);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el `Subject` para evitar fugas de memoria en las suscripciones.
   * @method ngOnDestroy
   */
  public ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

/**
 * Validador personalizado para verificar si un valor cumple con el formato de mes y año (MM/YYYY).
 * Este validador se puede usar en formularios para asegurarse de que el valor ingresado sea válido.
 * Si el valor está vacío, se delega la validación a `Validators.required`.
 * Si el valor no coincide con el formato esperado, devuelve un error con la clave `invalidMonthYear`.
 *
 * @returns {ValidatorFn} Una función de validación que verifica el formato de mes y año.
 *
 * @example
 * const control = new FormControl('12/2023', validadorDeMesyAno());
 * console.log(control.errors); // null (válido)
 *
 * const invalidControl = new FormControl('13/2023', validadorDeMesyAno());
 * console.log(invalidControl.errors); // { invalidMonthYear: true } (inválido)
 */
export function validadorDeMesyAno(): ValidatorFn {
  return (control: AbstractControl) => {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }
    const REGEX = REGEX_FECHA_MES_ANO;
    return REGEX.test(VALUE) ? null : { invalidMonthYear: true };
  };
}

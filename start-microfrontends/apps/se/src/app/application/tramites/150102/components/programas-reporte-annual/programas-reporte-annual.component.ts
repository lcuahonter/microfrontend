import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ConfiguracionColumna, ENVIRONMENT, LoginQuery, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent,doDeepCopy, esValidArray, esValidObject, getValidDatos, } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProgramasReporte, ReporteFechas } from '../../models/programas-reporte.model';
import { Solicitud150102State, Solicitud150102Store } from '../../estados/solicitud150102.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from "@ng-mf/data-access-user";
import { Solicitud150102Query } from '../../estados/solicitud150102.query';
import { SolicitudService } from '../../services/solicitud.service';

/**
 * @description Componente para gestionar el reporte anual de programas.
 * Se encarga de mostrar, actualizar y administrar datos relacionados
 * con los programas de reporte y sus configuraciones.
 */
@Component({
  selector: 'app-programas-reporte-annual',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    BsDatepickerModule,
    TablaDinamicaComponent,
    NotificacionesComponent
  ],
  templateUrl: './programas-reporte-annual.component.html',
  styleUrl: './programas-reporte-annual.component.scss',
})
export class ProgramasReporteAnnualComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para administrar los datos del reporte anual */
  formProgrmasReporte!: FormGroup;
  /**
   * @description Configuración del componente `BsDatepicker`.
   * Permite establecer el formato de la fecha y restringir la selección a nivel de mes y año.
   *
   * @property {string} dateInputFormat - Define el formato de la fecha mostrada en el campo de entrada (MM/YYYY).
   * @property {string} minMode - Establece el modo mínimo de selección en el selector (mes).
   */
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'MM-YYYY', // Formato de entrada: mes-año
    minMode: 'month', // Solo permite seleccionar mes y año
  };

  /** Estado actual de la solicitud */
  solicitud150102State: Solicitud150102State = {} as Solicitud150102State;

  /**
   * @description Evento que se emite al seleccionar una fila de la tabla.
   * Emite un valor booleano para indicar si la fila ha sido seleccionada.
   * @type {EventEmitter<boolean>}
   */
  @Output() filaDeInformeSeleccionada = new EventEmitter<boolean>();

  /** 
   * Datos guardados de la solicitud 
   */
private _solicitudDatosGuardados: ProgramasReporte[] = [];
/**  
 * @description Establece los datos guardados de la solicitud y actualiza los datos internos.
   * @param {ProgramasReporte[]} value - Datos guardados de la solicitud.
   */
@Input() set solicitudDatosGuardados(value: ProgramasReporte[]) {
  this._solicitudDatosGuardados = value;
  this.solicitudDatos = value; // Always update internal data
  // Optionally, re-initialize table or form here if needed
}

/** 
 * @description Obtiene los datos guardados de la solicitud.
 * @returns {ProgramasReporte[]} Datos guardados de la solicitud.
 */
get solicitudDatosGuardados(): ProgramasReporte[] {
  return this._solicitudDatosGuardados;
}


  /** Subject para manejar la destrucción de observables */
  private destroyed$ = new Subject<void>();

  /** Selección de tabla para los datos de solicitud (radio) */
  solicitudSeleccionTabla = TablaSeleccion.RADIO;

  /** Datos de la solicitud en forma de arreglo de programas de reporte */
  solicitudDatos: ProgramasReporte[] = [];  
  /*
   * Valor del RFC obtenido del estado de login.
   */
  public rfcValor: string = '';

  /** Configuración de la tabla para mostrar los datos de solicitud */
  solicitudConfiguracionTabla: ConfiguracionColumna<ProgramasReporte>[] = [
    {
      encabezado: 'Número/Registro de programa',
      clave: (item: ProgramasReporte) => item.folioPrograma,
      orden: 1,
    },
    {
      encabezado: 'Tipo programa',
      clave: (item: ProgramasReporte) => item.tipoPrograma,
      orden: 2,
    },
    {
      encabezado: 'Modalidad',
      clave: (item: ProgramasReporte) => item.modalidad,
      orden: 3,
    },
    {
      encabezado: 'Estatus',
      clave: (item: ProgramasReporte) => item.estatus,
      orden: 4,
    },
  ];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Índice que representa la posición del registro actual dentro de la lista de programas.
   * Se utiliza para identificar o acceder al programa seleccionado en operaciones de edición o visualización.
   */
  indiceDeRegistroDelPrograma!: number;
    /**
        * @public
        * @property {Notificacion} nuevaNotificacion
        * @description Representa una nueva notificación que se utilizará en el componente.
        * @command Este campo debe ser inicializado antes de su uso.
        */
    public nuevaNotificacion!: Notificacion;
    /** Indica si se debe mostrar la alerta al usuario.*/
  public mostrarConsulta: boolean = false;

  /**
   * @description Constructor que inicializa los servicios y estado necesarios.
   * @param fb Servicio para crear formularios reactivos.
   * @param solicitud150102Store Servicio para manejar el estado de la solicitud.
   * @param solicitud150102Query Servicio para realizar consultas del estado.
   * @param solicitudService Servicio para realizar solicitudes relacionadas.
   */
  constructor(
    public fb: FormBuilder,
    public solicitud150102Store: Solicitud150102Store,
    public solicitud150102Query: Solicitud150102Query,
    public solicitudService: SolicitudService,
    private consultaioQuery: ConsultaioQuery,
    private loginQuery: LoginQuery, 
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.mostrarConsulta = seccionState.update;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
      if (!this.mostrarConsulta) {
        this.obtenerProgramasReporte();
      }
  }

  /**
   * @description Método que se ejecuta al inicializar el componente.
   * Configura el formulario y sincroniza los datos iniciales con el estado.
   */
  ngOnInit(): void {
    // seleccionarSolicitud
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formProgrmasReporte.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formProgrmasReporte.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `formProgrmasReporte` con los valores actuales del estado `solicitud150102State`.
   *
   * - Deshabilita todos los campos para solo lectura.
   * - Se suscribe al observable `seleccionarSolicitud$` para actualizar el formulario en tiempo real
   *   cuando haya cambios en el estado de la solicitud.
   */

  inicializarFormulario(): void {
    this.formProgrmasReporte = this.fb.group({
      inicio: [{ value: this.solicitud150102State.inicio, disabled: true }],
      fin: [{ value: this.solicitud150102State.fin, disabled: true }],
      folioPrograma: [
        { value: this.solicitud150102State.folioPrograma, disabled: true },
      ],
      modalidad: [
        { value: this.solicitud150102State.modalidad, disabled: true },
      ],
      tipoPrograma: [
        { value: this.solicitud150102State.tipoPrograma, disabled: true },
      ],
      estatus: [{ value: this.solicitud150102State.estatus, disabled: true }],
    });
    this.solicitud150102Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud150102State) => {
          this.solicitud150102State = respuesta;
          this.formProgrmasReporte.patchValue({
            inicio: this.solicitud150102State.inicio,
            fin: this.solicitud150102State.fin,
            folioPrograma: this.solicitud150102State.folioPrograma,
            modalidad: this.solicitud150102State.modalidad,
            tipoPrograma: this.solicitud150102State.tipoPrograma,
            estatus: this.solicitud150102State.estatus,
          });
          this.indiceDeRegistroDelPrograma =
            this.solicitud150102State.indiceDeRegistroDelPrograma;
        })
      )
      .subscribe();
  }

  /**
   * @description Método para obtener las fechas de inicio y fin del reporte.
   * Actualiza el estado con las fechas obtenidas del servicio.
   */
  obtenerReporteFechas(): void {
    this.solicitudService
      .obtenerReporteFechas()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (respuesta: ReporteFechas) => {
          this.solicitud150102Store.actualizarInicio(respuesta.inicio);
          this.solicitud150102Store.actualizarFin(respuesta.fin);
        },
      });
  }

  /**
   * @description Método para obtener los datos de programas de reporte.
   * Actualiza los datos con los resultados obtenidos del servicio.
   */
  obtenerProgramasReporte(): void {
    // this.rfcValor
    const RFC = ENVIRONMENT.RFC;
    this.solicitudService
      .obtenerProgramasReporte(RFC)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (respuesta) => {
          const API_RESPONSE = doDeepCopy(respuesta);
          if(esValidObject(API_RESPONSE) && esValidArray(API_RESPONSE.datos)) {
            this.solicitud150102Store.actualizarInicio(this.formatDateToMonthYear(API_RESPONSE?.datos[0]?.fechaInicioVigencia));
            this.solicitud150102Store.actualizarFin(this.formatDateToMonthYear(API_RESPONSE?.datos[0]?.fechaFinVigencia));
            this.solicitudDatos = this.mapProgramasResponse(API_RESPONSE.datos);
          }
        },
      });
  }

  public mapProgramasResponse(datos: unknown[]): ProgramasReporte[] {
    return datos.map((item: unknown) => {
      const PROGRAMA = item as ProgramasReporte;
      return {
        folioPrograma: PROGRAMA.folioPrograma,
        modalidad: PROGRAMA.modalidad,
        tipoPrograma: PROGRAMA.tipoPrograma,
        estatus: PROGRAMA.estatus,
        idProgramaCompuesto: PROGRAMA.idProgramaCompuesto
      };
    }) || [];
  }

  /**
   * @description Actualiza los datos del programa seleccionado en el estado.
   * @param evento Objeto que contiene los datos del programa seleccionado.
   */
  actualizarProgramasReporte(evento: ProgramasReporte): void {
    const INDEX = this.solicitudDatos.findIndex(
      (x) => x.folioPrograma === evento.folioPrograma
    );
    this.solicitud150102Store.actualizarIndiceDeRegistroDelPrograma(INDEX);
    this.solicitud150102Store.actualizarFolioPrograma(evento.folioPrograma);
    this.solicitud150102Store.actualizarModalidad(evento.modalidad);
    this.solicitud150102Store.actualizarTipoPrograma(evento.tipoPrograma);
    this.solicitud150102Store.actualizarEstatus(evento.estatus);
    this.solicitud150102Store.actualizarIdProgramaCompuesto(evento.idProgramaCompuesto);
    if (evento instanceof Object) {
      this.filaDeInformeSeleccionada.emit(true);
    }
  }

  private formatDateToMonthYear(dateString: string) {
    if(getValidDatos(dateString)) {
        const DATE = new Date(dateString);
        const MONTH = String(DATE.getMonth() + 1).padStart(2, '0');
        const YEAR = DATE.getFullYear();
        return `${MONTH}-${YEAR}`;
    }
    return '';
  }

    /**
   * @method showAlert
   * @description Shows a general alert notification
   */
  public showAlert(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'info',
      modo: 'action',
      titulo: 'Programa seleccionado',
      mensaje: 'Se ha seleccionado un programa correctamente.',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }


  /**
   * @description Método que se ejecuta al destruir el componente.
   * Completa las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(); // Emite una señal para finalizar las suscripciones
    this.destroyed$.complete(); // Completa el Subject
  }
}

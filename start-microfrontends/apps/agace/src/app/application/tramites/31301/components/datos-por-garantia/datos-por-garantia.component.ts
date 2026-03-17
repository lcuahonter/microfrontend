import {
  CONFIGURACION_FECHA_FIN_ACTUAL_VIGENCIA,
  CONFIGURACION_FECHA_FIN_ANTERIOR_VIGENCIA,
  CONFIGURACION_FECHA_FIN_VIGENCIA,
  CONFIGURACION_FECHA_INICIO_ACTUAL_VIGENCIA,
  CONFIGURACION_FECHA_INICIO_ANTERIOR_VIGENCIA,
  CONFIGURACION_FECHA_INICIO_VIGENCIA,
  NOMBRE_INSTITUCION_ACTUAL_CATALOGO,
  NOMBRE_INSTITUCION_ANTERIOR_CATALOGO,
  NOMBRE_INSTITUCION_CATALOGO,
} from '../../constants/constants.enum';
import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  InputFecha,
  InputFechaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud31301State,
  Solicitud31301Store,
} from '../../estados/solicitud31301.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosPorGarantia } from '../../models/solicitud.model';
import { Solicitud31301Query } from '../../estados/solicitud31301.query';
import { SolicitudService } from '../../services/solicitud.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
/**
 * Componente encargado de mostrar y gestionar los datos relacionados
 * con la garantía de una póliza de fianza. Incluye la visualización de
 * fechas, importes y catálogo de instituciones.
 */
@Component({
  selector: 'app-datos-por-garantia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    TooltipModule,
  ],
  providers: [SolicitudService],
  templateUrl: './datos-por-garantia.component.html',
  styleUrl: './datos-por-garantia.component.scss',
})
/**
 * Componente encargado de mostrar y gestionar los datos relacionados
 * con la garantía de una póliza de fianza. Incluye la visualización de
 * fechas, importes y catálogo de instituciones.
 */
export class DatosPorGarantiaComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para mostrar los datos de la póliza de fianza */
  polizaDeFianzaForm!: FormGroup;

  /**
   * Formulario reactivo que contiene los datos de la póliza de fianza anterior.
   * Se utiliza para gestionar y validar la información ingresada o recuperada
   * relacionada con la póliza previa.
   *
   * @type {FormGroup}
   */
  polizaDeFianzaAnteriorForm!: FormGroup;

  /**
   * Formulario reactivo que contiene los datos de la póliza de fianza actual.
   * Se utiliza para gestionar y validar la información ingresada o editada
   * relacionada con la póliza vigente.
   *
   * @type {FormGroup}
   */
  polizaDeFianzaActualForm!: FormGroup;

  /** Catálogo de instituciones para selección de nombre */
  nombreInstitucionCatalogo: CatalogosSelect = NOMBRE_INSTITUCION_CATALOGO;

  /**
   * Catálogo de opciones que contiene las instituciones para la póliza de fianza anterior.
   * Se utiliza para mostrar las opciones disponibles en el formulario correspondiente.
   *
   * @type {CatalogosSelect}
   */
  nombreInstitucionAnteriorCatalogo: CatalogosSelect =
    NOMBRE_INSTITUCION_ANTERIOR_CATALOGO;

  /**
   * Catálogo de opciones que contiene las instituciones para la póliza de fianza actual.
   * Se utiliza para mostrar las opciones disponibles en el formulario correspondiente.
   *
   * @type {CatalogosSelect}
   */
  nombreInstitucionActualCatalogo: CatalogosSelect =
    NOMBRE_INSTITUCION_ACTUAL_CATALOGO;

  /** Configuración para el campo de fecha de fin de vigencia */
  configuracionFechaFinVigencia: InputFecha = CONFIGURACION_FECHA_FIN_VIGENCIA;

  /** Configuración para el campo de fecha de inicio de vigencia */
  configuracionFechaInicioVigencia: InputFecha =
    CONFIGURACION_FECHA_INICIO_VIGENCIA;

  /** Configuración para el campo de fecha de fin de vigencia */
  configuracionFechaFinAnteriorVigencia: InputFecha =
    CONFIGURACION_FECHA_FIN_ANTERIOR_VIGENCIA;

  /** Configuración para el campo de fecha de inicio de vigencia */
  configuracionFechaInicioAnteriorVigencia: InputFecha =
    CONFIGURACION_FECHA_INICIO_ANTERIOR_VIGENCIA;

  /**
   * @description Configuración utilizada para el campo de **Fecha de fin de vigencia actual**.
   * Define las propiedades de entrada como la etiqueta, si es requerido y si está habilitado.
   *
   * @type {InputFecha}
   * @memberof NombreDeTuComponente
   */
  configuracionFechaFinActualVigencia: InputFecha =
    CONFIGURACION_FECHA_FIN_ACTUAL_VIGENCIA;

  /**
   * @description Configuración utilizada para el campo de **Fecha de inicio de vigencia actual**.
   * Define las propiedades de entrada que controlan la etiqueta, si es requerido y su estado de habilitación.
   *
   * @type {InputFecha}
   * @memberof NombreDeTuComponente
   */
  configuracionFechaInicioActualVigencia: InputFecha =
    CONFIGURACION_FECHA_INICIO_ACTUAL_VIGENCIA;

  /** Subject usado para destruir suscripciones al finalizar el componente */
  public destroy$: Subject<void> = new Subject<void>();

  /** Estado actual de la solicitud almacenado en el store */
  solicitud31301State: Solicitud31301State = {} as Solicitud31301State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor que inyecta servicios y realiza la carga inicial de datos.
   *
   * @param fb FormBuilder para crear formularios reactivos
   * @param solicitudService Servicio para acceder a datos del backend
   * @param solicitud31301Store Store para actualizar el estado de la solicitud
   * @param solicitud31301Query Query para observar el estado de la solicitud
   * @param consultaioQuery -  Query que permite consultar datos relacionados del contexto general
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud31301Store: Solicitud31301Store,
    public solicitud31301Query: Solicitud31301Query,
    public consultaioQuery: ConsultaioQuery
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
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.conseguirNombreInstitucionCatalogo();
    this.conseguirDatosPorGarantia();
  }

  /**
   * Hook de inicialización del componente. Configura el formulario
   * y se suscribe al estado para sincronizar los datos mostrados.
   */
  ngOnInit(): void {
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
      this.inicializarFormularioAnterior();
      this.inicializarFormularioActual();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    this.inicializarFormularioAnterior();
    this.inicializarFormularioActual();
    if (this.esFormularioSoloLectura) {
      this.polizaDeFianzaForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.polizaDeFianzaForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario reactivo con los valores de razón social anteriores y actuales.
   *
   * Los campos del formulario están deshabilitados y tienen una validación de longitud máxima de 250 caracteres.
   */
  inicializarFormulario(): void {
    this.polizaDeFianzaForm = this.fb.group({
      polizaDeFianza: [this.solicitud31301State.polizaDeFianza],
      numeroFolio: [
        { value: this.solicitud31301State.numeroFolio, disabled: false },
        [Validators.maxLength(250)],
      ],
      rfcInstitucion: [
        { value: this.solicitud31301State.rfcInstitucion, disabled: true },
        [Validators.maxLength(250)],
      ],
      fechaExpedicion: [
        { value: this.solicitud31301State.fechaExpedicion, disabled: true },
        [Validators.maxLength(10)],
      ],
      fechaInicioVigenciaNo: [
        {
          value: this.solicitud31301State.fechaInicioVigenciaNo,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaFinVigenciaNo: [
        { value: this.solicitud31301State.fechaFinVigenciaNo, disabled: true },
        [Validators.maxLength(10)],
      ],
      fechaInicioVigencia: [
        { value: this.solicitud31301State.fechaInicioVigencia, disabled: true },
        [Validators.maxLength(10)],
      ],
      fechaFinVigencia: [
        { value: this.solicitud31301State.fechaFinVigencia, disabled: true },
        [Validators.maxLength(10)],
      ],
      importeTotal: [
        { value: this.solicitud31301State.importeTotal, disabled: true },
        [Validators.maxLength(20)],
      ],
    });

    // Suscripción al estado global para actualizar el formulario con nuevos valores
    this.solicitud31301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud31301State) => {
          this.solicitud31301State = respuesta;
          this.polizaDeFianzaForm.patchValue({
            polizaDeFianza: this.solicitud31301State.polizaDeFianza,
            numeroFolio: this.solicitud31301State.numeroFolio,
            rfcInstitucion: this.solicitud31301State.rfcInstitucion,
            fechaExpedicion: this.solicitud31301State.fechaExpedicion,
            fechaInicioVigenciaNo:
              this.solicitud31301State.fechaInicioVigenciaNo,
            fechaFinVigenciaNo: this.solicitud31301State.fechaFinVigenciaNo,
            fechaInicioVigencia: this.solicitud31301State.fechaInicioVigencia,
            fechaFinVigencia: this.solicitud31301State.fechaFinVigencia,
            importeTotal: this.solicitud31301State.importeTotal,
          });
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario de la póliza de fianza anterior con los valores obtenidos del estado `solicitud31301State`.
   *
   * - Define los controles del formulario con valores iniciales y validaciones específicas como `Validators.maxLength`.
   * - Los campos sensibles se inicializan en estado *disabled* (solo lectura).
   * - Se suscribe al estado global (`solicitud31301Query.selectSolicitud$`) para mantener el formulario sincronizado
   *   con cualquier cambio en los datos de la solicitud.
   *
   * Este método garantiza que el formulario refleje siempre la información más actualizada proveniente del store.
   *
   * @returns {void}
   */
  inicializarFormularioAnterior(): void {
    this.polizaDeFianzaAnteriorForm = this.fb.group({
      polizaDeFianzaAnterior: [this.solicitud31301State.polizaDeFianzaAnterior],
      numeroFolioAnterior: [
        { value: this.solicitud31301State.numeroFolioAnterior, disabled: true },
        [Validators.maxLength(250)],
      ],
      rfcInstitucionAnterior: [
        {
          value: this.solicitud31301State.rfcInstitucionAnterior,
          disabled: true,
        },
        [Validators.maxLength(250)],
      ],
      fechaExpedicionAnterior: [
        {
          value: this.solicitud31301State.fechaExpedicionAnterior,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaInicioVigenciaNoAnterior: [
        {
          value: this.solicitud31301State.fechaInicioVigenciaNoAnterior,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaFinVigenciaNoAnterior: [
        {
          value: this.solicitud31301State.fechaFinVigenciaNoAnterior,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaInicioVigenciaAnterior: [
        {
          value: this.solicitud31301State.fechaInicioVigenciaAnterior,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaFinVigenciaAnterior: [
        {
          value: this.solicitud31301State.fechaFinVigenciaAnterior,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      importeTotalAnterior: [
        {
          value: this.solicitud31301State.importeTotalAnterior,
          disabled: true,
        },
        [Validators.maxLength(20)],
      ],
    });

    // Suscripción al estado global para actualizar el formulario con nuevos valores
    this.solicitud31301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud31301State) => {
          this.solicitud31301State = respuesta;
          this.polizaDeFianzaAnteriorForm.patchValue({
            polizaDeFianzaAnterior:
              this.solicitud31301State.polizaDeFianzaAnterior,
            numeroFolioAnterior: this.solicitud31301State.numeroFolioAnterior,
            rfcInstitucionAnterior:
              this.solicitud31301State.rfcInstitucionAnterior,
            fechaExpedicionAnterior:
              this.solicitud31301State.fechaExpedicionAnterior,
            fechaInicioVigenciaNoAnterior:
              this.solicitud31301State.fechaInicioVigenciaNoAnterior,
            fechaFinVigenciaNoAnterior:
              this.solicitud31301State.fechaFinVigenciaNoAnterior,
            fechaInicioVigenciaAnterior:
              this.solicitud31301State.fechaInicioVigenciaAnterior,
            fechaFinVigenciaAnterior:
              this.solicitud31301State.fechaFinVigenciaAnterior,
            importeTotalAnterior: this.solicitud31301State.importeTotalAnterior,
          });
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario de la póliza de fianza actual con los valores obtenidos del estado `solicitud31301State`.
   *
   * - Configura los controles del formulario con valores iniciales y validaciones (`Validators.maxLength`).
   * - Algunos campos se establecen en modo *disabled* para evitar edición, según las reglas de negocio (por ejemplo,
   *   `montoAmpliaActual` se deshabilita cuando `tipoDeEndoso === 4`).
   * - Se suscribe al estado global (`solicitud31301Query.selectSolicitud$`) para mantener sincronizado el formulario
   *   con los cambios en los datos de la solicitud.
   *
   * @returns {void}
   */
  inicializarFormularioActual(): void {
    this.polizaDeFianzaActualForm = this.fb.group({
      polizaDeFianzaActual: [this.solicitud31301State.polizaDeFianzaActual],
      numeroFolioActual: [
        { value: this.solicitud31301State.numeroFolioActual, disabled: true },
        [Validators.maxLength(250)],
      ],
      rfcInstitucionActual: [
        {
          value: this.solicitud31301State.rfcInstitucionActual,
          disabled: true,
        },
        [Validators.maxLength(250)],
      ],
      fechaExpedicionActual: [
        {
          value: this.solicitud31301State.fechaExpedicionActual,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaInicioVigenciaNoActual: [
        {
          value: this.solicitud31301State.fechaInicioVigenciaNoActual,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaFinVigenciaNoActual: [
        {
          value: this.solicitud31301State.fechaFinVigenciaNoActual,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaInicioVigenciaActual: [
        {
          value: this.solicitud31301State.fechaInicioVigenciaActual,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      fechaFinVigenciaActual: [
        {
          value: this.solicitud31301State.fechaFinVigenciaActual,
          disabled: true,
        },
        [Validators.maxLength(10)],
      ],
      montoAmpliaActual: [
        {
          value: this.solicitud31301State.montoAmpliaActual,
          disabled: this.solicitud31301State.tipoDeEndoso === 4 ? true : false,
        },
        [Validators.maxLength(20)],
      ],
      montoGarantizadoActual: [
        {
          value: this.solicitud31301State.montoGarantizadoActual,
          disabled: true,
        },
        [Validators.maxLength(20)],
      ],
    });

    // Suscripción al estado global para actualizar el formulario con nuevos valores
    this.solicitud31301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud31301State) => {
          this.solicitud31301State = respuesta;
          this.polizaDeFianzaForm.patchValue({
            polizaDeFianzaActual: this.solicitud31301State.polizaDeFianzaActual,
            numeroFolioActual: this.solicitud31301State.numeroFolioActual,
            rfcInstitucionActual: this.solicitud31301State.rfcInstitucionActual,
            fechaExpedicionActual:
              this.solicitud31301State.fechaExpedicionActual,
            fechaInicioVigenciaNoActual:
              this.solicitud31301State.fechaInicioVigenciaNoActual,
            fechaFinVigenciaNoActual:
              this.solicitud31301State.fechaFinVigenciaNoActual,
            fechaInicioVigenciaActual:
              this.solicitud31301State.fechaInicioVigenciaActual,
            fechaFinVigenciaActual:
              this.solicitud31301State.fechaFinVigenciaActual,
            montoAmpliaActual: this.solicitud31301State.montoAmpliaActual,
            montoGarantizadoActual:
              this.solicitud31301State.montoGarantizadoActual,
          });
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al seleccionar una institución del catálogo.
   * Actualiza el valor de la póliza de fianza actual en el store.
   *
   * @param evento Elemento seleccionado del catálogo
   */
  seleccionaNombreInstitucion(evento: Catalogo): void {
    this.solicitud31301Store?.actualizarpolizaDeFianza(evento.id);
  }

  /**
   * Selecciona la institución anterior de la póliza de fianza.
   *
   * Llama al store para actualizar el identificador de la institución
   * seleccionada en la póliza de fianza anterior.
   *
   * @param evento - Objeto de tipo `Catalogo` que contiene la información de la institución seleccionada.
   * @returns {void}
   */
  seleccionaNombreInstitucionAnterior(evento: Catalogo): void {
    this.solicitud31301Store.actualizarPolizaDeFianzaAnterior(evento.id);
  }

  /**
   * Selecciona la institución actual de la póliza de fianza.
   *
   * Llama al store para actualizar el identificador de la institución
   * seleccionada en la póliza de fianza actual.
   *
   * @param evento - Objeto de tipo `Catalogo` que contiene la información de la institución seleccionada.
   * @returns {void}
   */
  seleccionaNombreInstitucionActual(evento: Catalogo): void {
    this.solicitud31301Store.actualizarPolizaDeFianzaActual(evento.id);
  }

  /**
   * Consulta al servicio los datos del catálogo de instituciones
   * y los almacena para ser mostrados en el componente.
   */
  conseguirNombreInstitucionCatalogo(): void {
    this.solicitudService
      .conseguirNombreInstitucionCatalogo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: Catalogo[]) => {
          this.nombreInstitucionCatalogo.catalogos = respuesta;
          this.nombreInstitucionAnteriorCatalogo.catalogos = respuesta;
          this.nombreInstitucionActualCatalogo.catalogos = respuesta;
        },
      });
  }

  /**
   * Obtiene los datos por garantía desde el backend y actualiza
   * el estado global con la información correspondiente.
   */
  conseguirDatosPorGarantia(): void {
    this.solicitudService
      .conseguirDatosPorGarantia()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: DatosPorGarantia) => {
          this.solicitud31301Store.update((state) => ({
            ...state,
            ...respuesta,
          }));
        },
      });
  }

  /**
   * Hook que se ejecuta al destruir el componente.
   * Se usa para liberar recursos y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

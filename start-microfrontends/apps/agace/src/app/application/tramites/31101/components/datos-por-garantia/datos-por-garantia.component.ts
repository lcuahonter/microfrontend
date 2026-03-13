import {
  CONFIGURACION_FECHA_DE_EXPEDICION,
  CONFIGURACION_FECHA_FIN_VIGENCIA,
  CONFIGURACION_FECHA_INICIO_VIGENCIA,
  FIANZA_FECHA_DE_EXPEDICION,
  FIANZA_FECHA_FIN_VIGENCIA,
  FIANZA_FECHA_INICIO_VIGENCIA,
  INSTITUCION_CREDITO_CATALOGO,
  INSTITUCION_FIANZA_CATALOGO,
} from '../../constants/solicitud.enum';
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
  Solicitud31101State,
  Solicitud31101Store,
} from '../../estados/solicitud31101.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { GarantiaCatalogo } from '../../models/solicitud.model';
import { Solicitud31101Query } from '../../estados/solicitud31101.query';
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
  polizaFianzaForm!: FormGroup;

  /**
   * Formulario reactivo para capturar los datos de la póliza de crédito.
   *
   * Esta propiedad es de tipo `FormGroup` y se inicializa en el método
   * correspondiente del componente. Contiene los controles del formulario
   * y sus validaciones para gestionar la información de la póliza.
   */
  polizaCreditoForm!: FormGroup;

  /** Catálogo de instituciones para selección de nombre */
  nombreInstitucionCatalogo: CatalogosSelect = INSTITUCION_CREDITO_CATALOGO;

  /**
   * Catálogo de instituciones de fianza.
   *
   * Esta propiedad contiene los datos de selección para el campo de institución de fianza,
   * utilizando la estructura `CatalogosSelect`. Se inicializa con `INSTITUCION_FIANZA_CATALOGO`.
   */
  institucionFianzaCatalogo: CatalogosSelect = INSTITUCION_FIANZA_CATALOGO;

  /** Configuración para el campo de fecha de fin de vigencia */
  configuracionFechaDeExpedicion: InputFecha =
    CONFIGURACION_FECHA_DE_EXPEDICION;

  /** Configuración para el campo de fecha de inicio de vigencia */
  configuracionFechaInicioVigencia: InputFecha =
    CONFIGURACION_FECHA_INICIO_VIGENCIA;

  /** Configuración para el campo de fecha de inicio de vigencia */
  configuracionFechaFinVigencia: InputFecha = CONFIGURACION_FECHA_FIN_VIGENCIA;

  /** Configuración para el campo de fecha de fin de vigencia */
  fianzaFechaDeExpedicion: InputFecha = FIANZA_FECHA_DE_EXPEDICION;

  /** Configuración para el campo de fecha de inicio de vigencia */
  fianzaFechaInicioVigencia: InputFecha = FIANZA_FECHA_INICIO_VIGENCIA;

  /** Configuración para el campo de fecha de inicio de vigencia */
  fianzaFechaFinVigencia: InputFecha = FIANZA_FECHA_FIN_VIGENCIA;

  /** Subject usado para destruir suscripciones al finalizar el componente */
  private destroy$: Subject<void> = new Subject<void>();

  /** Estado actual de la solicitud almacenado en el store */
  solicitud31101State: Solicitud31101State = {} as Solicitud31101State;

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
   * @param solicitud31101Store Store para actualizar el estado de la solicitud
   * @param solicitud31101Query Query para observar el estado de la solicitud
   * @param consultaioQuery Query para observar el estado de la sección de consulta
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud31101Store: Solicitud31101Store,
    public solicitud31101Query: Solicitud31101Query,
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
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.polizaCreditoForm.disable();
      this.polizaFianzaForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.polizaCreditoForm.enable();
      this.polizaFianzaForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa los formularios reactivos `polizaFianzaForm` y `polizaCreditoForm`.
   *
   * Este método configura los controles de cada formulario con los valores actuales
   * del estado `solicitud31101State`, incluyendo habilitación/deshabilitación y
   * validaciones como `Validators.maxLength`.
   *
   * Además, se suscribe al observable `selectSolicitud$` del estado global
   * `solicitud31101Query` para actualizar automáticamente los formularios
   * cuando los datos del estado cambien.
   */
  inicializarFormulario(): void {
    this.polizaFianzaForm = this.fb.group({
      polizaFianzaActual: [this.solicitud31101State.polizaFianzaActual],
      folioFianza: [
        { value: this.solicitud31101State.folioFianza, disabled: false },
        [Validators.maxLength(250)],
      ],
      rfcAfianzadora: [
        { value: this.solicitud31101State.rfcAfianzadora, disabled: true },
      ],
      fechaExpedicionFianza: [
        {
          value: this.solicitud31101State.fechaExpedicionFianza,
          disabled: true,
        },
      ],
      fecInicioVigenciaFianza: [
        {
          value: this.solicitud31101State.fecInicioVigenciaFianza,
          disabled: true,
        },
      ],
      fecFinVigenciaFianza: [
        {
          value: this.solicitud31101State.fecFinVigenciaFianza,
          disabled: true,
        },
      ],
      fianzaImporteTotal: [
        { value: this.solicitud31101State.fianzaImporteTotal, disabled: false },
        [Validators.maxLength(18)],
      ],
    });
    this.polizaCreditoForm = this.fb.group({
      polizaDeFianzaActual: [this.solicitud31101State.polizaDeFianzaActual],
      numeroFolio: [
        { value: this.solicitud31101State.numeroFolio, disabled: false },
        [Validators.maxLength(250)],
      ],
      rfcInstitucion: [
        { value: this.solicitud31101State.rfcInstitucion, disabled: true },
        [Validators.maxLength(250)],
      ],
      fechaExpedicion: [
        { value: this.solicitud31101State.fechaExpedicion, disabled: false },
        [Validators.maxLength(10)],
      ],
      fechaInicioVigenciaNo: [
        {
          value: this.solicitud31101State.fechaInicioVigenciaNo,
          disabled: false,
        },
        [Validators.maxLength(10)],
      ],
      fechaFinVigenciaNo: [
        { value: this.solicitud31101State.fechaFinVigenciaNo, disabled: false },
        [Validators.maxLength(10)],
      ],
      fechaInicioVigencia: [
        {
          value: this.solicitud31101State.fechaInicioVigencia,
          disabled: false,
        },
        [Validators.maxLength(10)],
      ],
      fechaFinVigencia: [
        { value: this.solicitud31101State.fechaFinVigencia, disabled: false },
        [Validators.maxLength(10)],
      ],
      importeTotal: [
        { value: this.solicitud31101State.importeTotal, disabled: false },
        [Validators.maxLength(20)],
      ],
    });

    // Suscripción al estado global para actualizar el formulario con nuevos valores
    this.solicitud31101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud31101State) => {
          this.solicitud31101State = respuesta;
          this.polizaFianzaForm.patchValue({
            polizaFianzaActual: this.solicitud31101State.polizaFianzaActual,
            folioFianza: this.solicitud31101State.folioFianza,
            rfcAfianzadora: this.solicitud31101State.rfcAfianzadora,
            fechaExpedicionFianza:
              this.solicitud31101State.fechaExpedicionFianza,
            fecInicioVigenciaFianza:
              this.solicitud31101State.fecInicioVigenciaFianza,
            fecFinVigenciaFianza: this.solicitud31101State.fecFinVigenciaFianza,
            fianzaImporteTotal: this.solicitud31101State.fianzaImporteTotal,
          });
          this.polizaCreditoForm.patchValue({
            polizaDeFianzaActual: this.solicitud31101State.polizaDeFianzaActual,
            numeroFolio: this.solicitud31101State.numeroFolio,
            rfcInstitucion: this.solicitud31101State.rfcInstitucion,
            fechaExpedicion: this.solicitud31101State.fechaExpedicion,
            fechaInicioVigenciaNo:
              this.solicitud31101State.fechaInicioVigenciaNo,
            fechaFinVigenciaNo: this.solicitud31101State.fechaFinVigenciaNo,
            fechaInicioVigencia: this.solicitud31101State.fechaFinVigenciaNo,
            fechaFinVigencia: this.solicitud31101State.fechaFinVigencia,
            importeTotal: this.solicitud31101State.importeTotal,
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
    if (evento.id) {
      this.solicitud31101Store.actualizarRfcInstitucion('ZURE5401259D8');
    }
    this.solicitud31101Store.actualizarPolizaDeFianzaActual(evento.id);
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
        next: (respuesta: GarantiaCatalogo) => {
          this.nombreInstitucionCatalogo.catalogos = respuesta.creditoCatalogo;
          this.institucionFianzaCatalogo.catalogos = respuesta.fianzaCatalogo;
        },
      });
  }

  /**
   * Actualiza los datos de la póliza de fianza al seleccionar una institución.
   *
   * @param evento - Objeto de tipo `Catalogo` que representa la institución seleccionada.
   *
   * Si el objeto `evento` contiene un `id`, se actualiza el RFC de la afianzadora
   * en el store con un valor fijo ('ZURE5401259D9') y se actualiza el ID de la
   * póliza de fianza actual en el store `solicitud31101Store`.
   */
  seleccionaInstitucionFianza(evento: Catalogo): void {
    if (evento.id) {
      this.solicitud31101Store.actualizarRfcAfianzadora('ZURE5401259D9');
    }
    this.solicitud31101Store.actualizarPolizaFianzaActual(evento.id);
  }

  /**
   * Actualiza el número de folio de la póliza de fianza en el store.
   *
   * @param evento - Evento del input donde el usuario ingresa el número de folio.
   *
   * Extrae el valor del input y llama al método `actualizarFolioFianza` del store
   * `solicitud31101Store` para actualizar el estado global con el nuevo folio.
   */
  seleccionaNumeroFolio(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud31101Store.actualizarFolioFianza(VALOR);
  }

  /**
   * Actualiza el importe total de la fianza en el store.
   *
   * @param evento - Evento del input donde el usuario ingresa el importe total de la fianza.
   *
   * Extrae el valor del input y llama al método `actualizarFianzaImporteTotal` del store
   * `solicitud31101Store` para actualizar el estado global con el nuevo importe total.
   */
  seleccionaFianzaImporteTotal(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud31101Store.actualizarFianzaImporteTotal(VALOR);
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

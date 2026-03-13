import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  Catalogo,
  ConfiguracionColumna,
  MostrarPartidas,
  Notificacion,
  NotificacionesComponent,
  REGEX_DECIMAL,
  REGEX_NUMERO_ENTERO,
  REGEX_NUMERO_ENTERO_14_3,
  REGEX_NUMERO_ENTERO_POSITIVO,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  ID_PROCEDIMIENTO,
  OPINIONES_SOLICITUD,
  PRODUCTO_OPCION,
} from '../../constantes/importaciones-agropecuarias.enum';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite130107State,
  Tramite130107Store,
} from '../../../../estados/tramites/tramite130107.store';
import { CommonModule } from '@angular/common';
import { DatosDeLaMercanciaComponent } from '../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud.service';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { ImportacionesAgropecuariasService } from '../../services/importaciones-agropecuarias.service';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PaisProcendenciaComponent } from '../../../../shared/components/pais-procendencia/pais-procendencia.component';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { RepresentacionComponent } from '../../../../shared/components/representacion/representacion.component';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { Tramite130107Query } from '../../../../estados/queries/tramite130107.query';

/**
 * @component SolicitudComponent
 * @description
 * Componente encargado de gestionar la solicitud del trámite 130107.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    DatosDelTramiteComponent,
    DatosDeLaMercanciaComponent,
    PartidasDeLaMercanciaComponent,
    PaisProcendenciaComponent,
    RepresentacionComponent,
    NotificacionesComponent
  ],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
/**
 * @class SolicitudComponent
 * @descripcion
 * Componente que gestiona la solicitud del trámite 130107, incluyendo formularios reactivos,
 * tablas dinámicas y la interacción con el estado global del trámite.
 */
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * form
   * Formulario reactivo principal para capturar los datos de la solicitud.
   */
  partidasDelaMercanciaForm!: FormGroup;

  /**
   * jest.spyOnFormulario reactivo para los datos del trámite.
   */
  formDelTramite!: FormGroup;

  /**
   * jest.spyOnFormulario reactivo para los detalles de la mercancía.
   */
  mercanciaForm!: FormGroup;

  /**
   * formForTotalCount
   * Formulario reactivo para capturar los totales de las partidas.
   */
  formForTotalCount!: FormGroup;

  /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas.
   */
  isInvalidaPartidas: boolean = false;

  /**
   * Formulario reactivo para la selección de países.
   */
  paisForm!: FormGroup;

  /**
   * Formulario reactivo para la representación.
   */
  frmRepresentacionForm!: FormGroup;

  /**
   * Formulario reactivo para modificar las partidas de la mercancía.
   */
  modificarPartidasDelaMercanciaForm!: FormGroup;

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de partidas de la mercancía.
   */
  mostrarErroresPartidas = false;

  /**
   * Referencia al componente `PartidasDeLaMercanciaComponent` dentro de la vista.
   * Permite acceder a las propiedades y métodos públicos del componente hijo desde el componente padre.
   */
  @ViewChild(PartidasDeLaMercanciaComponent)
  partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;

  /**
   * tableHeaderData
   * Configuración de las columnas de la tabla dinámica.
   */
  tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] =
    PARTIDASDELAMERCANCIA_TABLA;

  /**
   * tableBodyData
   * Datos que se mostrarán en el cuerpo de la tabla dinámica.
   */
  tableBodyData: PartidasDeLaMercanciaModelo[] = [];

  /**
   * mostrarTabla
   * Bandera para mostrar u ocultar la tabla dinámica.
   */
  mostrarTabla = false;

  /**
   * CHECKBOX
   * Tipo de selección de la tabla dinámica (checkbox).
   */
  checkBox = TablaSeleccion.CHECKBOX;

  /**
   * getEstablecimientoTableData
   * Datos de configuración de la tabla obtenidos de un archivo JSON.
   */
  public getEstablecimientoTableData = [];

  /**
   * filaSeleccionada
   * Fila seleccionada en la tabla dinámica.
   */
  filaSeleccionada: PartidasDeLaMercanciaModelo[] = [];

  /**
   * jest.spyOnOpciones para el campo "producto".
   */
  productoOpciones: ProductoOpción[] = PRODUCTO_OPCION;

  /**
   * jest.spyOnCatálogo con valores de fracción arancelaria.
   */
  fraccionCatalogo: Catalogo[] = [];

  /**
   * jest.spyOnCatálogo con opciones de unidad de medida.
   */
  unidadCatalogo: Catalogo[] = [];

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de mercancía.
   */
  mostrarErroresMercancia = false;

  /**
   * jest.spyOnCampos de entrada configurables para detalles adicionales.
   */
  datosInputFields = [
    {
      /** label del campo de entrada. */
      label: 'Régimen al que se destinará la mercancía',
      /** placeholder del campo de entrada. */
      placeholder: 'Seleccione un documento',
      /** Indica si el campo es obligatorio. */
      required: true,
      /** Nombre del control asociado al campo en el formulario reactivo. */
      controlName: 'regimen',
    },
    {
      /** label del campo de entrada. */
      label: 'Clasificación del régimen',
      /** placeholder del campo de entrada. */
      placeholder: 'Seleccione un documento',
      /** Indica si el campo es obligatorio. */
      required: true,
      /** Nombre del control asociado al campo en el formulario reactivo. */
      controlName: 'clasificacion',
    },
  ];

  /**
   * jest.spyOnMatriz de catálogos adicionales para el formulario.
   */
  catalogosArray: Catalogo[][] = [[], []];

  /**
   * jest.spyOnOpciones de solicitud configurables.
   */
  opcionesSolicitud: ProductoOpción[] = OPINIONES_SOLICITUD;

  /**
   * jest.spyOnArreglo que almacena un catálogo de elementosDeBloque.
   */
  elementosDeBloque: Catalogo[] = [];

  /**
   * jest.spyOnArreglo que contiene un catálogo de países organizados por bloque.
   */
  paisesPorBloque: Catalogo[] = [];

  /**
   * jest.spyOnArreglo que guarda un catálogo de entidades federativas.
   */
  entidadFederativa: Catalogo[] = [];

  /**
   * jest.spyOnArreglo que almacena un catálogo de representaciones federales.
   */
  representacionFederal: Catalogo[] = [];

  /**
   * jest.spyOnArreglo de cadenas que representa las opciones seleccionables de rangos de días.
   */
  selectRangoDias: string[] = [];

  /**
   * jest.spyOnObjeto o constante que contiene los textos utilizados en la aplicación.
   */
  TEXTOS = TEXTOS;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * jest.spyOnState de la sección de importaciones agropecuarias.
   * @type {Tramite130107State}
   */
  private seccionState!: Tramite130107State;

  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * jest.spyOnArreglo que almacena las partidas a mostrar en la tabla.
   * @type {MostrarPartidas[]}
   */
  mostrarPartidas: MostrarPartidas[] = [];

  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si se debe mostrar el tooltip del valor de la factura en USD.
   */
  mostrarTooltipValorFacturaUSD: boolean = true;

  /**
   * jest.spyOnSujeto para gestionar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();


  /** jest.spyOnCatálogo con opciones de régimen aduanero. */
  fechasSeleccionadasDatos: string[] = [];

  /**
     * jest.spyOnEstado de la consulta actual.
     */
  consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param tramite130107Store Store para gestionar el estado del trámite 130107.
   * @param tramite130107Query Query para seleccionar datos del estado del trámite 130107.
   * @param importacionesAgropecuariasService Servicio para gestionar las importaciones agropecuarias.
   * @param consultaioQuery Query para seleccionar datos del estado de la consulta.
   */
  constructor(
    private fb: FormBuilder,
    private datosDeLaSolicitudService: DatosDeLaSolicitudService,
    private tramite130107Store: Tramite130107Store,
    private tramite130107Query: Tramite130107Query,
    private importacionesAgropecuariasService: ImportacionesAgropecuariasService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.inicializarFormularios();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * jest.spyOnCiclo de vida de Angular: inicializa formularios, suscripciones y opciones al cargar el componente.
   */
  ngOnInit(): void {
    this.configuracionFormularioSuscripciones();
    this.getRegimenCatalogo();
    this.getFraccionCatalogo();
    this.getEntidadesFederativasCatalogo();
    this.getBloque();

    this.tramite130107Query.mostrarTabla$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mostrarTabla) => {
        this.mostrarTabla = mostrarTabla;
      });

    this.tramite130107Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.seccionState = data;
        this.tableBodyData = data.tableBodyData || [];
      });
  }

  /**
   * jest.spyOnInicializa los formularios reactivos `formDelTramite` y `mercanciaForm`.
   */
  inicializarFormularios(): void {
    this.formDelTramite = this.fb.group({
      solicitud: [this.seccionState?.defaultSelect, Validators.required],
      regimen: [this.seccionState?.regimen, Validators.required],
      clasificacion: [this.seccionState?.clasificacion, Validators.required],
    });

    this.mercanciaForm = this.fb.group({
      producto: [this.seccionState?.defaultProducto],
      descripcion: [
        this.seccionState?.descripcion,
        [
          Validators.required,
          Validators.maxLength(500),
        ],
      ],
      fraccion: [this.seccionState?.fraccion, Validators.required],
      cantidad: [
        this.seccionState?.cantidad,
        [
          Validators.required,
          SolicitudComponent.validarNumeroTresDecimales,
          Validators.min(1),
        ],
      ],

      valorFacturaUSD: [
        this.seccionState?.valorFacturaUSD,
        [
          Validators.required,
          SolicitudComponent.validarNumeroTresDecimales,
          Validators.min(0.01),
        ],
      ],

      unidadMedida: [this.seccionState?.unidadMedida, Validators.required],
    });

    this.partidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        this.seccionState?.cantidadPartidasDeLaMercancia,
        [
          Validators.required,
          SolicitudComponent.validarCatorceEnterosTresDecimales,
          Validators.maxLength(18),
        ],
      ],
      descripcionPartidasDeLaMercancia: [
        this.seccionState?.descripcionPartidasDeLaMercancia,
        [Validators.required, Validators.maxLength(255)],
      ],
      valorPartidaUSDPartidasDeLaMercancia: [
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia,
        [
          Validators.required,
          Validators.min(0),
          SolicitudComponent.validarCatorceEnterosTresDecimales,
          Validators.maxLength(20),
        ],
      ],
    });

    this.paisForm = this.fb.group({
      bloque: [this.seccionState?.bloque],
      pais: [this.seccionState?.fechasSeleccionadas, Validators.required],
      usoEspecifico: [this.seccionState?.usoEspecifico, Validators.required],
      justificacionImportacionExportacion: [
        this.seccionState?.justificacionImportacionExportacion,
        [Validators.required],
      ],
      observaciones: [this.seccionState?.observaciones, Validators.maxLength(512)],
    });

    this.frmRepresentacionForm = this.fb.group({
      entidad: [this.seccionState?.entidad, Validators.required],
      representacion: [this.seccionState?.representacion, Validators.required],
    });

    this.modificarPartidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        this.seccionState?.modificarPartidasDelaMercanciaForm
          ?.cantidadPartidasDeLaMercancia,
        [
          Validators.required,
          SolicitudComponent.validarCatorceEnterosTresDecimales,
          Validators.maxLength(18),
        ],
      ],
      descripcionPartidasDeLaMercancia: [
        this.seccionState?.modificarPartidasDelaMercanciaForm
          ?.descripcionPartidasDeLaMercancia,
        [Validators.required, Validators.maxLength(255)],
      ],
      valorPartidaUSDPartidasDeLaMercancia: [
        this.seccionState?.modificarPartidasDelaMercanciaForm
          ?.valorPartidaUSDPartidasDeLaMercancia,
        [
          Validators.required,
          Validators.min(0),
          SolicitudComponent.validarCatorceEnterosTresDecimales,
          Validators.maxLength(20),
        ],
      ],
    });

    this.formForTotalCount = this.fb.group({
      cantidadTotal: [
        { value: this.seccionState?.cantidadTotal, disabled: true },
      ],
      valorTotalUSD: [
        { value: this.seccionState?.valorTotalUSD, disabled: true },
      ],
    });
  }

  /**
   * Valida todos los formularios y la selección de filas.
   * @returns {boolean} Indica si todos los formularios y la selección son válidos.
   */
  validarFormulario(): boolean {
    let isValid = true;
    if (this.formDelTramite.invalid) {
      this.formDelTramite.markAllAsTouched();
      isValid = false;
    }
    if (this.mercanciaForm.invalid) {
      this.mercanciaForm.markAllAsTouched();
      isValid = false;
    }
    if (this.tableBodyData.length === 0) {
      this.isInvalidaPartidas = true;
      isValid = false;
    } else if (this.tableBodyData.length > 0) {
      this.isInvalidaPartidas = false;
    }
    if (this.paisForm.invalid) {
      this.paisForm.markAllAsTouched();
      isValid = false;
    }
    if (this.frmRepresentacionForm.invalid) {
      this.frmRepresentacionForm.markAllAsTouched();
      isValid = false;
    }
    return isValid;
  }

  /**
   * jest.spyOnConfigura las suscripciones para actualizar formularios y almacenar estados.
   */
  configuracionFormularioSuscripciones(): void {
    this.tramite130107Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.seccionState = seccionState;

          this.formDelTramite.patchValue({
            solicitud: seccionState.defaultSelect,
            regimen: seccionState.regimen,
            clasificacion: seccionState.clasificacion,
          });

          this.mercanciaForm.patchValue({
            producto: seccionState.producto,
            descripcion: seccionState.descripcion,
            fraccion: seccionState.fraccion,
            cantidad: seccionState.cantidad,
            valorFacturaUSD: seccionState.valorFacturaUSD,
            unidadMedida: seccionState.unidadMedida,
          });

          this.paisForm.patchValue({
            bloque: seccionState.bloque,
            pais: seccionState.fechasSeleccionadas,
            usoEspecifico: seccionState.usoEspecifico,
            justificacionImportacionExportacion:
              seccionState.justificacionImportacionExportacion,
            observaciones: seccionState.observaciones,
          });

          this.frmRepresentacionForm.patchValue({
            entidad: seccionState.entidad,
            representacion: seccionState.representacion,
          });

          this.formForTotalCount.patchValue({
            cantidadTotal: seccionState.cantidadTotal,
            valorTotalUSD: seccionState.valorTotalUSD,
          });
        })
      )
      .subscribe();
  }

  /**
   * manejarlaFilaSeleccionada
   * Maneja la selección de filas en la tabla dinámica y actualiza el estado global.
   * Lista de filas seleccionadas.
   */
  manejarlaFilaSeleccionada(
    filasSeleccionadas: PartidasDeLaMercanciaModelo[]
  ): void {
    this.filaSeleccionada = filasSeleccionadas.length ? filasSeleccionadas : [];
    if (this.filaSeleccionada) {
      this.tramite130107Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }

  /**
   * validarYEnviarFormulario
   * Valida el formulario y muestra la tabla dinámica si es válido.
   */
  validarYEnviarFormulario(): void {
    if (this.partidasDelaMercanciaForm.invalid) {
      this.partidasDelaMercanciaForm.markAllAsTouched();
    } else {
      this.mostrarTabla = true;
      this.tramite130107Store.actualizarEstado({ mostrarTabla: true });
      const PRECIO_UNITARIO_USD = this.calcularImporteUnitario(
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia,
        this.seccionState?.cantidadPartidasDeLaMercancia
      );

      const UMT = this.unidadCatalogo
        .map((item) =>
          item.clave === this.seccionState?.unidadMedida ? item.descripcion : ''
        )
        .toString();

      const DATOS = [
        {
          id: String(this.tableBodyData.length + 1),
          cantidad: this.seccionState?.cantidadPartidasDeLaMercancia || '',
          unidadDeMedida: UMT || '',
          fraccionFrancelaria: this.seccionState?.fraccion || '',
          descripcion: this.seccionState?.descripcion || '',
          precioUnitarioUSD: PRECIO_UNITARIO_USD || '',
          totalUSD:
            this.seccionState?.valorPartidaUSDPartidasDeLaMercancia || '',
        },
      ];
      this.tableBodyData = [...this.tableBodyData, ...DATOS];
      this.tramite130107Store.actualizarEstado({ tableBodyData: this.tableBodyData });
      this.partidasDelaMercanciaForm.reset();

      const CANTIDAD_TOTAL = this.tableBodyData.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);
      const TOTAL_USD = this.tableBodyData.reduce((acc, item) => acc + parseFloat(item.totalUSD), 0);
      this.tramite130107Store.actualizarEstado({ cantidadTotal: CANTIDAD_TOTAL.toString() });
      this.tramite130107Store.actualizarEstado({ valorTotalUSD: TOTAL_USD.toString() });
    }
  }

  /**
   * navegarParaModificarPartida
   * Navega para modificar una partida específica y actualiza el estado global.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130107Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130107Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }

  /**
   * Maneja el cambio de bloque seleccionado.
   * Identificador del bloque seleccionado.
   */
  enCambioDeBloque(bloqueId: number): void {
    this.getPaisesPorBloque(bloqueId.toString());
  }

  /**
   * jest.spyOnActualiza el almacén con nuevos valores basados en eventos de formulario.
   * jest.spyOnEvento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;
    this.tramite130107Store.actualizarEstado({ [$event.campo]: VALOR });
    if ($event.campo === 'regimen') {
      const VALOR = this.formDelTramite.get('regimen')?.value;
      this.getClasificacionRegimenCatalogo(VALOR);
    }
    if ($event.campo === 'fraccion') {
      const VALOR = this.mercanciaForm.get('fraccion')?.value;
      this.getUnidadesMedidaTarifaria(VALOR);
    }
    if ($event.campo === 'entidad') {
      const VALOR = this.frmRepresentacionForm.get('entidad')?.value;
      this.getRepresentacionFederalCatalogo(VALOR);
    }
  }

  /**
   * Determina si el botón "Modificar" debe estar deshabilitado.
   * Este método verifica si no hay filas seleccionadas en la tabla dinámica.
   *
   */
  disabledModificar(): boolean {
    let disabled = false;
    if (this.filaSeleccionada.length === 0) {
      disabled = true;
    }
    return disabled;
  }

  /**
   *  Modifica los valores del formulario de partidas de la mercancía según el evento recibido.
   * @param evento
   */
  modificarPartidaSeleccionada(evento: PartidasDeLaMercanciaModelo): void {
    this.modificarPartidasDelaMercanciaForm.patchValue({
      cantidadPartidasDeLaMercancia: evento.cantidad,
      valorPartidaUSDPartidasDeLaMercancia: evento.totalUSD,
      descripcionPartidasDeLaMercancia: evento.descripcion,
    });
  }

  /**
   *  Actualiza la partida modificada en la tabla de datos.
   * @param evento
   */
  partidaModificada(evento: PartidasDeLaMercanciaModelo): void {
    this.tableBodyData = this.tableBodyData.map((item) => {
      if (item.id === evento.id) {
        return {
          ...item,
          cantidad: evento.cantidad,
          totalUSD: evento.totalUSD,
          precioUnitarioUSD: evento.precioUnitarioUSD,
          descripcion: evento.descripcion,
        };
      }
      return item;
    });
    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (acc, item) => acc + parseInt(item.cantidad, 10),
      0
    );
    const TOTAL_USD = this.tableBodyData.reduce(
      (acc, item) => acc + parseFloat(item.totalUSD),
      0
    );
    this.formForTotalCount.patchValue({
      cantidadTotal: CANTIDAD_TOTAL,
      valorTotalUSD: TOTAL_USD,
    });

    this.tramite130107Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
    });
  }

  /**
   * Elimina partidas de la tabla según los IDs recibidos y recalcula los totales.
   *
   * @param {string[]} evento - Arreglo de IDs (como cadenas) de las partidas que deben eliminarse.
   *
   * @description
   * Esta función filtra `tableBodyData` removiendo los elementos cuyo `id` coincida
   * con alguno de los valores en `evento`.
   * Luego recalcula:
   * - `cantidadTotal`: suma de todas las cantidades restantes.
   * - `valorTotalUSD`: suma del total en USD de cada partida.
   *
   * Finalmente, actualiza el formulario `formForTotalCount` con los nuevos valores.
   */

  partidasEliminadas(evento: string[]): void {
    this.tableBodyData = this.tableBodyData.filter(
      (item) => !evento.includes(String(item.id))
    );
    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (acc, item) => acc + parseInt(item.cantidad, 10),
      0
    );
    const TOTAL_USD = this.tableBodyData.reduce(
      (acc, item) => acc + parseFloat(item.totalUSD),
      0
    );
    this.formForTotalCount.patchValue({
      cantidadTotal: CANTIDAD_TOTAL,
      valorTotalUSD: TOTAL_USD,
    });
    this.tramite130107Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
    });
  }

  /**
   * Valida que un número tenga como máximo tres decimales.
   */
  static validarNumeroTresDecimales(
    control: AbstractControl
  ): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') {
      return null;
    }

    if (!REGEX_DECIMAL.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (REGEX_NUMERO_ENTERO_POSITIVO.test(VALOR)) {
      return { maximoTresDecimales: true };
    }

    return null;
  }

  /**
   * Calcula el importe unitario dado un valor total y una cantidad.
   * @param control Control del formulario que contiene el valor total y la cantidad.
   * @returns El importe unitario calculado.
   */
  static validarCatorceEnterosTresDecimales(
    control: AbstractControl
  ): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') {
      return null;
    }

    if (!REGEX_NUMERO_ENTERO.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (!REGEX_NUMERO_ENTERO_14_3.test(VALOR)) {
      return { validarCatorceEnterosTresDecimales: true };
    }

    return null;
  }

  /**
   * Valida los formularios de mercancía y partidas de la mercancía antes de permitir la carga de un archivo.
   */
  validarYCargarArchivo(): void {
    ['cantidad', 'valorFacturaUSD', 'fraccion'].forEach((controlName) => {
      const CONTROL = this.mercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });

    if (
      this.mercanciaForm.get('cantidad')?.invalid ||
      this.mercanciaForm.get('valorFacturaUSD')?.invalid ||
      this.mercanciaForm.get('fraccion')?.invalid
    ) {
      this.mostrarErroresMercancia = true;
      this.mostrarErroresPartidas = false;
      return;
    }

    this.mostrarErroresMercancia = false;

    if (!this.mercanciaForm.get('fraccion')?.value) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'info',
        modo: '',
        titulo: '',
        mensaje: 'Debes seleccionar una Fracción arancelaria',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'modal-sm',
      };
      this.mostrarNotificacion = true;
      return;
    }

    this.partidasDeLaMercanciaComponent.abrirCargarArchivoModalReal();
  }

  /**
   * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
   *
   * @returns {void}
   */
  getRegimenCatalogo(): void {
    this.importacionesAgropecuariasService
      .getRegimenCatalogo(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.catalogosArray[0] = data as Catalogo[];
      });
  }

  /**
   * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
   *
   * @returns {void}
   */
  getClasificacionRegimenCatalogo(VALOR: string): void {
    this.importacionesAgropecuariasService
      .getClasificacionRegimenCatalogo(VALOR)
      .subscribe((data) => {
        this.catalogosArray[1] = data as Catalogo[];
      });
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio y lo asigna a la propiedad `fraccionCatalogo`.
   *
   * @returns {void}
   */
  getFraccionCatalogo(): void {
    this.importacionesAgropecuariasService
      .getFraccionCatalogoService(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.fraccionCatalogo = data?.map((item) => ({
          ...item,
          descripcion: `${item.clave} - ${item.descripcion}`,
        }));
      });
  }

  /**
   * Obtiene las unidades de medida tarifaria basadas en la fracción arancelaria seleccionada.
   * @param FRACCION_ID
   */
  getUnidadesMedidaTarifaria(FRACCION_ID: string): void {
    this.importacionesAgropecuariasService
      .getUMTService(this.idProcedimiento.toString(), FRACCION_ID)
      .subscribe((data) => {
        this.unidadCatalogo = data as Catalogo[];
        if (this.unidadCatalogo.length > 0) {
          this.mercanciaForm
            .get('unidadMedida')
            ?.setValue(this.unidadCatalogo[0]?.clave || '');
          this.tramite130107Store.actualizarEstado({
            unidadMedida: this.unidadCatalogo[0]?.clave || '',
          });
        }
      });
  }

  /**
   * Obtiene los bloques desde el servicio y los asigna a la propiedad `elementosDeBloque`.
   *
   * @returns {void}
   */
  getBloque(): void {
    this.importacionesAgropecuariasService
      .getBloqueService(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.elementosDeBloque = data as Catalogo[];
      });
  }

  /**
   *  Obtiene los países por bloque desde el servicio y los asigna a la propiedad `paisesPorBloque`.
   * @param ID
   */
  getPaisesPorBloque(ID: string): void {
    this.importacionesAgropecuariasService
      .getPaisesPorBloqueService(this.idProcedimiento.toString(), ID)
      .subscribe((data) => {
        this.paisesPorBloque = data as Catalogo[];
      });
  }

  /**
   * Obtiene el catálogo de entidades federativas desde el servicio y lo asigna a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  getEntidadesFederativasCatalogo(): void {
    this.importacionesAgropecuariasService
      .getEntidadesFederativasCatalogo(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.entidadFederativa = data as Catalogo[];
      });
  }

  /**
   *  Obtiene el catálogo de representaciones federales basado en la entidad seleccionada.
   * @param cveEntidad
   */
  getRepresentacionFederalCatalogo(cveEntidad: string): void {
    this.importacionesAgropecuariasService
      .getRepresentacionFederalCatalogo(cveEntidad)
      .subscribe((data) => {
        this.representacionFederal = data as Catalogo[];
      });
  }

  /**
   * Maneja la selección de todos los países.
   * @param evento
   */
  todosPaisesSeleccionados(evento: boolean): void {
    if (evento) {
      this.importacionesAgropecuariasService
        .getTodosPaisesSeleccionados(this.idProcedimiento.toString())
        .subscribe((data) => {
          this.paisesPorBloque = data as Catalogo[];
        });
    }
  }

  /**
   * Obtiene las partidas a mostrar desde el servicio y las asigna a la propiedad `mostrarPartidas`.
   *
   * @returns {void}
   */
  getMostrarPartidas(): void {
    let idSolicitud = 0;
    if (this.seccionState?.idSolicitud) {
      idSolicitud = this.seccionState?.idSolicitud;
    }
    this.importacionesAgropecuariasService
      .getMostrarPartidasService(idSolicitud)
      .subscribe((data) => {
        if (data.codigo === '00') {
          this.mostrarPartidas = data.datos as MostrarPartidas[];
          if (this.mostrarPartidas.length > 0) {
            const TABLE_BODY = this.mostrarPartidas.map((item, i) => ({
              id: i?.toString(),
              cantidad: item.candidatoEliminar?.toString() || '',
              unidadDeMedida: item.unidadMedidaDescripcion?.toString() || '',
              fraccionFrancelaria: item.fraccionClave?.toString() || '',
              descripcion: item.descripcionOriginal?.toString() || '',
              precioUnitarioUSD: item.importeUnitarioUSD?.toString() || '',
              totalUSD: item.importeTotalUSD?.toString() || '',
              fraccionTigiePartidasDeLaMercancia: '',
              fraccionDescripcionPartidasDeLaMercancia: '',
            }));
            this.tramite130107Store.actualizarEstado({
              tableBodyData: TABLE_BODY,
            });
          }
          this.tramite130107Store.actualizarEstado({
            mostrarPartidas: this.mostrarPartidas,
          });
        }
      });
  }

  /**
   * Maneja la selección de fechas y actualiza el estado global.
   * @param evento
   */
  fechasSeleccionadas(evento: string[]): void {
    this.tramite130107Store.actualizarEstado({ fechasSeleccionadas: evento });
  }

  /**
   * Calcula el importe unitario en USD basado en la cantidad de partidas y el total en USD.
   * @param cantidadPartidas
   * @param cantidadUSD
   * @returns
   */
  calcularImporteUnitario(
    cantidadPartidas: string,
    cantidadUSD: string
  ): string {
    const TOTAL_PARTIDAS = Number(cantidadPartidas) || 0;
    const TOTAL_USD = Number(cantidadUSD) || 0;

    if (TOTAL_PARTIDAS === 0) {
      return '0';
    }

    const MAXIMO_DECIMALES = 3;
    const IMPORTE_UNITARIO_USD = TOTAL_USD / TOTAL_PARTIDAS;

    return IMPORTE_UNITARIO_USD.toFixed(MAXIMO_DECIMALES).toString();
  }

  /**
* Llama a los métodos de obtención de catálogos necesarios.
* Solo se ejecuta después de que los datos de la solicitud han sido cargados y el estado actualizado.
*/
  loadCatalogos(seccionState: Record<string, unknown>): void {
    if (this.consultaState && !this.consultaState.create) {
      if (seccionState['regimen']) {
        this.getClasificacionRegimenCatalogo(
          seccionState['regimen']?.toString() ?? ''
        );
      }
      if (seccionState['fraccion']) {
        this.getUnidadesMedidaTarifaria(
          seccionState['fraccion']?.toString() ?? ''
        );
      }
      if (seccionState['entidad']) {
        this.getRepresentacionFederalCatalogo(
          seccionState['entidad']?.toString() ?? ''
        );
      }

      if ((seccionState['fechasSeleccionadas'] as string[]).length > 0) {
        this.getMostrartodosPaisesSeleccionadosEvent(seccionState);
      }
    }
  }

  /**
   * Obtiene y muestra todos los países seleccionados en función del estado de la sección.
   * @param seccionState Estado actual de la sección del trámite.
   */
  getMostrartodosPaisesSeleccionadosEvent(seccionState: Record<string, unknown>): void {
    this.datosDeLaSolicitudService.getTodosPaisesSeleccionados(this.idProcedimiento.toString()).subscribe((data) => {
      const PAISES_POR_BLOQUE = data as Catalogo[];
      this.fechasSeleccionadasDatos = (seccionState['fechasSeleccionadas'] as string[]).map((fecha: string) => {
        const PAIS = PAISES_POR_BLOQUE.find(p => p.clave === fecha);
        return PAIS ? PAIS.descripcion : '';
      });
    });
  }

  /**
   * jest.spyOnCiclo de vida de Angular: limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

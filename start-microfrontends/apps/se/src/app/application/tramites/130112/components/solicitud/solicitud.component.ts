import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  Catalogo,
  ConsultaioQuery,
  ConsultaioState,
  Notificacion,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, take, takeUntil } from 'rxjs';
import {
  Tramite130112State,
  Tramite130112Store,
} from '../../estados/tramites/tramites130112.store';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-material-de-investigacion-cientifica-pasos.enum';
import { ImportacionMaterialDeInvestigacionCientificaService } from '../../services/importacion-material-de-investigacion-cientifica.service';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PartidasDeLaMercanciaComponent } from '../partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import PartidasdelaTable from '@libs/shared/theme/assets/json/130112/partidas-de-la.json';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { Tramite130112Query } from '../../estados/queries/tramite130112.query';
import fractionValues from '@libs/shared/theme/assets/json/130112/fraccion_arancelaria.json';
import solicitudeSelectVal from '@libs/shared/theme/assets/json/130112/solicitud-select.json';
import unidadOptions from '@libs/shared/theme/assets/json/130112/unidad_da.json';

/**
 * Componente para gestionar la solicitud de mercancías.
 * Contiene formularios reactivos y opciones configurables relacionadas con el trámite.
 */
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * form
   * Formulario reactivo principal para capturar los datos de la solicitud.
   */
  partidasDelaMercanciaForm!: FormGroup;
  /*
   * modificarPartidasDelaMercanciaForm
   * Formulario reactivo para modificar las partidas.
   */
  modificarPartidasDelaMercanciaForm!: FormGroup;

  /**
   *  Formulario reactivo para los datos del trámite.
   */
  formDelTramite!: FormGroup;

  /**
   *  Formulario reactivo para los detalles de la mercancía.
   */
  mercanciaForm!: FormGroup;

  /**
   * formForTotalCount
   * Formulario reactivo para capturar los totales de las partidas.
   */
  formForTotalCount!: FormGroup;

  /**
   * Formulario reactivo para la selección de países.
   */
  paisForm!: FormGroup;

  /**
   * Formulario reactivo para la representación.
   */
  frmRepresentacionForm!: FormGroup;

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
  mostrarTabla = true;

  /**
   * CHECKBOX
   * Tipo de selección de la tabla dinámica (checkbox).
   */
  checkBox = TablaSeleccion.CHECKBOX;

  /**
   * getEstablecimientoTableData
   * Datos de configuración de la tabla obtenidos de un archivo JSON.
   */
  public getEstablecimientoTableData = PartidasdelaTable;

  /**
   * filaSeleccionada
   * Fila seleccionada en la tabla dinámica.
   */
  filaSeleccionada: PartidasDeLaMercanciaModelo[] = [];

  /**
   *  Opciones para el campo "producto".
   */
  productoOpciones: ProductoOpción[] = [];

  /**
   *  Opciones para el campo "fraccionDescription".
   */
  fraccionDescription: Catalogo[] = [];

  /**
   *  Catálogo con valores de fracción arancelaria.
   */

  fraccionCatalogo: Catalogo[] = [];

  /**
   *  Catálogo con opciones de unidad de medida.
   */
  unidadCatalogo: Catalogo[] = [];

  /**
   *  Campos de entrada configurables para detalles adicionales.
   */
  datosInputFields = [
    {
      label: 'Régimen al que se destinará la mercancía',
      placeholder: 'Seleccione un documento',
      required: true,
      controlName: 'regimen',
    },
    {
      label: 'Clasificación del régimen',
      placeholder: 'Seleccione un documento',
      required: true,
      controlName: 'clasificacion',
    },
  ];

  /**
   *  Matriz de catálogos adicionales para el formulario.
   */
  catalogosArray: Catalogo[][] = [[],[]];
  /**
   *  Opciones de solicitud configurables.
   */
  opcionesSolicitud: ProductoOpción[] = [];

  /**
   *  Sujeto para gestionar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();
  /**
   *  Arreglo que almacena un catálogo de elementosDeBloque.
   * @type {Catalogo[]}
   */
  elementosDeBloque: Catalogo[] = [];
  /**
   *  Arreglo que contiene un catálogo de países organizados por bloque.
   * @type {Catalogo[]}
   */
  paisesPorBloque: Catalogo[] = [];
  /**
   *  Arreglo que guarda un catálogo de entidades federativas.
   * @type {Catalogo[]}
   */
  entidadFederativa: Catalogo[] = [];
  /**
   *  Arreglo que almacena un catálogo de representaciones federales.
   * @type {Catalogo[]}
   */
  representacionFederal: Catalogo[] = [];
  /**
   *  Arreglo de cadenas que representa las opciones seleccionables de rangos de días.
   * @type {string[]}
   */
  selectRangoDias: string[] = [];
  /**
   * @property {string} idProcedimiento
   * @description
   * Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado interno de la sección actual del trámite 130110.
   * Utilizado para gestionar y almacenar la información relacionada con esta sección.
   * Propiedad privada.
   */
  private seccionState!: Tramite130112State;
  /**
   * Indica si se debe mostrar el error de clasificación.
   */
  mostrarErrorClasificacion = false;

  /*
   * Indica si se debe mostrar el tooltip del valor de la factura en USD.
   */
  mostrarTooltipValorFacturaUSD = true;
  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de partidas de la mercancía.
   */
  mostrarErroresPartidas = false;

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de mercancía.
   */
  mostrarErroresMercancia = false;

  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;
  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Arreglo que contiene los elementos del catálogo de clasificación de régimen.
   * Cada elemento es de tipo `Catalogo` y representa una opción disponible para la selección en el formulario de solicitud.
   */
  catalogoClasificacionRegimen: Catalogo[] = [];

  /**
   * Arreglo que contiene los diferentes regímenes disponibles en el catálogo.
   * Cada elemento es de tipo `Catalogo`.
   *
   * @type {Catalogo[]}
   */
  catalogoRegimenes: Catalogo[] = [];

  /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas.
   */
  isInvalidaPartidas: boolean = false;

  /**
   * Referencia al componente `PartidasDeLaMercanciaComponent` dentro de la vista.
   * Permite acceder a las propiedades y métodos públicos del componente hijo desde el componente padre.
   */
  @ViewChild(PartidasDeLaMercanciaComponent)
  partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;

  /**
   * Arreglo que contiene las fracciones y descripciones de las partidas de la mercancía.
   * Cada elemento es un objeto del tipo `Catalogo`, que representa una opción seleccionable
   * en el catálogo correspondiente a las partidas de mercancía.
   */
  fraccionDescripcionPartidasDeLaMercancia: Catalogo[] = [];

  /**
   * Identificador del procedimiento asociado al trámite.
   * @type {string}
   */
  procedureId: string = "130112";

  /**
   * Estado de la consulta actual.
   * Contiene información relevante sobre el estado de la consulta, como si está en modo de solo lectura.
   * @type {ConsultaioState}
   */
  consultaState!: ConsultaioState;

  /**
   * Arreglo que contiene las fechas seleccionadas en el formulario.
   * @type {string[]}
   */
  fechasSeleccionadasDatos: string[] = [];

  /**
   * Constructor del componente.
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {HttpClient} http - Servicio para realizar solicitudes HTTP.
   * @param {Tramite130112Store} tramite130112Store - Store para gestionar el estado del trámite 130112.
   * @param {Tramite130112Query} tramite130112Query - Query para consultar el estado del trámite 130112.
   * @param {ImportacionMaterialDeInvestigacionCientificaService} importacionMaterialDeInvestigacionCientificaService - Servicio para la exportación de minerales de hierro.
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tramite130112Store: Tramite130112Store,
    private tramite130112Query: Tramite130112Query,
    private importacionMaterialDeInvestigacionCientificaService: ImportacionMaterialDeInvestigacionCientificaService,
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
   *  Ciclo de vida de Angular: inicializa formularios, suscripciones y opciones al cargar el componente.
   */
  ngOnInit(): void {
    this.tramite130112Store.actualizarEstado({
      solicitud: 'TISOL.I',
      producto: 'CONDMER.N',
      defaultSelect: 'TISOL.I',
      defaultProducto: 'CONDMER.N',
    });
    this.suscribirseAEstadoDeSolicitud();
    this.opcionesDeBusqueda();
    this.fetchEntidadFederativa();
    this.listaDePaisesDisponibles();
    this.getRegimenes();
    this.getFraccionArancelaria();
    this.tramite130112Query
      .select((state) => state.tableBodyData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tableBodyData = data || [];
      });
  }
  
  /**
   * Se suscribe a los cambios del estado de la solicitud en el store de Tramite130112.
   * Cada vez que el estado cambia, actualiza la propiedad interna `seccionState` con los nuevos datos.
   * Esta suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  suscribirseAEstadoDeSolicitud(): void {
    this.tramite130112Query.selectSolicitud$
      ?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite130112State) => {
        this.seccionState = data;

        this.tableBodyData = this.seccionState.tableBodyData || [];

        this.partidasDelaMercanciaForm.patchValue({
          cantidadPartidasDeLaMercancia:
            this.seccionState.cantidadPartidasDeLaMercancia,
          valorPartidaUSDPartidasDeLaMercancia:
            this.seccionState.valorPartidaUSDPartidasDeLaMercancia,
          descripcionPartidasDeLaMercancia:
            this.seccionState.descripcionPartidasDeLaMercancia,
        });

        this.formDelTramite.patchValue({
          solicitud: this.seccionState.defaultSelect,
          regimen: this.seccionState.regimen,
          clasificacion: this.seccionState.clasificacion,
        });

        this.mercanciaForm.patchValue({
          producto: this.seccionState.producto,
          descripcion: this.seccionState.descripcion,
          fraccion: this.seccionState.fraccion,
          cantidad: this.seccionState.cantidad,
          valorFacturaUSD: this.seccionState.valorFacturaUSD,
          unidadMedida: this.seccionState.unidadMedida,
        });

        this.paisForm.patchValue({
          bloque: this.seccionState.bloque,
          pais: this.seccionState.fechasSeleccionadas,
          usoEspecifico: this.seccionState.usoEspecifico,
          justificacionImportacionExportacion:
            this.seccionState.justificacionImportacionExportacion,
          observaciones: this.seccionState.observaciones,
        });

        this.frmRepresentacionForm.patchValue({
          entidad: this.seccionState.entidad,
          representacion: this.seccionState.representacion,
        });

        this.formForTotalCount.patchValue({
          cantidadTotal: this.seccionState.cantidadTotal,
          valorTotalUSD: this.seccionState.valorTotalUSD,
        });
      });
  }
  /**
   *  Inicializa los formularios reactivos `formDelTramite` y `mercanciaForm`.
   */
  inicializarFormularios(): void {
    this.formDelTramite = this.fb.group({
      solicitud: [this.seccionState?.solicitud, Validators.required],
      regimen: [this.seccionState?.regimen, Validators.required],
      clasificacion: [this.seccionState?.clasificacion, Validators.required],
    });

    this.mercanciaForm = this.fb.group({
      producto: [this.seccionState?.producto],
      descripcion: [
        this.seccionState?.descripcion,
        [
          Validators.required,
          SolicitudComponent.validarSinCaracterAnguloDerecho,
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
      fraccionTigiePartidasDeLaMercancia: [
        this.seccionState?.fraccionTigiePartidasDeLaMercancia,
        [Validators.required, Validators.maxLength(255)],
      ],
      fraccionDescripcionPartidasDeLaMercancia: [
        this.seccionState?.fraccionDescripcionPartidasDeLaMercancia,
      ],
    });
    this.modificarPartidasDelaMercanciaForm = this.fb.group({
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
      fraccionTigiePartidasDeLaMercancia: [
        this.seccionState?.fraccionTigiePartidasDeLaMercancia,
        [Validators.required, Validators.maxLength(255)],
      ],
      fraccionDescripcionPartidasDeLaMercancia: [
        this.seccionState?.fraccionDescripcionPartidasDeLaMercancia,
      ],
    });
    this.formularioTotalCount(
      String(this.seccionState?.cantidadTotal),
      String(this.seccionState?.valorTotalUSD)
    );
    this.paisForm = this.fb.group({
      bloque: [this.seccionState?.bloque],
      pais: [this.seccionState?.fechasSeleccionadas, Validators.required],
      usoEspecifico: [
        this.seccionState?.usoEspecifico,
        [
          Validators.required,
          SolicitudComponent.validarSinCaracterAnguloDerecho,
        ],
      ],
      justificacionImportacionExportacion: [
        this.seccionState?.justificacionImportacionExportacion,
        [
          Validators.required,
          SolicitudComponent.validarSinCaracterAnguloDerecho,
        ],
      ],
      observaciones: [
        this.seccionState?.observaciones,
        Validators.maxLength(512),
      ],
    });
    this.frmRepresentacionForm = this.fb.group({
      entidad: [this.seccionState?.entidad, Validators.required],
      representacion: [this.seccionState?.representacion, Validators.required],
    });
  }

  /**
   * formularioTotalCount
   * Crea el formulario reactivo para capturar los totales de las partidas.
   */
  formularioTotalCount(cantidadTotal: string, valorTotalUSD: string): void {
    this.formForTotalCount = this.fb.group({
      cantidadTotal: [{ value: cantidadTotal, disabled: true }],
      valorTotalUSD: [{ value: valorTotalUSD, disabled: true }],
    });
  }

  /**
   *  Solicita opciones configurables para los formularios desde archivos JSON.
   */
  opcionesDeBusqueda(): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getSolicitudeOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.opcionesSolicitud = data.options;
          this.tramite130112Store.actualizarEstado({
            solicitud: data.options[0]?.value || '',
            defaultSelect: data.defaultSelect || 'TISOL.I',
          });
        },
        error: (error) =>
          console.error('Error loading solicitude options:', error),
      });

    this.importacionMaterialDeInvestigacionCientificaService
      .getProductoOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.productoOpciones = data.options;
          this.tramite130112Store.actualizarEstado({
            producto: data.options[0]?.value || 'CONDMER.N',
            defaultProducto: data.options[0]?.value || 'CONDMER.N',
          });
        },
      });
  }
  /**
   * manejarlaFilaSeleccionada
   * Maneja la selección de filas en la tabla dinámica y actualiza el estado global.
   * Lista de filas seleccionadas.
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  manejarlaFilaSeleccionada(
    filasSeleccionadas: PartidasDeLaMercanciaModelo[]
  ): void {
    this.filaSeleccionada = filasSeleccionadas.length ? filasSeleccionadas : [];
    if (this.filaSeleccionada) {
      this.tramite130112Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }

  /**
   * validarYEnviarFormulario
   * Valida el formulario y muestra la tabla dinámica si es válido.
   */
  validarYEnviarFormulario(): void {
    ['cantidad', 'valorFacturaUSD'].forEach((controlName) => {
      const CONTROL = this.mercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });

    if (
      this.mercanciaForm.get('cantidad')?.invalid ||
      this.mercanciaForm.get('valorFacturaUSD')?.invalid
    ) {
      this.mostrarErroresMercancia = true;
      this.mostrarErroresPartidas = false;
      return;
    }

    this.mostrarErroresMercancia = false;

    [
      'cantidadPartidasDeLaMercancia',
      'valorPartidaUSDPartidasDeLaMercancia',
      'descripcionPartidasDeLaMercancia',
      'fraccionTigiePartidasDeLaMercancia',
    ].forEach((controlName) => {
      const CONTROL = this.partidasDelaMercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });

    if (
      this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')
        ?.invalid ||
      this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')
        ?.invalid ||
      this.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')
        ?.invalid ||
      this.partidasDelaMercanciaForm.get('fraccionTigiePartidasDeLaMercancia')
        ?.invalid
    ) {
      this.mostrarErroresPartidas = true;
      return;
    }

    // Si fracción no tiene valor, mostrar popup y detener flujo
    if (
      !this.mercanciaForm.get('fraccion')?.value ||
      !this.partidasDelaMercanciaForm.get(
        'fraccionDescripcionPartidasDeLaMercancia'
      )?.value
    ) {
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
    const CURRENT_TABLE =
      this.tramite130112Query.getValue().tableBodyData || [];
    const CANTIDAD = Number(
      this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.value
    );
    const TOTALUSD = Number(
      this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')
        ?.value
    );

    const PRECIOUNITARIO_USD =
      CANTIDAD && !isNaN(CANTIDAD) && !isNaN(TOTALUSD)
        ? (TOTALUSD / CANTIDAD).toFixed(2)
        : '';

    const NEW_ROW: PartidasDeLaMercanciaModelo = {
      id: Date.now().toString(),
      cantidad: this.partidasDelaMercanciaForm.get(
        'cantidadPartidasDeLaMercancia'
      )?.value,
      totalUSD: this.partidasDelaMercanciaForm.get(
        'valorPartidaUSDPartidasDeLaMercancia'
      )?.value,
      descripcion: this.partidasDelaMercanciaForm.get(
        'descripcionPartidasDeLaMercancia'
      )?.value,
      unidadDeMedida:
        this.unidadCatalogo.find(
          (f) =>
            String(f.clave) ===
            String(this.mercanciaForm.get('unidadMedida')?.value)
        )?.descripcion || '',
      fraccionFrancelaria:
        this.fraccionCatalogo.find(
          (f) =>
            String(f.clave) ===
            String(this.mercanciaForm.get('fraccion')?.value)
        )?.descripcion || '',
      precioUnitarioUSD: PRECIOUNITARIO_USD,
      fraccionTigiePartidasDeLaMercancia: this.partidasDelaMercanciaForm.get(
        'fraccionTigiePartidasDeLaMercancia'
      )?.value,
      fraccionDescripcionPartidasDeLaMercancia:
        this.partidasDelaMercanciaForm.get(
          'fraccionDescripcionPartidasDeLaMercancia'
        )?.value,
    };

    const UPDATED_TABLE = [...CURRENT_TABLE, NEW_ROW];
    this.tramite130112Store.actualizarEstado({
      tableBodyData: UPDATED_TABLE,
      mostrarTabla: true,
    });

    this.tableBodyData = UPDATED_TABLE;
    this.mostrarTabla = true;

    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );

    this.tramite130112Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD),
    });

    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
    this.partidasDelaMercanciaForm.reset();
    this.mostrarErroresPartidas = false;
  }

  /**
   * navegarParaModificarPartida
   * Navega para modificar una partida específica y actualiza el estado global.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130112Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130112Store.actualizarEstado({
        filaSeleccionada: this.filaSeleccionada,
      });
    }
  }

  /**
   * Método para obtener la lista de entidades federativas.
   */
  fetchEntidadFederativa(): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getEntidadesFederativasCatalogo(this.idProcedimiento.toString())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.entidadFederativa = data;
      });
  }

  /**
   * Obtiene los catálogos de regímenes y clasificaciones de régimen desde el servicio.
   * Actualiza las propiedades del componente con los datos obtenidos.
   */
  getRegimenes(): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getRegimenes(this.procedureId)
      .subscribe((data) => {
        this.catalogosArray[0] = data;
      });
  }

  /**
   * Obtiene el catálogo de clasificaciones de régimen desde el servicio.
   * Actualiza las propiedades del componente con los datos obtenidos.
   */
  getClasificacionRegimen(valor: string): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getRegimenClasificacion(this.procedureId, valor.toString())
      .subscribe((data) => {
        this.catalogosArray[1] = data;
      });
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio.
   * Actualiza la propiedad del componente con los datos obtenidos.
   */
  getFraccionArancelaria(): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getFraccionesArancelarias(this.procedureId)
      .subscribe((data) => {
        this.fraccionCatalogo = data?.map((item) => ({
          ...item,
          descripcion: `${item.clave} - ${item.descripcion}`,
        }));
      });
  }

  /**
   * Obtiene el catálogo de unidades de medida desde el servicio.
   * Actualiza la propiedad del componente con los datos obtenidos.
   */
  getUMTCatalogo(FRACCION_ID: string): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getUMTCatalogo(this.procedureId, FRACCION_ID)
      .subscribe((data) => {
        this.unidadCatalogo = data || [];
      });
  }

  /**
   * Método para obtener la lista de representaciones federales.
   */
  fetchRepresentacionFederal(): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getRepresentacionFederal()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.representacionFederal = data;
      });
  }
  /**
   * Método para obtener la lista de países disponibles.
   */
  listaDePaisesDisponibles(): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getBloque(this.procedureId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.elementosDeBloque = data;
      });
  }

  /**
   * Método para obtener la lista de países por bloque.
   * @param {number} _bloqueId - Identificador del bloque.
   */
  fetchPaisesPorBloque(_bloqueId: number): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getPaisesPorBloque(this.procedureId, String(_bloqueId))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.paisesPorBloque = data;
        this.selectRangoDias = this.paisesPorBloque.map(
          (pais: Catalogo) => pais.descripcion
        );
      });
  }

  /**
   * Maneja el cambio de bloque seleccionado.
   * @param {number} bloqueId - Identificador del bloque seleccionado.
   */
  enCambioDeBloque(bloqueId: number): void {
    this.fetchPaisesPorBloque(bloqueId);
  }

  /**
   * setValoresStore
   * Establece valores en el store.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;
    this.tramite130112Store.actualizarEstado({ [$event.campo]: VALOR });
    if ($event.campo === 'regimen') {
      const VALOR = this.formDelTramite.get('regimen')?.value;
      this.getClasificacionRegimen(VALOR);
    }

    if ($event.campo === 'fraccion') {
      const VALOR = this.mercanciaForm.get('fraccion')?.value;
      this.getUMTCatalogo(VALOR);
    }

    if ($event.campo === 'entidad') {
      const VALOR = this.frmRepresentacionForm.get('entidad')?.value;
      this.getRepresentacionFederalCatalogo(VALOR);
    }

    if ($event.campo === 'fraccionTigiePartidasDeLaMercancia') {
      const VALOR = this.partidasDelaMercanciaForm.get(
        'fraccionTigiePartidasDeLaMercancia'
      )?.value;
      this.getFraccionDescripcionPartidasDeLaMercancia(VALOR);
    }
  }

  /**
   * onFechasSeleccionadasChange
   * Maneja el cambio en las fechas seleccionadas y actualiza el estado global.
   * @param evento - Arreglo de cadenas con las fechas seleccionadas.
   * @returns {void}
   */
  onFechasSeleccionadasChange(evento: string[]): void {
    this.tramite130112Store.actualizarEstado({ fechasSeleccionadas: evento });
  }

  /**
   *  Obtiene el catálogo de representaciones federales basado en la entidad seleccionada.
   * @param cveEntidad
   */
  getRepresentacionFederalCatalogo(cveEntidad: string): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getRepresentacionFederalCatalogo(
        this.idProcedimiento.toString(),
        cveEntidad
      )
      .subscribe((data) => {
        this.representacionFederal = data as Catalogo[];
      });
  }

  /**
   * Obtiene la descripción de la fracción y las partidas de la mercancía asociadas a un ID específico.
   *
   * Este método llama al servicio `importacionMaterialDeInvestigacionCientificaService` para recuperar
   * la información relacionada con la fracción y las partidas de la mercancía, utilizando el identificador
   * proporcionado. Los datos obtenidos se asignan a la propiedad `fraccionDescripcionPartidasDeLaMercancia`.
   *
   * @param ID - Identificador de la fracción o partida de la mercancía para la cual se desea obtener la descripción.
   */
  getFraccionDescripcionPartidasDeLaMercancia(ID: string): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getFraccionDescripcionPartidasDeLaMercanciaService(
        this.idProcedimiento.toString(),
        ID
      )
      .subscribe((data) => {
        this.fraccionDescripcionPartidasDeLaMercancia = data as Catalogo[];
      });
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
   *  Ciclo de vida de Angular: limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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

    if (!/^\d+(\.\d+)?$/.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (/^\d+\.\d{4,}$/.test(VALOR)) {
      return { maximoTresDecimales: true };
    }

    return null;
  }

  /**
   * Valida que un string no contenga el carácter de ángulo derecho (›).
   */
  static validarSinCaracterAnguloDerecho(
    control: AbstractControl
  ): ValidationErrors | null {
    if (typeof control.value === 'string' && control.value.includes('›')) {
      return { validarSinCaracterAnguloDerecho: true };
    }
    return null;
  }

  /*
      Valida que un número tenga como máximo 14 enteros y 3 decimales.
      */
  static validarCatorceEnterosTresDecimales(
    control: AbstractControl
  ): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') {
      return null;
    }

    if (!/^\d*\.?\d*$/.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (!/^\d{1,14}(\.\d{1,3})?$/.test(VALOR)) {
      return { validarCatorceEnterosTresDecimales: true };
    }

    return null;
  }
  /*
   * Método que se ejecuta cuando se eliminan partidas de la tabla.
   * Actualiza los datos de la tabla y recalcula los totales.
   */
  onPartidasEliminadas(ids: string[]): void {
    this.tableBodyData = this.tableBodyData.filter(
      (row) => !ids.includes(row.id)
    );
    this.mostrarTabla = this.tableBodyData.length > 0;

    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );
    this.tramite130112Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD),
    });
    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
    this.tramite130112Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
      mostrarTabla: this.mostrarTabla,
    });
  }

  /**
   * onModificarPartidaSeleccionada
   * Maneja la modificación de una partida seleccionada.
   * @param partida - La partida que se va a modificar.
   */
  onModificarPartidaSeleccionada(partida: PartidasDeLaMercanciaModelo): void {
    this.modificarPartidasDelaMercanciaForm.patchValue({
      cantidadPartidasDeLaMercancia: partida.cantidad,
      descripcionPartidasDeLaMercancia: partida.descripcion,
      valorPartidaUSDPartidasDeLaMercancia: partida.totalUSD,
      fraccionTigiePartidasDeLaMercancia:
        partida.fraccionTigiePartidasDeLaMercancia,
      fraccionDescripcionPartidasDeLaMercancia:
        partida.fraccionDescripcionPartidasDeLaMercancia || '',
    });
  }
  /**
   * Valida los formularios de mercancía y partidas de la mercancía antes de permitir la carga de un archivo.
   */
  validarYCargarArchivo(): void {
    ['cantidad', 'valorFacturaUSD'].forEach((controlName) => {
      const CONTROL = this.mercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });

    if (
      this.mercanciaForm.get('cantidad')?.invalid ||
      this.mercanciaForm.get('valorFacturaUSD')?.invalid
    ) {
      this.mostrarErroresMercancia = true;
      this.mostrarErroresPartidas = false;
      return;
    }

    this.mostrarErroresMercancia = false;

    [
      'cantidadPartidasDeLaMercancia',
      'valorPartidaUSDPartidasDeLaMercancia',
      'descripcionPartidasDeLaMercancia',
      'fraccionTigiePartidasDeLaMercancia',
    ].forEach((controlName) => {
      const CONTROL = this.partidasDelaMercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });

    if (
      this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')
        ?.invalid ||
      this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')
        ?.invalid ||
      this.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')
        ?.invalid ||
      this.partidasDelaMercanciaForm.get('fraccionTigiePartidasDeLaMercancia')
        ?.invalid
    ) {
      this.mostrarErroresPartidas = true;
      return;
    }

    if (
      !this.mercanciaForm.get('fraccion')?.value ||
      !this.partidasDelaMercanciaForm.get(
        'fraccionDescripcionPartidasDeLaMercancia'
      )?.value
    ) {
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
   * onPartidaModificada
   * Maneja la modificación de una partida.
   * @param partida - La partida que se va a modificar.
   */
  onPartidaModificada(partida: PartidasDeLaMercanciaModelo): void {
    this.tableBodyData = this.tableBodyData.map((row) =>
      row.id === partida.id ? { ...row, ...partida } : row
    );
    this.tramite130112Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
    });

    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );
    this.tramite130112Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD),
    });
    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
  }

  /**
   * Marca todos los campos de los formularios como tocados para mostrar errores de validación.
   * Este método se ejecuta cuando la validación falla y es necesario mostrar todos los errores
   */
  marcarCamposComoTocados(): void {
    // Marcar todos los formularios como tocados para activar la visualización de validación
    if (this.formDelTramite) {
      this.formDelTramite.markAllAsTouched();
    }
    if (this.mercanciaForm) {
      this.mercanciaForm.markAllAsTouched();
    }
    if (this.paisForm) {
      this.paisForm.markAllAsTouched();
    }
    if (this.frmRepresentacionForm) {
      this.frmRepresentacionForm.markAllAsTouched();
    }

    // Asegurar que los mensajes de error se muestren para todos los campos de validación cuando falla la validación
    this.mostrarErrorClasificacion = true;
    this.mostrarErroresPartidas = true;
    this.mostrarErroresMercancia = true;
  }

  /**
   * Valida todos los formularios del componente y verifica que existan partidas en la tabla.
   * Este método realiza una validación integral de todos los formularios reactivos del componente
   */
  validarFormulario(): boolean {
    const IS_VALID =
      this.formDelTramite.valid &&
      this.mercanciaForm.valid &&
      this.paisForm.valid &&
      this.frmRepresentacionForm.valid &&
      this.tableBodyData.length > 0;

    if (!IS_VALID) {
      this.marcarCamposComoTocados();
    }

    return IS_VALID;
  }

  /**
   * Llama a los métodos de obtención de catálogos necesarios.
   * Solo se ejecuta después de que los datos de la solicitud han sido cargados y el estado actualizado.
   */
  loadCatalogos(seccionState: Record<string, unknown>): void {
    if (this.consultaState && !this.consultaState.create) {
      if (seccionState['regimen']) {
        this.getClasificacionRegimen(seccionState['regimen']?.toString() ?? '');
      }
      if (seccionState['fraccion']) {
        this.getUMTCatalogo(seccionState['fraccion']?.toString() ?? '');
      }
      if (seccionState['entidad']) {
        this.getRepresentacionFederalCatalogo(
          seccionState['entidad']?.toString() ?? ''
        );
      }
      if (seccionState['fraccionTigiePartidasDeLaMercancia']) {
        this.getFraccionDescripcionPartidasDeLaMercancia(
          seccionState['fraccionTigiePartidasDeLaMercancia']?.toString() ?? ''
        );
      }
      if ((seccionState['fechasSeleccionadas'] as string[]).length > 0) {
        this.getMostrartodosPaisesSeleccionadosEvent(seccionState);
      }
    }
  }

  /**
   * Obtiene y muestra todos los países seleccionados basados en el estado de la sección.
   * @param seccionState Estado de la sección que contiene las fechas seleccionadas.
   */
  getMostrartodosPaisesSeleccionadosEvent(seccionState: Record<string, unknown>): void {
    this.importacionMaterialDeInvestigacionCientificaService.getPaisesTodoService(this.idProcedimiento.toString())
    .pipe(take(1))
    .subscribe((data) => {
      const PAISES_POR_BLOQUE = data as Catalogo[];
      this.fechasSeleccionadasDatos = (seccionState['fechasSeleccionadas'] as string[]).map((fecha: string) => {
        const PAIS = PAISES_POR_BLOQUE.find(p => p.clave === fecha);
        return PAIS ? PAIS.descripcion : '';
      });
    });
  }

  /**
   *  Maneja la selección de todos los países.
   * @param evento
   */
  todosPaisesSeleccionados(evento: boolean): void {
    if (evento) {
      this.importacionMaterialDeInvestigacionCientificaService
        .getTodosPaisesSeleccionados(this.idProcedimiento.toString())
        .subscribe((data) => {
          this.paisesPorBloque = data as Catalogo[];
        });
    }
  }
}

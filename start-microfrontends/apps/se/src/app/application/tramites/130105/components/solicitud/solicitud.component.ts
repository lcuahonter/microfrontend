import {
  Catalogo,
  ConfiguracionColumna,
  ConsultaioQuery,
  ConsultaioState,
  REG_X,
  REGEX_NUMERO_DECIMAL_ENTERO,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  ID_PROCEDIMIENTO,
  OPINIONES_SOLICITUD,
  PRODUCTO_OPCION,
} from '../../constants/importacion-vehiculos-usados-donacion-pasos.enum';
import {
  MostrarPartidas,
  Notificacion,
  REGEX_DECIMAL,
  REGEX_NUMERO_ENTERO_POSITIVO,
  TablaSeleccion,  
} from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite130105State,
  Tramite130105Store,
} from '../../../../estados/tramites/tramites130105.store';
import { ImportacionVehiculosUsadosDonacionService } from '../../services/importacion-vehiculos-usados-donacion.service';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { Tramite130105Query } from '../../../../estados/queries/tramite130105.query';

/**
 * jest.spyOnComponente para gestionar la solicitud de mercancías.
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
   * jest.spyOnIndica si las partidas seleccionadas son inválidas.
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
   * jest.spyOnMatriz de catálogos adicionales para el formulario.
   */
  catalogosArray: Catalogo[][] = [[], []];
  /**
   * jest.spyOnOpciones de solicitud configurables.
   */
  opcionesSolicitud: ProductoOpción[] = OPINIONES_SOLICITUD;

  /**
   * jest.spyOnSujeto para gestionar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();
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
   * Estado interno de la sección actual del trámite 130110.
   * Utilizado para gestionar y almacenar la información relacionada con esta sección.
   * Propiedad privada.
   */
  private seccionState!: Tramite130105State;

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
   * jest.spyOnEstado de la consulta actual.
   */
  consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   */
  constructor(
    private fb: FormBuilder,
    private tramite130105Store: Tramite130105Store,
    private tramite130105Query: Tramite130105Query,
    private importacionVehiculosUsadosDonacionService: ImportacionVehiculosUsadosDonacionService,
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
    this.tramite130105Query.mostrarTabla$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mostrarTabla) => {
        this.mostrarTabla = mostrarTabla || false;
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
          Validators.minLength(10),
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
          Validators.pattern(REG_X.SOLO_NUMEROS),
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
          Validators.pattern(REGEX_NUMERO_DECIMAL_ENTERO),
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
      observaciones: [this.seccionState?.observaciones],
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
          Validators.pattern(REG_X.SOLO_NUMEROS),
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
          Validators.pattern(REGEX_NUMERO_DECIMAL_ENTERO),
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
    this.tramite130105Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.seccionState = seccionState;
          this.tableBodyData = seccionState.tableBodyData || [];

          this.partidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia:
              seccionState.cantidadPartidasDeLaMercancia,
            valorPartidaUSDPartidasDeLaMercancia:
              seccionState.valorPartidaUSDPartidasDeLaMercancia,
            descripcionPartidasDeLaMercancia:
              seccionState.descripcionPartidasDeLaMercancia,
          });

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
      this.tramite130105Store.actualizarEstado({
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
    } else if (this.mercanciaForm.invalid) {
      this.mercanciaForm.markAllAsTouched();
    } else {
      this.mostrarTabla = true;
      this.tramite130105Store.actualizarEstado({ mostrarTabla: true });
      const PRECIO_UNITARIO_USD = this.calcularImporteUnitario(
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia || '',
        this.seccionState?.cantidadPartidasDeLaMercancia || ''
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
      this.partidasDelaMercanciaForm.reset();
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
      this.tramite130105Store.actualizarEstado({
        tableBodyData: this.tableBodyData,
        cantidadTotal: CANTIDAD_TOTAL.toString(),
        valorTotalUSD: TOTAL_USD.toString(),
      });
    }
  }

  /**
   * navegarParaModificarPartida
   * Navega para modificar una partida específica y actualiza el estado global.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130105Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130105Store.actualizarEstado({
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
    this.tramite130105Store.actualizarEstado({ [$event.campo]: VALOR });
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

    this.tramite130105Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
      cantidadTotal: CANTIDAD_TOTAL.toString(),
      valorTotalUSD: TOTAL_USD.toString(),
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
    this.tramite130105Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
      cantidadTotal: CANTIDAD_TOTAL.toString(),
      valorTotalUSD: TOTAL_USD.toString(),
    });
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
    this.importacionVehiculosUsadosDonacionService
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
    this.importacionVehiculosUsadosDonacionService
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
    this.importacionVehiculosUsadosDonacionService
      .getFraccionCatalogoService(this.idProcedimiento.toString())
      .subscribe((data) => {
        this.fraccionCatalogo = data?.map((item) => ({
          ...item,
          descripcion: `${item.clave} - ${item.descripcion}`,
        }));
      });
  }

  /**
   *  Obtiene las unidades de medida tarifaria basadas en la fracción arancelaria seleccionada.
   * @param FRACCION_ID
   */
  getUnidadesMedidaTarifaria(FRACCION_ID: string): void {
    this.importacionVehiculosUsadosDonacionService
      .getUMTService(this.idProcedimiento.toString(), FRACCION_ID)
      .subscribe((data) => {
        this.unidadCatalogo = data as Catalogo[];
        if (this.unidadCatalogo.length > 0) {
          this.mercanciaForm
            .get('unidadMedida')
            ?.setValue(this.unidadCatalogo[0]?.clave || '');
          this.tramite130105Store.actualizarEstado({
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
    this.importacionVehiculosUsadosDonacionService
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
    this.importacionVehiculosUsadosDonacionService
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
    this.importacionVehiculosUsadosDonacionService
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
    this.importacionVehiculosUsadosDonacionService
      .getRepresentacionFederalCatalogo(
        this.idProcedimiento.toString(),
        cveEntidad
      )
      .subscribe((data) => {
        this.representacionFederal = data as Catalogo[];
      });
  }

  /**
   *  Maneja la selección de todos los países.
   * @param evento
   */
  todosPaisesSeleccionados(evento: boolean): void {
    if (evento) {
      this.importacionVehiculosUsadosDonacionService
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
    this.importacionVehiculosUsadosDonacionService
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
            this.tramite130105Store.actualizarEstado({
              tableBodyData: TABLE_BODY,
            });
          }
          this.tramite130105Store.actualizarEstado({
            mostrarPartidas: this.mostrarPartidas,
          });
        }
      });
  }

  /**
   *  Maneja la selección de fechas y actualiza el estado global.
   * @param evento
   */
  fechasSeleccionadas(evento: string[]): void {
    this.tramite130105Store.actualizarEstado({ fechasSeleccionadas: evento });
  }

  /**
   *  Calcula el importe unitario en USD basado en la cantidad de partidas y el total en USD.
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
    }
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
   * jest.spyOnCiclo de vida de Angular: limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

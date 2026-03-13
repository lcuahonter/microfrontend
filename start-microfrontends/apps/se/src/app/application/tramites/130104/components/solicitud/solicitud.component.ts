import { Catalogo, ConfiguracionColumna, ConsultaioQuery, ConsultaioState, REGEX_NUMERO_DECIMAL_ENTERO, REG_X } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ID_PROCEDIMIENTO, OPINIONES_SOLICITUD, PRODUCTO_OPCION } from '../../constants/importacion-otros-vehiculos-usados-pasos.enum';
import { MostrarPartidas, Notificacion, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Subject, map, take, takeUntil } from 'rxjs';
import { Tramite130104State, Tramite130104Store } from '../../../../estados/tramites/tramite130104.store';
import { HttpClient } from '@angular/common/http';
import { ImportacionOtrosVehiculosUsadosService } from '../../services/importacion-otros-vehiculos-usados.service';
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { Tramite130104Query } from '../../../../estados/queries/tramite130104.query';
import solicitudeSelectVal from '@libs/shared/theme/assets/json/130104/solicitud-select.json';


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
  tableHeaderData: ConfiguracionColumna<PartidasDeLaMercanciaModelo>[] = PARTIDASDELAMERCANCIA_TABLA;
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

  /** jest.spyOnCatálogo con opciones de régimen aduanero. */
  fechasSeleccionadasDatos: string[] = [];
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
  catalogosArray: Catalogo[][] = solicitudeSelectVal;

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
  private seccionState!: Tramite130104State;

  /**
 *  jest.spyOnIndica si las partidas seleccionadas son inválidas. 
 */
  isInvalidaPartidas: boolean = false;

  /**
   * jest.spyOnIdentificador del procedimiento actual.
   * @type {number}
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Formulario reactivo para modificar las partidas de la mercancía.
   */
  modificarPartidasDelaMercanciaForm!: FormGroup;

  /**
   * jest.spyOnArreglo que almacena las partidas a mostrar en la tabla.
   * @type {MostrarPartidas[]}
   */
  mostrarPartidas: MostrarPartidas[] = [];

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de mercancía.
   */
  mostrarErroresMercancia = false;

  /**
   * Bandera que indica si se deben mostrar los mensajes de error para el formulario de partidas de la mercancía.
   */
  mostrarErroresPartidas = false;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /*
   * @descripcion Indica si se debe mostrar una notificación.
   */
  mostrarNotificacion = false;

  /**
   * Referencia al componente `PartidasDeLaMercanciaComponent` dentro de la vista.
   * Permite acceder a las propiedades y métodos públicos del componente hijo desde el componente padre.
   */
  @ViewChild(PartidasDeLaMercanciaComponent)
  partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;

  /**
   * jest.spyOnEstado de la consulta actual.
   */
  consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private tramite130104Store: Tramite130104Store,
    private tramite130104Query: Tramite130104Query,
    private importacionOtrosVehiculosUsadosService: ImportacionOtrosVehiculosUsadosService,
    private consultaioQuery: ConsultaioQuery,
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
      .subscribe()

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

    this.tramite130104Query.mostrarTabla$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mostrarTabla) => {
        this.mostrarTabla = mostrarTabla;
      });
  }

  /**
   * jest.spyOnInicializa los formularios reactivos `formDelTramite` y `mercanciaForm`.
   */

  inicializarFormularios(): void {
    this.formDelTramite = this.fb.group({
      solicitud: [this.seccionState?.solicitud, Validators.required],
      regimen: [this.seccionState?.regimen, Validators.required],
      clasificacion: [this.seccionState?.clasificacion, Validators.required],
    });

    this.mercanciaForm = this.fb.group({
      producto: [],
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
          Validators.pattern(REG_X.SOLO_NUMEROS),
          Validators.min(1),
        ],
      ],

      valorFacturaUSD: [
        this.seccionState?.valorFacturaUSD,
        [
          Validators.required,
          Validators.pattern(REG_X.DECIMALES_DOS_LUGARES),
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
      bloque: [''],
      usoEspecifico: ['', Validators.required],
      justificacionImportacionExportacion: ['', [Validators.required]],
      observaciones: [''],
    });
    this.frmRepresentacionForm = this.fb.group({
      entidad: ['', Validators.required],
      representacion: ['', Validators.required],
    });

    this.modificarPartidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        '',
        [
          Validators.required,
          Validators.pattern(REG_X.SOLO_NUMEROS),
          Validators.maxLength(18),
        ],
      ],
      descripcionPartidasDeLaMercancia: [
        '',
        [Validators.required, Validators.maxLength(255)],
      ],
      valorPartidaUSDPartidasDeLaMercancia: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(REGEX_NUMERO_DECIMAL_ENTERO),
          Validators.maxLength(20),
        ],
      ],
    });

    this.formForTotalCount = this.fb.group({
      cantidadTotal: [{ value: this.seccionState?.cantidadTotal, disabled: true }],
      valorTotalUSD: [{ value: this.seccionState?.valorTotalUSD, disabled: true }],
    });
  }

  /**
   * jest.spyOnConfigura las suscripciones para actualizar formularios y almacenar estados.
   */
  configuracionFormularioSuscripciones(): void {
    this.tramite130104Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$),
        map((seccionState) => {
          this.seccionState = seccionState;
          this.tableBodyData = seccionState.tableBodyData;
          this.partidasDelaMercanciaForm.patchValue({
            cantidadPartidasDeLaMercancia:
              seccionState.cantidadPartidasDeLaMercancia,
            valorPartidaUSDPartidasDeLaMercancia:
              seccionState.valorPartidaUSDPartidasDeLaMercancia,
            descripcionPartidasDeLaMercancia:
              seccionState.descripcionPartidasDeLaMercancia,
          });

          this.formDelTramite.patchValue({
            solicitud: seccionState.solicitud,
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
      ).subscribe();
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
      item => !evento.includes(String(item.id))
    );
    const CANTIDAD_TOTAL = this.tableBodyData.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);
    const TOTAL_USD = this.tableBodyData.reduce((acc, item) => acc + parseFloat(item.totalUSD), 0);
    this.formForTotalCount.patchValue({
      cantidadTotal: CANTIDAD_TOTAL,
      valorTotalUSD: TOTAL_USD,
    });
    this.tramite130104Store.actualizarEstado({
      tableBodyData: this.tableBodyData
    })
  }

  /**
   *  Actualiza la partida modificada en la tabla de datos.
   * @param evento 
   */
  partidaModificada(evento: PartidasDeLaMercanciaModelo): void {
    this.tableBodyData = this.tableBodyData.map(item => {
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
    const CANTIDAD_TOTAL = this.tableBodyData.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);
    const TOTAL_USD = this.tableBodyData.reduce((acc, item) => acc + parseFloat(item.totalUSD), 0);
    this.formForTotalCount.patchValue({
      cantidadTotal: CANTIDAD_TOTAL,
      valorTotalUSD: TOTAL_USD,
    });

    this.tramite130104Store.actualizarEstado({
      tableBodyData: this.tableBodyData
    })
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
   * manejarlaFilaSeleccionada
   * Maneja la selección de filas en la tabla dinámica y actualiza el estado global.
   * Lista de filas seleccionadas.
   */
  manejarlaFilaSeleccionada(filasSeleccionadas: PartidasDeLaMercanciaModelo[]): void {
    this.filaSeleccionada = filasSeleccionadas.length
      ? filasSeleccionadas
      : [];
    if (this.filaSeleccionada) {
      this.tramite130104Store.actualizarEstado({ filaSeleccionada: this.filaSeleccionada });
    }
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
   * Obtiene las partidas a mostrar desde el servicio y las asigna a la propiedad `mostrarPartidas`.
   *
   * @returns {void}
   */
  getMostrarPartidas(): void {
    let idSolicitud = 0;
    if (this.seccionState?.idSolicitud) {
      idSolicitud = this.seccionState?.idSolicitud;
    }
    this.importacionOtrosVehiculosUsadosService.getMostrarPartidasService(idSolicitud).subscribe((data) => {
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
            fraccionTigiePartidasDeLaMercancia: "",
            fraccionDescripcionPartidasDeLaMercancia: "",
          }));
          this.tramite130104Store.actualizarEstado({ tableBodyData: TABLE_BODY })
        }
        this.tramite130104Store.actualizarEstado({ mostrarPartidas: this.mostrarPartidas });
      }
    });
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
      this.tramite130104Store.actualizarEstado({ mostrarTabla: true });
      const PRECIO_UNITARIO_USD = this.calcularImporteUnitario(this.seccionState?.valorPartidaUSDPartidasDeLaMercancia, this.seccionState?.cantidadPartidasDeLaMercancia);
      const UMT = this.unidadCatalogo.map(item => item.clave === this.seccionState?.unidadMedida ? item.descripcion : '').toString();
      const DATOS = [
        {
          "id": String(this.tableBodyData.length + 1),
          "cantidad": this.seccionState?.cantidadPartidasDeLaMercancia || "",
          "unidadDeMedida": UMT || "",
          "fraccionFrancelaria": this.seccionState?.fraccion || "",
          "descripcion": this.seccionState?.descripcion || "",
          "precioUnitarioUSD": PRECIO_UNITARIO_USD || "",
          "totalUSD": this.seccionState?.valorPartidaUSDPartidasDeLaMercancia || ""
        }
      ];
      this.tableBodyData = [...this.tableBodyData, ...DATOS];

      this.tramite130104Store.actualizarEstado({ tableBodyData: this.tableBodyData });

      this.partidasDelaMercanciaForm.reset();
      const CANTIDAD_TOTAL = this.tableBodyData.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);
      const TOTAL_USD = this.tableBodyData.reduce((acc, item) => acc + parseFloat(item.totalUSD), 0);
      this.formForTotalCount.patchValue({
        cantidadTotal: CANTIDAD_TOTAL,
        valorTotalUSD: TOTAL_USD,
      });
    }
  }

  /**
 *  Calcula el importe unitario en USD basado en la cantidad de partidas y el total en USD.
 * @param cantidadPartidas 
 * @param cantidadUSD 
 * @returns 
 */
  calcularImporteUnitario(cantidadPartidas: string, cantidadUSD: string): string {
    const TOTAL_PARTIDAS = Number(cantidadPartidas);
    const TOTAL_USD = Number(cantidadUSD);

    if (TOTAL_PARTIDAS === 0) {
      return '0';
    }

    const MAXIMO_DECIMALES = 3;
    const IMPORTE_UNITARIO_USD = TOTAL_USD / TOTAL_PARTIDAS;

    return IMPORTE_UNITARIO_USD.toFixed(MAXIMO_DECIMALES).toString();
  }

  /**
   * navegarParaModificarPartida
   * Navega para modificar una partida específica y actualiza el estado global.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130104Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130104Store.actualizarEstado({ filaSeleccionada: this.filaSeleccionada });
    }
  }

  /**
   *  Obtiene los países por bloque desde el servicio y los asigna a la propiedad `paisesPorBloque`.
   * @param ID 
   */
  getPaisesPorBloque(ID: string): void {
    this.importacionOtrosVehiculosUsadosService.getPaisesPorBloqueService(this.idProcedimiento.toString(), ID).subscribe((data) => {
      this.paisesPorBloque = data as Catalogo[];
    });
  }

  /**
   * Obtiene el catálogo de entidades federativas desde el servicio y lo asigna a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  getEntidadesFederativasCatalogo(): void {
    this.importacionOtrosVehiculosUsadosService.getEntidadesFederativasCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.entidadFederativa = data as Catalogo[];
    })
  }

  /**
   *  Obtiene el catálogo de representaciones federales basado en la entidad seleccionada.
   * @param cveEntidad 
   */
  getRepresentacionFederalCatalogo(cveEntidad: string): void {
    this.importacionOtrosVehiculosUsadosService.getRepresentacionFederalCatalogo(this.idProcedimiento.toString(), cveEntidad).subscribe((data) => {
      this.representacionFederal = data as Catalogo[];
    });
  }

  /**
  * Maneja el cambio de bloque seleccionado.
  * Identificador del bloque seleccionado.
  */
  enCambioDeBloque(bloqueId: number): void {
    this.getPaisesPorBloque(bloqueId.toString());
  }

  /**
   * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
   *
   * @returns {void}
   */
  getClasificacionRegimenCatalogo(VALOR: string): void {
    this.importacionOtrosVehiculosUsadosService.getClasificacionRegimenCatalogo(VALOR).subscribe((data) => {
      this.catalogosArray[1] = data as Catalogo[];
    });
  }

  /**
  * Obtiene el catálogo de tratados o acuerdos desde el servicio y lo asigna a la propiedad `tratadoAcuerdoCertificado`.
  *
  * @returns {void}
  */
  getRegimenCatalogo(): void {
    this.importacionOtrosVehiculosUsadosService.getRegimenCatalogo(this.idProcedimiento.toString()).subscribe((data) => {
      this.catalogosArray[0] = data as Catalogo[];
    });
  }

  /**
   *  Obtiene las unidades de medida tarifaria basadas en la fracción arancelaria seleccionada.
   * @param FRACCION_ID 
   */
  getUnidadesMedidaTarifaria(FRACCION_ID: string): void {
    this.importacionOtrosVehiculosUsadosService.getUMTService(this.idProcedimiento.toString(), FRACCION_ID).subscribe((data) => {
      this.unidadCatalogo = data as Catalogo[];
      if (this.unidadCatalogo.length > 0) {
        this.mercanciaForm.get('unidadMedida')?.setValue(this.unidadCatalogo[0]?.clave || '');
        this.tramite130104Store.actualizarEstado({ unidadMedida: this.unidadCatalogo[0]?.clave || '' });
      }
    });
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio y lo asigna a la propiedad `fraccionCatalogo`.
   *
   * @returns {void}
   */
  getFraccionCatalogo(): void {
    this.importacionOtrosVehiculosUsadosService.getFraccionCatalogoService(this.idProcedimiento.toString()).subscribe((data) => {
      this.fraccionCatalogo = data?.map(item => ({
        ...item,
        descripcion: `${item.clave} - ${item.descripcion}`
      }));
    });
  }

  /**
   * Obtiene los bloques desde el servicio y los asigna a la propiedad `elementosDeBloque`.
   *
   * @returns {void}
   */
  getBloque(): void {
    this.importacionOtrosVehiculosUsadosService.getBloqueService(this.idProcedimiento.toString()).subscribe((data) => {
      this.elementosDeBloque = data as Catalogo[];
    });
  }

  /**
   * jest.spyOnActualiza el almacén con nuevos valores basados en eventos de formulario.
   * jest.spyOnEvento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;
    this.tramite130104Store.actualizarEstado({ [$event.campo]: VALOR });
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
 *  Maneja la selección de fechas y actualiza el estado global.
 * @param evento 
 */
  fechasSeleccionadas(evento: string[]): void {
    this.tramite130104Store.actualizarEstado({ fechasSeleccionadas: evento });
  }


  /**
   * Determina si el botón "Modificar" debe estar deshabilitado.
   * Este método verifica si no hay filas seleccionadas en la tabla dinámica.
   * 
   */
  disabledModificar(): boolean {
    let disabled = false;
    if (this.filaSeleccionada.length === 0) {
      disabled = true
    }
    return disabled;
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
   * Obtiene y muestra todos los países seleccionados basados en el estado de la sección.
   * @param seccionState Estado de la sección que contiene las fechas seleccionadas.
   */
  getMostrartodosPaisesSeleccionadosEvent(seccionState: Record<string, unknown>): void {
    this.importacionOtrosVehiculosUsadosService.getPaisesTodoService(this.idProcedimiento.toString()).pipe(take(1)).subscribe((data) => {
      const PAISES_POR_BLOQUE = data as Catalogo[];
      this.fechasSeleccionadasDatos = (seccionState['fechasSeleccionadas'] as string[]).map((fecha: string) => {
        const PAIS = PAISES_POR_BLOQUE.find(p => p.clave === fecha);
        return PAIS ? PAIS.descripcion : '';
      });
    });
  }

  /**
   *  Maneja el evento de selección de todos los países.
   * @param event Indica si todos los países han sido seleccionados.
   */
  todosPaisesSeleccionadosEvent(event: boolean): void {
    if (event) {
      this.importacionOtrosVehiculosUsadosService.getPaisesTodoService(this.idProcedimiento.toString()).subscribe((data) => {
        this.paisesPorBloque = data as Catalogo[];
      });
    }
  }

  /**
   * jest.spyOnCiclo de vida de Angular: limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

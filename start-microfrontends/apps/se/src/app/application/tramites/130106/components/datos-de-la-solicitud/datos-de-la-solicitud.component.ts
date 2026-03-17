/* Importación de componentes, servicios, formularios y datos necesarios para el manejo del trámite 130106 */
/* Incluye componentes UI, validaciones, operadores RxJS, estados y datos JSON relacionados */
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Catalogo, ConfiguracionColumna, NotificacionesComponent, REGEX_DECIMAL,REGEX_NUMERO_ENTERO, REGEX_NUMERO_ENTERO_14_3, REGEX_NUMERO_ENTERO_POSITIVO, } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, Notificacion } from '@ng-mf/data-access-user';
import { DATOS_INPUT_FIELDS, ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { Solicitud130106State, Tramite130106Store } from '../../../../estados/tramites/tramite130106.store';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosDeLaMercanciaComponent } from "../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component";
import { DatosDelTramiteComponent } from "../../../../shared/components/datos-del-tramite/datos-del-tramite.component";
import { PARTIDASDELAMERCANCIA_TABLA } from '../../../../shared/constantes/partidas-de-la-mercancia.enum';
import { PaisProcendenciaComponent } from "../../../../shared/components/pais-procendencia/pais-procendencia.component";
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import PartidasdelaTable from '@libs/shared/theme/assets/json/130202/partidas-de-la.json';
import { RepresentacionComponent } from "../../../../shared/components/representacion/representacion.component";
import { Solocitud130106Service } from '../../service/service130106.service';
import { TEXTOS } from '../../../../shared/constantes/representacion-federal.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { Tramite130106Query } from '../../../../estados/queries/tramite130106.query';
/**
 * Componente Angular que representa la sección "Datos de la solicitud" del trámite 130106.
 * 
 * Este componente es autónomo (standalone) y se encarga de:
 * - Mostrar y gestionar un formulario reactivo con validaciones.
 * - Sincronizar datos con el estado global usando un store (Tramite130106Store).
 * - Deshabilitar o habilitar campos según el modo de solo lectura.
 * - Mostrar selectores de catálogo y botones de opción personalizados.
 * 
 * El formulario incluye los campos: solicitud, régimen, clasificación del régimen, producto y descripción.
 * Además, utiliza componentes personalizados como `CatalogoSelectComponent` e `InputRadioComponent`.
 */
@Component({
  selector: 'app-datos-de-la-solicitude',
  standalone: true,
  imports: [ReactiveFormsModule, DatosDeLaMercanciaComponent, PartidasDeLaMercanciaComponent, PaisProcendenciaComponent, RepresentacionComponent, NotificacionesComponent, DatosDelTramiteComponent],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss'
})
/* Componente que gestiona los datos de la solicitud 130106 mediante formularios reactivos.  
   Soporta modo solo lectura y sincronización con el estado global a través de Store y Query. */
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {

  /*
     * Indica si se debe mostrar el tooltip del valor de la factura en USD.
     */
  mostrarTooltipValorFacturaUSD = true;
  /**
   * form
   * Formulario reactivo principal para capturar los datos de la solicitud.
   */
  partidasDelaMercanciaForm!: FormGroup;
  /**
   * @description Formulario reactivo para los datos del trámite.
   */
  formDelTramite!: FormGroup;

  /**
   * @description Formulario reactivo para los detalles de la mercancía.
   */
  mercanciaForm!: FormGroup;
  /**
   * formForTotalCount
   * Formulario reactivo para capturar los totales de las partidas.
   */
  formForTotalCount!: FormGroup;
  /**
   * Formulario reactivo para la selección de países.
   * @type {FormGroup}
   */
  paisForm!: FormGroup;
  /**
   * Formulario reactivo para la representación.
   * @type {FormGroup}
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
   * @description Opciones para el campo "producto".
   */
  productoOpciones: ProductoOpción[] = [];
  /**
   * @description Catálogo con valores de fracción arancelaria.
   * Será cargado desde la API mediante `getFraccionArancelaria()`.
   */
  fraccionCatalogo: Catalogo[] = [];

  /**
   * @description Catálogo con opciones de unidad de medida.
   */
  unidadCatalogo: Catalogo[] = [];
  /**
   * @description Campos de entrada configurables para detalles adicionales.
   */
  datosInputFields = DATOS_INPUT_FIELDS;

  // Catálogo de regímenes disponibles.
  catalogoRegimenes: Catalogo[] = [];

  // Catálogo de clasificaciones de régimen disponibles.
  catalogoClasificacionRegimen: Catalogo[] = [];
  /**
   * @description Matriz de catálogos adicionales para el formulario.
   */
  catalogosArray: Catalogo[][] = [[], []];

  /**
   * @description Opciones de solicitud configurables.
   */
  opcionesSolicitud: ProductoOpción[] = [];

  /**
   * @description Sujeto para gestionar la destrucción de suscripciones.
   */
  public destroyed$ = new Subject<void>();
  /**
   * @description Arreglo que almacena un catálogo de elementosDeBloque.
   * @type {Catalogo[]}
   */
  elementosDeBloque: Catalogo[] = [];
  /**
   * @description Arreglo que contiene un catálogo de países organizados por bloque.
   * @type {Catalogo[]}
   */
  paisesPorBloque: Catalogo[] = [];
  /**
   * @description Arreglo que guarda un catálogo de entidades federativas.
   * @type {Catalogo[]}
   */
  entidadFederativa: Catalogo[] = [];
  /**
   * @description Arreglo que almacena un catálogo de representaciones federales.
   * @type {Catalogo[]}
   */
  representacionFederal: Catalogo[] = [];
  /**
   * @description Arreglo de cadenas que representa las opciones seleccionables de rangos de días.
   * @type {string[]}
   */
  selectRangoDias: string[] = [];
  /**
   * @description Objeto o constante que contiene los textos utilizados en la aplicación.
   * @type {any}
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
  private seccionState!: Solicitud130106State;
  /**
   * Indica si se debe mostrar el error de clasificación.
   */
  mostrarErrorClasificacion = true;
    /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas. 
   */
  isInvalidaPartidas: boolean = false;
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
   * Referencia al componente `PartidasDeLaMercanciaComponent` dentro de la vista.
   * Permite acceder a las propiedades y métodos públicos del componente hijo desde el componente padre.
   */
  @ViewChild(PartidasDeLaMercanciaComponent) partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;
  /*
    * modificarPartidasDelaMercanciaForm
    * Formulario reactivo para modificar las partidas.
    */
  modificarPartidasDelaMercanciaForm!: FormGroup;
   /**
     * jest.spyOnIdentificador del procedimiento actual.
     * @type {number}
     */
    idProcedimiento: number = 130106;
  
  /**
   * Constructor del componente.
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {HttpClient} http - Servicio para realizar solicitudes HTTP.
   * @param {Tramite130106Store} tramite130106Store - Store para gestionar el estado del trámite 130106.
   * @param {Tramite130106Query} tramite130106Query - Query para consultar el estado del trámite 130106.
   * @param {Solocitud130106Service} solocitud130106Service - Servicio para la exportación de minerales de hierro.
   */
  constructor(
    private fb: FormBuilder,
    private tramite130106Store: Tramite130106Store,
    private tramite130106Query: Tramite130106Query,
    public solocitud130106Service: Solocitud130106Service,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()
  }
  /**
   * @description Ciclo de vida de Angular: inicializa formularios, suscripciones y opciones al cargar el componente.
   */
  ngOnInit(): void {
    this.tramite130106Store.actualizarEstado({
      solicitud: 'TISOL.I',
      producto: 'CONDMER.N',
      defaultSelect: 'TISOL.I',
      defaultProducto: 'CONDMER.N'
    });
    this.inicializarEstadoFormulario();
    this.opcionesDeBusqueda();
    this.fetchEntidadFederativa();
    this.listaDePaisesDisponibles();

    this.tramite130106Query.select(state => state.tableBodyData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tableBodyData = data || [];
      });
    this.getRegimenes();
    this.getFraccionArancelaria();
  }

  /**
* Evalúa si se debe inicializar o cargar datos en el formulario.
*/
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormularios();
    }
  }

  /**
 * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
 * Luego reinicializa el formulario con los valores actualizados desde el store.
 */
  guardarDatosFormulario(): void {
    this.inicializarFormularios();
  }

  /**
     * Se suscribe a los cambios del estado de la solicitud en el store de Tramite130111.
     * Cada vez que el estado cambia, actualiza la propiedad interna `seccionState` con los nuevos datos.
     * Esta suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
     */
  suscribirseAEstadoDeSolicitud(): void {
    this.tramite130106Query.selectSolicitud$
      ?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Solicitud130106State) => {
        this.seccionState = data;
      });
  }
  /**
   * @description Inicializa los formularios reactivos `formDelTramite` y `mercanciaForm`.
   */
  /**
 * jest.spyOnInicializa los formularios reactivos `formDelTramite` y `mercanciaForm`.
 */

  inicializarFormularios(): void {
    this.suscribirseAEstadoDeSolicitud();
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
          DatosDeLaSolicitudComponent.validarSinCaracterAnguloDerecho
        ],
      ],
      fraccion: [this.seccionState?.fraccion, Validators.required],
      cantidad: [
        this.seccionState?.cantidad,
        [
          Validators.required,
          DatosDeLaSolicitudComponent.validarNumeroTresDecimales,
          Validators.min(1),
        ],
      ],
      valorFacturaUSD: [
        this.seccionState?.valorFacturaUSD,
        [
          Validators.required,
          DatosDeLaSolicitudComponent.validarNumeroTresDecimales,
          Validators.min(0.01),
        ],
      ],

      unidadMedida: [this.seccionState?.unidadMedida, Validators.required],
    });
    this.partidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        this.seccionState?.cantidadPartidasDeLaMercancia,
        [
          DatosDeLaSolicitudComponent.validarCatorceEnterosTresDecimales,
          Validators.maxLength(18),
        ],
      ],
      descripcionPartidasDeLaMercancia: [
        this.seccionState?.descripcionPartidasDeLaMercancia,
        [ Validators.maxLength(255)],
      ],
      valorPartidaUSDPartidasDeLaMercancia: [
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia,
        [
          
          Validators.min(0),
          DatosDeLaSolicitudComponent.validarCatorceEnterosTresDecimales,
          Validators.maxLength(20),
        ],
      ],
    });
    this.modificarPartidasDelaMercanciaForm = this.fb.group({
      cantidadPartidasDeLaMercancia: [
        this.seccionState?.cantidadPartidasDeLaMercancia,
        [
          DatosDeLaSolicitudComponent.validarCatorceEnterosTresDecimales,
          Validators.maxLength(18),
        ],
      ],
      descripcionPartidasDeLaMercancia: [
        this.seccionState?.descripcionPartidasDeLaMercancia,
        [ Validators.maxLength(255)],
      ],
      valorPartidaUSDPartidasDeLaMercancia: [
        this.seccionState?.valorPartidaUSDPartidasDeLaMercancia,
        [
          
          Validators.min(0),
          DatosDeLaSolicitudComponent.validarCatorceEnterosTresDecimales,
          Validators.maxLength(20),
        ],
      ],
    });
    this.formularioTotalCount(
      String(this.seccionState?.cantidadTotal),
      String(this.seccionState?.valorTotalUSD)
    );
    this.paisForm = this.fb.group({
      bloque: [this.seccionState?.bloque],
      usoEspecifico: [this.seccionState?.usoEspecifico, Validators.required],
      justificacionImportacionExportacion: [this.seccionState?.justificacionImportacionExportacion, [Validators.required]],
      observaciones: [this.seccionState?.observaciones],
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
   * @description Solicita opciones configurables para los formularios desde archivos JSON.
   */
  opcionesDeBusqueda(): void {
    this.solocitud130106Service
      .getSolicitudeOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.opcionesSolicitud = data.options;
          this.tramite130106Store.actualizarEstado({
            solicitud: data.options[0]?.value || '',
            defaultSelect: data.defaultSelect || 'Inicial',
          });
        },
        error: (error) =>
          console.error('Error loading solicitude options:', error),
      });

    this.solocitud130106Service
      .getProductoOptions()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.productoOpciones = data.options;
          this.tramite130106Store.actualizarEstado({
            producto: data.options[0]?.value || 'Nuevo',
            defaultProducto: data.options[0]?.value || 'Nuevo',
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
  manejarlaFilaSeleccionada(filasSeleccionadas: PartidasDeLaMercanciaModelo[]): void {
    this.filaSeleccionada = filasSeleccionadas.length
      ? filasSeleccionadas
      : [];
    if (this.filaSeleccionada) {
      this.tramite130106Store.actualizarEstado({ filaSeleccionada: this.filaSeleccionada });
    }
  }

  /**
     * onModificarPartidaSeleccionada
     * Maneja la modificación de una partida seleccionada.
     * @param partida - La partida que se va a modificar.
     */
  onModificarPartidaSeleccionada(partida: PartidasDeLaMercanciaModelo): void {
    this.modificarPartidasDelaMercanciaForm.setValue({
      cantidadPartidasDeLaMercancia: partida.cantidad,
      descripcionPartidasDeLaMercancia: partida.descripcion,
      valorPartidaUSDPartidasDeLaMercancia: partida.totalUSD
    });
  }
  /**
   * onPartidaModificada
   * Maneja la modificación de una partida.
   * @param partida - La partida que se va a modificar.
   */
  onPartidaModificada(partida: PartidasDeLaMercanciaModelo): void {
    this.tableBodyData = this.tableBodyData.map(row =>
      row.id === partida.id ? { ...row, ...partida } : row
    );
    this.tramite130106Store.actualizarEstado({ tableBodyData: this.tableBodyData });
    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );
    this.tramite130106Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD)
    });
    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
  }

  /**
 *  Calcula el importe unitario en USD basado en la cantidad de partidas y el total en USD.
 * @param cantidadPartidas 
 * @param cantidadUSD 
 * @returns 
 */
  calcularImporteUnitario(cantidadPartidas: string, cantidadUSD: string): string {
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
   * validarYEnviarFormulario
   * Valida el formulario y muestra la tabla dinámica si es válido.
   */
  validarYEnviarFormulario(): void {
    if (this.partidasDelaMercanciaForm.invalid) {
      this.partidasDelaMercanciaForm.markAllAsTouched();
    } else {
      this.mostrarTabla = true;
      this.tramite130106Store.actualizarEstado({ mostrarTabla: true });
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
      this.partidasDelaMercanciaForm.reset();
      const CANTIDAD_TOTAL = this.tableBodyData.reduce((acc, item) => acc + parseInt(item.cantidad, 10), 0);
      const TOTAL_USD = this.tableBodyData.reduce((acc, item) => acc + parseFloat(item.totalUSD), 0);
      this.formForTotalCount.patchValue({
        cantidadTotal: CANTIDAD_TOTAL,
        valorTotalUSD: TOTAL_USD,
      });
      this.tramite130106Store.actualizarEstado({
        tableBodyData: this.tableBodyData
      })
    }
  }

  /**
   * navegarParaModificarPartida
   * Navega para modificar una partida específica y actualiza el estado global.
   */
  navegarParaModificarPartida(): void {
    if (this.filaSeleccionada) {
      this.tramite130106Store.actualizarEstado({ mostrarTabla: true });
      this.tramite130106Store.actualizarEstado({ filaSeleccionada: this.filaSeleccionada });
    }
  }
  /**
   * Método para obtener la lista de entidades federativas.
   */
  fetchEntidadFederativa(): void {
    this.solocitud130106Service
      .getEntidadFederativa('130106')
      .subscribe((data) => {
        this.entidadFederativa = data;
      });
  }
  /**
  * Método para obtener la lista de representaciones federales.
  */
  fetchRepresentacionFederal(cveEntidad: string): void {
    this.solocitud130106Service.getRepresentacionFederal(this.idProcedimiento.toString(), cveEntidad)
      .subscribe((data) => {
        this.representacionFederal = data as Catalogo[];
      });
  }

  /**
  * Método para obtener la lista de países disponibles.
  */
  listaDePaisesDisponibles(): void {
    this.solocitud130106Service
      .getBloque('130106')
      .subscribe((data) => {
        this.elementosDeBloque = data;
      });
  }
  /**
  * Método para obtener la lista de países por bloque.
  * @param {number} _bloqueId - Identificador del bloque.
  */
  fetchPaisesPorBloque(ID: string): void {
    this.solocitud130106Service.getPaisesPorBloque(this.idProcedimiento.toString(), ID)
      .subscribe((data) => {
       this.paisesPorBloque = data as Catalogo[];
      });
  }

  /**
  * Maneja el cambio de bloque seleccionado.
  * @param {number} bloqueId - Identificador del bloque seleccionado.
  */
  enCambioDeBloque(bloqueId: number): void {
    this.fetchPaisesPorBloque(bloqueId.toString());
  }
 
   /**
   *  Maneja la selección de fechas y actualiza el estado global.
   * @param evento 
   */
  fechasSeleccionadas(evento: string[]): void {
    this.tramite130106Store.actualizarEstado({ fechasSeleccionadas: evento });
  }
  /**
   * @description Actualiza el almacén con nuevos valores basados en eventos de formulario.
   * @param event Evento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore($event: { form: FormGroup; campo: string }): void {
    const VALOR = $event.form.get($event.campo)?.value;
    this.tramite130106Store.actualizarEstado({ [$event.campo]: VALOR });
   
    if ($event.campo === 'regimen') {
      const VALOR = this.formDelTramite.get('regimen')?.value;
      this.getClasificacionRegimen(VALOR);
    }

    if ($event.campo === 'entidad') {
      const VALOR = this.frmRepresentacionForm.get('entidad')?.value;
      this.fetchRepresentacionFederal(VALOR);
    }

     if ($event.campo === 'fraccion') {
      const VALOR = this.mercanciaForm.get('fraccion')?.value;
      this.getUMTCatalogo(VALOR);
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
      disabled = true
    }
    return disabled;
  }
 
  /**
   * Valida que un número tenga como máximo tres decimales.
   */
  static validarNumeroTresDecimales(control: AbstractControl): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') { return null; }

    if (!REGEX_DECIMAL.test(VALOR)) {
      return { noEsNumero: true };
    }

    if (REGEX_NUMERO_ENTERO_POSITIVO.test(VALOR)) {
      return { maximoTresDecimales: true };
    }

    return null;
  }

  /**
   * Valida que un string no contenga el carácter de ángulo derecho (›).
   */
  static validarSinCaracterAnguloDerecho(control: AbstractControl): ValidationErrors | null {
    if (typeof control.value === 'string' && control.value.includes('›')) {
      return { validarSinCaracterAnguloDerecho: true };
    }
    return null;
  }

  /*
 Valida que un número tenga como máximo 14 enteros y 3 decimales.
 */
  static validarCatorceEnterosTresDecimales(control: AbstractControl): ValidationErrors | null {
    const VALOR = control.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') { return null; }

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
    ['cantidad', 'valorFacturaUSD'].forEach(controlName => {
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
      'descripcionPartidasDeLaMercancia'
    ].forEach(controlName => {
      const CONTROL = this.partidasDelaMercanciaForm.get(controlName);
      if (CONTROL) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      }
    });
    if (
      this.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.invalid ||
      this.partidasDelaMercanciaForm.get('valorPartidaUSDPartidasDeLaMercancia')?.invalid ||
      this.partidasDelaMercanciaForm.get('descripcionPartidasDeLaMercancia')?.invalid
    ) {
      this.mostrarErroresPartidas = true;
      return;
    }
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
        tamanioModal: 'modal-sm'
      };
      this.mostrarNotificacion = true;
      return;
    }
    this.partidasDeLaMercanciaComponent.abrirCargarArchivoModalReal();
  }

  /*
  * Método que se ejecuta cuando se eliminan partidas de la tabla.
  * Actualiza los datos de la tabla y recalcula los totales.  
  */
  onPartidasEliminadas(ids: string[]): void {
    this.tableBodyData = this.tableBodyData.filter(row => !ids.includes(row.id));
    this.mostrarTabla = this.tableBodyData.length > 0;
    const CANTIDAD_TOTAL = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.cantidad),
      0
    );
    const VALOR_TOTAL_USD = this.tableBodyData.reduce(
      (sum, row) => sum + Number(row.totalUSD),
      0
    );
    this.tramite130106Store.actualizarEstado({
      cantidadTotal: String(CANTIDAD_TOTAL),
      valorTotalUSD: String(VALOR_TOTAL_USD)
    });
    this.formularioTotalCount(String(CANTIDAD_TOTAL), String(VALOR_TOTAL_USD));
    this.tramite130106Store.actualizarEstado({
      tableBodyData: this.tableBodyData,
      mostrarTabla: this.mostrarTabla
    });
  }

  /**
   * Obtiene los catálogos de regímenes y clasificaciones de régimen desde el servicio.
   * Actualiza las propiedades del componente con los datos obtenidos.
   */
  getRegimenes(): void {
    this.solocitud130106Service.getRegimenes(this.idProcedimiento.toString()).subscribe((data) => {
      this.catalogosArray[0] = data as Catalogo[];
    });
  }
  /**
   * Obtiene el catálogo de clasificaciones de régimen desde el servicio.
   * Actualiza las propiedades del componente con los datos obtenidos.
   */
  getClasificacionRegimen(VALOR: string): void {
    this.solocitud130106Service.getClasificacionRegimen(VALOR).subscribe((data) => {
     this.catalogosArray[1] = data as Catalogo[];
    });
  }

  /**  
    * Obtiene el catálogo de fracciones arancelarias desde el servicio.
     * Actualiza la propiedad del componente con los datos obtenidos.
     */
  getFraccionArancelaria(): void {
    this.solocitud130106Service.getFraccionesArancelarias('130106').subscribe((data) => {
      this.fraccionCatalogo = data || [];
    });
  }

  /**  
   * Obtiene el catálogo de unidades de medida desde el servicio.
   * Actualiza la propiedad del componente con los datos obtenidos.
   */
  getUMTCatalogo(FRACCION_ID: string): void {
    this.solocitud130106Service.getUMTCatalogo('130106', FRACCION_ID).subscribe((data) => {
      this.unidadCatalogo = data || [];
       if (this.unidadCatalogo.length > 0) {
        this.mercanciaForm.get('unidadMedida')?.setValue(this.unidadCatalogo[0]?.clave || '');
        this.tramite130106Store.actualizarEstado({ unidadMedida: this.unidadCatalogo[0]?.clave || '' });
      }
    });
  }
 
    /**
   * Valida todos los formularios y la selección de filas.
   * @returns {boolean} Indica si todos los formularios y la selección son válidos.
   */
  validarFormulario(): boolean {

    let isValid = true;
    if (this.partidasDelaMercanciaForm.invalid) {
      this.partidasDelaMercanciaForm.markAllAsTouched();
      isValid = false;
    }
    if (this.formDelTramite.invalid) {
      this.formDelTramite.markAllAsTouched();
      isValid = false;
    }
    if(this.mercanciaForm.invalid){
      this.mercanciaForm.markAllAsTouched();
      isValid = false;
    }
    if (this.formForTotalCount.invalid) {
      this.formForTotalCount.markAllAsTouched();
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
     if (this.modificarPartidasDelaMercanciaForm.invalid) {
      this.modificarPartidasDelaMercanciaForm.markAllAsTouched();
      isValid = false;
    }
    return isValid;
    
  }
  /**
  * @description Ciclo de vida de Angular: limpia las suscripciones al destruir el componente.
  */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

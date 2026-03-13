import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Catalogo, CatalogoLista, SolicitudTabla } from "../../models/autorizacion-importacion.model";
import { CatalogoSelectComponent, InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent, PATRON_LETRAS_NUMEROS_ESPACIOS, Pedimento, REGEX_SOLO_NUMEROS, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from "@libs/shared/data-access-user/src";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ConsultaioQuery, ConsultaioState } from "@ng-mf/data-access-user";
import { FECHA_CARTAPORTE, FECHA_DESTINO, FECHA_IMPORTACION, FECHA_VENCIMIENTO, TABLA_DE_DATOS, TEXTOS } from "../../constants/autorizacion-importacion.enum";
import { Subject, map, takeUntil } from "rxjs";
import { Tramite6402State, Tramite6402Store } from "../../estados/tramite6402.store";
import { AutorizacionImportacionService } from "../../services/autorizacion-importacion.service";
import { CommonModule } from "@angular/common";
import { MedioTransporteUtil } from "../../enums/medio-transporte.enum";
import { Modal } from 'bootstrap';
import { Tramite6402Query } from "../../estados/tramite6402.query";
/**
 * Componente para gestionar el aviso de traslado.
 * 
 * Este componente permite al usuario capturar, editar y gestionar la información
 * relacionada con el aviso de traslado, incluyendo datos de la empresa, mercancías,
 * Mercancias y otros detalles necesarios para el trámite 6402.
 */
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    NotificacionesComponent
  ],
  standalone: true,
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * @property {FormGroup} solicitudFormulario
   * @description Formulario reactivo que contiene los datos del solicitudFormulario en el trámite.
  */
  solicitudFormulario!: FormGroup;

  /**
   * @property {FormGroup} mercanciaFormulario
   * @description Formulario reactivo que contiene los datos del mercanciaFormulario en el trámite.
  */
  mercanciaFormulario!: FormGroup;

  /**
   * Representa una nueva instancia de notificación asociada con el componente.
   * Esta propiedad se utiliza para gestionar y almacenar datos de notificaciones.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
  */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {Tramite6402State} tramiteState
   * @description Estado actual del trámite 6402, que contiene toda la información relevante del proceso.
  */
  public tramiteState!: Tramite6402State;

  /**
   * @property {InputFecha} fechaImportacion
   * @description Fecha de importación utilizada en el trámite.
   */
  public fechaImportacion: InputFecha = FECHA_IMPORTACION;

  /**
   * @property {InputFecha} fechaVencimiento
   * @description Fecha de vencimiento utilizada en el trámite.
   */
  public fechaVencimiento: InputFecha = FECHA_VENCIMIENTO;

  /**
   * @property {InputFecha} fechaCartaPorte
   * @description Fecha de la carta porte utilizada en el trámite.
   */
  public fechaCartaPorte: InputFecha = FECHA_CARTAPORTE;

  /**
   * @property {InputFecha} fechaDestino
   * @description Fecha de destino utilizada en el trámite.
   */
  public fechaDestino: InputFecha = FECHA_DESTINO;
  /**
   * @property {Catalogo[]} entidadFederativa
   * @description Lista de entidades federativas cargadas desde un catálogo.
  */
  entidadFederativa: Catalogo[] = [];

  /**
   * @property {Catalogo[]} aduanas
   * @description Lista de aduanas cargadas desde un catálogo.
   */
  aduanas: Catalogo[] = [];
  /**
   * @property {Catalogo[]} aduaneras
   * @description Lista de aduaneras cargadas desde un catálogo.
   */
  aduaneras: Catalogo[] = [];
  /**
   * @property {Catalogo[]} recintoFiscalizado
   * @description Lista de recintos fiscalizados cargados desde un catálogo.
   */
  recintoFiscalizado: Catalogo[] = [];
  /**
   * @property {Catalogo[]} tipoDeDocumento
   * @description Lista de tipos de documentos cargados desde un catálogo.
   */
  tipoDeDocumento: Catalogo[] = [];
  /**
   * @property {Catalogo[]} medioDeTransporte
   * @description Lista de medios de transporte cargados desde un catálogo.
   */
  medioDeTransporte: Catalogo[] = [];
  /**
   * @property {Catalogo[]} paisDeProcedencia
   * @description Lista de países de procedencia cargados desde un catálogo.
   */
  paisDeProcedencia: Catalogo[] = [];
  /**
   * @property {Catalogo[]} siNo
   * @description Lista de opciones "Sí" o "No" cargadas desde un catálogo.
   */
  siNo: Catalogo[] = [];
  /**
   * @property {Catalogo[]} tipoDeDestino
   * @description Lista de tipos de destino cargados desde un catálogo.
   */
  tipoDeDestino: Catalogo[] = [];

  /**
   * @property {typeof MedioTransporteUtil} medioTransporteUtil
   * @description Utilidad para trabajar con medios de transporte
   */
  medioTransporteUtil = MedioTransporteUtil;

  /**
   * @property {TablaSeleccion} tablaSeleccion
   * @description Propiedad que representa la tabla de selección utilizada en el componente.
  */
  /**
   * @property {string} INPUT
   * @description Cadena de texto utilizada como entrada en el componente.
   * 
   * Esta propiedad puede ser utilizada para almacenar valores temporales
   * o como referencia en diferentes métodos del componente.
   */
  INPUT: HTMLInputElement = document.createElement('input');

  /**
   * @property {TablaSeleccion} tablaSeleccion
   * @description Propiedad que representa la tabla de selección utilizada en el componente.
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * @property {object} tablaDeDatos
   * @description Configuración de la tabla de datos utilizada en el componente.
   * Contiene las definiciones de las columnas (encabezados) y los datos que se mostrarán en la tabla.
   */
  tablaDeDatos = TABLA_DE_DATOS;

  /**
   * @property {SolicitudTabla[]} filaSeleccionadaLista
   * @description Lista de filas seleccionadas en la tabla de avisos. 
   * Contiene los datos de las filas seleccionadas por el usuario.
  */
  filaSeleccionadaLista: SolicitudTabla[] = [];
  /**
   * @property {ElementRef} modalMercancia
   * @description Referencia al elemento del modal de Mercancia en la plantilla HTML.
   * Utilizado para abrir o manipular el modal de Mercancia.
  */
  @ViewChild('modalMercancia') modalMercancia!: ElementRef;
  /**
   * @property {ElementRef} closeMercancia
   * @description Referencia al botón o elemento que cierra el modal de Mercancia.
   * Utilizado para cerrar el modal de manera programática.
  */
  @ViewChild('closeMercancia') public closeMercancia!: ElementRef;

  /**
   * @property {any} TEXTOS
   * @description Constante que contiene textos o mensajes utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
 * @property {ConsultaioState} consultaDatos
 * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
 */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /** 
* Arreglo que contiene los pedimentos registrados.
*/
  public pedimentos: Array<Pedimento> = [];

  /**
   * Propiedad para almacenar el identificador del elemento que se va a eliminar o editar.
   * Se utiliza en la edición y eliminación de mercancías y pedimentos.
   */
  public elementoParaEliminar?: number;
  /**
   * Indicador de validación para la tabla de datos.
   * Se utiliza para mostrar mensajes de error o validación relacionados con la tabla.
   */
  public tablaDeDatosValidation?: boolean = false;
  /**
   * Indicador de validación para el formulario de mercancía.
   * Se utiliza para mostrar mensajes de error o validación relacionados con el formulario de mercancía.
   */
  public mercanciaFormularioValidation?: boolean = false;

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {Tramite6402Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite6402Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {autorizacionImportacionService} autorizacionImportacionService - Servicio para obtener datos relacionados con el aviso.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
  */
  constructor(
    public fb: FormBuilder,
    public store: Tramite6402Store,
    public tramiteQuery: Tramite6402Query,
    public autorizacionImportacionService: AutorizacionImportacionService,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }
  
  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Configura los formularios, carga los datos iniciales y suscribe al estado del trámite.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.soloLectura = this.consultaDatos.readonly;
        this.inicializarEstadoFormulario();
      })
    )
      .subscribe();
    this.inicializarFormulario();
    this.cargarFederativa();
    this.cargarAduanas();
    this.cargarAduaneras();
    this.cargarRecintoFiscalizado();
    this.cargarTipoDeDocumento();
    this.cargarMedioDeTransporte();
    this.cargarPaisDeProcedencia();
    this.cargarSiNo();
    this.cargarTipoDeDestino();
    this.inicializarMercanciaFormulario();
  }

  /**
   * @method cambioImportacionTemporal
   * @description Método para manejar el cambio de la fecha de importación temporal.
   *
   * - Actualiza el valor del campo `fechaImportacionTemporal` en el formulario `datosPedimento`.
   * - Marca el campo como no modificado (`markAsUntouched`).
   * - Establece el nuevo valor en el store del trámite.
   *
   * @param {string} nuevo_valor - Nuevo valor de la fecha de importación temporal.
   * @returns {void}
   */
  public cambioImportacionTemporal(nuevo_valor: string): void {
    this.datosPedimento.get('fechaImportacionTemporal')?.setValue(nuevo_valor);
    this.datosPedimento.get('fechaImportacionTemporal')?.markAsUntouched();
    document.getElementById('fechaImportacionTemporalInput')?.querySelector('.input-group-text')?.classList.remove('is-invalid-date');
    document.getElementById('fechaImportacionTemporalInput')?.querySelector('.invalid-date-label-asterisk')?.classList.remove('invalid-date-label-asterisk')
    const ERROR_MESSAGE_DIV = document.getElementById('fechaImportacionTemporalInput')?.querySelector('small.text-danger');
    if (ERROR_MESSAGE_DIV) {
      ERROR_MESSAGE_DIV.remove();
    }
    
    this.store.setFechaImportacionTemporal(nuevo_valor);
  }

  /**
   * @method cambioVencimiento
   * @description Método para manejar el cambio de la fecha de vencimiento.
   *
   * - Actualiza el valor del campo `fechaVencimiento` en el formulario `datosPedimento`.
   * - Marca el campo como no modificado (`markAsUntouched`).
   * - Establece el nuevo valor en el store del trámite.
   *
   * @param {string} nuevo_valor - Nuevo valor de la fecha de vencimiento.
   * @returns {void}
   */
  public cambioVencimiento(nuevo_valor: string): void {
    this.datosPedimento.get('fechaVencimiento')?.setValue(nuevo_valor);
    this.datosPedimento.get('fechaVencimiento')?.markAsUntouched();
    document.getElementById('fechaVencimientoInput')?.querySelector('.input-group-text')?.classList.remove('is-invalid-date');
    document.getElementById('fechaVencimientoInput')?.querySelector('.invalid-date-label-asterisk')?.classList.remove('invalid-date-label-asterisk');
    const ERROR_MESSAGE_DIV = document.getElementById('fechaVencimientoInput')?.querySelector('small.text-danger');
    if (ERROR_MESSAGE_DIV) {
      ERROR_MESSAGE_DIV.remove();
    }
    this.store.setFechaVencimiento(nuevo_valor);
  }

  /**
   * @method cambioFechaCartaPorte
   * @description Método para manejar el cambio de la fecha de la carta porte.
   *
   * - Actualiza el valor del campo `fechaCartaPorte` en el formulario `datosPedimento`.
   * - Marca el campo como no modificado (`markAsUntouched`).
   * - Establece el nuevo valor en el store del trámite.
   *
   * @param {string} nuevo_valor - Nuevo valor de la fecha de la carta porte.
   * @returns {void}
   */
  public cambioFechaCartaPorte(nuevo_valor: string): void {
    this.datosPedimento.get('fechaCartaPorte')?.setValue(nuevo_valor);
    this.datosPedimento.get('fechaCartaPorte')?.markAsUntouched();
    this.store.setFechaCartaPorte(nuevo_valor);
  }

  /**
   * Cambia la fecha de destrucción del destino en el formulario y actualiza el estado correspondiente.
   *
   * @param nuevo_valor - La nueva fecha que se establecerá como valor en el campo `fechaDescruccionDestino`.
   *
   * Este método realiza las siguientes acciones:
   * - Actualiza el valor del campo `fechaDescruccionDestino` en el formulario `datosPedimento`.
   * - Marca el campo como no modificado (`untouched`).
   * - Actualiza el estado global con la nueva fecha utilizando el método `setFechaCartaPorte` del store.
   */
  public cambioFechaDestino(nuevo_valor: string): void {
    this.datosDestinoMercancia.get('fechaDescruccionDestino')?.setValue(nuevo_valor);
    this.datosDestinoMercancia.get('fechaDescruccionDestino')?.markAsUntouched();
    document.getElementById('fechaDescruccionDestinoInput')?.querySelector('.input-group-text')?.classList.remove('is-invalid-date');
    document.getElementById('fechaDescruccionDestinoInput')?.querySelector('.invalid-date-label-asterisk')?.classList.remove('invalid-date-label-asterisk');
    const ERROR_MESSAGE_DIV = document.getElementById('fechaDescruccionDestinoInput')?.querySelector('small.text-danger');
    if (ERROR_MESSAGE_DIV) {
      ERROR_MESSAGE_DIV.remove();
    }
    this.store.setFechaCartaPorte(nuevo_valor);
  }

  /**
   * @method setValoresStore
   * @description Método para establecer valores en el store del trámite.
   * Obtiene el valor de un campo específico de un formulario y lo asigna al método correspondiente del store.
   *
   * @param {FormGroup} form - Formulario reactivo del cual se obtiene el valor.
   * @param {string} campo - Nombre del campo dentro del formulario.
   * @param {keyof Tramite6402Store} metodoNombre - Nombre del método del store donde se asignará el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite6402Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * @method cargarAduaneras
   * @description Método para cargar la lista de aduaneras desde el servicio `autorizacionImportacionService`.
   * Los datos obtenidos se asignan a la propiedad `aduaneras`.
   *
   * @returns {void}
   */
  public cargarAduaneras(): void {
    this.autorizacionImportacionService
      .obtenerAduaneras()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.aduaneras = datos.datos;
      });
  }

  /**
   * @method cargarAduanas
   * @description Este método se encarga de cargar la lista de aduanas desde el servicio de autorización de importación.
   * Obtiene los datos mediante una suscripción al observable proporcionado por el servicio y los asigna a la propiedad `aduanas`.
   * La suscripción se gestiona utilizando el operador `takeUntil` para evitar fugas de memoria.
   *
   * @returns {void} No retorna ningún valor.
   */
  public cargarAduanas(): void {
    this.autorizacionImportacionService
      .obtenerAduanas()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.aduanas = datos.datos;
      });
  }

  /**
   * @method cargarRecintoFiscalizado
   * @description Método para cargar la lista de recintos fiscalizados desde el servicio `autorizacionImportacionService`.
   * Los datos obtenidos se asignan a la propiedad `recintoFiscalizado`.
   *
   * @returns {void}
   */
  public cargarRecintoFiscalizado(): void {
    this.autorizacionImportacionService
      .obtenerRecintoFiscalizado()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.recintoFiscalizado = datos.datos;
      });
  }

  /**
   * @method cargarTipoDeDocumento
   * @description Método para cargar la lista de tipos de documentos desde el servicio `autorizacionImportacionService`.
   * Los datos obtenidos se asignan a la propiedad `tipoDeDocumento`.
   *
   * @returns {void}
   */
  public cargarTipoDeDocumento(): void {
    this.autorizacionImportacionService
      .obtenerTipoDeDocumento()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.tipoDeDocumento = datos.datos;
      });
  }

  /**
   * @method cargarMedioDeTransporte
   * @description Carga los datos del medio de transporte desde el servicio de autorización de importación.
   * Suscribe a los datos obtenidos y los asigna a la propiedad `medioDeTransporte`.
   * Utiliza un observable para manejar la suscripción y asegura la limpieza con `takeUntil`.
   *
   * @returns {void} No retorna ningún valor.
   */
  public cargarMedioDeTransporte(): void {
    this.autorizacionImportacionService
      .obtenerMedioDeTransporte()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.medioDeTransporte = datos.datos;
      });
  }

  /**
   * Carga el país de procedencia desde el servicio de autorización de importación.
   *
   * Este método realiza una solicitud al servicio `autorizacionImportacionService`
   * para obtener el catálogo de países de procedencia. Los datos obtenidos se asignan
   * a la propiedad `paisDeProcedencia` del componente.
   *
   * @remarks
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   *
   * @see {@link autorizacionImportacionService.obtenerPaisDeProcedencia}
   */
  public cargarPaisDeProcedencia(): void {
    this.autorizacionImportacionService
      .obtenerPaisDeProcedencia()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.paisDeProcedencia = datos.datos;
      });
  }

  /**
   * @method cargarSiNo
   * @description Método para cargar la lista de opciones "Sí" o "No" desde el servicio `autorizacionImportacionService`.
   * Los datos obtenidos se asignan a la propiedad `siNo`.
   *
   * @returns {void}
   */
  public cargarSiNo(): void {
    this.autorizacionImportacionService
      .obtenerSiNo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.siNo = datos.datos;
      });
  }

  /**
   * @method cargarTipoDeDestino
   * @description Este método se encarga de cargar los tipos de destino desde el servicio de autorización de importación.
   * Utiliza un observable para suscribirse a los datos obtenidos y asignarlos a la propiedad `tipoDeDestino`.
   *
   * @returns {void} No retorna ningún valor.
   *
   * @example
   * // Ejemplo de uso:
   * this.cargarTipoDeDestino();
   *
   * @memberof SolicitudComponent
   */
  public cargarTipoDeDestino(): void {
    this.autorizacionImportacionService
      .obtenerTipoDeDestino()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.tipoDeDestino = datos.datos;
      });
  }

  /**
   * @method cargarFederativa
   * @description Método para cargar la lista de entidades federativas desde el servicio `autorizacionImportacionService`.
   * Los datos obtenidos se asignan a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  public cargarFederativa(): void {
    this.autorizacionImportacionService
      .obtenerFederativa()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.entidadFederativa = datos.datos;
      });
  }

  /**
   * @method inicializarFormulario
   * @description Método para inicializar el formulario reactivo `solicitudFormulario` con los datos del estado actual del trámite.
   *
   * - Agrupa diferentes secciones del formulario como `datosAduana`, `datosPedimento`, `datosMedioTransporte`, `datosDestinoMercancia` entre otros.
   * - Aplica validaciones específicas a cada campo, como longitud máxima, patrones y campos obligatorios.
   *
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.solicitudFormulario = this.fb.group({
      datosAduana: this.fb.group({
        cveAduana: [
          this.tramiteState?.solicitudFormulario?.cveAduana,
          [Validators.required],
        ],
        cveSeccionAduanal: [
          this.tramiteState?.solicitudFormulario?.cveSeccionAduanal,
        ],
        cveRecintoFiscalizado: [
          this.tramiteState?.solicitudFormulario?.cveRecintoFiscalizado,
        ],
      }),
      datosPedimento: this.fb.group({
        cveTipoDocumento: [
          this.tramiteState?.solicitudFormulario?.cveTipoDocumento,
          [Validators.required],
        ],
        estadoTipoDocumento: [
          {
            value: this.tramiteState?.solicitudFormulario?.estadoTipoDocumento,
            disabled: true,
          },
        ],
        aduana: [
          this.tramiteState?.solicitudFormulario?.aduana,
          [
            Validators.required,
            Validators.maxLength(3),
            Validators.pattern(REGEX_SOLO_NUMEROS),
          ],
        ],
        patente: [
          this.tramiteState?.solicitudFormulario?.patente,
          [Validators.required],
        ],
        pedimento: [
          this.tramiteState?.solicitudFormulario?.pedimento,
          [Validators.required],
        ],
        folioImportacionTemporal: [
          this.tramiteState?.solicitudFormulario?.folioImportacionTemporal,
          [
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(REGEX_SOLO_NUMEROS),
          ],
        ],
        folioFormatoOficial: [
          this.tramiteState?.solicitudFormulario?.folioFormatoOficial,
          [Validators.required, Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)],
        ],
        checkProrroga: [
          this.tramiteState?.solicitudFormulario?.checkProrroga,
          [Validators.required],
        ],
        folioOficialProrroga: [
          {
            value: this.tramiteState?.solicitudFormulario?.folioOficialProrroga,
            disabled: true,
          },
          [Validators.required],
        ],
        fechaImportacionTemporal: [
          this.tramiteState?.solicitudFormulario?.fechaImportacionTemporal,
          [Validators.required, SolicitudComponent.validateFechaMenorIgualHoy],
        ],
        fechaVencimiento: [
          this.tramiteState?.solicitudFormulario?.fechaVencimiento,
          [Validators.required,this.validateFechaMayorHoy],
        ],
        descMercancia: [
          this.tramiteState?.solicitudFormulario?.descMercancia,
          [Validators.required],
        ],
        marca: [
          this.tramiteState?.solicitudFormulario?.marca,
          [Validators.required],
        ],
        modelo: [
          this.tramiteState?.solicitudFormulario?.modelo,
          [Validators.required],
        ],
        numeroSerie: [
          this.tramiteState?.solicitudFormulario?.numeroSerie,
          [Validators.required],
        ],
        tipo: [
          this.tramiteState?.solicitudFormulario?.tipo,
          [Validators.required],
        ],
      }),
      datosMedioTransporte: this.fb.group({
        cveMedioTrasporte: [
          this.tramiteState?.solicitudFormulario?.cveMedioTrasporte,
          [Validators.required],
        ],
        guiaMaster: [
          this.tramiteState?.solicitudFormulario?.guiaMaster,
          [Validators.required, Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)],
        ],
        guiaBl: [
          this.tramiteState?.solicitudFormulario?.guiaBl,
          [Validators.required,Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)],
        ],
        numeroBl: [
          this.tramiteState?.solicitudFormulario?.numeroBl,
          [Validators.required,Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)],
        ],
        rfcEmpresaTransportista: [
          this.tramiteState?.solicitudFormulario?.rfcEmpresaTransportista, [Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)]
        ],
        estadoMedioTransporte: [
          {
            value:
              this.tramiteState?.solicitudFormulario?.estadoMedioTransporte,
            disabled: true,
          },
        ],
        cartaPorte: [
          this.tramiteState?.solicitudFormulario?.cartaPorte
        ],
        cvePaisProcedencia: [
          this.tramiteState?.solicitudFormulario?.cvePaisProcedencia
        ],
        guiaHouse: [this.tramiteState?.solicitudFormulario?.guiaHouse, [Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)]],
        numeroBuque: [this.tramiteState?.solicitudFormulario?.numeroBuque, [Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)]],
        numeroEquipo: [this.tramiteState?.solicitudFormulario?.numeroEquipo, [Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)]],
        fechaCartaPorte: [
          this.tramiteState?.solicitudFormulario?.fechaCartaPorte
        ],
        tipContenedor: [
          this.tramiteState?.solicitudFormulario?.tipContenedor
        ],
        tranporteMarca: [
          this.tramiteState?.solicitudFormulario?.tranporteMarca
        ],
        tranporteModelo: [
          this.tramiteState?.solicitudFormulario?.tranporteModelo
        ],
        tranportePlaca: [
          this.tramiteState?.solicitudFormulario?.tranportePlaca
        ],
        observaciones: [
          {
            value: this.tramiteState?.solicitudFormulario?.observaciones,
            disabled: this.soloLectura,
          }
        ],
      }),
      datosDestinoMercancia: this.fb.group({
        conDestino: [
          this.tramiteState?.solicitudFormulario?.conDestino,
          [Validators.required],
        ],
        cveTipoDestino: [
          this.tramiteState?.solicitudFormulario?.cveTipoDestino,
          [Validators.required],
        ],
        cveTipoDocumentoReemplazada: [
          this.tramiteState?.solicitudFormulario?.cveTipoDocumentoReemplazada,
          [Validators.required],
        ],
        numeroActaDescruccion: [
          this.tramiteState?.solicitudFormulario?.numeroActaDescruccion,
          [Validators.required, Validators.maxLength(30), Validators.pattern(PATRON_LETRAS_NUMEROS_ESPACIOS)],
        ],
        cveAduanaDestino: [
          this.tramiteState?.solicitudFormulario?.cveAduanaDestino,
          [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS),],
        ],
        cvePatenteDestino: [
          this.tramiteState?.solicitudFormulario?.cvePatenteDestino,
          [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS),],
        ],
        cvePedimentoDestino: [
          this.tramiteState?.solicitudFormulario?.cvePedimentoDestino,
          [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS),],
        ],
        folioVucemRetorno: [
          this.tramiteState?.solicitudFormulario?.folioVucemRetorno,
          [Validators.required],
        ],
        folioFormatoOficialDestino: [
          this.tramiteState?.solicitudFormulario?.folioFormatoOficialDestino,
          [Validators.required],
        ],
        fechaDescruccionDestino: [
          this.tramiteState?.solicitudFormulario?.fechaDescruccionDestino,
          [Validators.required],
        ],
        estadoTipoDocumentoDestino: [
          this.tramiteState?.solicitudFormulario?.estadoTipoDocumentoDestino
        ],
        autoridadPresentoAvisoDestruccion: [
          this.tramiteState?.solicitudFormulario
            ?.autoridadPresentoAvisoDestruccion,
          [
            Validators.required,
            Validators.maxLength(30)
          ],
        ],
        folioFormatoOficialTemporalDestino: [
          this.tramiteState?.solicitudFormulario?.folioFormatoOficialTemporalDestino,
          [
            Validators.required,
            Validators.maxLength(25),
            Validators.pattern(REGEX_SOLO_NUMEROS),
          ],
        ],
      }),
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario según el modo de solo lectura.
   *
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
   * En caso contrario, habilita los controles del formulario.
   *
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.solicitudFormulario?.disable();
    } else {
      this.solicitudFormulario?.enable();
    }
  }

  /**
   * @method inicializarMercanciaFormulario
   * @description Inicializa el formulario reactivo para la gestión de la mercancía en el componente.
   * Este formulario contiene campos relacionados con la descripción, especificaciones, marca, modelo,
   * número de serie, número de parte y tipo de la mercancía. Los valores iniciales se obtienen del estado
   * actual del trámite (`tramiteState`) y todos los campos son obligatorios.
   *
   * @returns {void} No retorna ningún valor.
   */
  inicializarMercanciaFormulario(): void {
    this.mercanciaFormulario = this.fb.group({
      modalDescMercancia: ['', [Validators.required]],
      espeMercancia: [
        this.tramiteState?.mercanciaFormulario?.espeMercancia,
        [Validators.required],
      ],
      marcaMercancia: [
        {
          value: this.tramiteState?.mercanciaFormulario?.marcaMercancia,
          disabled: this.soloLectura,
        }
      ],
      modeloMercancia: [
        this.tramiteState?.mercanciaFormulario?.modeloMercancia
      ],
      numSerieMercancia: [
        this.tramiteState?.mercanciaFormulario?.numSerieMercancia
      ],
      numParteMercancia: [
        this.tramiteState?.mercanciaFormulario?.numParteMercancia
      ],
      tipoMercancia: [
        this.tramiteState?.mercanciaFormulario?.tipoMercancia
      ],
    });
  }

  /**
   * @method datosPedimento
   * @description Getter para obtener el grupo de controles `datosPedimento` del formulario `solicitudFormulario`.
   *
   * @returns {FormGroup} El grupo de controles `datosPedimento`.
   */
  get datosPedimento(): FormGroup {
    return this.solicitudFormulario.get('datosPedimento') as FormGroup;
  }

  /**
   * @method datosMedioTransporte
   * @description Getter para obtener el grupo de controles `datosMedioTransporte` del formulario `solicitudFormulario`.
   *
   * @returns {FormGroup} El grupo de controles `datosMedioTransporte`.
   */
  get datosMedioTransporte(): FormGroup {
    return this.solicitudFormulario.get('datosMedioTransporte') as FormGroup;
  }

  /**
   * @method datosDestinoMercancia
   * @description Getter para obtener el grupo de controles `datosDestinoMercancia` del formulario `solicitudFormulario`.
   *
   * @returns {FormGroup} El grupo de controles `datosDestinoMercancia`.
   */
  get datosDestinoMercancia(): FormGroup {
    return this.solicitudFormulario.get('datosDestinoMercancia') as FormGroup;
  }

  /**
   * @method datosAduana
   * @description Getter para obtener el grupo de controles `datosAduana` del formulario `solicitudFormulario`.
   *
   * @returns {FormGroup} El grupo de controles `datosAduana`.
   */
  get datosAduana(): FormGroup {
    return this.solicitudFormulario.get('datosAduana') as FormGroup;
  }

  /**
   * @method isValid
   * @description Método para verificar si un campo específico de un formulario es válido.
   *
   * - Utiliza el servicio `validacionesService` para realizar la validación.
   *
   * @param {FormGroup} form - Formulario reactivo que contiene el campo a validar.
   * @param {string} field - Nombre del campo a validar.
   * @returns {boolean | null} Retorna `true` si el campo es válido, `false` si no lo es, o `null` si no se puede determinar.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param nombreControl - Nombre del control a verificar.
   * @returns True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.solicitudFormulario.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Maneja el evento blur (pérdida de foco) en los campos del formulario
   * para activar la validación visual.
   *
   * @param fieldName - Nombre del campo que perdió el foco.
   */
  public onFieldBlur(fieldName: string): void {
    const CONTROL = this.solicitudFormulario.get(fieldName);
    if (CONTROL) {
      CONTROL.markAsTouched();
      CONTROL.markAsDirty();
    }
  }

  /**
   * @method filaSeleccionada
   * @description Método para manejar las filas seleccionadas en la tabla de avisos.
   *
   * - Actualiza la propiedad `filaSeleccionadaLista` con las filas seleccionadas.
   *
   * @param {AvisoTabla[]} evento - Lista de filas seleccionadas en la tabla de avisos.
   * @returns {void}
   */
  filaSeleccionada(evento: SolicitudTabla[]): void {
    this.filaSeleccionadaLista = evento;
  }

  /**
   * @method eliminarMercancia
   * @description Método para eliminar las filas seleccionadas de la tabla de Mercancias.
   *
   * - Filtra los datos de la tabla para excluir las filas seleccionadas.
   * - Limpia la lista de filas seleccionadas.
   *
   * @returns {void}
   */
  eliminarMercancia(): void {
        if (!this.filaSeleccionadaLista.length) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar un registro a eliminar.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.tablaDeDatos.datos = this.tablaDeDatos.datos.filter(
      (ele) => !this.filaSeleccionadaLista.includes(ele)
    );
    this.filaSeleccionadaLista = [];
  }

  /**
   * @method abiertoMercancia
   * @description Método para abrir el modal de Mercancia.
   *
   * - Utiliza la referencia al modal de Mercancia para mostrarlo en la interfaz.
   *
   * @returns {void}
   */
  abiertoMercancia(): void {
    if (this.modalMercancia) {
      const MODAL_INSTANCE = new Modal(this.modalMercancia.nativeElement);
      this.mercanciaFormulario.reset();
      this.mercanciaFormulario.markAsUntouched();
      this.mercanciaFormulario.markAsPristine();
      MODAL_INSTANCE.show();
    }
  }

  // Edita la mercancía seleccionada
  modificarMercancia(): void {
    if (!this.filaSeleccionadaLista.length) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar un registro a modificar.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    // Solo permite editar la primera seleccionada
    const SELECTED_ROW = this.filaSeleccionadaLista[0];
    // Llena el formulario con los datos de la fila seleccionada
    this.mercanciaFormulario.patchValue({
      modalDescMercancia: SELECTED_ROW.modalDescMercancia || '',
      // espeMercancia: not available in SolicitudTabla, leave blank or handle as needed
      espeMercancia: '',
      marcaMercancia: SELECTED_ROW.marca || '',
      modeloMercancia: SELECTED_ROW.modelo || '',
      numSerieMercancia: SELECTED_ROW.numeroDeSerie || '',
      // numParteMercancia: not available in SolicitudTabla, leave blank or handle as needed
      numParteMercancia: '',
      tipoMercancia: SELECTED_ROW.tipo || '',
    });
    // Guarda el id de la fila editada
    this.elementoParaEliminar = SELECTED_ROW.id;
    // Abre el modal de edición
    if (this.modalMercancia) {
      const MODAL_INSTANCE = new Modal(this.modalMercancia.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Consulta la mercancía seleccionada en la lista.
   * 
   * Si no hay ningún registro seleccionado en `filaSeleccionadaLista`, muestra una notificación de alerta
   * indicando que se debe seleccionar un registro para consultar.
   * 
   * @remarks
   * Esta función es utilizada para validar la selección de registros antes de proceder con la consulta de mercancía.
   * Si no hay selección, se configura una notificación de tipo alerta para informar al usuario.
   */
  consultarMercancia(): void {
    if (!this.filaSeleccionadaLista.length) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar un registro a consultar.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * @method cargarMercanciaTabla
   * @description Método para cargar los datos de la tabla de mercancias desde el servicio `autorizacionImportacionService`.
   * Los datos obtenidos se asignan a la propiedad `tablaDeDatos.datos`.
   *
   * @returns {void}
   */
  public cargarMercanciaTabla(): void {
    if (this.mercanciaFormulario.valid) {
      const REQUIRED_FIELDS = [
        'modalDescMercancia',
        'espeMercancia'
      ];
      const INVALID_FIELDS: string[] = [];

      // Verificar si los campos requeridos están vacíos o son inválidos
      REQUIRED_FIELDS.forEach((field) => {
        const CONTROL = this.mercanciaFormulario.get(field);
        if (!CONTROL?.value || CONTROL.invalid) {
          INVALID_FIELDS.push(field);
        }
      });

      // Si algún campo requerido es inválido, mostrar error y salir
      if (INVALID_FIELDS.length > 0) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: 'Error de validación',
          mensaje: 'Por favor, complete todos los campos requeridos antes de agregar.',
          cerrar: true,
          tiempoDeEspera: 3000,
          txtBtnAceptar: 'De acuerdo',
          txtBtnCancelar: '',
        };

        // Marcar todos los controles del formulario como tocados para mostrar errores de validación
        this.mercanciaFormulario.markAllAsTouched();
        return;
      }

      const FORM_VALUES = this.mercanciaFormulario.value;
      const NEW_ROW: SolicitudTabla = {
        id: this.tablaDeDatos.datos.length + 1,
        marca: FORM_VALUES.marcaMercancia,
        modelo: FORM_VALUES.modeloMercancia,
        numeroDeSerie: FORM_VALUES.numSerieMercancia,
        tipo: FORM_VALUES.tipoMercancia,
        modalDescMercancia: FORM_VALUES.modalDescMercancia,
      };

      this.tablaDeDatos.datos = [...this.tablaDeDatos.datos, NEW_ROW];
      this.mercanciaFormulario.reset();
      this.mercanciaFormulario.markAsUntouched();
      this.mercanciaFormulario.markAsPristine();
    }
  }

  /**
   * Obtiene la etiqueta de un elemento seleccionado en un catálogo desplegable.
   *
   * @param selectedId - El ID del elemento seleccionado.
   * @param catalog - Una lista de objetos del catálogo que contiene descripciones.
   * @returns La descripción del elemento seleccionado si se encuentra, de lo contrario, 'N/A'.
   */
  static getDropdownLabel(
    selectedId: string | number,
    catalog: Catalogo[]
  ): string {
    const NUMERIC_ID =
      typeof selectedId === 'string' ? parseInt(selectedId, 10) : selectedId;
    const SELECTED_ITEMS = catalog.find((item) => {
      return item.id === NUMERIC_ID;
    });
    return SELECTED_ITEMS ? SELECTED_ITEMS.descripcion : 'N/A';
  }

  /**
   * @method agregarMercancia
   * @description Método para agregar Mercancias a la tabla de avisos.
   *
   * - Carga los datos de la tabla de avisos y cierra el modal de Mercancia.
   *
   * @returns {void}
   */
  agregarMercancia(): void {
    if (this.mercanciaFormulario.invalid) {
      Object.values(this.mercanciaFormulario.controls).forEach(control => {
        control.markAsTouched();
        control.markAsDirty();
      });
      this.mercanciaFormularioValidation = true;
      return;
    }
    this.mercanciaFormularioValidation = false;
    // Si estamos editando (elementoParaEliminar tiene valor), actualiza la fila
    if (this.elementoParaEliminar) {
      const IDX = this.tablaDeDatos.datos.findIndex(
        (ROW: SolicitudTabla) => ROW.id === this.elementoParaEliminar
      );
      if (IDX !== -1) {
        const FORM_VALUES = this.mercanciaFormulario.value;
        this.tablaDeDatos.datos[IDX] = {
          ...this.tablaDeDatos.datos[IDX],
          modalDescMercancia: FORM_VALUES.modalDescMercancia,
          marca: FORM_VALUES.marcaMercancia,
          modelo: FORM_VALUES.modeloMercancia,
          numeroDeSerie: FORM_VALUES.numParteMercancia,
          tipo: FORM_VALUES.tipoMercancia,
        };
      }
      this.elementoParaEliminar = undefined;
      this.filaSeleccionadaLista = [];
    } else {
      this.cargarMercanciaTabla();
    }
    this.closeMercancia.nativeElement.click();
  }

  /**
   * @method abrirModal
   * @description Método para abrir un modal de notificación.
   *
   * Este método configura una nueva notificación con los siguientes parámetros:
   * - `tipoNotificacion`: Tipo de notificación (en este caso, "alerta").
   * - `categoria`: Categoría de la notificación (en este caso, "peligro").
   * - `modo`: Modo de la notificación (en este caso, "acción").
   * - `titulo`: Título de la notificación (en este caso, vacío).
   * - `mensaje`: Mensaje de la notificación (en este caso, "El registro fue agregado correctamente.").
   * - `cerrar`: Indica si la notificación se puede cerrar manualmente (en este caso, `false`).
   * - `tiempoDeEspera`: Tiempo en milisegundos antes de que la notificación desaparezca automáticamente (en este caso, 2000 ms).
   * - `txtBtnAceptar`: Texto del botón de aceptación (en este caso, "Aceptar").
   * - `txtBtnCancelar`: Texto del botón de cancelación (en este caso, vacío).
   *
   * @example
   * // Llamar al método para abrir el modal de notificación
   * this.abrirModal();
   */
  public abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'El registro fue agregado correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.elementoParaEliminar = i;
  }

  /**
   * @method cambiarTipoDocumento
   * @description Método para manejar el cambio del tipo de documento en el formulario.
   *
   * - Si el tipo de documento seleccionado es "Folio VUCEM", desactiva el campo `checkProrroga` y limpia su valor.
   * - En caso contrario, habilita el campo `checkProrroga`.
   *
   * @returns {void}
   */
  cambiarTipoDocumento(): void {
    const FIELDS = ['descMercancia', 'marca', 'modelo', 'numeroSerie', 'tipo', 'folioOficialProrroga', 'fechaImportacionTemporal', 'fechaVencimiento', 'folioFormatoOficial', 'folioImportacionTemporal', 'patente', 'pedimento', 'aduana'];
    FIELDS.forEach((field) => {
      this.datosPedimento.get(field)?.reset('');
    });
    if (this.datosPedimento.get('cveTipoDocumento')?.value === 'Folio VUCEM') {
      this.datosPedimento.get('checkProrroga')?.setValue('');
      this.datosPedimento.get('checkProrroga')?.disable();
      this.datosPedimento.get('folioOficialProrroga')?.disable();
    } else {
      this.datosPedimento.get('checkProrroga')?.enable();
    }
  }

  /**
   * @method cambiarCheckProrroga
   * @description Método para manejar el cambio del estado del checkbox `checkProrroga`.
   *
   * - Si el checkbox está seleccionado (`true`), habilita el campo `folioOficialProrroga`.
   * - Si el checkbox no está seleccionado (`false`), deshabilita el campo `folioOficialProrroga` y limpia su valor.
   *
   * @returns {void}
   */
  cambiarCheckProrroga(): void {
    if (this.datosPedimento.get('checkProrroga')?.value === true) {
      this.datosPedimento.get('folioOficialProrroga')?.enable();
    } else {
      this.datosPedimento.get('folioOficialProrroga')?.setValue('');
      this.datosPedimento.get('folioOficialProrroga')?.disable();
    }
  }

  /**
   * @method cambiarMedioDeTransporte
   * @description Cambia el estado del medio de transporte basado en el valor del campo 'cveTipoDocumento'.
   * Si el valor es 'Folio VUCEM', desactiva y limpia el campo 'checkProrroga'.
   * En caso contrario, habilita el campo 'checkProrroga'.
   *
   * @returns {void} No retorna ningún valor.
   */
  cambiarMedioDeTransporte(): void {
    if (this.datosPedimento.get('cveTipoDocumento')?.value === 'Folio VUCEM') {
      this.datosPedimento.get('checkProrroga')?.setValue('');
      this.datosPedimento.get('checkProrroga')?.disable();
    } else {
      this.datosPedimento.get('checkProrroga')?.enable();
    }
  }

  /**
   * Validador personalizado para verificar si la fecha es menor o igual a la fecha actual
   */
  static validateFechaMenorIgualHoy(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    let fechaSeleccionada: Date;
    if (typeof control.value === 'string' && control.value.includes('/')) {
      const PARTES = control.value.split('/');
      if (PARTES.length === 3) {
        const DIA = parseInt(PARTES[0], 10);
        const MES = parseInt(PARTES[1], 10);
        const ANIO = parseInt(PARTES[2], 10);
        fechaSeleccionada = new Date(ANIO, MES - 1, DIA);
      } else {
        fechaSeleccionada = new Date(control.value);
      }
    } else {
      fechaSeleccionada = new Date(control.value);
    }

    // Verificar si la fecha es válida
    if (isNaN(fechaSeleccionada.getTime())) {
      return { fechaInvalida: true }; // Retorna error para fechas inválidas
    }

    const FECHA_ACTUAL = new Date();

    // Restablecer la hora para comparar solo las fechas
    fechaSeleccionada.setHours(0, 0, 0, 0);
    FECHA_ACTUAL.setHours(0, 0, 0, 0);

    if (fechaSeleccionada > FECHA_ACTUAL) {
      return { fechaInvalida: true }; // Retorna un objeto de error para fechas futuras
    }

    return null; // Retorna null si la fecha es válida (hoy o pasada)
  }
/**
 * Validador personalizado para verificar si la fecha es mayor a la fecha actual (solo fechas futuras)
 */
public validateFechaMayorHoy(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  
  let fechaSeleccionada: Date;
  
  // Handle different date formats
  if (typeof control.value === 'string') {
    if (control.value.includes('/')) {
      // Format: DD/MM/YYYY
      const PARTES = control.value.split('/');
      if (PARTES.length === 3) {
        const DIA = parseInt(PARTES[0], 10);
        const MES = parseInt(PARTES[1], 10);
        const ANIO = parseInt(PARTES[2], 10);
        fechaSeleccionada = new Date(ANIO, MES - 1, DIA);
      } else {
        return { fechaInvalida: true };
      }
    } else if (control.value.includes('-')) {
      // Format: YYYY-MM-DD
      fechaSeleccionada = new Date(control.value);
    } else {
      return { fechaInvalida: true };
    }
  } else if (control.value instanceof Date) {
    fechaSeleccionada = new Date(control.value);
  } else {
    fechaSeleccionada = new Date(control.value);
  }

  // Verificar si la fecha es válida
  if (isNaN(fechaSeleccionada.getTime())) {
    return { fechaInvalida: true };
  }

  const FECHA_ACTUAL = new Date();

  // Restablecer la hora para comparar solo las fechas
  fechaSeleccionada.setHours(0, 0, 0, 0);
  FECHA_ACTUAL.setHours(0, 0, 0, 0);

  // Solo acepta fechas futuras (mayor que hoy)
  // Rechaza fechas de hoy o anteriores
  if (fechaSeleccionada <= FECHA_ACTUAL) {
    return { fechaInvalida: true };
  }
  return null; // Fecha válida (futura)
}

  /**
* Elimina un pedimento si se confirma la acción. 
*/
  eliminarPedimento(borrar: boolean): void {
    if (borrar && typeof this.elementoParaEliminar === 'number') {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Verifica si todo el formulario es válido para su envío.
   * Marca los campos requeridos como tocados y valida la lógica condicional.
   * @returns {boolean} True si el formulario es válido, false en caso contrario.
   */
  isFormValid(): boolean {
    return this.validateFormOnSubmit();
  }

  /**
   * Valida el formulario al enviar, incluyendo campos condicionales y dependientes.
   * Marca los controles relevantes como tocados para mostrar errores.
   * @returns {boolean} True si el formulario es válido, false en caso contrario.
   */
  private validateFormOnSubmit(): boolean {
    let hasError = false;

    // Marcar los campos siempre requeridos como tocados
    this.datosAduana.get('cveAduana')?.markAsTouched();
    this.datosMedioTransporte.get('cveMedioTrasporte')?.markAsTouched();
    this.datosDestinoMercancia.get('conDestino')?.markAsTouched();
    this.datosDestinoMercancia.get('cveTipoDestino')?.markAsTouched();

    // Verificar los campos siempre requeridos
    if (!this.datosAduana.get('cveAduana')?.value) { hasError = true }
    if (!this.datosMedioTransporte.get('cveMedioTrasporte')?.value) { hasError = true }
    if (!this.datosDestinoMercancia.get('conDestino')?.value) { hasError = true }
    if (!this.datosDestinoMercancia.get('cveTipoDestino')?.value) { hasError = true }

    // Validar tipoDocumento y sus campos dependientes
    const TIPO_DOCUMENTO = this.datosPedimento.get('cveTipoDocumento')?.value;
    if (!TIPO_DOCUMENTO) {
      this.datosPedimento.get('cveTipoDocumento')?.markAsTouched();
      hasError = true;
    } else {
      hasError = this.validateTipoDocumentoFields(TIPO_DOCUMENTO) || hasError;
    }
    // Validar que haya al menos una mercancía en la tabla
    if( this.tablaDeDatos.datos.length === 0){
      this.tablaDeDatosValidation = true;
      hasError = true;
    }
    // Validar medio de transporte y sus campos dependientes
    const MEDIO_TRANSPORTE = this.datosMedioTransporte.get('cveMedioTrasporte')?.value;
    if (!MEDIO_TRANSPORTE) {
      this.datosMedioTransporte.get('cveMedioTrasporte')?.markAsTouched();
      hasError = true;
    } else {
      hasError = this.validateMedioDeTransporteFields() || hasError;
    }

    // Validar campos de destino si aplica
    const CON_DESTINO = this.datosDestinoMercancia.get('conDestino')?.value;
    if (CON_DESTINO === 'Si') {
      hasError = this.validateDestinoFields() || hasError;
      if (this.datosDestinoMercancia.get('cveTipoDestino')?.value === 'Retorno') {
        const CVE_TIPO_DOCUMENTO_REEMPLAZADA = this.datosDestinoMercancia.get('cveTipoDocumentoReemplazada')?.value;
        if (!CVE_TIPO_DOCUMENTO_REEMPLAZADA) {
          this.datosDestinoMercancia.get('cveTipoDocumentoReemplazada')?.markAsTouched();
          hasError = true;
        } else {
          hasError = this.validateTipoDestinationFields(CVE_TIPO_DOCUMENTO_REEMPLAZADA) || hasError;
        }
      }
    }
    this.handleDateFieldsOnValidation();

    return !hasError;
  }

  /**
   * Valida los campos según el tipo de documento seleccionado.
   * @param tipoDocumento - El tipo de documento seleccionado.
   * @returns {boolean} True si hay errores de validación, false en caso contrario.
   */
  private validateTipoDocumentoFields(tipoDocumento: string): boolean {
    const FIELDS_MAP: Record<string, string[]> = {
      'Folio VUCEM': [
        'fechaImportacionTemporal',
        'folioImportacionTemporal',
        'fechaVencimiento',
        'descMercancia'
      ],
      'Pedimento': [
        'aduana',
        'patente',
        'pedimento',
        'fechaImportacionTemporal',
        'fechaVencimiento',
        'descMercancia'
      ],
      'Formato oficial': [
        'folioFormatoOficial',
        'descMercancia'
      ]
    };

    const REQUIRED_FIELDS = FIELDS_MAP[tipoDocumento] || [];
    return this.validateFields(this.datosPedimento, REQUIRED_FIELDS);
  }

  /**
   * Valida los campos relacionados con el destino según el tipo de destino seleccionado.
   * @returns {boolean} True si hay errores de validación, false en caso contrario.
   */
  private validateDestinoFields(): boolean {
    const TIPO_DESTINO = this.datosDestinoMercancia.get('cveTipoDestino')?.value;

    const FIELDS_MAP: Record<string, string[]> = {
      'Retorno': ['cveTipoDocumentoReemplazada'],
      'Destrucción': [
        'numeroActaDescruccion',
        'fechaDescruccionDestino',
        'autoridadPresentoAvisoDestruccion'
      ],
      'Importación definitiva': [
        'cveAduanaDestino',
        'cvePatenteDestino',
        'cvePedimentoDestino'
      ]
    };

    const REQUIRED_FIELDS = FIELDS_MAP[TIPO_DESTINO] || [];
    return this.validateFields(this.datosDestinoMercancia, REQUIRED_FIELDS);
  }

  /**
   * Valida los campos relacionados con el medio de transporte según el tipo seleccionado.
   * @returns {boolean} True si hay errores de validación, false en caso contrario.
   */
  private validateMedioDeTransporteFields(): boolean {
    const TIPO_TRANSPORTE = this.medioDeTransporte.find((transporte) => transporte.id === Number(this.datosMedioTransporte.get('cveMedioTrasporte')?.value))?.descripcion || '';

    const FIELDS_MAP: Record<string, string[]> = {
      'Aéreo': ['guiaMaster'],
      'Marítimo': [
        'guiaBl'
      ],
      'Ferroviario': [
        'numeroBl'
      ]
    };

    const REQUIRED_FIELDS = FIELDS_MAP[TIPO_TRANSPORTE] || [];
    return this.validateFields(this.datosMedioTransporte, REQUIRED_FIELDS);
  }

  /**
   * Valida los campos para el tipo de documento seleccionado en la sección de destino.
   * @param tipoDocumento - El tipo de documento seleccionado para destino.
   * @returns {boolean} True si hay errores de validación, false en caso contrario.
   */
  private validateTipoDestinationFields(tipoDocumento: string): boolean {
    const FIELDS_MAP: Record<string, string[]> = {
      'Folio VUCEM': ['folioFormatoOficialTemporalDestino'],
      'Pedimento': [
        'cveAduanaDestino',
        'cvePatenteDestino',
        'cvePedimentoDestino'
      ],
      'Formato oficial': ['folioFormatoOficialDestino']
    };

    const REQUIRED_FIELDS = FIELDS_MAP[tipoDocumento] || [];
    return this.validateFields(this.datosDestinoMercancia, REQUIRED_FIELDS);
  }

  /**
   * Valida una lista de campos en un FormGroup dado.
   * Marca cada campo como tocado y verifica si está en estado inválido.
   * @param formGroup - El grupo de formulario a validar.
   * @param fields - Arreglo de nombres de campos a validar.
   * @returns {boolean} True si hay errores de validación, false en caso contrario.
   */
  private validateFields(formGroup: FormGroup, fields: string[]): boolean {
    let hasError = false;

    fields?.forEach(field => {
      const CONTROL = formGroup?.get(field);
      if (CONTROL) {
        CONTROL.markAsTouched();
        if (CONTROL.invalid) {
          hasError = true;
        }
      }
    });

    // Utiliza esto para satisfacer la regla de lint para métodos de clase que usan this
    return hasError || !this;
  }

  /**
   * Valida los campos de fecha en el formulario y agrega borde de error visual si están vacíos.
   * 
   * Este método revisa los controles de fecha relevantes en el formulario (`fechaImportacionTemporal`, `fechaVencimiento`, `fechaDescruccionDestino`)
   * y, si alguno está vacío, agrega la clase CSS `is-invalid-date` al campo correspondiente para mostrar el error visual.
   */
  handleDateFieldsOnValidation(): void {
    const FECHA_IMPORTACION_TEMPORAL_CONTROL = this.datosPedimento.get('fechaImportacionTemporal')?.value;
    const FECHA_VENCIMIENTO_CONTROL = this.datosPedimento.get('fechaVencimiento')?.value;
    const FECHA_DESCRUCCION_DESTINO_INPUT = this.datosDestinoMercancia.get('fechaDescruccionDestino')?.value;
    if (!FECHA_IMPORTACION_TEMPORAL_CONTROL) {
      this.addErrorBorderToDateFields(document.getElementById('fechaImportacionTemporalInput'));
    }
    if (!FECHA_VENCIMIENTO_CONTROL) {
      this.addErrorBorderToDateFields(document.getElementById('fechaVencimientoInput'));
    }
    if (!FECHA_DESCRUCCION_DESTINO_INPUT) {
      this.addErrorBorderToDateFields(document.getElementById('fechaDescruccionDestinoInput'));
    }
  }

  /**   
   * @method permitirSoloAlfanumerico
   * @description Maneja el evento de pulsación de tecla para permitir solo caracteres alfanuméricos.
   * @param event - El evento de teclado.
   */

  public permitirSoloAlfanumerico(event: KeyboardEvent): void {
    const PATTERN = PATRON_LETRAS_NUMEROS_ESPACIOS;
    const CHAR = String.fromCharCode(event?.charCode || event?.which);
    
    if (!PATTERN.test(CHAR) && this) {
      event.preventDefault();
    }
  }

  /**
   * @method permitirSoloNumerico
   * @description Maneja el evento de pulsación de tecla para permitir solo caracteres numéricos.
   * @param event - El evento de teclado.
   */
  
  public permitirSoloNumerico(event: KeyboardEvent): void {
    const PATTERN = REGEX_SOLO_NUMEROS;
    const CHAR = String.fromCharCode(event?.charCode || event?.which);
    
    if (!PATTERN.test(CHAR) && this) {
      event.preventDefault();
    }
  } 


  /**   * Agrega una clase de borde de error a los campos de fecha vacíos.
   * @param element - El elemento HTML del campo de fecha.
   */
  addErrorBorderToDateFields(element: HTMLElement | null): void {
    const INPUT_ELEMENT = element?.querySelector('.input-group-text');
    const REQUIRE_SPAN = element?.querySelector('input-fecha label span.require');
    const ERROR_MESSAGE_DIV = document.createElement('div');
    const ERROR_MESSAGE = ERROR_MESSAGE_DIV.appendChild(document.createElement('small'));
    ERROR_MESSAGE.innerText = 'Este campo es obligatorio.';
    ERROR_MESSAGE.classList.add('text-danger');
    if (INPUT_ELEMENT && this) {
      INPUT_ELEMENT.classList?.add('is-invalid-date');
      // Adjuntar al elemento padre en lugar de hijo
      INPUT_ELEMENT.parentElement?.parentElement?.parentElement?.appendChild(ERROR_MESSAGE_DIV);
    }
    if (REQUIRE_SPAN && this) {
      REQUIRE_SPAN.classList?.add('invalid-date-label-asterisk');
    }
  }
  /**
   * @method resetValidationMessage
   * @description Resetea el mensaje de validación del formulario de mercancía si es válido.    
   * @return {void}
   */
  resetValidationMessage(): void {
    if(!this.mercanciaFormulario.invalid){
      this.mercanciaFormularioValidation = false;
    }
  }
  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * - Completa el `Subject` `destroyNotifier$` para cancelar todas las suscripciones activas y evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
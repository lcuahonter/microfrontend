import {
  Catalogo,
  CatalogoSelectComponent,
  InputFecha,
  InputFechaComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_CARACTERES_ESPECIALES,
  REGEX_NICO,
  REGEX_REEMPLAZAR,
  REGEX_SOLO_NUMEROS,
  REG_X,
  TEXTOS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import {
  CatalogoLista,
  SolicitudTabla,
  SolicitudTablaDatos,
} from '../../models/retorno-de-partes.model';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FECHA_CARTAPORTE,
  FECHA_DESTINO,
  FECHA_IMPORTACION,
  FECHA_VENCIMIENTO,
  TABLA_DE_DATOS,
} from '../../constants/retorno-de-partes.enum';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  Tramite6403State,
  Tramite6403Store,
} from '../../estados/tramite6403.store';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { RetornoDePartesService } from '../../services/retorno-de-partes.service';
import { Tramite6403Query } from '../../estados/tramite6403.query';
/**
 * Componente para gestionar el aviso de traslado.
 *
 * Este componente permite al usuario capturar, editar y gestionar la información
 * relacionada con el aviso de traslado, incluyendo datos de la empresa, mercancías,
 * Mercancias y otros detalles necesarios para el trámite 6403.
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
    NotificacionesComponent,
  ],
  standalone: true,
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Título del modal para agregar o editar mercancías.
   */
  titleMercancia: string = 'Agregar';
  /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;
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
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /**
   * @property {Tramite6403State} tramiteState
   * @description Estado actual del trámite 6403, que contiene toda la información relevante del proceso.
   */
  public tramiteState!: Tramite6403State;

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
   * Instancia del componente `Modal`.
   *
   * Se utiliza para manipular directamente el modal, por ejemplo
   * abrirlo, cerrarlo o realizar operaciones relacionadas con
   * su estado actual.
   *
   * @type {Modal}
   */
  MODAL_INSTANCE!: Modal;
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
   * Constructor del componente.
   *
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {Tramite6403Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite6403Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {retornoDePartesService} retornoDePartesService - Servicio para obtener datos relacionados con el aviso.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   */
  constructor(
    public fb: FormBuilder,
    public store: Tramite6403Store,
    public tramiteQuery: Tramite6403Query,
    public retornoDePartesService: RetornoDePartesService,
    public validacionesService: ValidacionesFormularioService,
    public consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.tablaDeDatos.datos = this.tramiteState.tablaPartesReemplazadasDatos || [];
        })
      )
      .subscribe();
  }
  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Configura los formularios, carga los datos iniciales y suscribe al estado del trámite.
   */
  ngOnInit(): void {
    this.cargarFederativa();
    this.cargarAduanas();
    this.cargarAduaneras();
    this.cargarRecintoFiscalizado();
    this.cargarTipoDeDocumento();
    this.cargarMedioDeTransporte();
    this.cargarPaisDeProcedencia();
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
      this.inicializarMercanciaFormulario();
    }
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    this.inicializarMercanciaFormulario();
    if (this.soloLectura) {
      this.solicitudFormulario?.disable();
      this.mercanciaFormulario?.disable();
    } else {
      this.solicitudFormulario?.enable();
      this.mercanciaFormulario?.enable();
    }
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
    this.datosPedimento.get('fechaDescruccionDestino')?.setValue(nuevo_valor);
    this.datosPedimento.get('fechaDescruccionDestino')?.markAsUntouched();
    this.store.setFechaCartaPorte(nuevo_valor);
  }

  /**
   * @method setValoresStore
   * @description Método para establecer valores en el store del trámite.
   * Obtiene el valor de un campo específico de un formulario y lo asigna al método correspondiente del store.
   *
   * @param {FormGroup} form - Formulario reactivo del cual se obtiene el valor.
   * @param {string} campo - Nombre del campo dentro del formulario.
   * @param {keyof Tramite6403Store} metodoNombre - Nombre del método del store donde se asignará el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite6403Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * @method setTipContenedorValue
   * @description Maneja el evento de cambio del campo tipContenedor y asegura que se almacene un valor de tipo string.
   * 
   * @param {Event} event - El evento de cambio del campo de entrada.
   */
  setTipContenedorValue(event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    const VALOR = TARGET.value;
    
    // Asegurar que almacenamos un valor de tipo string, no un objeto
    this.store.setTipContenedor(VALOR);
  }

  /**
   * @method cargarAduaneras
   * @description Método para cargar la lista de aduaneras desde el servicio `retornoDePartesService`.
   * Los datos obtenidos se asignan a la propiedad `aduaneras`.
   *
   * @returns {void}
   */
  public cargarAduaneras(): void {
    this.retornoDePartesService
      .obtenerAduaneras()
      .pipe(takeUntil(this.destroyed$))
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
    this.retornoDePartesService
      .obtenerAduanas()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: CatalogoLista) => {
        this.aduanas = datos.datos;
      });
  }

  /**
   * @method cargarRecintoFiscalizado
   * @description Método para cargar la lista de recintos fiscalizados desde el servicio `retornoDePartesService`.
   * Los datos obtenidos se asignan a la propiedad `recintoFiscalizado`.
   *
   * @returns {void}
   */
  public cargarRecintoFiscalizado(): void {
    this.retornoDePartesService
      .obtenerRecintoFiscalizado()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: CatalogoLista) => {
        this.recintoFiscalizado = datos.datos;
      });
  }

  /**
   * @method cargarTipoDeDocumento
   * @description Método para cargar la lista de tipos de documentos desde el servicio `retornoDePartesService`.
   * Los datos obtenidos se asignan a la propiedad `tipoDeDocumento`.
   *
   * @returns {void}
   */
  public cargarTipoDeDocumento(): void {
    this.retornoDePartesService
      .obtenerTipoDeDocumento()
      .pipe(takeUntil(this.destroyed$))
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
    this.retornoDePartesService
      .obtenerMedioDeTransporte()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: CatalogoLista) => {
        this.medioDeTransporte = datos.datos;
      });
  }

  /**
   * Carga el país de procedencia desde el servicio de autorización de importación.
   *
   * Este método realiza una solicitud al servicio `retornoDePartesService`
   * para obtener el catálogo de países de procedencia. Los datos obtenidos se asignan
   * a la propiedad `paisDeProcedencia` del componente.
   *
   * @remarks
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   *
   * @see {@link retornoDePartesService.obtenerPaisDeProcedencia}
   */
  public cargarPaisDeProcedencia(): void {
    this.retornoDePartesService
      .obtenerPaisDeProcedencia()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: CatalogoLista) => {
        this.paisDeProcedencia = datos.datos;
      });
  }

  /**
   * @method cargarFederativa
   * @description Método para cargar la lista de entidades federativas desde el servicio `retornoDePartesService`.
   * Los datos obtenidos se asignan a la propiedad `entidadFederativa`.
   *
   * @returns {void}
   */
  public cargarFederativa(): void {
    this.retornoDePartesService
      .obtenerFederativa()
      .pipe(takeUntil(this.destroyed$))
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
          {
            value: this.tramiteState?.solicitudFormulario?.cveAduana,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        cveSeccionAduanal: [
          {
            value: this.tramiteState?.solicitudFormulario?.cveSeccionAduanal,
            disabled: this.soloLectura,
          },
        ],
        cveRecintoFiscalizado: [
          {
            value:
              this.tramiteState?.solicitudFormulario?.cveRecintoFiscalizado,
            disabled: this.soloLectura,
          },
        ],
      }),
      datosPedimento: this.fb.group({
        cveTipoDocumento: [
          {
            value: this.tramiteState?.solicitudFormulario?.cveTipoDocumento,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        estadoTipoDocumento: [
          {
            value: this.tramiteState?.solicitudFormulario?.estadoTipoDocumento,
            disabled: true,
          },
        ],
        aduana: [
          {
            value: this.tramiteState?.solicitudFormulario?.aduana,
            disabled: this.soloLectura,
          },
          [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
        ],
        patente: [
          {
            value: this.tramiteState?.solicitudFormulario?.patente,
            disabled: this.soloLectura,
          },
          [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
        ],
        pedimento: [
          {
            value: this.tramiteState?.solicitudFormulario?.pedimento,
            disabled: this.soloLectura,
          },
          [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
        ],
        folioImportacionTemporal: [
          {
            value:
              this.tramiteState?.solicitudFormulario?.folioImportacionTemporal,
            disabled: this.soloLectura,
          },
          [
            Validators.required,
            Validators.maxLength(25),
            Validators.pattern(REG_X.SOLO_NUMEROS),
          ],
        ],
        folioFormatoOficial: [
          {
            value: this.tramiteState?.solicitudFormulario?.folioFormatoOficial,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        checkProrroga: [
          {
            value: this.tramiteState?.solicitudFormulario?.checkProrroga,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        folioOficialProrroga: [
          {
            value: this.tramiteState?.solicitudFormulario?.folioOficialProrroga,
            disabled: true,
          }
        ],
        fechaImportacionTemporal: [this.tramiteState?.solicitudFormulario?.fechaImportacionTemporal,
          [Validators.required],
        ],
        fechaVencimiento: [this.tramiteState?.solicitudFormulario?.fechaVencimiento,
          [Validators.required],
        ],
        descMercancia: [
          {
            value: this.tramiteState?.solicitudFormulario?.descMercancia,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        marca: [
          {
            value: this.tramiteState?.solicitudFormulario?.marca,
            disabled: this.soloLectura,
          }
        ],
        modelo: [
          {
            value: this.tramiteState?.solicitudFormulario?.modelo,
            disabled: this.soloLectura,
          }
        ],
        numeroSerie: [
          {
            value: this.tramiteState?.solicitudFormulario?.numeroSerie,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        tipo: [
          {
            value: this.tramiteState?.solicitudFormulario?.tipo,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
      }),
      datosMedioTransporte: this.fb.group({
        cveMedioTrasporte: [
          {
            value: this.tramiteState?.solicitudFormulario?.cveMedioTrasporte,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        guiaMaster: [
          {
            value: this.tramiteState?.solicitudFormulario?.guiaMaster,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        guiaBl: [
          {
            value: this.tramiteState?.solicitudFormulario?.guiaBl,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        numeroBl: [
          {
            value: this.tramiteState?.solicitudFormulario?.numeroBl,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        rfcEmpresaTransportista: [
          {
            value:
              this.tramiteState?.solicitudFormulario?.rfcEmpresaTransportista,
            disabled: this.soloLectura,
          },
        ],
        estadoMedioTransporte: [
          {
            value:
              this.tramiteState?.solicitudFormulario?.estadoMedioTransporte,
            disabled: true,
          },
        ],
        cartaPorte: [
          {
            value: this.tramiteState?.solicitudFormulario?.cartaPorte,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        cvePaisProcedencia: [
          {
            value: this.tramiteState?.solicitudFormulario?.cvePaisProcedencia,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        guiaHouse: [
          {
            value: this.tramiteState?.solicitudFormulario?.guiaHouse,
            disabled: this.soloLectura,
          },
        ],
        numeroBuque: [
          {
            value: this.tramiteState?.solicitudFormulario?.numeroBuque,
            disabled: this.soloLectura,
          },
        ],
        numeroEquipo: [
          {
            value: this.tramiteState?.solicitudFormulario?.numeroEquipo,
            disabled: this.soloLectura,
          },
        ],
        fechaCartaPorte: [this.tramiteState?.solicitudFormulario?.fechaCartaPorte,
          [Validators.required],
        ],
        tipContenedor: [
          {
            value: this.tramiteState?.solicitudFormulario?.tipContenedor || '',
            disabled: this.soloLectura,
          }
        ],
        tranporteMarca: [
          {
            value: this.tramiteState?.solicitudFormulario?.tranporteMarca,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        tranporteModelo: [
          {
            value: this.tramiteState?.solicitudFormulario?.tranporteModelo,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        tranportePlaca: [
          {
            value: this.tramiteState?.solicitudFormulario?.tranportePlaca,
            disabled: this.soloLectura,
          }
        ],
        observaciones: [
          {
            value: this.tramiteState?.solicitudFormulario?.observaciones,
            disabled: this.soloLectura,
          },
        ],
      }),
      datosDestinoMercancia: this.fb.group({
        conDestino: [
          {
            value: this.tramiteState?.solicitudFormulario?.conDestino,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        cveTipoDestino: [
          {
            value: this.tramiteState?.solicitudFormulario?.cveTipoDestino,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        cveTipoDocumentoReemplazada: [
          {
            value:
              this.tramiteState?.solicitudFormulario
                ?.cveTipoDocumentoReemplazada,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        numeroActaDescruccion: [
          {
            value:
              this.tramiteState?.solicitudFormulario?.numeroActaDescruccion,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        cveAduanaDestino: [
          {
            value: this.tramiteState?.solicitudFormulario?.cveAduanaDestino,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        cvePatenteDestino: [
          {
            value: this.tramiteState?.solicitudFormulario?.cvePatenteDestino,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        cvePedimentoDestino: [
          {
            value: this.tramiteState?.solicitudFormulario?.cvePedimentoDestino,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        folioVucemRetorno: [
          {
            value: this.tramiteState?.solicitudFormulario?.folioVucemRetorno,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        folioFormatoOficialDestino: [
          {
            value:
              this.tramiteState?.solicitudFormulario
                ?.folioFormatoOficialDestino,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        fechaDescruccionDestino: [
          {
            value:
              this.tramiteState?.solicitudFormulario?.fechaDescruccionDestino,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        estadoTipoDocumentoDestino: [
          {
            value:
              this.tramiteState?.solicitudFormulario
                ?.estadoTipoDocumentoDestino,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        autoridadPresentoAvisoDestruccion: [
          {
            value:
              this.tramiteState?.solicitudFormulario
                ?.autoridadPresentoAvisoDestruccion,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
      }),
    });
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
      modalDescMercancia: [
        {value: this.tramiteState?.mercanciaFormulario?.modalDescMercancia, disabled: this.soloLectura},
        [Validators.required],
      ],
      espeMercancia: [
        {value: this.tramiteState?.mercanciaFormulario?.espeMercancia, disabled: this.soloLectura},
        [Validators.required],
      ],
      marcaMercancia: [
        {value: this.tramiteState?.mercanciaFormulario?.marcaMercancia, disabled: this.soloLectura},
        [],
      ],
      modeloMercancia: [
        {value: this.tramiteState?.mercanciaFormulario?.modeloMercancia, disabled: this.soloLectura},
        [],
      ],
      numSerieMercancia: [
        {value: this.tramiteState?.mercanciaFormulario?.numSerieMercancia, disabled: this.soloLectura},
        [],
      ],
      numParteMercancia: [
        {value: this.tramiteState?.mercanciaFormulario?.numParteMercancia, disabled: this.soloLectura},
        [],
      ],
      tipoMercancia: [
        {value: this.tramiteState?.mercanciaFormulario?.tipoMercancia, disabled: this.soloLectura},
        [],
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
   * Abre el modal de mercancía en modo **modificación** y carga en el formulario
   * los datos de la fila seleccionada.
   *
   * - Si existen elementos seleccionados en la lista (`filaSeleccionadaLista`),
   *   se instancia y muestra el modal (`MODAL_INSTANCE`) y se asignan los valores
   *   de la mercancía al formulario reactivo (`mercanciaFormulario`).
   *
   * - Si no hay ninguna fila seleccionada, se muestra un modal de advertencia
   *   indicando que es necesario seleccionar un registro antes de modificar.
   *
   * @returns {void}
   */
  modificarReemplazadas(): void {
    if (this.filaSeleccionadaLista.length > 0) {
      if (this.modalMercancia) {
        this.MODAL_INSTANCE = new Modal(this.modalMercancia.nativeElement);
        this.MODAL_INSTANCE.show();
        this.titleMercancia = 'Modificar';
      }
      this.mercanciaFormulario.patchValue({
        modalDescMercancia: this.filaSeleccionadaLista[0].descripcionMercancia,
        marcaMercancia: this.filaSeleccionadaLista[0].marca,
        modeloMercancia: this.filaSeleccionadaLista[0].modelo,
        numSerieMercancia: this.filaSeleccionadaLista[0].numeroDeSerie,
        tipoMercancia: this.filaSeleccionadaLista[0].tipo,
        espeMercancia: this.filaSeleccionadaLista[0].espeMercancia,
        numParteMercancia: this.filaSeleccionadaLista[0].numParteMercancia
      });
    } else {
      this.abrirModal('Debe seleccionar un registro a modificar');
    }
  }

  /**
   * Abre el modal de mercancía en modo **consulta** y carga en el formulario
   * los datos de la fila seleccionada.
   *
   * - Si existen elementos seleccionados en la lista (`filaSeleccionadaLista`),
   *   se instancia y muestra el modal (`MODAL_INSTANCE`) y se asigna el título
   *   del modal a **"Consultar"**.
   *
   * - Posteriormente, se llenan los controles del formulario reactivo
   *   (`mercanciaFormulario`) con la información de la mercancía seleccionada.
   *
   * - Si no hay ninguna fila seleccionada, se muestra un modal de advertencia
   *   indicando que es necesario seleccionar un registro antes de consultar.
   *
   * @returns {void}
   */
  consultarReemplazadas(): void {
    if (this.filaSeleccionadaLista.length > 0) {
      if (this.modalMercancia) {
        this.MODAL_INSTANCE = new Modal(this.modalMercancia.nativeElement);
        this.MODAL_INSTANCE.show();
        this.titleMercancia = 'Consultar';
      }
      this.mercanciaFormulario.patchValue({
        modalDescMercancia: this.filaSeleccionadaLista[0].descripcionMercancia,
        marcaMercancia: this.filaSeleccionadaLista[0].marca,
        modeloMercancia: this.filaSeleccionadaLista[0].modelo,
        numSerieMercancia: this.filaSeleccionadaLista[0].numeroDeSerie,
        tipoMercancia: this.filaSeleccionadaLista[0].tipo,
        espeMercancia: this.filaSeleccionadaLista[0].espeMercancia,
        numParteMercancia: this.filaSeleccionadaLista[0].numParteMercancia
      });
    } else {
      this.abrirModal('Debe seleccionar un registro a consultar');
    }
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
    if (this.filaSeleccionadaLista.length === 0) {
      this.abrirModal('Debe seleccionar un registro a eliminar');
    } else {
      this.tablaDeDatos.datos = this.tablaDeDatos.datos.filter(
        (ele) => !this.filaSeleccionadaLista.includes(ele)
      );
      
      // Actualizar la tienda con nuevos datos
      this.store.setTablaPartesReemplazadasDatos(this.tablaDeDatos.datos);
      
      this.filaSeleccionadaLista = [];
    }
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
      this.MODAL_INSTANCE = new Modal(this.modalMercancia.nativeElement);
      this.MODAL_INSTANCE.show();
      this.titleMercancia = 'Agregar';
    }
  }

  /**
   * @method cargarMercanciaTabla
   * @description Método para cargar los datos de la tabla de mercancias desde el servicio `retornoDePartesService`.
   * Los datos obtenidos se asignan a la propiedad `tablaDeDatos.datos`.
   *
   * @returns {void}
   */
  public cargarMercanciaTabla(): void {
    this.retornoDePartesService
      .obtenerSolicitudTabla()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: SolicitudTablaDatos) => {
        this.tablaDeDatos.datos = datos.datos;
      });
  }

  /**
   * Agrega o actualiza un registro de mercancía en la tabla de datos.
   *
   * Flujo:
   * - Obtiene los valores actuales del formulario de mercancía (`mercanciaFormulario`).
   * - Valida que los campos obligatorios (`modalDescMercancia` y `espeMercancia`)
   *   no estén inválidos; en caso contrario, marca todos los controles como
   *   tocados y detiene el proceso.
   * - Verifica si existe un `id` en la fila seleccionada:
   *   - **Si existe**: actualiza el registro correspondiente en `tablaDeDatos.datos`.
   *   - **Si no existe**: agrega un nuevo registro a la lista y muestra un modal
   *     de confirmación con el mensaje **"El registro fue agregado correctamente."**.
   * - Limpia la lista de filas seleccionadas (`filaSeleccionadaLista`),
   *   reinicia el formulario (`mercanciaFormulario.reset()`)
   *   y oculta el modal (`MODAL_INSTANCE.hide()`).
   *
   * @returns {void}
   */
  agregarMercancias(): void {
    const FORMS = this.mercanciaFormulario.value;
    if (
      this.mercanciaFormulario.get('modalDescMercancia')?.invalid ||
      this.mercanciaFormulario.get('espeMercancia')?.invalid
    ) {
      this.mercanciaFormulario?.markAllAsTouched();
      return;
    }
    const ID = this.filaSeleccionadaLista?.[0]?.id;

    const DATOS = {
      id: ID ? ID : (this.tablaDeDatos.datos.length || 0) + 1,
      marca: FORMS?.marcaMercancia,
      modelo: FORMS?.modeloMercancia,
      numeroDeSerie: FORMS?.numParteMercancia,
      tipo: FORMS?.tipoMercancia,
      descripcionMercancia: FORMS?.modalDescMercancia,
      espeMercancia: FORMS?.espeMercancia,
      numParteMercancia: FORMS?.numParteMercancia

    };
    if (ID) {
      this.tablaDeDatos.datos = this.tablaDeDatos.datos.map((item) =>
        item.id === ID ? { ...item, ...DATOS } : item
      );
    } else {
      this.tablaDeDatos.datos = [...this.tablaDeDatos.datos, { ...DATOS }];
      this.abrirModal('El registro fue agregado correctamente.');
    }

    // Actualizar la tienda con nuevos datos
    this.store.setTablaPartesReemplazadasDatos(this.tablaDeDatos.datos);
    
    this.filaSeleccionadaLista = [];
    this.mercanciaFormulario.reset();
    this.MODAL_INSTANCE.hide();
  }

  /**
   * @method agregarMercancia
   * @description Método para agregar Mercancias a la tabla de avisos.
   *
   * - Carga los datos de la tabla de avisos y cierra el modal de Mercancia.
   *
   * @returns {void}
   */
  agregarMercanciaBtn(): void {
    const FORMS = this.mercanciaFormulario.value;
    if (
      this.mercanciaFormulario.get('modalDescMercancia')?.invalid ||
      this.mercanciaFormulario.get('espeMercancia')?.invalid
    ) {
      this.mercanciaFormulario?.markAllAsTouched();
      return;
    }
    const ID = this.filaSeleccionadaLista?.[0]?.id;

    const DATOS = {
      id: ID ? ID : (this.tablaDeDatos.datos.length || 0) + 1,
      marca: FORMS?.marcaMercancia,
      modelo: FORMS?.modeloMercancia,
      numeroDeSerie: FORMS?.numParteMercancia,
      tipo: FORMS?.tipoMercancia,
      descripcionMercancia: FORMS?.modalDescMercancia,
      espeMercancia: FORMS?.espeMercancia,
      numParteMercancia: FORMS?.numParteMercancia
    };
    if (ID) {
      this.tablaDeDatos.datos = this.tablaDeDatos.datos.map((item) =>
        item.id === ID ? { ...item, ...DATOS } : item
      );
    } else {
      this.tablaDeDatos.datos = [...this.tablaDeDatos.datos, { ...DATOS }];
    }

    // Actualizar la tienda con nuevos datos
    this.store.setTablaPartesReemplazadasDatos(this.tablaDeDatos.datos);
    
    this.filaSeleccionadaLista = [];
    this.mercanciaFormulario.reset();
    this.MODAL_INSTANCE.hide();
    this.abrirModal('El registro fue agregado correctamente.');
  }

  /**
   * Cancela la operación actual en el formulario de mercancía.
   *
   * - Reinicia todos los controles del formulario (`mercanciaFormulario.reset()`),
   *   eliminando cualquier valor ingresado o modificado.
   * - Oculta el modal asociado (`MODAL_INSTANCE.hide()`),
   *   cerrando la ventana emergente sin guardar cambios.
   *
   * @returns {void}
   */
  cancelarModel(): void {
    this.mercanciaFormulario.reset();
    this.MODAL_INSTANCE.hide();
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
  public abrirModal(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
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
    const CONTROL_NAME = [
      'estadoTipoDocumento',
      'aduana',
      'patente',
      'pedimento',
      'folioImportacionTemporal',
      'folioFormatoOficial',
      'checkProrroga',
      'folioOficialProrroga',
      'fechaImportacionTemporal',
      'fechaVencimiento',
      'descMercancia',
      'marca',
      'modelo',
      'numeroSerie',
      'tipo',
    ];
    CONTROL_NAME?.forEach((field) => {
      this.datosPedimento.get(field)?.reset('');
    });
    if (this.datosPedimento?.get('cveTipoDocumento')?.value === 'Folio VUCEM') {
      this.datosPedimento?.get('checkProrroga')?.setValue('');
      this.datosPedimento?.get('checkProrroga')?.disable();
      this.datosPedimento?.get('descMercancia')?.disable();
      this.datosPedimento?.get('marca')?.disable();
      this.datosPedimento?.get('modelo')?.disable();
      this.datosPedimento?.get('numeroSerie')?.disable();
      this.datosPedimento?.get('tipo')?.disable();
      this.resetearBordesInputFecha();
    } else {
      this.datosPedimento?.get('checkProrroga')?.enable();
      this.datosPedimento?.get('descMercancia')?.enable();
      this.datosPedimento?.get('marca')?.enable();
      this.datosPedimento?.get('modelo')?.enable();
      this.datosPedimento?.get('numeroSerie')?.enable();
      this.datosPedimento?.get('tipo')?.enable();
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
    if (this.datosPedimento?.get('checkProrroga')?.value === true) {
      this.datosPedimento?.get('folioOficialProrroga')?.enable();
    } else {
      this.datosPedimento?.get('folioOficialProrroga')?.setValue('');
      this.datosPedimento?.get('folioOficialProrroga')?.disable();
    }
  }

  /**
   * Actualiza el campo **guiaMaster** en el formulario `datosMedioTransporte`.
   *
   * - Obtiene el valor desde el evento del input.
   * - Elimina caracteres no permitidos utilizando la expresión regular `REGEX_REEMPLAZAR`.
   * - Aplica el valor limpio al formulario con `patchValue`.
   *
   * @param {Event} evento Evento del input que contiene el nuevo valor.
   * @returns {void}
   */
  cambiarGuiaMaster(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    const CLEANED = VALUE.replace(REGEX_REEMPLAZAR, '');

    this.datosMedioTransporte.patchValue({
      guiaMaster: CLEANED,
    });
  }

  /**
   * Actualiza el campo **guiaHouse** en el formulario `datosMedioTransporte`.
   *
   * @param {Event} evento Evento del input que contiene el nuevo valor.
   * @returns {void}
   */
  cambiarGuiaHouse(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    const CLEANED = VALUE.replace(REGEX_REEMPLAZAR, '');

    this.datosMedioTransporte.patchValue({
      guiaHouse: CLEANED,
    });
  }

  /**
   * Actualiza el campo **guiaBl** en el formulario `datosMedioTransporte`.
   *
   * @param {Event} evento Evento del input que contiene el nuevo valor.
   * @returns {void}
   */
  cambiarGuiaBL(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    const CLEANED = VALUE.replace(REGEX_REEMPLAZAR, '');

    this.datosMedioTransporte.patchValue({
      guiaBl: CLEANED,
    });
  }

  /**
   * Actualiza el campo **numeroBuque** en el formulario `datosMedioTransporte`.
   *
   * @param {Event} evento Evento del input que contiene el nuevo valor.
   * @returns {void}
   */
  cambiarNumeroDeBuque(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    const CLEANED = VALUE.replace(REGEX_REEMPLAZAR, '');

    this.datosMedioTransporte.patchValue({
      numeroBuque: CLEANED,
    });
  }

  /**
   * Actualiza el campo **numeroBl** en el formulario `datosMedioTransporte`.
   *
   * @param {Event} evento Evento del input que contiene el nuevo valor.
   * @returns {void}
   */
  cambiarNumeroBL(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    const CLEANED = VALUE.replace(REGEX_REEMPLAZAR, '');

    this.datosMedioTransporte.patchValue({
      numeroBl: CLEANED,
    });
  }

  /**
   * Actualiza el campo **numeroEquipo** en el formulario `datosMedioTransporte`.
   *
   * @param {Event} evento Evento del input que contiene el nuevo valor.
   * @returns {void}
   */
  cambiarNumeroEquipo(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    const CLEANED = VALUE.replace(REGEX_REEMPLAZAR, '');

    this.datosMedioTransporte.patchValue({
      numeroEquipo: CLEANED,
    });
  }

  /**
   * Actualiza el campo **rfcEmpresaTransportista** en el formulario `datosMedioTransporte`.
   *
   * @param {Event} evento Evento del input que contiene el nuevo valor.
   * @returns {void}
   */
  cambiarRFCEmpresaTransportista(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    const CLEANED = VALUE.replace(REGEX_REEMPLAZAR, '');

    this.datosMedioTransporte.patchValue({
      rfcEmpresaTransportista: CLEANED,
    });
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
   * Limpia el valor del input permitiendo solo números.
   * utilizando la expresión regular `REGEX_NICO` y actualiza los controles del formulario
   * `datosPedimento` correspondientes: `aduana`, `patente`, `pedimento` y `folioImportacionTemporal`.
   */
  limpiarSoloNumeros(event: Event): void {
    const INPUT = event?.target as HTMLInputElement;
    if (INPUT) {
      // Replica exactamente: this.value = (this.value + '').replace(/[^0-9]/g, '');
      INPUT.value = String(INPUT.value).replace(REGEX_NICO, '');
      
      // Actualizar control de formulario
      this.datosPedimento.get('datosPedimento.aduana')?.setValue(INPUT.value, { emitEvent: false });
      this.datosPedimento.get('datosPedimento.patente')?.setValue(INPUT.value, { emitEvent: false });
      this.datosPedimento.get('datosPedimento.pedimento')?.setValue(INPUT.value, { emitEvent: false });
      this.datosPedimento.get('datosPedimento.folioImportacionTemporal')?.setValue(INPUT.value, { emitEvent: false });
    }
  }

  /**
   * Limpia el valor del input permitiendo solo caracteres alfanuméricos.
   * Utiliza la expresión regular `REGEX_CARACTERES_ESPECIALES` y actualiza los controles
   * @param {Event} event - Evento del input.
   */
  limpiarAlfanumerico(event: Event): void {
    const INPUT = event?.target as HTMLInputElement;
    if (INPUT) {
      // Replica exactamente: this.value = (this.value + '').replace(/[^0-9]/g, '');
      INPUT.value = String(INPUT.value).replace(REGEX_CARACTERES_ESPECIALES, '');
      
      // Actualizar control de formulario
      this.datosPedimento.get('datosPedimento.folioFormatoOficial')?.setValue(INPUT.value, { emitEvent: false });
      this.datosPedimento.get('datosPedimento.folioOficialProrroga')?.setValue(INPUT.value, { emitEvent: false });
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
        'folioImportacionTemporal',
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

    // Usando esto para acceder al estado del componente
    if (this.soloLectura && hasError) {
      // Lógica adicional para el modo solo lectura
    }

    return hasError;
  }

   /**
   * Valida los campos de fecha en el formulario y agrega borde de error visual si están vacíos.
   * 
   * Este método revisa los controles de fecha relevantes en el formulario (`fechaImportacionTemporal`, `fechaVencimiento`, `fechaDescruccionDestino`)
   * y, si alguno está vacío, agrega la clase CSS `is-invalid-date` al campo correspondiente para mostrar el error visual.
   */
  handleDateFieldsOnValidation(): void {
    if(this.datosPedimento?.get('cveTipoDocumento')?.value === 'Folio VUCEM'){
      return;
    }
    const FECHA_IMPORTACION_TEMPORAL_CONTROL = this.datosPedimento.get('fechaImportacionTemporal')?.value;
    const FECHA_VENCIMIENTO_CONTROL = this.datosPedimento.get('fechaVencimiento')?.value;
    if (!FECHA_IMPORTACION_TEMPORAL_CONTROL) {
      this.addErrorBorderToDateFields(document.getElementById('fechaImportacionTemporalInput'));
    }
    if (!FECHA_VENCIMIENTO_CONTROL) {
      this.addErrorBorderToDateFields(document.getElementById('fechaVencimientoInput'));
    }
  }


  /**   * Agrega una clase de borde de error a los campos de fecha vacíos.
   * @param element - El elemento HTML del campo de fecha.
   */
  addErrorBorderToDateFields(element: HTMLElement | null): void {
     const INPUT_ELEMENT = element?.querySelector('.input-group-text') as HTMLElement;
    if (INPUT_ELEMENT) {
      INPUT_ELEMENT.classList?.add('is-invalid-date');
    }
    
    // Usando esto para acceder al estado del componente
    if (this.soloLectura) {
      // Lógica adicional para el modo solo lectura
    }
  }

/**
   * Valida los campos relacionados con el medio de transporte según el tipo seleccionado.
   * @returns {boolean} True si hay errores de validación, false en caso contrario.
   */
    private validateMedioDeTransporteFields(): boolean {
    const TIPO_TRANSPORTE = this.medioDeTransporte.find((transporte) => transporte.id === this.datosMedioTransporte.get('cveMedioTrasporte')?.value)?.descripcion || '';

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


  /**   * Elimina la clase de borde de error de los campos de fecha al interactuar con ellos.
   * @param event - El evento que se dispara al interactuar con el campo de fecha.
   */
  resetearBordesInputFecha(): void {
    document.getElementById('fechaImportacionTemporalInput')?.querySelector('.input-group-text')?.classList.remove('is-invalid-date');
    document.getElementById('fechaVencimientoInput')?.querySelector('.input-group-text')?.classList.remove('is-invalid-date');
    
    // Usando esto para acceder al estado del componente
    if (this.soloLectura) {
      // Lógica adicional para el modo solo lectura
    }
  }

    /**
   * @method permitirSoloNumerico
   * @description Maneja el evento de pulsación de tecla para permitir solo caracteres numéricos.
   * @param event - El evento de teclado.
   */

  permitirSoloNumerico(event: KeyboardEvent): void {
    const PATTERN = REGEX_SOLO_NUMEROS;
    const CHAR = String.fromCharCode(event?.charCode || event?.which);

    if (!PATTERN.test(CHAR)) {
      event.preventDefault();
    }
    
    // Usando esto para acceder al estado del componente
    if (this.soloLectura) {
      // Lógica adicional para el modo solo lectura
    }
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * - Completa el `Subject` `destroyed$` para cancelar todas las suscripciones activas y evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

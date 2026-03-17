import {
  ADUANA_TEXTO,
  DATOS_DEL_TRAMITE_MAP,
  DESACTIVADO_PERMISO_GENERAL,
  FETCHA_PAGO,
  FETCHA_SALIDA,
  MANIFIESTOS_DECLARACIONES,
  OCULTAR_BOTONES,
  OCULTAR_PERMISO_GENERAL,
  PAISE_DENTINO_EITIQUETA,
  PERIODO_DOS_SEMESTRE,
  PERIODO_SEMESTRE_HABILITADO,
  PERIODO_UNO_SEMESTRE,
  PERMISO_ADUNA_TITULO,
  PERMISO_DEFINITIVO_TITULO,
  PERMISO_DISABLE,
  PERMISO_JUSTIFICACION,
} from '../../constants/datos-del-tramilte.enum';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Catalogo, ConfiguracionColumna, CrossListLable, CrosslistComponent, InputFecha, InputFechaComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@ng-mf/data-access-user';
import { InputCheckComponent, InputRadioComponent, REGEX_SOLO_DIGITOS } from '@libs/shared/data-access-user/src';
import {
  DatosDelTramiteFormState,
  FECHA_DE_PAGO,
  FECHA_DE_SALIDA,
  JustificacionTramiteFormState,
  MANIFIESTOS_DECLARACION,
  MERCANCIA_ENCABEZADO_DE_TABLA,
  MercanciaDetalle,
} from '../../models/datos-del-tramite.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
/**
 * @title Datos del Trámite
 * @description Componente que gestiona el formulario de datos del trámite como permisos, uso final y selección de aduanas.
 * @summary Componente utilizado para capturar y emitir los datos del trámite.
 */
@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CrosslistComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    InputRadioComponent,
    InputCheckComponent,
    InputFechaComponent,
    TooltipModule
  ],
  templateUrl: './datos-del-tramite.component.html',
  styleUrl: './datos-del-tramite.component.scss',
})
export class DatosDelTramiteComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * @property {number} idProcedimiento
   * Identificador único del procedimiento asociado a la solicitud.
   * Este valor es recibido como un input desde el componente padre.
   *
   * @decorador @Input
   */
  @Input() public idProcedimiento!: number;

  /**
   * Indica si se deben usar botones personalizados en el componente.
   * Cuando es `true`, se aplicarán plantillas o lógica de botones personalizados en lugar de los botones predeterminados.
   */
  @Input() public usarBotonesPersonalizados!: boolean;

  /**
   * Indica si se deben mostrar las etiquetas de tipo de aduanas disponibles.
   * Cuando es `true`, se mostrarán etiquetas específicas para los tipos de aduanas disponibles.
   */
  @Input() public aduanasDisponiblesLabelTipo!: boolean;

  /**
   * Indica si el elemento está ocultarBotones o visible.
   *
   * @type {boolean}
   * - `true`: El elemento está ocultarBotones.
   * - `false`: El elemento está visible.
   */
  public ocultarBotones = false;

  /**
   * Indica si el elemento está oculto o visible.
   *
   * @type {boolean}
   * - `true`: El elemento está oculto.
   * - `false`: El elemento está visible.
   */
  public estaOculto = false;

  /**
   * Etiqueta que representa el país asociado al trámite.
   * Esta propiedad utiliza la constante `PAISE_DENTINO_EITIQUETA`
   * para asignar el valor correspondiente.
   */
  public paisEtiqueta = PAISE_DENTINO_EITIQUETA;
  /**
   * Indica si el periodo habilitado está activo o no.
   * Esta propiedad se utiliza para determinar si el periodo de semestre está habilitado.
   * @type {boolean}
   */
  public periodoHabilitado = false;

  /**
   * Indica si el trámite está relacionado con aduanas.
   *
   * @type {boolean}
   * @default false
   */
  public esAduna = false;

  /**
   * @property {boolean} esAdunaTexto
   * @description Indica si el trámite está relacionado con el texto de aduanas específicas.
   * - `true`: El trámite está relacionado con el texto de aduanas.
   * - `false`: El trámite no está relacionado con el texto de aduanas.
   * @default false
   */
  public esAdunaTexto = false;
  /**
   * Indica si el trámite está relacionado con manifiestos y declaraciones.
   *
   * @type {boolean}
   * @default false
   */
  public manifiestosDeclaraciones = false;
  /**
   * Indica si la fecha de pago está habilitada.
   *
   * @type {boolean}
   * @default false
   */
  public fetchaPago = false;
  /**
   * Indica si la fecha de salida está habilitada.
   *
   * @type {boolean}
   * @default false
   */
  public fetchaSalida = false;

  /**
   * Opciones para el campo de periodo de un semestre.
   *
   * @type {string[]}
   * @default ['Uno Semestre', 'Dos Semestre']
   */
  public periodoUnoSemestreOpciones = PERIODO_UNO_SEMESTRE;

  /**
   * Opciones para el campo de periodo de dos semestre.
   *
   * @type {string[]}
   * @default ['Uno Semestre', 'Dos Semestre']
   */
  public periodoUnoSemestreRadioOpciones = PERIODO_DOS_SEMESTRE;

  /**
   * Indica si el componente está en modo de justificación.
   *
   * @type {boolean}
   * @default false
   */
  public esJustificacion = false;

  /**
   * Indica si el permiso general está oculto.
   *
   * @type {boolean}
   * @default false
   */

  public ocultarPermisoGeneral = false;

  /**
 * Indica si el permiso general está oculto.
 *
 * @type {string }
 * @default string
 */

  public cve_paisDestino = '';

  /**
   * Indica si el permiso general está desactivado.
   *
   * @type {boolean}
   * - `true`: El permiso general está desactivado.
   * - `false`: El permiso general está activo.
   */
  public esDessactivadoPermisoGeneral = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * Subject para cancelar suscripciones activas y evitar fugas de memoria.
   * Se completa en el hook `ngOnDestroy`.
   * @private
   */
  private destroyNotifier$ = new Subject<void>();
  /**
   * Lista de aduanas disponibles para mostrar en el componente Crosslist.
   * @property {string[]} seleccionarAduanasDisponibles
   */
  public seleccionarAduanasDisponibles: string[] = [];
  public aduanasDisponibles: Catalogo[] = [];

  /**
   * Aduanas seleccionadas por el usuario desde el componente Crosslist.
   * @property {string[]} seleccionarAduanasDisponiblesDatos
   */
  public seleccionarAduanasDisponiblesDatos: string[] = [];

  /**
    * Holds only the 'clave' values.
    * @property {string[]} aduanasClaveSeleccionadas
    */
  public aduanasClaveSeleccionadas: string[] = [];

  /**
   * Etiquetas que se utilizan en el componente Crosslist para mostrar los títulos de los listados.
   * @property {CrossListLable} aduanasDisponiblesLabel
   */


  public aduanasDisponiblesLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Aduanas disponibles',
    derecha: 'Aduanas seleccionadas',
    showUnoTitulo: true,
    showDosTitulo: true,
  };

  /**
  * Etiquetas que se utilizan en el componente Crosslist para mostrar los títulos de los listados.
  * @property {CrossListLable} aduanasDisponiblesLabelRequired
  */
  public aduanasDisponiblesLabelRequired: CrossListLable = {
    tituluDeLaIzquierda: 'Aduanas disponibles:',
    derecha: 'Aduanas seleccionadas*:',
    showUnoTitulo: false,
    showDosTitulo: false,
  };

  /**
   * Grupo de formularios principal para capturar los datos del trámite.
   * @property {FormGroup} form
   */
  form!: FormGroup;
  /**
   * Formulario reactivo utilizado para justificar una acción o actividad.
   *  @property {FormGroup} formDeJustificacion
   */
  formDeJustificacion!: FormGroup;
  /**
   * Texto de los manifiestos.
   */
  manifiestosTexto: string = '';
  /**
   * @property {InputFecha} fechaInicioInput
   * Objeto con la configuración de la fecha inicial del componente.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;
  /**
   * @property {InputFecha} fechaInicioInput
   * Objeto con la configuración de la fecha inicial del componente.
   */
  fechaSalidaInput: InputFecha = FECHA_DE_SALIDA;
  /**
   * @method onReset
   * @description Limpia todos los campos del formulario de pago de derechos.
   */
  onReset(): void {
    this.form.reset();
    this.formDeJustificacion.reset();
  }

  /**
   * @method onFechaCambiada
   * @description Actualiza la Fecha única de pago en el formulario.
   *
   * @param {string} fecha - Fecha seleccionada en el componente `InputFecha`.
   */
  onFechaCambiada(fecha: string): void {
    this.form.patchValue({ fechaPago: fecha });
  }
  /**
   * @method onFechaSalidaCambiada
   * @description Actualiza la Fecha única de salida de la marcancia en el formulario.
   *
   * @param {string} fecha - Fecha seleccionada en el componente `InputFecha`.
   */
  onFechaSalidaCambiada(fecha: string): void {
    this.form.patchValue({ fechaSalida: fecha });
  }
  /**
   * Estado inicial del formulario del trámite, recibido desde el componente padre.
   * @property {DatosDelTramiteFormState} datosDelTramiteFormState
   */
  @Input() datosDelTramiteFormState!: DatosDelTramiteFormState;

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados.
   * @property {boolean} esFormularioSoloLectura
   * @default false
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Estado del formulario de justificación del trámite recibido desde el componente padre.
   * @property {JustificacionTramiteFormState} justificacionTramiteFormState
   */
  @Input() justificacionTramiteFormState!: JustificacionTramiteFormState;

  /**
   * Lista de datos de mercancías que se utilizan en la tabla dinámica.
   * @property {MercanciaDetalle[]} datosMercanciaTabla
   */
  @Input() datosMercanciaTabla: MercanciaDetalle[] = [];

  /**
   * @property
   * @name configuracionTabla
   * @type {ConfiguracionColumna<MercanciaDetalle>[]}
   * @description Configuración de las columnas utilizadas en la tabla dinámica de mercancías.
   * Este valor es recibido como un input desde el componente padre.
   * Permite personalizar las columnas que se mostrarán en la tabla.
   */
  @Input() configuracionTabla: ConfiguracionColumna<MercanciaDetalle>[] = [];
  /**
   * Lista de mercancias seleccionados en la tabla.
   * Contiene objetos del tipo `MercanciaDetalle`.
   *
   * @type {MercanciaDetalle[]}
   */
  mercanciaTablaSeleccionada: MercanciaDetalle[] = [];
  /**
   * Emite un evento cuando se modifican los datos del mercancia.
   * El evento contiene un objeto de tipo `MercanciaDetalle`.
   *
   * @type {EventEmitter<MercanciaDetalle>}
   */
  @Output() modificarMercanciasDatos: EventEmitter<MercanciaDetalle> =
    new EventEmitter<MercanciaDetalle>(true);
  /**
   * @output eliminarMercanciaFinalEvent - Evento que emite cuando se elimina un destinatario final.
   * Este EventEmitter emite una instancia de `MercanciaDetalle`.
   */
  @Output() eliminarMercanciaFinalEvent = new EventEmitter<MercanciaDetalle>();

  /**
   * Configuración utilizada para construir la tabla dinámica de mercancías.
   * @property {any} mercanciaTablaConfiguracion
   */
  public mercanciaTablaConfiguracion: {
    tipoSeleccionTabla: TablaSeleccion;
    configuracionTabla: ConfiguracionColumna<MercanciaDetalle>[];
    datos: MercanciaDetalle[];
  } = {
      tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
      configuracionTabla: MERCANCIA_ENCABEZADO_DE_TABLA,
      datos: [],
    };

  /**
   * Evento que emite los datos actualizados del formulario hacia el componente padre.
   * @event updateDatosDelTramiteFormulario
   */
  @Output() updateDatosDelTramiteFormulario =
    new EventEmitter<DatosDelTramiteFormState>();

  /**
   * Evento que emite cuando se desea abrir un modal.
   * @event openModal
   * */
  @Output() openModal = new EventEmitter<string>();

  /**
   * Referencia al componente Crosslist utilizado para gestionar aduanas.
   * @viewChild crossList
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Evento emitido cuando se actualiza el formulario de justificación del trámite.
   * @event updateJustificacionFormulario
   */
  @Output() updateJustificacionFormulario =
    new EventEmitter<JustificacionTramiteFormState>();

  /**
   * @property { btnNombre: string; class: string; funcion?: () => void } aduanasBotones
   * Lista de botones relacionados con aduanas que se recibe desde el componente padre.
   * Este input permite configurar dinámicamente los botones asociados a las aduanas.
   * @decorador @Input
   */
  @Input() aduanasBotones!: {
    btnNombre: string;
    class: string;
    funcion?: () => void;
  }[];

  /**
   * Un arreglo de objetos de configuración de botones para gestionar acciones de entrada de aduanas.
   *
   * Cada objeto en el arreglo representa un botón con las siguientes propiedades:
   * - `btnNombre`: El nombre que se muestra en el botón.
   * - `class`: La clase CSS que se aplica para el estilo del botón.
   * - `funcion`: La función de callback que se ejecuta al hacer clic en el botón.
   *
   * Las acciones disponibles son:
   * - "Agregar todos": Agrega todos los elementos invocando `agregar('t')` en el primer elemento de `crossList`.
   * - "Agregar selección": Agrega los elementos seleccionados invocando `agregar('')` en el primer elemento de `crossList`.
   * - "Restar selección": Quita los elementos seleccionados invocando `quitar('')` en el primer elemento de `crossList`.
   * - "Restar todos": Quita todos los elementos invocando `quitar('t')` en el primer elemento de `crossList`.
   */
  aduanasEntradaBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-danger',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Constructor del componente `DatosDelTramiteComponent`.
   * Inicializa los servicios necesarios para la creación de formularios reactivos, navegación relativa,
   * y consulta de estado de la aplicación.
   *
   * @param {FormBuilder} fb - Servicio para crear formularios reactivos.
   * @param {ActivatedRoute} activatedRoute - Ruta activa utilizada para navegación relativa.
   * @param {Router} router - Servicio de enrutamiento para manejar la navegación entre vistas.
   * @param {ConsultaioQuery} consultaioQuery - Servicio para consultar el estado de la aplicación.
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService
  ) { }

  /**
   * Hook que se ejecuta cuando cambian las propiedades de entrada del componente.
   * Permite habilitar o deshabilitar los formularios según el modo de solo lectura.
   * @param {SimpleChanges} changes - Cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['esFormularioSoloLectura'] && this.form) {
      if (this.esFormularioSoloLectura) {
        this.form.disable();
        this.formDeJustificacion.disable();
      } else {
        this.form.enable();
        this.formDeJustificacion.enable();
        this.form.get('paisDestino')?.disable();
      }
    }
  }
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormaulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.crearFormaulario();
    if (this.esFormularioSoloLectura) {
      this.form.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.form.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }
  /**
   * Crea el formulario reactivo `agregarDestinatarioFinal` utilizando `FormBuilder`.
   * Define los campos y sus validaciones.
   *
   */
  crearFormaulario(): void {
    this.form = this.fb.group({
      permisoGeneral: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
        ],
      ],
      paisDestino: ['',
        { disabled: true },
      ],
      usoFinal: ['', [Validators.required, Validators.maxLength(1000)]],
      fechaPago: [
        this.datosDelTramiteFormState?.fechaPago || '',
        Validators.required,
      ],
      fechaSalida: [
        this.datosDelTramiteFormState?.fechaSalida || '',
        Validators.required,
      ],
      unoSemestre: [
        { value: this.datosDelTramiteFormState?.unoSemestre ?? null, disabled: PERMISO_DISABLE.includes(this.idProcedimiento) },
        Validators.required,
      ],
      anoEnCurso: [{ value: this.datosDelTramiteFormState?.anoEnCurso ?? false, disabled: PERMISO_DISABLE.includes(this.idProcedimiento) }],
      informacionConfidencial: [
        this.datosDelTramiteFormState?.informacionConfidencial ?? false,
      ],
    });
  }

  /**
   * @method crearFormularioJustificacion
   * @description Crea el formulario reactivo para capturar la justificación del trámite.
   * Inicializa el campo `justificacion` con el valor recibido desde el estado del formulario,
   * o un valor vacío si no existe, y aplica la validación requerida.
   * @returns {void}
   */
  crearFormularioJustificacion(): void {
    this.formDeJustificacion = this.fb.group({
      justificacion: [
        this.justificacionTramiteFormState?.justificacion ?? '',
        Validators.required,
      ],
    });
  }

    /**
   * @method aduanasDisponiblesSeleccionadasChange
   * @description Procesa la selección del Crosslist para obtener las
claves técnicas de las aduanas.
   */
  public aduanasDisponiblesSeleccionadasChange(events: string[]): void {
    this.seleccionarAduanasDisponiblesDatos = events;
    this.aduanasClaveSeleccionadas = this.aduanasDisponibles
      .filter(item => events.includes(item.descripcion))
      .map(item => item.clave)
      .filter((clave): clave is string => clave !== undefined);
  }


  /**
   * Navega hacia el path de acciones relativo especificado.
   * @method irAAcciones
   * @param {string} accionesPath - Ruta relativa hacia la sección de acciones.
   * @returns {void}
   */
  irAAcciones(): void {
    this.openModal.emit('Datosmercancia');
  }

  /**
   * @method onPermisoGeneralInput
   * @description
   * Maneja el evento de entrada del campo "permisoGeneral" para asegurar que solo se permitan caracteres numéricos
   * y que la longitud máxima sea de 22 dígitos. Si el usuario ingresa un carácter no numérico, este será eliminado.
   * Además, si la longitud supera los 22 caracteres, el valor se recorta automáticamente.
   * El valor limpio se actualiza en el control reactivo sin emitir un nuevo evento de cambio.
   *
   * @param {Event} event - El evento de entrada generado por el campo de texto.
   *
   * @returns {void} No retorna ningún valor.
   */
  onPermisoGeneralInput(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    INPUT.value = INPUT.value.replace(REGEX_SOLO_DIGITOS, '').slice(0, 22);
    this.form
      .get('permisoGeneral')
      ?.setValue(INPUT.value, { emitEvent: false });
  }

  /**
   * @method
   * @description
   * Modifica el destinatario seleccionado en la tabla de mercancías.
   * Si hay una sola fila seleccionada, emite el evento para modificar los datos de la mercancía,
   * actualiza la configuración de edición en el store y navega a la pantalla de agregar datos de mercancía.
   * Si no hay filas seleccionadas o hay más de una, muestra un error en la consola.
   *
   * @returns {void}
   *
   * @memberof DatosDelTramiteComponent
   */
  modificarDestinatario(): void {
    if (this.mercanciaTablaSeleccionada.length > 0) {
      this.modificarMercanciasDatos.emit(this.mercanciaTablaSeleccionada[0]);
      this.openModal.emit('Datosmercancia');
    } else {
      console.error('No row selected for modification.');
    }
  }

  /**
   * Elimina el destinatario final seleccionado y emite un evento con el destinatario eliminado.
   *
   * @command Eliminar destinatario final seleccionado.
   */
  eliminarDestinatarioFinal(): void {
    if (this.mercanciaTablaSeleccionada.length > 0) {
      this.eliminarMercanciaFinalEvent.emit(this.mercanciaTablaSeleccionada[0] as MercanciaDetalle);
    } else {
      console.error('No se ha seleccionado ninguna fila para eliminar.');
    }
  }
  /**
   * Inicializa el formulario con los valores actuales del estado del trámite
   * y escucha los cambios para emitir actualizaciones.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.getAduanasList();
    this.getPaises();
    if (this.configuracionTabla.length > 0) {
      this.mercanciaTablaConfiguracion.configuracionTabla =
        this.configuracionTabla;
    } else {
      this.mercanciaTablaConfiguracion.configuracionTabla =
        MERCANCIA_ENCABEZADO_DE_TABLA;
    }
    this.esJustificacion = PERMISO_JUSTIFICACION.includes(this.idProcedimiento);
    this.ocultarBotones = OCULTAR_BOTONES.includes(this.idProcedimiento);
    this.ocultarPermisoGeneral = OCULTAR_PERMISO_GENERAL.includes(
      this.idProcedimiento
    );
    this.esDessactivadoPermisoGeneral = DESACTIVADO_PERMISO_GENERAL.includes(
      this.idProcedimiento
    );
    this.crearFormaulario();
    this.manifiestosTexto = MANIFIESTOS_DECLARACION.MANIFIESTOS;
    this.form.patchValue({
      permisoGeneral: this.datosDelTramiteFormState?.permisoGeneral,
      usoFinal: this.datosDelTramiteFormState?.usoFinal,
      unoSemestre: this.datosDelTramiteFormState.unoSemestre,
      anoEnCurso: this.datosDelTramiteFormState.anoEnCurso,
      fechaSalida: this.datosDelTramiteFormState.fechaPago
    });
    if (this.esFormularioSoloLectura) {
      this.form.disable();
    }
    if (this.esJustificacion) {
      this.crearFormularioJustificacion();
    }

    if (this.idProcedimiento) {
      this.actualizarFormControlsById();
    }

    if (this.esJustificacion) {
      this.formDeJustificacion.patchValue({
        justificacion: this.justificacionTramiteFormState?.justificacion,
      });
      if (this.esFormularioSoloLectura) {
        this.formDeJustificacion.disable();
      }
    }

    if (this.esDessactivadoPermisoGeneral) {
      this.form.get('permisoGeneral')?.setValue('5432');
      this.form.get('permisoGeneral')?.disable();
    }
    
  this.form.valueChanges
  .pipe(takeUntil(this.destroyNotifier$))
  .subscribe(() => {
    const rawValue = this.form.getRawValue();

    const DATOS_DEL_TRAMITE: DatosDelTramiteFormState = {
      permisoGeneral: rawValue.permisoGeneral,
      paisDestino: this.cve_paisDestino,
      usoFinal: rawValue.usoFinal,
      aduanasSeleccionadas: this.aduanasClaveSeleccionadas,
      anoEnCurso: rawValue.anoEnCurso,
      fechaPago: rawValue.fechaPago,
      fechaSalida: rawValue.fechaSalida,
      informacionConfidencial: rawValue.informacionConfidencial,
      unoSemestre: rawValue.unoSemestre === 'dosSemestre' ? '2' : '1',
    };

    this.updateDatosDelTramiteFormulario.emit(DATOS_DEL_TRAMITE);
  });
    if (this.esJustificacion) {
      this.formDeJustificacion.valueChanges
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((formValue) => {
          const DATOS_JUSTIFICACION: JustificacionTramiteFormState = {
            justificacion: formValue.justificacion,
          };
          this.updateJustificacionFormulario.emit(DATOS_JUSTIFICACION);
        });
    }
    this.estaOculto = PERMISO_DEFINITIVO_TITULO.includes(this.idProcedimiento);
    this.esAduna = PERMISO_ADUNA_TITULO.includes(this.idProcedimiento);
    this.esAdunaTexto = ADUANA_TEXTO.includes(this.idProcedimiento);
    this.periodoHabilitado = PERIODO_SEMESTRE_HABILITADO.includes(
      this.idProcedimiento
    );
    this.manifiestosDeclaraciones = MANIFIESTOS_DECLARACIONES.includes(
      this.idProcedimiento
    );
    this.fetchaPago = FETCHA_PAGO.includes(this.idProcedimiento);
    this.fetchaSalida = FETCHA_SALIDA.includes(this.idProcedimiento);
    if (!this.fetchaSalida) {
      this.form.get('fechaSalida')?.clearValidators()
      this.form.get('fechaSalida')?.updateValueAndValidity()
    }
    if (!this.fetchaPago) {
      this.form.get('fechaPago')?.clearValidators()
      this.form.get('fechaPago')?.updateValueAndValidity()
    }
  }
  /**
   * @method actualizarFormControlsById
   * @description Actualiza los controles del formulario basándose en el identificador del procedimiento.
   * Agrega controles adicionales al formulario si no existen y están asociados al identificador actual.
   * @returns {void}
   */
  actualizarFormControlsById(): void {
    Object.entries(DATOS_DEL_TRAMITE_MAP).forEach(
      ([control, idsDeProcedimiento]) => {
        if (idsDeProcedimiento.includes(this.idProcedimiento)) {
          if (!this.form.contains(control)) {
            const KEY = control as keyof DatosDelTramiteFormState;
            this.form.addControl(
              control,
              new FormControl(this.datosDelTramiteFormState[KEY])
            );
          }
        }
      }
    );
  }

  /**
   * @method actualizarUnoSemestre
   * @description Actualiza el valor del campo `unoSemestre` en el formulario reactivo.
   * @param {string | number} event - Valor seleccionado para el campo `unoSemestre`.
   * @returns {void}
   */
  actualizarUnoSemestre(event: string | number): void {
    this.form.patchValue({
      unoSemestre: event,
    });
  }

  /**
   * @method actualizarDosSemestre
   * @description Actualiza el valor del campo `dosSemestre` en el formulario reactivo.
   * @param {string | number} event - Valor seleccionado para el campo `dosSemestre`.
   * @returns {void}
   */
  actualizarDosSemestre(event: string | number): void {
    this.form.patchValue({
      dosSemestre: event,
    });
  }

  /**
   * @method getAduanasList
   * @description Obtiene la lista de aduanas disponibles.
   */
  getAduanasList(): void {
    this.datosSolicitudService
      .getAduanas(this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.aduanasDisponibles = respuesta.datos;
        this.seleccionarAduanasDisponibles = respuesta.datos.map((item: Catalogo) => {
          const parts = item.descripcion.split('-');
          return parts[1]?.trim() || item.descripcion;
        });
      });
  }

  /**
   * @method getPaises
   * @description Llama al servicio de países y establece "MEX" por defecto si existe.
   */
  public getPaises(): void {
    this.datosSolicitudService
      .getPaises(this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        const paisMEX = respuesta.datos.find((item: Catalogo) => item.clave === 'MEX');
        if (paisMEX) {
          this.cve_paisDestino = paisMEX.clave;
          const cleanDescripcion = paisMEX.descripcion;
          this.form.get('paisDestino')?.setValue(cleanDescripcion);
        }
      });
  }

   /**
   * @method ngOnDestroy
   * @description Hook de destrucción del componente. Libera las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
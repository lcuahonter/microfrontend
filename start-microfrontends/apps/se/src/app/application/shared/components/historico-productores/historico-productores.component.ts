import { AgregarDatosProductorFormulario, Catalogo, FormularioHistorico, HistoricoColumnas } from '../../models/certificado-origen.model';
import { CONFIGURACION_MERCANCIA, CONFIGURACION_PRODUCTOR_EXPORTADOR } from '../../constantes/certificado-tabla.enum';
import { CatalogoServices,ConfiguracionColumna, InputCheckComponent,CatalogoSelectComponent, Notificacion,NotificacionesComponent, REGEX_ALFANUMERICO_SIN_ESPACIOS, RFC_REGEX, REGEX_SOLO_DIGITOS, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Mercancia } from '../../models/modificacion.enum';
import { Modal } from 'bootstrap';
import { Subject } from 'rxjs';

/**
 * @description
 * Componente para gestionar el histórico de productores en el sistema VUCEM.
 * 
 * Este componente proporciona una interfaz completa para:
 * - Visualizar y gestionar productores relacionados con el trámite
 * - Agregar y eliminar productores
 * - Gestionar datos confidenciales
 * - Manejar la relación entre productores y exportadores
 * - Gestionar mercancías asociadas
 * 
 * @usageNotes
 * ### Ejemplo de uso básico
 * ```typescript
 * <app-historico-productores
 *   [productoresExportador]="listaProductores"
 *   [tramiteState]="estadoTramite"
 *   [esFormularioSoloLectura]="false"
 *   (formHistoricoEvent)="onFormularioActualizado($event)">
 * </app-historico-productores>
 * ```
 * 
 * @publicApi
 * @moduleName Productores
 * @version 1.0.0
 */
@Component({
  selector: 'app-historico-productores',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    InputCheckComponent,
    CatalogoSelectComponent,
    NotificacionesComponent,
  ],
  templateUrl: './historico-productores.component.html',
  styleUrl: './historico-productores.component.scss',
})
export class HistoricoProductoresComponent implements OnInit, OnDestroy {
  /**
   * Emisor de eventos mercancia datos.
   * @type {EventEmitter<Mercancia[]>}
   */
  @Output() emitMercanciaDatos: EventEmitter<Mercancia[]> = new EventEmitter<Mercancia[]>();

  /**
   * Indica si se deben mostrar las mercancías seleccionadas en la vista.
   *
   * @input
   * @type {boolean}
   * @default true
   */
  @Input() mostrarMercanciasSeleccionadas: boolean = true;

  /**
   * Define si la tabla de mercancías debe mostrarse ordenada.
   *
   * @input
   * @type {boolean}
   * @default false
   */
  @Input() sortMercanciasTablaOrder: boolean = false;

  /**
   * @description
   * Formulario principal para gestionar los datos de los productores.
   * Este formulario reactivo contiene los campos necesarios para el registro
   * y manipulación de la información de los productores.
   *
   * @type {FormGroup}
   * @property {FormControl} datosConfidencialesProductor - Control para gestionar datos confidenciales
   * @property {FormControl} productorMismoExportador - Control para indicar si el productor es el mismo que el exportador
   *
   * @example
   * ```typescript
   * this.formulario = this.fb.group({
   *   datosConfidencialesProductor: [],
   *   productorMismoExportador: []
   * });
   * ```
   */
  formulario!: FormGroup;
  /**
   * @description
   * Formulario reactivo para gestionar los datos de mercancías.
   *
   * Este formulario contiene todos los campos necesarios para la captura
   * y validación de información relacionada con las mercancías del productor.
   *
   * @type {FormGroup}
   * @property {FormControl} fraccionArancelaria - Fracción arancelaria de la mercancía (deshabilitado)
   * @property {FormControl} nombreComercial - Nombre comercial del producto (deshabilitado)
   * @property {FormControl} nombreTecnico - Nombre técnico del producto (deshabilitado)
   * @property {FormControl} numeroDeRegistroFiscal - Número de registro fiscal
   * @property {FormControl} valorMercancia - Valor de la mercancía (deshabilitado)
   * @property {FormControl} complemento - Información complementaria (deshabilitado)
   * @property {FormControl} numeroFactura - Número de factura (deshabilitado)
   * @property {FormControl} tipoFactura - Tipo de factura (requerido, valor mínimo: 0)
   *
   * @example
   * ```typescript
   * this.formularioMercancia = this.fb.group({
   *   fraccionArancelaria: [{ value: [], disabled: true }],
   *   nombreComercial: [{ value: [[]], disabled: true }],
   *   // ... otros campos
   * });
   * ```
   */
  formularioMercancia!: FormGroup;
  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * @type {boolean}
   */
  @Input() esFormularioSoloLectura!: boolean;
  nuevaNotificacionStatus: boolean = false;

  /**
   * Propiedad de entrada que contiene una lista de opciones de catálogo para el "Tipo Factura".
   * Esta propiedad se espera que sea llenada con un arreglo de objetos `Catalogo`.
   *
   * @comando Utilizada para proporcionar las opciones disponibles de tipo de factura al componente.
   */
  @Input() optionsTipoFactura!: Catalogo[];
  /**
   * @input tramiteState - Representa el estado del formulario histórico.
   * Este objeto contiene los datos relacionados con el historial de productores.
   *
   * @command Este decorador permite que el componente reciba datos desde su componente padre.
   */
  @Input() tramiteState: FormularioHistorico = {};
  /**
   * @input mercanciaDatos
   *
   * Arreglo de objetos de tipo `MercanciaTabla` que contiene los datos de mercancías
   * para ser utilizados en el componente. Este input permite pasar información desde
   * un componente padre.
   *
   * @type {Mercancia[]}
   * @default []
   */
  @Input() mercanciaDatos: Mercancia[] = [];

  /**
   * @property {Mercancia[]} mercanciaDatosSeleccionada
   *
   * @description
   * Arreglo que almacena los datos seleccionados de mercancías.
   *
   * @command
   * Utilizar este arreglo para gestionar la selección de mercancías en la tabla.
   */
  mercanciaDatosSeleccionada: Mercancia[] = [];
  /**
   * @method agregarDatosProductor
   * @description Este decorador de entrada (@Input) se utiliza para recibir un objeto
   * de tipo `AgregarDatosProductorFormulario` que contiene los datos necesarios
   * para agregar información del productor en el formulario.
   *
   * @command Este objeto debe ser proporcionado por el componente padre que utiliza
   * este componente hijo.
   */

  @Input() agregarDatosProductor: AgregarDatosProductorFormulario = {};
  /**
   * @property {string} mensajeDeAlerta - Mensaje de alerta que indica
   * la necesidad de agregar al menos un productor por exportador.
   *
   * @command Este mensaje se utiliza para notificar al usuario
   * sobre la validación requerida en la asignación de productores.
   */
  mensajeDeAlerta: string =
    'Es necesario agregar al menos un productor por exportador';
  /**
   * Propiedad de entrada que recibe los datos de la tabla de mercancia.
   * @type {Mercancia[]}
   */
  /**
   * @input productoresExportador
   *
   * Lista de productores asociados a un exportador, representada como un arreglo de objetos
   * del tipo `HistoricoColumnas`. Este dato es proporcionado como entrada al componente.
   *
   * @type {HistoricoColumnas[]}
   */
  @Input() productoresExportador!: HistoricoColumnas[];

  /**
   * Emisor de eventos para indicar si el formulario es válido.
   * @type {EventEmitter<boolean>}
   */
  @Output() formaValida: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  /**
   * Propiedad de salida que emite el valor del formulario cuando se actualiza.
   * @type {EventEmitter<undefined>}
   */
  @Output() formHistoricoEvent: EventEmitter<{
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }> = new EventEmitter<{
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }>();

  /**
   * Propiedad de entrada que indica si se debe ocultar el campo de fax.
   *
   * @type {boolean}
   * @default false
   */
  @Input() ocultarFax!: boolean;

  /**
   * @input esTipoDeSeleccionado Indica si el tipo seleccionado es válido o no.
   * @type {boolean}
   */
  @Input() esTipoDeSeleccionado!: boolean;

  /**
   * Propiedad de salida que emite el valor del formulario cuando se actualiza.
   * @type {EventEmitter<undefined>}
   */
  @Output() agregarDatosProductorFormularioEvent: EventEmitter<{
    formGroupName: string;
    campo: string;
    valor: string | number | boolean | null;
    storeStateName: string;
  }> = new EventEmitter<{
    formGroupName: string;
    campo: string;
    valor: string | number | boolean | null;
    storeStateName: string;
  }>();

  /**
   * Configuración de la tabla de selección.
   *
   * Esta propiedad se utiliza para gestionar la configuración y el comportamiento
   * de la tabla de selección en el componente.
   *
   * @type {TablaSeleccion}
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de las columnas de la tabla dinámica.
   */
  @Input() tableColumns: ConfiguracionColumna<HistoricoColumnas>[] =
    CONFIGURACION_PRODUCTOR_EXPORTADOR;

  /**
   * Lista de productores seleccionados para agregar.
   */
  seleccionadoProductoresExportador: HistoricoColumnas[] = [];

  /**
   * Lista de productores ya agregados.
   */
  @Input() agregarProductoresExportador: HistoricoColumnas[] = [];

  /**
   * Lista de productores seleccionados para eliminar.
   */
  seleccionadoAgregarProductoresExportador: HistoricoColumnas[] = [];

  /**
   * @property {ConfiguracionColumna<Mercancia>[]} mercanciaTablaConfiguracion
   *
   * Configuración de las columnas para la tabla de mercancías.
   *
   * @remarks
   * Este arreglo utiliza la configuración definida en `CONFIGURACION_MERCANCIA`
   * para establecer las propiedades de las columnas que se mostrarán en la tabla.
   *
   * @comando
   * Utilice esta propiedad para personalizar o acceder a la configuración de las columnas.
   */
  mercanciaTablaConfiguracion!: ConfiguracionColumna<Mercancia>[];
  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();
  /**
   * Referencia al modal para agregar datos del productor.
   */
  @ViewChild('modalAgregarDatosProductorPorExportador')
  modalElement!: ElementRef;

  /**
   * Referencia al elemento del DOM asociado al modal de búsqueda.
   */
  @ViewChild('modalBuscar') modalElements!: ElementRef;

  /**
   * Referencia al elemento del DOM asociado al modalMercancia.
   */
  @ViewChild('modalMercancia') modalElementsMercancia!: ElementRef;
  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModalMercancia') closeModalMercancia!: ElementRef;

  /**
   * @public
   * @property {Notificacion} nuevaNotificacion
   * @description Representa una nueva notificación que se utilizará en el componente.
   * @command Este campo debe ser inicializado antes de su uso.
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Formulario para agregar datos del productor.
   */
  agregarDatosProductorFormulario!: FormGroup;

  /**
   * Evento de salida que emite un valor booleano para indicar la acción de búsqueda de mercancía.
   *
   * @remarks
   * Utilice este evento para notificar al componente padre cuando se debe realizar una búsqueda de mercancía.
   *
   * @eventProperty
   */
  @Output() setbuscarMercanciaEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @Input
   * Identificador único del procedimiento asociado.
   * Este valor es requerido y se utiliza para determinar el procedimiento actual.
   *
   * @type {number}
   */
  @Input() idProcedimiento!: number;

  /** Evento que emite los datos del productor exportador cuando se agrega uno nuevo al sistema. */
  @Output() emitAgregarExportador: EventEmitter<HistoricoColumnas> =
    new EventEmitter<HistoricoColumnas>();

  /** Evento que emite los datos del productor exportador cuando se agrega uno nuevo al sistema. */
  @Output() eliminarEventoExportador: EventEmitter<HistoricoColumnas[]> =
    new EventEmitter<HistoricoColumnas[]>();

    /** Evento que emite los datos del productor exportador. */
  @Output() emitProductoresExportador: EventEmitter<HistoricoColumnas[]> =
    new EventEmitter<HistoricoColumnas[]>();

  /**
   * @description
   * Constructor del componente HistoricoProductores.
   *
   * Inicializa las dependencias necesarias para el funcionamiento del componente:
   * - FormBuilder para la creación de formularios reactivos
   * - ValidacionesFormularioService para la validación de campos
   *
   * @param {FormBuilder} fb - Servicio de Angular para construir formularios reactivos
   * @param {ValidacionesFormularioService} validacionesService - Servicio personalizado para validaciones
   *
   * @example
   * ```typescript
   * constructor(
   *   public fb: FormBuilder,
   *   private validacionesService: ValidacionesFormularioService
   * ) { }
   * ```
   *
   * @see FormBuilder
   * @see ValidacionesFormularioService
   */
  constructor(
    public fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private catalogoServices: CatalogoServices
  ) {}

  /**
   * @description
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * Realiza las siguientes tareas de inicialización:
   * 1. Inicializa el formulario principal
   * 2. Configura el estado inicial del formulario
   * 3. Inicializa el formulario de mercancías
   * 4. Configura el formulario de datos del productor
   * 5. Carga los datos del estado del trámite si existen
   *
   * @lifecycle
   * @implements {OnInit}
   *
   * @example
   * ```typescript
   * ngOnInit(): void {
   *   this.initFormulario();
   *   this.inicializarEstadoFormulario();
   *   // ... otras inicializaciones
   * }
   * ```
   */
  ngOnInit(): void {
    this.mercanciaTablaConfiguracion = CONFIGURACION_MERCANCIA(
      this.sortMercanciasTablaOrder
    );
    this.initFormulario();
    this.inicializarEstadoFormulario();
    this.inicializarFormularioMercancia();
    this.initAgregarDatosProductorFormulario();
    if (this.tramiteState) {
      this.formulario.patchValue(this.tramiteState);
    }
    if (this.agregarDatosProductor) {
      this.agregarDatosProductorFormulario.patchValue(
        this.agregarDatosProductor
      );
    }

    queueMicrotask(() => {
      this.formulario.updateValueAndValidity({ emitEvent: false });
      this.formaValida.emit(this.formulario.valid);
    });
  }
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (!this.formulario) {
      this.initFormulario();
    }

    if (this.esFormularioSoloLectura) {
      this.formulario.disable();
    }
  }

  /**
   * Inicializa el formulario principal con los datos del estado del trámite.
   */
  initFormulario(): void {
    this.formulario = this.fb.group({
      datosConfidencialesProductor: [],
      productorMismoExportador: [],
    });
  }
  /**
   * Inicializa el formulario relacionado con las mercancías.
   *
   * Este método configura los campos y validaciones del formulario de mercancías utilizando los datos del estado actual del trámite.
   */
  inicializarFormularioMercancia(): void {
    this.formularioMercancia = this.fb.group({
      fraccionArancelaria: [{ value: [], disabled: true }],
      nombreComercial: [{ value: [[]], disabled: true }],
      nombreTecnico: [{ value: [[]], disabled: true }],
      numeroDeRegistroFiscal: ['', [Validators.required,
         Validators.maxLength(15),
      ]],
      valorMercancia: [{ value: '', disabled: true }],
      complemento: [{ value: '', disabled: true }],
      numeroFactura: [{ value: [[]], disabled: true }],
      tipoFactura: [''],
    });
  }
  /**
   * Inicializa el formulario para agregar datos del productor.
   */
  initAgregarDatosProductorFormulario(): void {
    this.agregarDatosProductorFormulario = this.fb.group({
      numeroRegistroFiscal: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(REGEX_ALFANUMERICO_SIN_ESPACIOS)
        ]
      ],
      fax: ['', [Validators.pattern(REGEX_SOLO_DIGITOS)]],
    });
  }

  /**
   * Obtiene los productores seleccionados en la tabla.
   *
   * @param {HistoricoColumnas[]} evento - Lista de productores seleccionados.
   */
  obtenerSeleccionadoProductores(evento: HistoricoColumnas[]): void {
    this.seleccionadoProductoresExportador = evento;
  }

  /**
   * Obtiene los productores seleccionados para agregar.
   *
   * @param {HistoricoColumnas[]} evento - Lista de productores seleccionados para agregar.
   */
  obtenerAnadirProductosSeleccionados(evento: HistoricoColumnas[]): void {
    this.seleccionadoAgregarProductoresExportador = evento;
    // Clear merchandise selection when a new producer is selected
    // This ensures user must select merchandise after selecting a producer
    this.mercanciaDatosSeleccionada = [];
  }

  /**
   * Agrega los productores seleccionados a la lista de productores agregados.
   */
  productoresSeleccionados(): void {
    if (this.seleccionadoProductoresExportador.length !== 0) {
      // Verificar si algún productor seleccionado ya existe en la tabla de productores agregados
      const DUPLICADOS = this.seleccionadoProductoresExportador.filter(seleccionado => 
        this.agregarProductoresExportador.some(agregado => 
          agregado.numeroRegistroFiscal === seleccionado.numeroRegistroFiscal
        )
      );

      if (DUPLICADOS.length > 0) {
        this.abrirModal("El productor ya existe para este solicitante");
        return;
      }

      const DATOS = [...this.seleccionadoProductoresExportador];
      DATOS.forEach((ele: HistoricoColumnas) => {
        this.emitAgregarExportador.emit(ele);
      });
      this.productoresExportador = this.productoresExportador.filter((elementos) => !this.seleccionadoProductoresExportador.some((elementosSecundarios) => elementosSecundarios.id === elementos.id));
      this.emitProductoresExportador.emit(this.productoresExportador);
      this.seleccionadoProductoresExportador = [];
    } else {
      this.abrirModal("Debes seleccionar un productor");
    }
  }

  /**
   * Elimina los productores seleccionados de la lista de productores agregados.
   */
  eliminarProductoresSeleccionados(): void {
    if (this.seleccionadoAgregarProductoresExportador.length !== 0) {
      const EXISTING_PRODUCTORES = this.seleccionadoAgregarProductoresExportador.filter(
        (prod) => !prod.nuevo
      );

      const PRODUCTORES_EXPORTADOR = [
        ...this.productoresExportador,
        ...EXISTING_PRODUCTORES,
      ];
      
      this.emitProductoresExportador.emit(PRODUCTORES_EXPORTADOR);      const REMAINING_DATOS =
        this.agregarProductoresExportador.filter(
          (elementos) =>
            !this.seleccionadoAgregarProductoresExportador.some(
              (elementosSecundarios) => 
                elementosSecundarios.numeroRegistroFiscal === elementos.numeroRegistroFiscal &&
                elementosSecundarios.nombreProductor === elementos.nombreProductor
            )
        );
      this.eliminarEventoExportador.emit(REMAINING_DATOS);
      this.seleccionadoAgregarProductoresExportador = [];
    } else {
      this.abrirModal('Debes seleccionar un productor');
    }
  }

  /**
   * Abre el modal para agregar datos del productor.
   */
  agregarDatosProductorPorExportador(): void {
    if (this.modalElement?.nativeElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Cierra el modal para agregar datos del productor.
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }
  /**
   * Agrega un productor si el formulario es válido.
   * Utiliza el idProcedimiento del componente para obtener el producto nuevo.
   */
  agregarExportador(): void {
    if (this.agregarDatosProductorFormulario.valid) {
      const DATOS = this.agregarDatosProductorFormulario.value;
      const rfc = DATOS.numeroRegistroFiscal;
      if (!RFC_REGEX.test(rfc)) {
        this.cerrarModal();
        setTimeout(() => {
          this.abrirModal('El usuario no se encuentra dado de alta en el Servicio de Identificación del Contribuyente, favor de acudir a cualquier Módulo de Servicios al Contribuyente de su preferencia.');
        }, 300);
        return;
      }
      const EXISTE = this.agregarProductoresExportador.some(productor => 
        productor.numeroRegistroFiscal === rfc
      ) || (this.productoresExportador && this.productoresExportador.some(productor => 
        productor.numeroRegistroFiscal === rfc
      ));

      if (EXISTE) {
        this.cerrarModal();
        setTimeout(() => {
          this.abrirModal("El productor ya existe para este solicitante");
        }, 300);
        return;
      }

      this.cerrarModal();
      this.emitAgregarExportador.emit(DATOS);
      this.agregarDatosProductorFormulario.reset();
    } else {
      this.agregarDatosProductorFormulario.markAllAsTouched();
    }
  }

  /**
   * Valida un campo del formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Actualiza el estado del store con el valor seleccionado en el formulario.
   *
   * @param {string} formGroupName - Nombre del grupo de formulario.
   * @param {string} campo - El nombre del campo en el formulario.
   * @param {string} storeStateName - Nombre del estado del store para actualizar.
   */
  setValoresStore(
    formGroupName: string,
    campo: string,
    storeStateName?: string
  ): void {
    const VALOR = this.formulario.get(campo)?.value;
    if (campo === 'datosConfidencialesProductor' && !VALOR) {
      this.resetAllData();
      this.formulario.get('productorMismoExportador')?.setValue(false);
      this.emitResetEvent('productorMismoExportador', false);
    }
    if (campo === 'productorMismoExportador' && !VALOR) {
      this.resetProductorData();
    }

    this.formaValida.emit(this.formulario.valid);
    this.formHistoricoEvent.emit({
      formGroupName,
      campo,
      valor: VALOR,
      storeStateName: storeStateName || '',
    });
  }

  private resetAllData(): void {
    this.resetProductorData();
  }

  private resetProductorData(): void {
    this.seleccionadoProductoresExportador = [];
    this.seleccionadoAgregarProductoresExportador = [];
    this.mercanciaDatosSeleccionada = [];

    this.eliminarEventoExportador.emit([]);
    
    // Clear RFC productor from all merchandise data
    const CLEARED_MERCANCIA_DATA = this.mercanciaDatos.map(mercancia => ({
      ...mercancia,
      rfcProductor1: ''
    }));
    
    this.emitMercanciaDatos.emit(CLEARED_MERCANCIA_DATA);

    this.agregarDatosProductorFormulario.reset();
    this.formularioMercancia.reset();
    this.inicializarFormularioMercancia();
  }

  private emitResetEvent(campo: string, valor: boolean): void {
    this.formHistoricoEvent.emit({
      formGroupName: 'formulario',
      campo,
      valor: valor as any,
      storeStateName: '',
    });
  }
  /**
   * Actualiza el estado del store con el valor seleccionado en el formulario.
   *
   * @param {string} formGroupName - Nombre del grupo de formulario.
   * @param {string} campo - El nombre del campo en el formulario.
   * @param {string} storeStateName - Nombre del estado del store para actualizar.
   */
  setValoresStoreAgregarForm(
    formGroupName: string,
    campo: string,
    storeStateName?: string
  ): void {
    const VALOR =
      this.agregarDatosProductorFormulario.get(campo)?.value ?? null;
    this.formaValida.emit(this.agregarDatosProductorFormulario.valid);
    this.agregarDatosProductorFormularioEvent.emit({
      formGroupName,
      campo,
      valor: VALOR,
      storeStateName: storeStateName || '',
    });
  }
  /**
   * Abre un modal para agregar mercancía.
   *
   * @remarks
   * Este método verifica si los elementos del modal están disponibles
   * y, de ser así, crea una instancia del modal y lo muestra.
   *
   * @comando
   * - Llama a este método para abrir el modal de mercancía.
   */
  agregarMercancia(): void {
    if (this.agregarProductoresExportador.length === 0) {
      this.abrirModal("Es necesario agregar al menos un productor por exportador");
      return;
    }

    if (this.seleccionadoAgregarProductoresExportador.length === 0) {
      this.abrirModal("Debe seleccionar un productor para asignarle la mercancía");
      return;
    }

    if (this.mercanciaDatosSeleccionada.length === 0) {
      this.abrirModal("Debe seleccionar una mercancía para asignarle el productor");
      return;
    }

    // Handle multiple selections - notify user if more than one item is selected
    if (this.seleccionadoAgregarProductoresExportador.length > 1) {
      this.abrirModal("Solo puede seleccionar un productor a la vez para asignar");
      return;
    }

    if (this.mercanciaDatosSeleccionada.length > 1) {
      this.abrirModal("Solo puede seleccionar una mercancía a la vez para asignar");
      return;
    }

     if (this.mercanciaDatosSeleccionada.length === 1) {
    
    }

    if (this.seleccionadoAgregarProductoresExportador.length && this.mercanciaDatosSeleccionada.length) {
      const RFC = this.seleccionadoAgregarProductoresExportador[0].numeroRegistroFiscal;
      const MERCANCIA_SELECCIONADA = this.mercanciaDatosSeleccionada[0];
      const INDEX = this.mercanciaDatos.findIndex(mercancia => mercancia.id === MERCANCIA_SELECCIONADA.id);

      if (INDEX !== -1) {
        const MAPPED_MERCANCIA = { ...this.mercanciaDatos[INDEX], rfcProductor1: RFC};
        const UPDATED_ARRAY = [
          ...this.mercanciaDatos.slice(0, INDEX),
          MAPPED_MERCANCIA,
          ...this.mercanciaDatos.slice(INDEX + 1),
        ];
        this.emitMercanciaDatos.emit(UPDATED_ARRAY);
        
        // Clear selections after successful assignment to prevent reuse
        this.seleccionadoAgregarProductoresExportador = [];
        this.mercanciaDatosSeleccionada = [];
      }
    }
  }
  /**
   * Cierra el modal para agregar datos del productor.
   */
  cerrarModalMercancia(): void {
    if (this.closeModalMercancia?.nativeElement) {
      this.closeModalMercancia.nativeElement.click();
    }
  }

  /**
   * Método para manejar la selección de una mercancía en la tabla.
   *
   * @param evento - Objeto de tipo `MercanciaTabla` que representa la mercancía seleccionada.
   *
   * @command Este método actualiza la propiedad `mercanciaDatosSeleccionada` con la mercancía seleccionada.
   */
  obtenerSeleccionadoMercancia(evento: Mercancia): void {
    this.mercanciaDatosSeleccionada = [evento];
  }

  /**
   * Método para manejar la selección múltiple de mercancías en la tabla.
   *
   * @param evento - Array de objetos de tipo `Mercancia` que representa las mercancías seleccionadas.
   *
   * @command Este método actualiza la propiedad `mercanciaDatosSeleccionada` con las mercancías seleccionadas.
   */
  obtenerSeleccionadoMercancias(evento: Mercancia[]): void {
    this.mercanciaDatosSeleccionada = evento;
  }
  /**
   * @method mercanciaAgregarSeleccionada
   * @description Muestra un modal utilizando la instancia de `Modal` si el elemento modal está disponible.
   * @command Abre el modal para agregar una mercancía seleccionada.
   */
  mercanciaAgregarSeleccionada(): void {
    if (this.modalElements?.nativeElement) {
      const MODAL_INSTANCE = new Modal(this.modalElements.nativeElement);
      MODAL_INSTANCE.hide();
      this.mercanciaDatos.push(this.formularioMercancia.value);
    }
  }

  /**
   * @description
   * Abre un modal de notificación con una configuración predeterminada de alerta.
   *
   * Este método configura una notificación con las siguientes características:
   * - Tipo: Alerta
   * - Categoría: Peligro
   * - Modo: Acción
   * - Tiempo de espera: 2000ms
   * - Botón de aceptar personalizado
   *
   * @method
   * @public
   *
   * @example
   * ```typescript
   * // Ejemplo de uso del método
   * this.abrirModal();
   *
   * // La notificación se configurará como:
   * this.nuevaNotificacion = {
   *   tipoNotificacion: 'alert',
   *   categoria: 'danger',
   *   modo: 'action',
   *   // ... otras propiedades
   * }
   * ```
   *
   * @see Notificacion
   * @see NotificacionesComponent
   */
  public abrirModal(message?: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: message ? message : this.mensajeDeAlerta,
      cerrar: false,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.nuevaNotificacionStatus = true;
  }

  /**
   * Valida el formulario del componente.
   *
   * @returns {boolean} `true` si el formulario es válido, de lo contrario `false`.
   */
  public validarFormulario(): void {
    this.formulario.markAllAsTouched();
  }

  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
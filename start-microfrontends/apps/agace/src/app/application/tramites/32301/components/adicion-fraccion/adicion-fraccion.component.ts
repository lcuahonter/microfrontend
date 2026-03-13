import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AlertComponent,
  Catalogo,
  ConfiguracionColumna,
  ConsultaioQuery,
  Notificacion,
  NotificacionesComponent,
  TablaSeleccion,
  TableComponent,
  TablePaginationComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  CONFIGURATION_TABLA_GRID_FRACCIONES_HEADER,
  FraccionGridItem,
  MESSAGE_FRACCION,
} from '../../constantes/importador-exportador.enum';
import { CatalogoSelectComponent, CrosslistComponent, InputCheckComponent, InputRadioComponent, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { ALOTO_FRACCIONES } from '../../enums/adicion-fraccion.enum';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { CROSLISTA_DE_PAISES } from '../../enums/pantallas-constante.enum';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { exportExcelFile } from '@libs/shared/data-access-user/src';
import { ToastrService } from 'ngx-toastr';

interface RatioOption {
  label: string;
  value: string | number;
}
/**
 * Componente para la gestión de la adición de fracciones arancelarias.
 * Permite tanto la carga manual como la carga masiva de fracciones.
 */
@Component({
  selector: 'app-adicion-fraccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    InputRadioComponent,
    TableComponent,
    TablePaginationComponent,
    CatalogoSelectComponent,
    CrosslistComponent,
    NotificacionesComponent,
    InputCheckComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './adicion-fraccion.component.html',
  styleUrls: ['./adicion-fraccion.component.scss'],
  providers: [ToastrService],

})
export class AdicionFraccionComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Formulario principal para la declaración.
   */
  declaracionForm!: FormGroup;

  /**
   * Modelo del formulario de declaración.
   */
  declaracionFormModel!: FormGroup;

  /**
   * Formulario para la carga manual de datos.
   */
  cargaManualForm!: FormGroup;

  /**
   * Controla la visibilidad del botón de carga manual.
   */
  divBtnCargaMVisible: boolean = false;

  /**
   * Mensaje informativo para el usuario sobre la carga de fracciones arancelarias.
   */
  messageFraccion = MESSAGE_FRACCION;

  /**
   * Definición de la variable para manejar fracciones en el sistema.
   * Se utiliza para almacenar y manipular fracciones de manera eficiente.
   */
  alotoFracciones = ALOTO_FRACCIONES;
  /**
   * Opciones para los botones de radio.
   */
  radioOptions!: RatioOption[];
  /**
   * Estado de la selección de la tabla.
   * @type {TablaSeleccion}
   */
  seleccionTabla = TablaSeleccion.CHECKBOX;
  /**
   * Encabezados de la tabla de fracciones arancelarias.
   */
  gridFraccionesHeader: FraccionGridItem[] = [];

  /**
 * Configuración de las columnas de la tabla de mercancía disponible.
 * @type {ConfiguracionColumna<FraccionGridItem>[]}
 */
  configuraciongridFraccionesHeader: ConfiguracionColumna<FraccionGridItem>[] = CONFIGURATION_TABLA_GRID_FRACCIONES_HEADER;


  /**
   * Fechas seleccionadas por el usuario.
   */
  fechasSeleccionadas: string[] = [];

  /**
   * Fechas disponibles para selección.
   */
  fechasDatos: string[] = [];

  /**
   * Lista de países para selección, tomada de un catálogo.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;

  mensajeCamposObligatorios: string =  '* Campos obligatorios';

  validarFraccionArray:FraccionGridItem[]=[];

  @Output() onContinue = new EventEmitter<void>();


  /**
   * Rango de días seleccionados, basado en la lista de países.
   */
  selectRangoDias: string[] = this.crosListaDePaises;
  /**
   * Referencia a los componentes de la lista de fechas.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Configuración de botones para acciones sobre la selección.
   */
  botonField = [
    {
      btnNombre: 'Agregar',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Agregar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Eliminar',
      class: 'btn-danger',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Eliminar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Control de formulario para la fecha general.
   */
  fecha: FormControl = new FormControl('');

  /**
   * Control de formulario para la fecha seleccionada.
   */
  fechaSeleccionada: FormControl = new FormControl('');

  /**
   * Catálogos asignados a propiedades para selección.
   */
  cveNicoMod!: Catalogo[];
  unidadMedidaMod!: Catalogo[];
  activRelProcMod!: Catalogo[];
  cveFraccionCorrelacionMod!: Catalogo[];

  /**
   * Datos del cuerpo para el componente de miembros de la empresa.
   */
  public miembroDeLaEmpresaBodyData: unknown[] = [];

  /**
   * Instancias de modales utilizados en la carga masiva y fracciones.
   */
  cargaMasivaFrModalInstance!: Modal;
  /**
   * Instancia de la clase `Modal` utilizada para gestionar el diálogo modal de fracciones.
   * Esta propiedad se inicializa cuando se crea el modal y proporciona métodos para controlar su comportamiento.
   */
  fraccionesModelInstance!: Modal;

  /**
  * Elemento de entrada de archivo HTML.
  *
  * @type {HTMLInputElement}
  */
  entradaArchivo!: HTMLInputElement;
  /**
  * Etiqueta del archivo seleccionado.
  */
  etiquetaDeArchivo: string = 'Sin archivo seleccionados';

  /**
 * Archivo de medicamentos seleccionado.
 */
  archivoMedicamentos: File | null = null;

  /**
   * Referencias a los elementos del DOM para los modales.
   */
  @ViewChild('cargaMasivaFrModal', { static: false })
  cargaMasivaFrModal!: ElementRef;

  @ViewChild('fraccionesModel', { static: false }) fraccionesModel!: ElementRef;

  /**
   * Declaración de la variable nuevaNotificacion de tipo Notificacion.
   * Se utiliza para almacenar y gestionar notificaciones dentro del sistema.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Subject utilizado para destruir suscripciones y evitar fugas de memoria.
   */
  private destroy$: Subject<void> = new Subject<void>();
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
 * Fila seleccionada en la tabla de mercancías seleccionadas.
 * 
 * Representa la mercancía seleccionada actualmente en la tabla de mercancías seleccionadas.
 */
  seleccionadasFila!: FraccionGridItem | null;
  /**
   * Constructor donde se inyectan servicios y se inicializa el formulario principal.
   */
  constructor(
    private fb: FormBuilder,
    private AvisoModifyService: AvisoModifyService,
    private store: Tramite32301Store,
    private query: Tramite32301Query,
    private consultaioQuery: ConsultaioQuery,
    private toastrService: ToastrService,

  ) {
    this.declaracionForm = this.fb.group({
      tipoCarga: [''],
      booleanGenerico: [''],
      descripcionGenerica3: [''],
      idSolicitud: [''],
      labelFraccionesAgregadas: [''],
      idCarga: [{ value: '', disabled: this.esFormularioSoloLectura }],
      manifiestos: [false, Validators.required],
    });

    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroy$` emite un valor (para evitar fugas de memoria).
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
  }

  /**
   * Inicializa los formularios secundarios y obtiene las opciones de fracción adicional.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.query.selectState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((formState) => {
        this.gridFraccionesHeader = formState.gridFraccionesHeader || [];
      });
  }

  continuar(): void {
    this.onContinue.emit();
  }


  descargarPlantilla(event: Event): void {
    event.preventDefault();
    // Lógica para obtener la plantilla de proveedores extranjeros
    this.AvisoModifyService.getPlantilla('FRACCION').subscribe(
      (response) => {
        // Manejar la respuesta exitosa

        if(response.codigo === '00'){
          exportExcelFile(response.datos.contenido);
        }
      },
      (error : any) => {
        // Manejar el error
        console.error('Error al obtener la plantilla de proveedores extranjeros:', error);
        this.toastrService.error(error.mensaje);

      }
    );

  }


  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
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
      this.declaracionForm.disable();
      this.declaracionFormModel.disable();
      this.cargaManualForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.declaracionForm.enable();
      this.declaracionFormModel.enable();
      this.cargaManualForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }
  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.declaracionFormModel = this.fb.group({
      archivoProceso: [''],
      registrosProcesoCargados: [{ value: '', disabled: true }],
    });

    this.cargaManualForm = this.fb.group({
      fraccionDeclarada: ['', [Validators.required, Validators.maxLength(8)]],
      actividadRelacionada: ['', Validators.required],
      descripcionFraccionActual: ['', Validators.required],
      correlacionFraccionActual: ['', Validators.required],
      umt: ['', Validators.required],
      nico: ['', Validators.required],
      descripcionNico: [''],
      paisDeOrigen: [[], Validators.required],
      id: [null]
    });
    this.getAdicianFraccionOption();
    this.getAdicianFraccionActivRelProcModOption();
    this.getAdicianFraccioncveFraccionCorrelacionModOption();
  }
  /**
   * Obtiene las opciones para los botones de radio relacionados con fracciones.
   */
  getAdicianFraccionOption(): void {
    this.AvisoModifyService.getAdicianFraccionOption()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.radioOptions = Object.assign([], resp);
      });
  }
  /**
   * Obtiene las opciones de modificación de clave nacional única.
   */
  getAdicianFraccionNicoModOptions(): void {
    const correlacionFraccionActual = this.cargaManualForm.get('correlacionFraccionActual')?.value;
    this.AvisoModifyService.getAdicianFraccionNicoModOptions(correlacionFraccionActual)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.cveNicoMod = resp.datos
      });
  }

  /**
   * Obtiene las opciones de modificación de unidad de medida.
   */
  getAdicianFraccionUnidadMedidaModOption(): void {
    const correlacionFraccionActual = this.cargaManualForm.get('correlacionFraccionActual')?.value;
    this.AvisoModifyService.getAdicianFraccionUnidadMedidaModOption(correlacionFraccionActual)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.unidadMedidaMod = resp.datos
      });
  }

  /**
   * Obtiene las opciones de modificación de actividad relacionada con el proceso.
   */
  getAdicianFraccionActivRelProcModOption(): void {
    this.AvisoModifyService.getAdicianFraccionActivRelProcModOption()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.activRelProcMod = Object.assign([], resp);
      });
  }

  /**
   * Obtiene las opciones de modificación de la clave de fracción de correlación.
   */
  getAdicianFraccioncveFraccionCorrelacionModOption(): void {
    this.AvisoModifyService.getFraccionesArancelarias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        const FALLBACKDATA = [
          {
            "clave": "61032201",
            "descripcion": "De algodón."
          },
          {
            "clave": "61032301",
            "descripcion": "De fibras sinteticas."
          },
          {
            "clave": "61032306",
            "descripcion": "PRUEBA"
          }
        ]
        this.cveFraccionCorrelacionMod = resp.datos.length === 0 ? FALLBACKDATA : resp.datos
      });
  }

  /**
   * Agrega fechas seleccionadas dependiendo del tipo especificado ('t' para todas).
   */
  agregar(tipo: string): void {
    if (tipo === 't') {
      this.fechasSeleccionadas = [...this.selectRangoDias];
      this.fechasDatos = [];
    } else {
      const FECHA_VALOR = this.fecha.value.map(Number);
      this.fechasSeleccionadas.push(this.fechasDatos[FECHA_VALOR]);
      this.fechasDatos.splice(FECHA_VALOR, 1);
    }
  }

  /**
   * Quita fechas seleccionadas dependiendo del tipo especificado ('t' para todas).
   */
  quitar(tipo: string = ''): void {
    if (tipo === 't') {
      this.fechasDatos = [...this.fechasSeleccionadas];
      this.fechasSeleccionadas = [];
    } else {
      const FECHA_VALOR = this.fechaSeleccionada.value.map(Number);
      this.fechasDatos.push(this.fechasSeleccionadas[FECHA_VALOR]);
      this.fechasSeleccionadas.splice(FECHA_VALOR, 1);
    }
  }

  /**
   * Inicializa las instancias de los modales después de que las vistas estén cargadas.
   */
  ngAfterViewInit(): void {
    if (this.cargaMasivaFrModal?.nativeElement) {
      this.cargaMasivaFrModalInstance = new Modal(
        this.cargaMasivaFrModal.nativeElement
      );
    }

    if (this.fraccionesModel?.nativeElement) {
      this.fraccionesModelInstance = new Modal(
        this.fraccionesModel.nativeElement
      );
    }
  }

  /**
   * Controla la visibilidad del botón de carga dependiendo del tipo de carga seleccionado.
   */
  valorSeleccionadoTipoCarga(ev: string | number): void {
    if (ev === 'TIPCAR.MA') {
      this.divBtnCargaMVisible = false;
    } else if (ev === 'TIPCAR.CM') {
      this.divBtnCargaMVisible = true;
    }
  }

  /**
   * Abre el modal para agregar fracciones manualmente.
   */
  modalAgregaCarga(): void {
    this.openfraccionesModelModel();
  }

  saveFracciones(): void {
    const payload = {
      "id_persona_sol": this.cargaManualForm.value.fraccionDeclarada,
      "cve_fraccion_declarada": this.cargaManualForm.value.fraccionDeclarada ,
      "actividad_proceso":  this.cargaManualForm.value.actividadRelacionada,
      "descripcion_mercancia": this.cargaManualForm.value.descripcionFraccionActual,
      "cve_fraccion_correlacion": this.cargaManualForm.value.correlacionFraccionActual,
      "cve_unidad_medida": this.cargaManualForm.value.umt,
      "nico": this.cargaManualForm.value.nico,
      "descripcion_nico": this.cargaManualForm.value.descripcionNico,
      "cve_paises_origen": this.fechasDatos
    }
    this.AvisoModifyService.validarFraccionArancelaria(payload)
      .subscribe(response => {
        this.validarFraccionArray.push(response.datos)
        this.gridFraccionesHeader= this.validarFraccionArray;
      this.closefraccionesModelModels()
      }, error => {
        console.error('Error en la validación', error);
      });
  }
  /**
   * Abre el modal para la carga masiva de fracciones.
   */
  abrirModalCargaMasivaFr(): void {
    this.openCargaMasivaFrModal();
  }

  /**
   * Abre el modal de alerta después de cargar un archivo de procesos.
   */
  cargarArchivoProcesosAjax(): void {
    this.AvisoModifyService.cargarArchivoFraccionArancelaria(this.archivoMedicamentos!)
      .subscribe(response => {
    this.gridFraccionesHeader=response.datos.fracciones;
    this.closeCargaMasivaFrModal();
      }, error => {
        console.error('Error al cargar el archivo', error);
      });
  }

  /**
   * Abre el modal correspondiente a la carga masiva de fracciones.
   */
  openCargaMasivaFrModal(): void {
    if (this.cargaMasivaFrModalInstance) {
      this.cargaMasivaFrModalInstance.show();
    }
  }

  /**
   * Cierra el modal de carga masiva de fracciones.
   */
  closeCargaMasivaFrModal(): void {
    if (this.cargaMasivaFrModalInstance) {
      this.cargaMasivaFrModalInstance.hide();
    }
  }

  /**
   * Abre el modal para agregar fracciones de forma manual.
   */
  openfraccionesModelModel(): void {
    if (this.fraccionesModelInstance) {
      this.fraccionesModelInstance.show();
    }
  }

  /**
   * Cierra el modal para agregar fracciones de forma manual.
   */
  closefraccionesModelModels(): void {
    if (this.fraccionesModelInstance) {
      this.fraccionesModelInstance.hide();
    }
  }
  /**
   * Maneja la selección de filas en la tabla de seleccionadas.
   * 
   * Este método asigna la fila seleccionada a `seleccionadasFila`.
   * 
   * @param {FraccionGridItem} evento - La fila seleccionada en la tabla de mercancías seleccionadas.
   */
  seleccionDeFilas(evento: FraccionGridItem): void {
    this.seleccionadasFila = evento;
  }
  /**
   * Modifica la fila seleccionada en la tabla de mercancías seleccionadas.
   * 
   * Este método actualiza el formulario con los valores de la fila seleccionada y muestra el modal de fracciones.
   * 
   * @param {FraccionGridItem} seleccionadasTablaDatos - La fila seleccionada en la tabla de mercancías seleccionadas.
   */
  modificarSeleccionada(seleccionadasTablaDatos?: FraccionGridItem): void {
    const FORM_VALUES = seleccionadasTablaDatos;
    if (this.fraccionesModelInstance && this.seleccionadasFila) {
      this.fraccionesModelInstance?.show();
    }
    if (FORM_VALUES) {
      this.cargaManualForm.patchValue({
        id: FORM_VALUES.id || this.gridFraccionesHeader.length + 1,
        fraccionDeclarada: FORM_VALUES.cve_fraccion_declarada,
        actividadRelacionada: FORM_VALUES.actividad_proceso,
        correlacionFraccionActual: FORM_VALUES.cve_fraccion_correlacion ? FORM_VALUES.cve_fraccion_correlacion  : [],
        descripcionFraccionActual: FORM_VALUES.descripcion_mercancia,
        nico: FORM_VALUES.nico,
        descripcionNico: FORM_VALUES.descripcion_nico,
        umt: FORM_VALUES.cve_unidad_medida,
        paisDeOrigen: this.fechasDatos.join(', '),
      });
    }
  }
  /**
   * Elimina la fracción seleccionada de la lista de fracciones.
   * 
   * Este método busca la fracción por su ID y la elimina de la lista `gridFraccionesHeader`.
   * Si la fracción no se encuentra, actualiza el store con la lista actualizada.
   * 
   * @param {number} id - El ID de la fracción a eliminar.
   */
  eliminarFraccionSeleccionada(id: number): void {
    const INDEX = this.gridFraccionesHeader.findIndex(item => item.id === id);
    if (INDEX !== -1) {
      this.gridFraccionesHeader = this.gridFraccionesHeader.filter(item => item.id !== id);
      this.seleccionadasFila = null;
      this.store.setCargaManual(this.gridFraccionesHeader);
    }

  }

  /**
   * Maneja el cambio de selección de aduanas.
   * 
   * Este método actualiza las fechas seleccionadas en el formulario cuando se cambian las aduanas.
   * 
   * @param {string[]} events - Lista de eventos de aduanas seleccionadas.
   */
  aduanaSeleccionadasChange(events: string[]): void {
    this.fechasDatos = events;
  }

  /**
   * Cierra el modal de fracciones y actualiza la lista de fracciones con los datos del formulario.
   * 
   * Este método crea un nuevo objeto `FraccionGridItem` con los valores del formulario y lo agrega a la lista de fracciones.
   * Si la fracción ya existe, la actualiza; si no, la agrega como una nueva entrada.
   * 
   * @param {FormGroup} formularioFracciones - El formulario que contiene los datos de la fracción a agregar o modificar.
   */
  closefraccionesModelModel(formularioFracciones: FormGroup): void {
    const FORM_VALUES = formularioFracciones.value;

    const NUEVA_MERCANCIA: FraccionGridItem = {
      id: this.seleccionadasFila?.id ?? FORM_VALUES.id ?? this.gridFraccionesHeader.length + 1,
      cve_fraccion_declarada: FORM_VALUES.fraccionDeclarada,
      actividad_proceso: FORM_VALUES.actividadRelacionada,
      cve_fraccion_correlacion: FORM_VALUES.correlacionFraccionActual,
      descripcion_mercancia: FORM_VALUES.descripcionFraccionActual,
      nico: FORM_VALUES.nico,
      descripcion_nico: FORM_VALUES.descripcionNico,
      cve_unidad_medida: FORM_VALUES.umt,
      cve_paises_origen: this.fechasDatos.join(', '),
    };

    const INDEX = this.gridFraccionesHeader.findIndex(
      item => item.id === NUEVA_MERCANCIA.id
    );

    if (INDEX !== -1) {
      this.gridFraccionesHeader = this.gridFraccionesHeader.map((item, i) =>
        i === INDEX ? NUEVA_MERCANCIA : item
      );
    } else {
      this.gridFraccionesHeader = [
        ...this.gridFraccionesHeader,
        NUEVA_MERCANCIA
      ];
    }
    this.store.setCargaManual(this.gridFraccionesHeader);
    this.seleccionadasFila = null;

    if (this.fraccionesModelInstance) {
      this.fraccionesModelInstance.hide();
    }
    this.cargaManualForm.reset();
  }

  /**
   * Se ejecuta al destruir el componente. Se utiliza para limpiar suscripciones activas y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    /**
     * Notifica a los observadores que el flujo de datos se va a destruir.
     */
    this.destroy$.next();

    /**
     * Completa el flujo de datos, asegurando que no se envíen más valores.
     */
    this.destroy$.complete();
  }
  /**
 * Maneja el cambio de archivo en el input de archivo.
 *
 * @param event Evento de cambio de archivo.
 *
 * @returns {void}
 */
  onCambioDeArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    const FILE_INPUT = document.getElementById(
      'archivoProceso'
    ) as HTMLInputElement;
    const FILE = FILE_INPUT.files?.[0];
    if (FILE) {
      if (FILE.type !== 'text/xlsx' && !FILE.name.endsWith('.xlsx')) {
        this.abrirModal();
        return;
      }

      if (TARGET.files && TARGET.files.length > 0) {
        this.archivoMedicamentos = TARGET.files[0];
        this.etiquetaDeArchivo
          = this.archivoMedicamentos.name;
      } else {
        this.etiquetaDeArchivo = 'Sin archivo seleccionados';
      }
    }
  }
  /**
  * Abre un modal de notificación para alertar al usuario que debe seleccionar un archivo CSV.
  * 
  * Este método inicializa la notificación con un mensaje de alerta y configura el elemento a eliminar.
  */
  abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por favor seleccione un archivo CSV.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'OK',
      txtBtnCancelar: '',
    };

  }
  /**
* Activa la selección del archivo de medicamentos.
* @returns {void}
*/
  activarSeleccionArchivo(): void {
    this.entradaArchivo = document.getElementById(
      'archivoProceso'
    ) as HTMLInputElement;
    if (this.entradaArchivo) {
      this.entradaArchivo.click();
    }


  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AlertComponent,
  ConfiguracionColumna,
  ConsultaioQuery,
  InputFecha,
  NotificacionesComponent,
  TablaSeleccion,
  TablePaginationComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  CANTIDAD_BIENES_OPTION,
  CONFIGURATION_TABLA_GRID_FUSION_ESCISION,
  EscisionHeaderItem,
  FECHA_INGRESO,
  FUSIONRADIO_OPTIONS,
  FUSIONRADIO_OPTIONS_ONLY,
  FUSION_O_ESCISION_OPTIONS,
} from '../../enums/fusion-oescision.enum';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputFechaComponent, InputRadioComponent, Notificacion, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { PersonaFusionEscisionDTO } from '../../models/avisomodify.model';
import { TableDataNgTable } from '../../models/avisomodify.model';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { Tramite32301Store } from '../../estados/tramite32301.store';

/**
 * Componente responsable de la gestión de datos relacionados con la fusión o escisión de empresas.
 * Maneja formularios reactivos, carga de datos desde servicios y visualización condicional.
 */
@Component({
  selector: 'app-fusion-oescision',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    TituloComponent,
    InputRadioComponent,
    TablePaginationComponent,
    NotificacionesComponent,
    InputFechaComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './fusion-oescision.component.html',
})
export class FusionOescisionComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /** Formulario principal del componente */
  formulario!: FormGroup;

  /** Formulario utilizado dentro del modal */
  modelFormulario!: FormGroup;

  /** Título principal mostrado dinámicamente según la opción elegida */
  fusionOescisionTitulo!: string;

  /** Subtítulo mostrado en la sección de detalle */
  subFusionOescisionTitulo!: string;

  /** Etiqueta para la fecha de fusión o escisión */
  labelFechaFusionOscision!: string;

  /** Opciones para el input radio de capacidad de almacenamiento */
  radioOptions = FUSION_O_ESCISION_OPTIONS;

  /** Visibilidad del bloque con certificación (en formulario principal) */
  conCertificacionPrincipalVisible: boolean = true;

  /** Visibilidad del bloque sin certificación (en modal) */
  sinCertificacionPrincipalVisible: boolean = true;

  /** Instancia del modal de modificación */
  ModificarFusionEscisionInstance!: Modal;

  /** Arreglo de fechas seleccionadas */
  fechasSeleccionadas = [];

  /** Opciones del radio para seleccionar tipo de operación (fusión/escisión) */
  fusionradioOptions = FUSIONRADIO_OPTIONS;

  /** Opciones para indicar si se poseen bienes */
  cantidadBienesOption = CANTIDAD_BIENES_OPTION;

  /** Encabezado de tabla que muestra los datos de empresas fusionadas/escindidas */
  gridFusionEscisionHeader: string[] = [];

  /**
    * Estado de la selección de la tabla.
    * @type {TablaSeleccion}
    */
  seleccionTabla = TablaSeleccion.CHECKBOX;
  /**
   * Encabezados de la tabla de fracciones arancelarias.
   */
  fusionEscisionHeader: EscisionHeaderItem[] = [];

/**
 * Encabezados de la tabla de fracciones arancelarias.
 */
  fusion: EscisionHeaderItem[] = [];
  /**
 * Configuración de las columnas de la tabla de fusión y escisión.
 * @type {ConfiguracionColumna<EscisionHeaderItem>[]}
 */
  configuracionfusionEscisionHeader: ConfiguracionColumna<EscisionHeaderItem>[] = CONFIGURATION_TABLA_GRID_FUSION_ESCISION;


  /** Datos a mostrar en la tabla */
  gridFusionEscisionData: { tbodyData: string[] }[] = [{ tbodyData: [] }];

  /** Total de elementos para paginación */
  totalItems: number = 0;

  /** Elementos por página para paginación */
  itemsPerPage: number = 1;

  /** Página actual seleccionada */
  currentPage: number = 1;

  /** Datos del cuerpo de tabla (miembros de la empresa) */
  public miembroDeLaEmpresaBodyData: unknown[] = [];

  /** Visibilidad del bloque completo con datos */
  divCompletoVisible: boolean = false;

  /** Contenido textual para el modal */
  modalContent: string = '';

  /** Referencia al modal de modificación en el DOM */
  @ViewChild('ModificarFusionEscisionModel', { static: false })
  ModificarFusionEscisionModel!: ElementRef;

  /** Objeto con datos de persona fusionada o escindida */
  PersonaFusionEscisionDTO!: PersonaFusionEscisionDTO;

  /**
   * Declaración de la variable correctamenteNotificacion de tipo Notificacion.
   * Se utiliza para almacenar y gestionar notificaciones que indican acciones exitosas dentro del sistema.
   */
  public correctamenteNotificacion!: Notificacion;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Observable para gestionar el ciclo de vida del componente */
  public destroy$: Subject<void> = new Subject<void>();
  /**
 * Representa la fecha de inicio ingresada por el usuario.
 *
 * @type {InputFecha}
 * @default FECHA_INGRESO
 */
  public fechaInicioInput: InputFecha = FECHA_INGRESO;
  /**
 * Fila seleccionada en la tabla de mercancías seleccionadas.
 * 
 * Representa la mercancía seleccionada actualmente en la tabla de mercancías seleccionadas.
 */
  seleccionadasFila!: EscisionHeaderItem | null;
  /**
   * Indica si se ha seleccionado una opción de fusión o escisión.
   * Se utiliza para mostrar u ocultar secciones del formulario.
   */
  isSelectFusionEscision: boolean = false;

  mensajeCamposObligatorios: string = '* Campos obligatorios';

  @Output() onContinue = new EventEmitter<void>();

  /**
   * Constructor del componente, inyecta formularios, servicios y manejo de estado.
   */
  /**
   * Crea una instancia del componente `FusionOEscisionComponent`.
   *
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param AvisoModifyService - Servicio para manejar la lógica de modificación de avisos.
   * @param store - Store para manejar el estado del trámite 32301.
   * @param Tramite32301Query - Query para obtener datos del estado del trámite 32301.
   * @param consultaioQuery - Query para obtener el estado de la consulta.
   */

  constructor(
    private fb: FormBuilder,
    private AvisoModifyService: AvisoModifyService,
    private store: Tramite32301Store,
    private Tramite32301Query: Tramite32301Query,
    private consultaioQuery: ConsultaioQuery
  ) {
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
   * Getter para acceder al control de fecha del formulario.
   * Utiliza el método `get` del formulario para obtener el control específico.
   *
   * @returns {FormControl} El control de fecha del formulario.
   */
  get fechaControl(): FormControl {
    return this.formulario.get('personaFusionEscisionDTO.fecha') as FormControl;
  }

  /** Inicializa formularios y obtiene opciones del servicio */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();

    this.Tramite32301Query.selectState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((formState) => {
        this.fusionEscisionHeader = formState.fusionEscisionHeader || [];
      });

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
 * Cambia la fecha de ingreso en el formulario de formulario.
 *
 * @param nuevo_valor - El nuevo valor de la fecha de ingreso en formato de cadena.
 */
  public cambioFechaInicio(nuevo_valor: string): void {
    this.formulario.get('fechaInspeccion')?.setValue(nuevo_valor);
    this.formulario.get('fechaInspeccion')?.markAsUntouched();
    this.store.setFechaInspeccion(nuevo_valor);
  }


  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formulario.disable();
      this.modelFormulario.disable();
      const CONTROL = this.formulario.get('personaFusionEscisionDTO');
      if (CONTROL) {
        CONTROL.disable();
      }

      this.mpersonaFusionEscisionDTO.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formulario.enable();
      const CONTROL = this.formulario.get('personaFusionEscisionDTO');
      if (CONTROL) {
        CONTROL.disable();
      }
      this.modelFormulario.enable();
      this.personaFusionEscisionDTO.enable();
      this.mpersonaFusionEscisionDTO.enable();
    }
  }

  continuar(): void {
    this.changeDescripcionClobGenerica2();
    this.onContinue.emit();
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `Tramite32301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  async inicializarFormulario(): Promise<void> {
    await this.initializeForm();
    this.getGridsubFusionOescision();
  }

  /** Inicializa las instancias de los modales al cargar la vista */
  ngAfterViewInit(): void {
    if (this.ModificarFusionEscisionModel?.nativeElement) {
      this.ModificarFusionEscisionInstance = new Modal(
        this.ModificarFusionEscisionModel.nativeElement
      );
    }
  }

  /** Crea e inicializa los formularios reactivos */
  initializeForm(): void {
    this.formulario = this.fb.group({
      capacidadAlmacenamiento: [null, Validators.required],
      numeroTotalCarros: [null, Validators.required],
      cantidadBienes: [null, Validators.required],
      fechaInspeccion: [{ value: '' }],
      personaFusionEscisionDTO: this.fb.group({
        registroFederalDeContribuyentes: ['', Validators.required],
        denominacionORazonSocial: [{ value: '', disabled: true }],
        folioVucemUltimaCertificacion: [{ value: '', disabled: true }],
        fechaInicioVigenciaUltimaCertificacion: [{ value: '', disabled: true }],
        fechaFinVigenciaUltimaCertificacion: [{ value: '', disabled: true }],
        descripcionClobGenerica2: ['', Validators.required],
        fecha: [{ value: '' }],
      }),
      personaFusionEscisionModal: this.fb.group({
        registroFederalDeContribuyentes: ['', Validators.required],
        denominacionORazonSocial: [{ value: '', disabled: true }],
        folioVucemUltimaCertificacion: [{ value: '', disabled: true }],
        fechaInicioVigenciaUltimaCertificacion: [{ value: '', disabled: true }],
        fechaFinVigenciaUltimaCertificacion: [{ value: '', disabled: true }],
      }),
    });

    this.modelFormulario = this.fb.group({
      mCantidadBienes: [null, Validators.required],
      personaFusionEscisionDTO: this.fb.group({
        registroFederalDeContribuyentes: ['', Validators.required],
        denominacionORazonSocial: [{ value: '', disabled: true }],
        folioVucemUltimaCertificacion: [{ value: '', disabled: true }],
        fechaInicioVigenciaUltimaCertificacion: [{ value: '', disabled: true }],
        fechaFinVigenciaUltimaCertificacion: [{ value: '', disabled: true }],
        fecha: [{ value: '' }],
        descripcionClobGenerica2: ['', Validators.required],
      }),
      personaFusionEscisionModal: this.fb.group({
        registroFederalDeContribuyentes: ['', Validators.required],
        denominacionORazonSocial: [{ value: '', disabled: true }],
        folioVucemUltimaCertificacion: [{ value: '', disabled: true }],
        fechaInicioVigenciaUltimaCertificacion: [{ value: '', disabled: true }],
        fechaFinVigenciaUltimaCertificacion: [{ value: '', disabled: true }],
      }),
    });
  }

  /** Oculta la opción de escisión si se selecciona cierto valor */
  ocultarEscicion(ev: string | number): void {
    if (ev === 'fusion1') {
      this.fusionradioOptions = FUSIONRADIO_OPTIONS;
      this.store.setCapacidadAlmacenamiento(2);
    }
    if (ev === 'fusion2') {
      this.fusionradioOptions = FUSIONRADIO_OPTIONS_ONLY
      this.store.setCapacidadAlmacenamiento(3);
    }
  }
  changeDescripcionClobGenerica2(): void {
    const nuevo_valor = this.formulario.get('personaFusionEscisionDTO.descripcionClobGenerica2')?.value;
    this.store.setDescripcionClobGenerica2(nuevo_valor);
  }

  /** Cambia dinámicamente los títulos y etiquetas según la opción seleccionada */
  mostrarFusionOEscision(ev: string | number): void {
    if (ev === 1 || ev === '1') {
      this.isSelectFusionEscision = true;
      this.fusionOescisionTitulo = 'Datos de las empresas fusionadas';
      this.subFusionOescisionTitulo = 'Datos de las empresas fusionadas';
      this.fechaInicioInput.labelNombre = 'Fecha en que surte efecto la fusión';
      this.store.setNumeroTotalCarros(1);

    }
    else {
      this.isSelectFusionEscision = false;
      this.fusionOescisionTitulo = 'Datos de las empresas escindente';
      this.subFusionOescisionTitulo = 'Datos de las empresas escindidas';
      this.fechaInicioInput.labelNombre = 'Fecha en que surte efecto la escisión';
      this.store.setNumeroTotalCarros(0);
    }
    const VALOR = Number(ev);
    this.divCompletoVisible = VALOR === 1 || VALOR === 0;


  }

  /** Muestra u oculta los bloques de certificación según la opción elegida */
  mostrarCertificacionFusionada(ev: string | number, ismodel?: string): void {
    this.conCertificacionPrincipalVisible = ev === '1';
    this.store.setCantidadBienes(ev === '1' ? 1 : 0);

    if (ismodel === 'isModel') {
      this.sinCertificacionPrincipalVisible = ev === '1';
    }
  }

  /**
    * Maneja la selección de filas en la tabla de seleccionadas.
    * 
    * Este método asigna la fila seleccionada a `seleccionadasFila`.
    * 
    * @param {EscisionHeaderItem} evento - La fila seleccionada en la tabla de mercancías seleccionadas.
    */
  seleccionDeFilas(evento: EscisionHeaderItem): void {
    this.seleccionadasFila = evento;
  }
  /**
   * Modifica la fila seleccionada en la tabla de mercancías seleccionadas.
   * 
   * Este método actualiza el formulario con los valores de la fila seleccionada y muestra el modal de fracciones.
   * 
   * @param {FraccionGridItem} seleccionadasTablaDatos - La fila seleccionada en la tabla de mercancías seleccionadas.
   */
  modificarSeleccionada(seleccionadasTablaDatos?: EscisionHeaderItem): void {
    const FORM_VALUES = seleccionadasTablaDatos;
    if (this.ModificarFusionEscisionInstance && this.seleccionadasFila) {
      this.ModificarFusionEscisionInstance?.show();
    }
    if (FORM_VALUES) {
      this.personaFusionEscisionModal.patchValue({
        id: FORM_VALUES.id || this.fusionEscisionHeader.length + 1,
        registroFederalDeContribuyentes: FORM_VALUES.rfc,
        denominacionORazonSocial: FORM_VALUES.razon_social,
        folioVucemUltimaCertificacion: FORM_VALUES.num_folio_tramite,
        fechaInicioVigenciaUltimaCertificacion: FORM_VALUES.fecha_inicio_vigencia,
        fechaFinVigenciaUltimaCertificacion: FORM_VALUES.fecha_fin_vigencia,
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
  eliminarSeleccionada(id: number): void {
    const INDEX = this.fusionEscisionHeader.findIndex(item => Number(item.id) === id);
    if (INDEX !== -1) {
      this.fusionEscisionHeader = this.fusionEscisionHeader.filter(item => Number(item.id) !== id);
      this.seleccionadasFila = null;
      this.store.setFusionEscisionHeader(this.fusionEscisionHeader);
    }
  }

  /** Carga los datos de persona fusionada desde el query del store hacia el modal */
  ModelcargarDatosPersonaFusion(): void {
    this.AvisoModifyService.cargarDatosPersonaFusion()
      .pipe(
        takeUntil(this.destroy$),
        map((resp) => {
          this.personaFusionEscisionModal.patchValue({
            registroFederalDeContribuyentes: resp.registroFederalDeContribuyentes,
            denominacionORazonSocial: resp.denominacionORazonSocial,
            folioVucemUltimaCertificacion: resp.folioVucemUltimaCertificacion,
            fechaInicioVigenciaUltimaCertificacion: FusionOescisionComponent.formatFechaToInputDate(resp.fechaInicioVigenciaUltimaCertificacion),
            fechaFinVigenciaUltimaCertificacion: FusionOescisionComponent.formatFechaToInputDate(resp.fechaFinVigenciaUltimaCertificacion)
          });
        })
      )
      .subscribe();

  }

  /**
   * Loads and populates the fusion or escision person's data into the form.
   *
   * This method retrieves the RFC (Registro Federal de Contribuyentes) value from the `personaFusionEscisionDTO` form group,
   * then calls the `getEmpresaDetails` method of `AvisoModifyService` to fetch company details associated with the RFC.
   * If the response code is '00', it updates the form group with the company's social denomination, last certification folio,
   * and the start and end dates of the last certification's validity.
   *
   * The observable is automatically unsubscribed when the component is destroyed.
   */
  cargarDatosPersonaFusion(): void {
    const RFC = this.personaFusionEscisionDTO.get('registroFederalDeContribuyentes')?.value;
    this.AvisoModifyService.getEmpresaDetails(RFC)
      .pipe(
        takeUntil(this.destroy$),
        map((resp) => {
          if (resp.codigo === '00') {
            this.personaFusionEscisionDTO.patchValue({
              denominacionORazonSocial: resp.datos.razon_social,
              folioVucemUltimaCertificacion: resp.datos.num_folio_tramite,
              fechaInicioVigenciaUltimaCertificacion: resp.datos.fecha_inicio_vigencia,
              fechaFinVigenciaUltimaCertificacion: resp.datos.fecha_fin_vigencia
            });
            const NUEVA_FUSION_ESCISION_ITEM: any = {
              rfc: RFC,
              razon_social: resp.datos.razon_social,
              num_folio_tramite: resp.datos.num_folio_tramite,
              fecha_inicio_vigencia: resp.datos.fecha_inicio_vigencia,
              fecha_fin_vigencia: resp.datos.fecha_fin_vigencia,
            };
            this.fusion =  [NUEVA_FUSION_ESCISION_ITEM] ;
            this.store.setFusion(this.fusion);
          }

        })
      )
      .subscribe();

  }
  /**
   * Searches for company details using the RFC (Registro Federal de Contribuyentes) value
   * from the `personaFusionEscisionModal` form. If the service returns a successful response,
   * it updates the form with the company's social denomination, last certification folio,
   * and certification validity dates.
   *
   * @remarks
   * This method uses the `AvisoModifyService` to fetch company details and updates the form
   * fields accordingly. The observable is automatically unsubscribed when the component is destroyed.
   *
   * @returns void
   */
  searchRFC(): void {
    const RFC = this.personaFusionEscisionModal.get('registroFederalDeContribuyentes')?.value;
    this.AvisoModifyService.getEmpresaDetails(RFC)
      .pipe(
        takeUntil(this.destroy$),
        map((resp) => {
          if(resp.codigo === '00'){
            this.personaFusionEscisionModal.patchValue({
              denominacionORazonSocial: resp.datos.razon_social,
              folioVucemUltimaCertificacion: resp.datos.num_folio_tramite,
              fechaInicioVigenciaUltimaCertificacion: resp.datos.fecha_inicio_vigencia,
              fechaFinVigenciaUltimaCertificacion: resp.datos.fecha_fin_vigencia
            });

          }

        })
      )
      .subscribe();

  }

  /**
   * Retrieves the grid headers for the Fusion/Escision process by calling the `gridsubFusionOescision` method
   * from the `AvisoModifyService`. The response is expected to be of type `TableDataNgTable`, and the table headers
   * are assigned to `gridFusionEscisionHeader`. The observable is automatically unsubscribed when `destroy$` emits.
   */
  getGridsubFusionOescision(): void {
    this.AvisoModifyService.gridsubFusionOescision()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: TableDataNgTable) => {
        this.gridFusionEscisionHeader = resp.tableHeader; // Asigna los encabezados para los domicilios nuevos
      });
  }

  /** Getter del grupo de persona fusionada en el formulario principal */
  get personaFusionEscisionDTO(): FormGroup {
    return this.formulario.get('personaFusionEscisionDTO') as FormGroup;
  }

  /** Getter del grupo de persona fusionada en el formulario del modal */
  get mpersonaFusionEscisionDTO(): FormGroup {
    return this.modelFormulario.get('personaFusionEscisionDTO') as FormGroup;
  }

  /** Getter del grupo de persona fusionada en el formulario del modal */
  get personaFusionEscisionModal(): FormGroup {
    return this.modelFormulario.get('personaFusionEscisionModal') as FormGroup;
  }

  /** Cambia la cantidad de elementos por página y actualiza la tabla */
  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }

  /** Cambia la página actual en la tabla y actualiza la vista */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  /** Realiza el corte de datos para mostrar la tabla paginada */
  updatePagination(): void {
    const START_INDEX = (this.currentPage - 1) * this.itemsPerPage;
    this.miembroDeLaEmpresaBodyData = this.miembroDeLaEmpresaBodyData.slice(
      START_INDEX,
      START_INDEX + this.itemsPerPage
    );
  }
  /**
   * Formatea una fecha de entrada en formato 'YYYY/MM/DD' a 'YYYY-MM-DD'.
   * @param fecha - Fecha en formato 'YYYY/MM/DD'.
   * @returns Fecha formateada en 'YYYY-MM-DD'.
   */
  static formatFechaToInputDate(fecha: string): string {
    // Convierte '2025/03/08' → '2025-03-08'
    if (!fecha) { return ''; }

    const PARTS = fecha.includes('/') ? fecha.split('/') : fecha.split('-');

    if (PARTS.length === 3) {
      const [DAY, MONTH, YEAR] = PARTS;
      return `${YEAR}-${MONTH.padStart(2, '0')}-${DAY.padStart(2, '0')}`;
    }
    return '';
  }

  /** Abre el modal de modificación de fusión o escisión */
  abrirModalFusionEscision(): void {
    if (this.ModificarFusionEscisionInstance) {
      this.ModificarFusionEscisionInstance.show();
    }
  }

  /** Cierra el modal y actualiza los datos mostrados en la tabla */
  nuevaFusionEscisionModal(form: FormGroup): void {

    const FORM_VALUES = form.getRawValue();

    const NUEVA_FUSION_ESCISION_ITEM: EscisionHeaderItem = {
      id: this.seleccionadasFila?.id ?? FORM_VALUES.id ?? this.fusionEscisionHeader.length + 1,
      rfc: FORM_VALUES.registroFederalDeContribuyentes,
      razon_social: FORM_VALUES.denominacionORazonSocial,
      num_folio_tramite: FORM_VALUES.folioVucemUltimaCertificacion,
      fecha_inicio_vigencia: FORM_VALUES.fechaInicioVigenciaUltimaCertificacion,
      fecha_fin_vigencia: FORM_VALUES.fechaFinVigenciaUltimaCertificacion,
    };

    const INDEX = this.fusionEscisionHeader.findIndex(
      item => item.id === NUEVA_FUSION_ESCISION_ITEM.id
    );

    if (INDEX !== -1) {
      this.fusionEscisionHeader = this.fusionEscisionHeader.map((item, i) =>
        i === INDEX ? NUEVA_FUSION_ESCISION_ITEM : item
      );
    } else {
      this.fusionEscisionHeader = [
        ...this.fusionEscisionHeader,
        NUEVA_FUSION_ESCISION_ITEM
      ];
    }
    this.store.setFusionEscisionHeader(this.fusionEscisionHeader);
    this.seleccionadasFila = null;

    if (this.ModificarFusionEscisionInstance) {
      this.ModificarFusionEscisionInstance.hide();
      this.divCompletoVisible = true;
    }
    this.personaFusionEscisionModal.reset();
  }

  /** Cierra el modal de fusión o escisión */
  closeFusionEscisionModal(): void {
    if (this.ModificarFusionEscisionInstance) {
      this.ModificarFusionEscisionInstance.hide();
    }
  }

  /** Abre el modal de confirmación */
  openCorrectamenteModel(): void {
    this.correctamenteNotificacion = {
      /**
       * Tipo de notificación: alerta.
       */
      tipoNotificacion: 'alert',

      /**
       * Categoría de la notificación: peligro (danger).
       */
      categoria: 'success',

      /**
       * Modo de la notificación: acción requerida.
       */
      modo: 'action',

      /**
       * Título de la notificación (actualmente vacío).
       */
      titulo: '',

      /**
       * Mensaje de la notificación, indicando que Datos guardados correctamente.
       */
      mensaje: 'Datos guardados correctamente.',

      /**
       * Indica si la notificación debe cerrarse automáticamente (false = no se cerrará).
       */
      cerrar: false,

      /**
       * Tiempo de espera antes de cerrar la notificación (2000 milisegundos).
       */
      tiempoDeEspera: 2000,

      /**
       * Texto del botón de aceptación en la notificación.
       */
      txtBtnAceptar: 'Aceptar',

      /**
       * Texto del botón de cancelación en la notificación (actualmente vacío).
       */
      txtBtnCancelar: '',
    };
  }

  /** Destruye las suscripciones al finalizar el componente */
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
}

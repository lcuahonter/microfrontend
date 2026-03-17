import { AlertComponent, Catalogo, CatalogoSelectComponent, CatalogoServices, CatalogosSelect, ConfiguracionColumna, InputFecha, Notificacion, NotificacionesComponent, Pedimento, REGEX_CANTIDAD_15_4, REGEX_NUMERO_15_ENTEROS_4_DECIMALES, REGEX_NUMERO_ENTERO, REGEX_SIN_DIGITOS, REGEX_SOLO_DIGITOS, TablaDinamicaComponent, TablaSeleccion, TableBodyData, TableComponent, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { ColumnasTabla, FECHAFACTURA, FECHAFINAL, FECHAINICIAL, OPTIONS_PAIS, OPTIONS_TIPO_FACTURA, OPTIONS_TRATADO, OPTIONS_UMC, OPTIONS_UNIDAD_MEDIDA, SeleccionadasTabla } from '../../models/registro.model';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HEADERS_DATA, HEADER_MAP_DATOS } from '../../enum/certificado.enum';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud110201State, Tramite110201Store } from '../../state/Tramite110201.store';
import { CommonModule } from '@angular/common';
import { InputFechaComponent } from '@libs/shared/data-access-user/src/tramites/components/input-fecha/input-fecha.component';
import { Modal } from 'bootstrap';
import { RegistroService } from '../../services/registro.service';
import { Tramite110201Query } from '../../state/Tramite110201.query';
import mercanciaDisponsibleTable from '@libs/shared/theme/assets/json/110201/mercancia-disponsible.json';
import mercanciaSeleccionadasTable from '@libs/shared/theme/assets/json/110201/mercancias-seleccionadas.json';
import mercanciaTable from '@libs/shared/theme/assets/json/110201/mercancia.json';

const TERCEROS_TEXTO_DE_ALERTA =
  'Para continuar con el trámite, debes agregar por lo menos una mercancía.';

/**
 * @component CertificadoDeOrigenComponent (Enhanced)
 * @description Componente responsable de gestionar el formulario de certificado de origen en el trámite 110201.
 * Proporciona funcionalidades para captura de datos del certificado, gestión de mercancías y validaciones.
 * Incluye formularios reactivos, tablas dinámicas, modales y manejo de archivos CSV.
 * @implements OnInit, OnDestroy
 * @features
 * - Formularios reactivos con validaciones
 * - Gestión de mercancías disponibles y seleccionadas
 * - Modal para agregar/editar mercancías
 * - Carga masiva de mercancías via CSV
 * - Validación de fechas y datos
 * - Integración con catálogos de países, tratados y unidades
 * @dependencies FormBuilder, Store, ValidacionesService, RegistroService
 */
@Component({
  selector: 'app-certificado-de-origen',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    TableComponent,
    AlertComponent,
    TablaDinamicaComponent,
    InputFechaComponent,
    NotificacionesComponent
  ],
  templateUrl: './certificado-de-origen.component.html',
  styleUrl: './certificado-de-origen.component.css',
})
export class CertificadoDeOrigenComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * @property consultaDatos - Estado de consulta de datos para el componente
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property soloLectura - Indica si el formulario está en modo solo lectura
   * Cuando es `true`, los campos del formulario no se pueden editar
   */
  soloLectura: boolean = false;

  /**
   * @property dataEvent - Evento para comunicar datos al componente padre
   */
  @Output() dataEvent = new EventEmitter<boolean>();

  /**
   * @property TEXTO_DE_ALERTA - Texto de alerta mostrado en el componente
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;

  /**
   * @property registroForm - Formulario reactivo para los datos del certificado
   */
  registroForm!: FormGroup;

  /**
   * @property mercanciaForm - Formulario reactivo para los datos de la mercancía
   */
  mercanciaForm!: FormGroup;

  /**
   * @property modalAgregar - Referencia al modal para agregar/editar mercancía
   */
  @ViewChild('modalAgregar') modalAgregar!: ElementRef;

  /**
   * @property pais - Catálogo de países disponibles
   */
  pais!: CatalogosSelect;

  /**
   * @property tratado - Catálogo de tratados comerciales
   */
  tratado!: CatalogosSelect;

  /**
   * @property umc - Catálogo de unidades de medida comercial (UMC)
   */
  umc!: CatalogosSelect;

  /**
   * @property unidadMedida - Catálogo de unidades de medida
   */
  unidadMedida!: CatalogosSelect;

  /**
   * @property tipoFactura - Catálogo de tipos de factura
   */
  tipoFactura!: CatalogosSelect;

  /**
   * @property cargarArchivo - Indica si se debe mostrar el formulario para cargar un archivo
   */
  cargarArchivo: boolean = false;

  /**
   * @property mostrarErrores - Indica si se deben mostrar errores en el formulario
   */
  mostrarErrores: boolean = false;

  /**
   * @property mostrarErrorMercancias - Indica si se deben mostrar errores para mercancías seleccionadas
   */
  mostrarErrorMercancias: boolean = false;

  /**
   * @property hayMercanciasDisponibles - Indica si hay mercancías disponibles
   */
  hayMercanciasDisponibles: boolean = false;

  /**
   * @property esMercanciaEnEdicion - Indica si se está editando una mercancía
   */
  esMercanciaEnEdicion = false;

  /**
   * @property getMercanciaDisponsibleTableData - Datos de la tabla de mercancías disponibles
   */
  public getMercanciaDisponsibleTableData = mercanciaDisponsibleTable;

  /**
   * @property getmercanciaSeleccionadasTable - Datos de la tabla de mercancías seleccionadas
   */
  public getmercanciaSeleccionadasTable = mercanciaSeleccionadasTable;

  /**
   * @property getMercanciaTable - Datos de la tabla de mercancías
   */
  public getMercanciaTable = mercanciaTable;

  /**
   * @property mercanciasdisponibles - Lista de mercancías disponibles
   */
  public mercanciasdisponibles: string[] = [];

  /**
   * @property encabezadosTablas - Encabezados de las tablas
   */
  public encabezadosTablas: string[] = [];

  /**
   * @property mercanciasHeader - Encabezados de la tabla de mercancías
   */
  public mercanciasHeader: string[] = [];

  /**
   * @property mercanciasBody - Cuerpo de la tabla de mercancías
   */
  public mercanciasBody: TableBodyData[] = [];

  /**
   * @property solicitudState - Estado actual de la solicitud del trámite 110201
   */
  public solicitudState!: Solicitud110201State;

  /**
   * @property TablaSeleccion - Tabla de selección de mercancías
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * @property Tratadodescripcion - Descripciones de los tratados comerciales
   */
  Tratadodescripcion: unknown[] = [];

  /**
   * @property unidadMedidaValue - Valores de las unidades de medida
   */
  unidadMedidaValue: unknown[] = [];

  /**
   * @property seleccioneTratado - Tratado comercial seleccionado
   */
  seleccioneTratado: string | null = null;

  /**
   * @property nombreArchivo - Nombre del archivo seleccionado para carga
   */
  nombreArchivo: string = '';

  /**
   * @property fechaInicialInput - Configuración de la fecha inicial
   * Representa la configuración del campo de entrada para la fecha inicial en el formulario
   */
  fechaInicialInput: InputFecha = FECHAINICIAL;

  /**
   * @property fechaFinalInput - Configuración de la fecha final
   * Representa la configuración del campo de entrada para la fecha final en el formulario
   */
  fechaFinalInput: InputFecha = FECHAFINAL;

  /**
   * @property fechaFacturaInput - Configuración de la fecha de la factura
   * Representa la configuración del campo de entrada para la fecha de la factura en el formulario
   */
  fechaFacturaInput: InputFecha = FECHAFACTURA;

  /**
   * @property esFormulario - Indica si se está mostrando el formulario
   */
  esFormulario: boolean = false;

  /**
   * @property destroyed$ - Notificador para destruir observables al destruir el componente
   * Se utiliza para gestionar la cancelación de suscripciones activas y evitar fugas de memoria
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * @property optionsTratado - Opciones del catálogo de tratados comerciales
   * Contiene una lista de objetos del catálogo de tratados obtenidos desde el servicio
   */
  public optionsTratado = OPTIONS_TRATADO;

  /**
   * @property optionsPais - Opciones del catálogo de países
   * Contiene una lista de objetos del catálogo de países obtenidos desde el servicio
   */
  public optionsPais = OPTIONS_PAIS;

  /**
   * @property optionsUMC - Opciones del catálogo de unidades de medida comercial (UMC)
   * Contiene una lista de objetos del catálogo de UMC obtenidos desde el servicio
   */
  public optionsUMC = OPTIONS_UMC;

  /**
   * @property optionsUnidadMedida - Opciones del catálogo de unidades de medida
   * Contiene una lista de objetos del catálogo de unidades de medida obtenidos desde el servicio
   */
  optionsUnidadMedida = OPTIONS_UNIDAD_MEDIDA;

  /**
   * @property optionsTipoFactura - Opciones del catálogo de tipos de factura
   * Contiene una lista de objetos del catálogo de tipos de factura obtenidos desde el servicio
   */
  optionsTipoFactura = OPTIONS_TIPO_FACTURA;

  /**
   * @property mercanciaDisponsiblesTablaDatos - Datos de la tabla de mercancías disponibles
   * Representa una lista de objetos que contienen información sobre las mercancías disponibles para selección
   */
  public mercanciaDisponsiblesTablaDatos: ColumnasTabla[] = [];

  /**
   * @property mercanciaSeleccionadasTablaData - Datos de la tabla de mercancías seleccionadas
   * Representa una lista de objetos que contienen información sobre las mercancías seleccionadas por el usuario
   */
  public mercanciaSeleccionadasTablaData: SeleccionadasTabla[] = [];

  /**
   * @property nuevaNotificacion - Notificación utilizada para mostrar mensajes o alertas en la interfaz
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * @property pedimentos - Arreglo que contiene los pedimentos registrados
   */
  public pedimentos: Array<Pedimento> = [];

  /**
   * @property elementoParaEliminar - Índice del pedimento marcado para eliminación
   */
  public elementoParaEliminar!: number;
  /**
   * @property seleccionados - Arreglo que contiene las mercancías seleccionadas
   */
  public seleccionados: SeleccionadasTabla[] = [];
  /**
   * @property mercanciasTablaDatos - Arreglo que contiene los datos de la tabla de mercancías
   */
  mercanciasTablaDatos: SeleccionadasTabla[] = [];
  /**
   * @property ischecked - Indica si un elemento está seleccionado
   */
  ischecked: boolean = false;

  /**
   * @property mostrarMensajeError
   * Bandera que indica si se debe mostrar un mensaje de error al usuario.
   */
  public mostrarMensajeError: boolean = false;

  /**
   * @property selectedRow
   * Almacena la fila seleccionada en la tabla de mercancías.
   */
  selectedRow!: SeleccionadasTabla;
  /**
   * Indica si el componente está actualmente activo.
   * Este input puede usarse para controlar el estado o la visibilidad del componente.
   * @default false
   */
  @Input() active = false;
  /**
   * @property headers - Configuración de las columnas de la tabla de mercancías disponibles
   * Define los encabezados y las claves asociadas a cada columna de la tabla de mercancías disponibles
   */
  public headers: ConfiguracionColumna<ColumnasTabla>[] = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: ColumnasTabla) => ele.fraccionArancelaria,
      orden: 1,
    },
    {
      encabezado: 'Nombre técnico',
      clave: (ele: ColumnasTabla) => ele.nombreTecnico,
      orden: 2,
    },
    {
      encabezado: 'Nombre comercial',
      clave: (ele: ColumnasTabla) => ele.nombreComercial,
      orden: 3,
    },
    {
      encabezado: 'Número de registro de productos',
      clave: (ele: ColumnasTabla) => ele.numeroRegistroProducto,
      orden: 4,
    },
    {
      encabezado: 'Fecha expedición',
      clave: (ele: ColumnasTabla) => ele.fechaExpedicion,
      orden: 5,
    },
    {
      encabezado: 'Fecha vencimiento',
      clave: (ele: ColumnasTabla) => ele.fechaVencimiento,
      orden: 6,
    },
  ];

  /**
   * @property headersData - Configuración de las columnas de la tabla de mercancías seleccionadas
   * Define los encabezados y las claves asociadas a cada columna de la tabla de mercancías seleccionadas
   */
  public headersData = HEADERS_DATA;

  /**
   * @property mostrarCargarArchivoTable - Bandera para mostrar la tabla de cargar archivo
   */
  mostrarCargarArchivoTable: boolean = false;

  /**
   * @property datosTabla - Define los datos que se mostrarán en la tabla dinámica
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datosTabla: any[] = [];

  /**
   * @property closeModal - Referencia al botón para cerrar el modal
   * Se utiliza para cerrar el modal de manera programada
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * @property modalInstances - Referencia al elemento del modal de modificación
   * Se utiliza para abrir o cerrar el modal de modificación de mercancías
   */
  modalInstances: Modal | null = null;

  /**
   * @property mostrarErrorRegistro - Indica si se debe mostrar un mensaje de error relacionado con el registro
   * Cuando es `true`, se muestra el error de registro en la interfaz de usuario
   */
  mostrarErrorRegistro: boolean = false;

  /**
   * @property validationAttempted - Indica si se ha intentado validar el formulario
   * Se usa para mostrar errores de validación aunque el campo no haya sido tocado
   */
  validationAttempted: boolean = false;

  /** ID del trámite actual */
  TramitesID: string = '110201';

  /** Tratado asociado al certificado de origen */
  tratadoAsociado: string = 'TITRAC.TA';

  /**
   * @constructor Constructor del componente CertificadoDeOrigenComponent
   * @param registroService - Servicio para obtener datos de catálogos
   * @param fb - Constructor de formularios reactivos de Angular
   * @param store - Tienda para gestionar el estado del trámite 110201
   * @param query - Query para consultas del estado del trámite
   * @param validacionesService - Servicio para validaciones de formularios
   * @param consultaioQuery - Query para consultas de estado de consulta
   */
  constructor(
    private registroService: RegistroService,
    public fb: FormBuilder,
    public store: Tramite110201Store,
    private query: Tramite110201Query,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
    private catalogoServices: CatalogoServices
  ) { }

  /**
   * Método del ciclo de vida que se ejecuta cuando cambia alguna propiedad enlazada por datos.
   * Ejecuta lógica cuando la propiedad 'active' cambia, disparando métodos de obtención de datos.
   *
   * @param changes - Objeto con pares clave/valor que representan las propiedades cambiadas.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue) {
      // this.getPaises();
      // this.getTratadoCertificado();
    }
  }
  /**
   * @method ngOnInit - Método del ciclo de vida que se ejecuta al inicializar el componente
   * Configura los formularios y obtiene los catálogos necesarios
   */
  ngOnInit(): void {
    this.mercanciatable();
    this.inicializarEstadoFormulario();
      this.getTratadoCertificado();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.mercanciaSeleccionadasTablaData = this.solicitudState.mercanciaSeleccionadasTablaData || [];
          this.mercanciaDisponsiblesTablaDatos = this.solicitudState.mercancias_disponibles || [];
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.donanteDomicilio();
  }

  /**
   * @method manejarClic - Maneja el evento de clic para habilitar el formulario de edición
   * @param _row - Fila seleccionada
   */
  manejarClic(_row: unknown): void {
    this.esFormulario = true;
  }

  /**
   * @method validarDestinatarioFormulario - Valida el formulario del destinatario
   * Marca todos los campos como tocados si el formulario es inválido
   */
  validarDestinatarioFormulario(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
    }
  }

  /**
   * @method validarMercanciaForm - Valida el formulario de mercancías
   * Marca todos los campos como tocados si el formulario es inválido
   */
  validarMercanciaForm(): void {
    if (this.mercanciaForm.invalid) {
      this.mercanciaForm.markAllAsTouched();
    }
  }
  /**
   * @method validarFormularios - Valida todos los formularios del componente 
   * @returns boolean
   * Valida todos los formularios del componente `CertificadoDeOrigenComponent`.
   * Si alguno de los formularios es inválido, marca todos los campos como tocados para mostrar los errores de validación.
   * Retorna `true` si todos los formularios son válidos, de lo contrario retorna `false`.
   */
  validarFormularios(): boolean {
    this.validationAttempted = true;
    let isValid = true;

    this.mostrarErrorMercancias = false;

    if (!this.registroForm.valid) {
      this.registroForm.markAllAsTouched();
      isValid = false;
    }

    if (!this.mercanciaSeleccionadasTablaData || this.mercanciaSeleccionadasTablaData.length === 0) {
      this.mostrarErrorMercancias = true;
      isValid = false;
    }
    if (!this.mercanciaDisponsiblesTablaDatos || this.mercanciaDisponsiblesTablaDatos.length === 0) {
      this.mostrarErrorMercancias = true;
      isValid = false;
    }
    return isValid;
  }
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.soloLectura) {
      this.registroForm.disable();
      this.mercanciaForm.disable();
    } else {
      this.registroForm.enable();
      this.mercanciaForm.enable();
    }
  }
  /**
   * Actualiza la fecha inicial en el formulario reactivo y en el estado de la tienda.
   * @param nuevo_fechaIncial Nueva fecha inicial seleccionada.
   */
  cambioFechaInicial(nuevo_fechaIncial: string): void {
    this.registroForm.patchValue({
      validacionForm: {
        fechaInicial: nuevo_fechaIncial,
      },
    });
    this.setValoresStore(this.validacionForm, 'fechaInicial', 'setFechInicioB');
  }
  /**
   * Actualiza la fecha final en el formulario reactivo y en el estado de la tienda.
   * @param nuevo_fechaFinal Nueva fecha final seleccionada.
   */
  cambioFechaFinal(nuevo_fechaFinal: string): void {
    this.registroForm.patchValue({
      validacionForm: {
        fechaFinal: nuevo_fechaFinal,
      },
    });

    this.setValoresStore(this.validacionForm, 'fechaFinal', 'setFechFinB');
  }
  /**
   * Actualiza la fecha de la factura en el formulario reactivo y en el estado de la tienda.
   * @param nuevo_fechaFin Nueva fecha de la factura seleccionada.
   */
  cambioFechaFactura(nuevo_fechaFin: string): void {
    this.mercanciaForm.patchValue({
      validacionMercanciaForm: {
        fecha: nuevo_fechaFin,
      },
    });
    this.setValoresStore(this.validacionMercanciaForm, 'fecha', 'setFecha');
  }

  /**
   * Maneja el cambio en el catálogo de tratados.
   * @param event Objeto del catálogo de tratados seleccionado.
   */
  onTratadoChange(event: Catalogo): void {
    this.store.setTratadoDescripciones(event.descripcion);
     if (event.clave !== undefined) {
      this.getPaisBloque(event.clave);
    }
  }

  /**
   * Maneja el cambio en el catálogo de países.
   * @param event Objeto del catálogo de países seleccionado.
   */
  onPaisChange(event: Catalogo): void {
    this.store.setPaisDescripcion(event.descripcion);
  }

  /**
   * Busca mercancías disponibles basándose en la descripción del tratado.
   * Verifica si la lista `tratadoDescripcion` incluye el valor '1' para determinar si hay mercancías disponibles.
   * Si el valor está presente, establece `hayMercanciasDisponibles` en `true`; de lo contrario, lo establece en `false`.
  /**
   * @method buscarMercancias - Busca mercancías basado en los datos del formulario
   * Además, actualiza los catálogos necesarios llamando a los métodos de obtención de catálogos
   */
  buscarMercancias(): void {
    const PAYLOAD = {
      rfcExportador: "AAL0409235E6",
      tratadoAcuerdo: { idTratadoAcuerdo: this.solicitudState?.tratado || '105' },
      pais: { cvePais: this.solicitudState?.pais || 'ARG' }
    };

    this.registroService.buscarMercanciasCert(PAYLOAD).subscribe(response => {
      this.mercanciaDisponsiblesTablaDatos = Array.isArray(response.data) ? response.data as ColumnasTabla[] : [];
      this.store.setMercanciaTabla(this.mercanciaDisponsiblesTablaDatos);
    });
    this.hayMercanciasDisponibles = true;
  }

  /**
   * @method abrirModalMercancia - Abre el modal para agregar una mercancía desde la tabla de mercancías disponibles
   * @param rowData - Datos de la fila seleccionada de tipo ColumnasTabla
   */
  abrirModalMercancia(rowData: ColumnasTabla): void {
    if (rowData) {
      this.esFormulario = true;
      this.esMercanciaEnEdicion = false;
      this.getUmc();
      this.getUnidadMedidaCertificado();
      this.getTipoFacturaCertificado();

      this.mercanciaForm.markAsUntouched();
      this.mercanciaForm.patchValue({
        validacionMercanciaForm: {
          fraccionMercanciaArancelaria: rowData.fraccionArancelaria || '',
          nombreTecnico: rowData.nombreTecnico || '',
          nombreComercialDelaMercancia: rowData.nombreComercial || '',
          cantidad: '',
          valorDelaMercancia: '',
          tipoFactura: '',
          numeroFactura: '',
          complementoDelaDescripcion: '',
          fecha: rowData.fechaVencimiento || '',
          marca: '',
          umc: '',
          masaBruta: '',
          unidadMedida: '',
          numeroRegistroProducto: rowData.numeroRegistroProducto || '',
          criterioParaConferir: rowData.criterioOrigen || '',
          nombreEnIngles: rowData.nombreComercial || '',
        },
      });
      if (!this.modalInstances) {
        this.modalInstances = new Modal(this.modalAgregar.nativeElement, {
          backdrop: 'static',
          focus: true
        });
      }
      this.modalInstances?.show();
    }
  }

  /**
   * Agrega una mercancía al formulario.
   */
  agregar(): void {
    if (this.mercanciaForm.invalid) {
      this.mostrarErrorRegistro = true;
      this.mercanciaForm.markAllAsTouched();
      return;
    }
    this.mostrarErrorRegistro = false;

    const FORM_VALUES = this.mercanciaForm.value.validacionMercanciaForm;

    const NEW_ITEM: ColumnasTabla = {
      fraccionArancelaria: FORM_VALUES.fraccionMercanciaArancelaria,
      nombreTecnico: FORM_VALUES.nombreTecnico,
      nombreComercial: FORM_VALUES.nombreComercialDelaMercancia,
      numeroRegistroProducto: FORM_VALUES.numeroRegistroProducto || '',
      fechaExpedicion: FORM_VALUES.fechaExpedicion || '',
      fechaVencimiento: FORM_VALUES.fechaVencimiento || ''
    };

    const IDX = this.mercanciaDisponsiblesTablaDatos.findIndex(
      it => it.fraccionArancelaria === NEW_ITEM.fraccionArancelaria
    );

    if (IDX > -1) {
      this.mercanciaDisponsiblesTablaDatos[IDX].nombreTecnico = NEW_ITEM.nombreTecnico;
    } else {
      this.mercanciaDisponsiblesTablaDatos.push(NEW_ITEM);
    }

    const SELECTED_ITEM = {
      id: !this.selectedRow ? this.mercanciaSeleccionadasTablaData.length : this.selectedRow.id,
      fraccionArancelaria: FORM_VALUES.fraccionMercanciaArancelaria,
      cantidad: FORM_VALUES.cantidad,
      unidadMedida: FORM_VALUES.unidadMedida?.toString() || '',
      valorMercancia: FORM_VALUES.valorDelaMercancia,
      nombreTecnico: FORM_VALUES.nombreTecnico,
      nombreComercial: FORM_VALUES.nombreComercialDelaMercancia,
      numeroRegistroProducto: FORM_VALUES.numeroRegistroProducto || '',
      fechaExpedicion: FORM_VALUES.fechaExpedicion || '',
      fechaVencimiento: FORM_VALUES.fechaVencimiento || '',
      tipoFactura: FORM_VALUES.tipoFactura?.toString() || '',
      numFactura: FORM_VALUES.numeroFactura,
      complementoDescripcion: FORM_VALUES.complementoDelaDescripcion,
      fechaFactura: FORM_VALUES.fecha || ''
    };

    if (this.selectedRow) {
      this.mercanciaSeleccionadasTablaData = this.mercanciaSeleccionadasTablaData.map(item =>
        item.id === this.selectedRow.id ? SELECTED_ITEM : item
      );
    } else {
      this.mercanciaSeleccionadasTablaData = [
        ...this.mercanciaSeleccionadasTablaData,
        SELECTED_ITEM
      ];
    }
    this.store.setDatosMercancia(this.mercanciaSeleccionadasTablaData);
    this.store.setMercanciaTabla(this.mercanciaDisponsiblesTablaDatos);
    this.mostrarErrorMercancias = false;

    this.esMercanciaEnEdicion = true;
    this.esFormulario = true;
    this.cerrarModal();
  }

  /**
   * Cierra el modal activo.
   *
   * Este método utiliza la referencia al botón de cierre del modal para cerrarlo.
   */
  cerrarModal(): void {
    this.mostrarErrorRegistro = false;
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Cancela la edición de una mercancía.
   */
  cancelar(): void {
    this.esMercanciaEnEdicion = true;
    this.esFormulario = false;
    this.cerrarModal();
  }
  /**
   * Modifica una mercancía existente.
   */
  modificar(): void {
    if (!this.selectedRow) {

      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'info',
        titulo: 'Selección requerida',
        mensaje: 'Debes seleccionar una mercancía',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarMensajeError = true;
    } else {
      this.abrirModalModificar();

    }
  }
  /**
   * Indica si se debe mostrar un mensaje de error.
   * Cuando es `true`, se muestra el mensaje de error en la interfaz de usuario.
   */
  abrirModalModificar(): void {
    this.getUmc();
    this.getUnidadMedidaCertificado();
    this.getTipoFacturaCertificado();
    if (!this.modalInstances) {
      this.modalInstances = new Modal(this.modalAgregar.nativeElement, {
        backdrop: 'static',
        focus: true
      });
    }
    this.modalInstances?.show();
  }
  /**
   * Configura los encabezados y el cuerpo de la tabla de mercancías.
   * Asigna los valores de los encabezados y el cuerpo de la tabla desde los datos obtenidos.
   */
  public mercanciatable(): void {
    this.mercanciasHeader = this.getMercanciaTable.tableHeader;
    this.mercanciasBody = this.getMercanciaTable.tableBody;
  }
  /**
   * Activa el formulario para cargar un archivo.
   * Cambia el estado de la variable `cargarArchivo` a `true` para mostrar el formulario de carga de archivos.
   */
  cargaArchivo(): void {
    this.cargarArchivo = true;
    this.actualizarValidacionArchivo(true);
    this.dataEvent.emit(true);
  }

  /**
   * Actualiza las validaciones del campo de archivo en el formulario reactivo.
   * @param archivo Indica si se debe aplicar la validación de archivo.
   * Si es `true`, se agrega la validación `Validators.required`; si es `false`, se eliminan las validaciones.
   **/ 
  actualizarValidacionArchivo(archivo: boolean): void {
    this.registroForm.get('validacionForm.archivo')?.setValidators(archivo ? [Validators.required] : []);
    this.registroForm.get('validacionForm.archivo')?.updateValueAndValidity();
  }
  /**
   * Analiza un archivo CSV y extrae los datos de mercancías.
   * @param csv Contenido del archivo CSV como una cadena de texto.
   * Procesa el contenido del archivo CSV, separando las líneas y los valores.
   * Mapea los datos a un formato estructurado y los asigna a la propiedad `mercanciaSeleccionadasTablaData`.
   * Si se encuentran mercancías válidas, desactiva la bandera de error `mostrarErrorMercancias`.
   */
  analizarGramaticalmenteCSV(csv: string): void {
    const LINES = csv.split('\n').filter((line) => line.trim() !== '');
    const HEADERS = LINES[0].split(',');
    const HEADER_MAP = HEADER_MAP_DATOS;
    const DATA = LINES.slice(1)
      .map((line) => {
        const VALUES = line.split(',');
        const OBJ: { [key: string]: string } = {};
        HEADERS.forEach((header, index) => {
          const KEY = HEADER_MAP[header.trim()] || header.trim();
          OBJ[KEY] = VALUES[index]?.trim();
        });
        return OBJ;
      })
      .filter((articulo) => Object.values(articulo).some((valor) => valor));
    this.mercanciaSeleccionadasTablaData = DATA.map((articulo) => ({
      fraccionArancelaria: articulo['fraccionArancelaria'] || '',
      cantidad: articulo['cantidad'] || '',
      unidadMedida: articulo['unidadMedida'] || '',
      valorMercancia: articulo['valorMercancia'] || '',
      nombreTecnico: articulo['nombreTecnico'] || '',
      nombreComercial: articulo['nombreComercial'] || '',
      numeroRegistroProducto: articulo['numeroRegistroProducto'] || '',
      fechaExpedicion: articulo['fechaExpedicion'] || '',
      fechaVencimiento: articulo['fechaVencimiento'] || '',
      tipoFactura: articulo['tipoFactura'] || '',
      numFactura: articulo['numFactura'] || '',
      complementoDescripcion: articulo['complementoDescripcion'] || '',
      fechaFactura: articulo['fechaFactura'] || ''
    }));
    this.store.setDatosMercancia(this.mercanciaSeleccionadasTablaData);

    if (this.mercanciaSeleccionadasTablaData.length > 0) {
      this.mostrarErrorMercancias = false;
    }
  }
  /**
   * Muestra errores en el formulario y desactiva la carga de archivos.
   * Cambia el estado de las variables `mostrarErrores` a `true` y `cargarArchivo` a `false`.
   */
  darError(): void {
    const FILE_INPUT = document.getElementById(
      'archivoAdjuntar'
    ) as HTMLInputElement;
    const FILE = FILE_INPUT.files?.[0];

    if (!FILE) {
      this.abrirModal();
      return;
    }

    if (FILE) {
      const READER = new FileReader();
      READER.onload = (e): void => {
        const TEXT = e.target?.result as string;
        this.analizarGramaticalmenteCSV(TEXT);
        this.esMercanciaEnEdicion = true;
      };
      READER.readAsText(FILE);
    }
    this.mostrarErrores = true;
    this.cargarArchivo = false;
    this.actualizarValidacionArchivo(false);
  }

  /**
   * Cierra el formulario para adjuntar un archivo de mercancías.
   * Cambia el estado de la variable `cargarArchivo` a `false` para ocultar el formulario de carga de archivos.
   */
  cerrarAdjuntarArchivoMercancias(): void {
    this.cargarArchivo = false;
    this.actualizarValidacionArchivo(false);
  }
  /**
   * Maneja el evento de selección de un archivo.
   * Obtiene el archivo seleccionado por el usuario y asigna su nombre a la propiedad `nombreArchivo`.
   * Si no se selecciona ningún archivo, asigna el mensaje "No se eligió ningún archivo".
   * @param event Evento que contiene la información del archivo seleccionado.
   */
  alSeleccionarArchivo(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const FILE = INPUT.files && INPUT.files[0];
    this.nombreArchivo = FILE ? FILE.name : 'No se eligió ningún archivo';
  }

  /**
   * Valida y formatea la entrada de fracción arancelaria.
   * Solo permite números y limita la entrada a 8 dígitos.
   * @param event Evento del input
   */
  onFraccionArancelariaInput(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    let valor = INPUT.value;

    valor = valor.replace(REGEX_SIN_DIGITOS, '');

    if (valor.length > 8) {
      valor = valor.substring(0, 8);
    }

    INPUT.value = valor;

    this.registroForm.patchValue({
      validacionForm: {
        fraccionArancelaria: valor
      }
    });

    this.setValoresStore(this.validacionForm, 'fraccionArancelaria', 'setFraccionArancelaria');
  }
  /**
   * Maneja el envío del formulario.
   */
  onSubmit(): void {
    if (this.registroForm.valid) {
      // Aquí se implementará la lógica para manejar el envío del formulario.
    }
  }
  /**
   * Verifica si un campo del formulario es válido.
   * @param form Formulario reactivo.
  /**
   * @method isValid - Verifica si un campo del formulario es válido
   * @param form - Formulario reactivo
   * @param field - Nombre del campo a validar
   * @returns boolean - `true` si el campo es válido, de lo contrario `false`
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * @method setValoresStore - Establece valores en el estado de la tienda
   * @param form - Formulario reactivo
   * @param campo - Nombre del campo del formulario
   * @param metodoNombre - Método de la tienda para actualizar el estado
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110201Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * @method validarFormulario - Valida el formulario de certificado de origen
   * Retorna `true` si el formulario es válido, de lo contrario retorna `false`
   * Si el componente hijo no está disponible, retorna `false`
   * @returns boolean - Indica si el formulario es válido
   */
  validarFormulario(): boolean {
    let isValid = true;
    if (!this.validarFormularios()) {
      isValid = false;
    }
    return isValid;
  }


  /**
   * @getter validacionForm - Obtiene el formulario de validación principal
   * @returns FormGroup - Formulario de validación anidado
   */
  get validacionForm(): FormGroup {
    return this.registroForm.get('validacionForm') as FormGroup;
  }

  /**
   * @getter validacionMercanciaForm - Obtiene el formulario de validación de mercancías
   * @returns FormGroup - Formulario de validación de mercancías anidado
   */
  get validacionMercanciaForm(): FormGroup {
    return this.mercanciaForm.get('validacionMercanciaForm') as FormGroup;
  }

  /**
   * @method donanteDomicilio - Configura el formulario reactivo con los valores iniciales del estado
   */
  donanteDomicilio(): void {
    this.registroForm = this.fb.group({
      validacionForm: this.fb.group({
        tratado: [{ value: this.solicitudState?.tratado, disabled: this.soloLectura }, [Validators.required]],
        pais: [{ value: this.solicitudState?.pais, disabled: this.soloLectura }, [Validators.required]],
        fraccionArancelaria: [{ value: this.solicitudState?.fraccionArancelaria, disabled: this.soloLectura }, [Validators.pattern(REGEX_SOLO_DIGITOS), Validators.minLength(8), Validators.maxLength(8)]],
        numeroRegistro: [{ value: this.solicitudState?.numeroRegistro, disabled: this.soloLectura }],
        nombreComercial: [{ value: this.solicitudState?.nombreComercial, disabled: this.soloLectura }],
        fechaInicial: [{ value: this.solicitudState?.fechaInicial, disabled: this.soloLectura }],
        fechaFinal: [{ value: this.solicitudState?.fechaFinal, disabled: this.soloLectura }],
        archivo: [{ value: this.solicitudState?.archivo, disabled: this.soloLectura }],
      }),
    });

    this.mercanciaForm = this.fb.group({
      validacionMercanciaForm: this.fb.group({
        fraccionMercanciaArancelaria: [{ value: '', disabled: this.soloLectura }],
        nombreTecnico: [{ value: '', disabled: this.soloLectura }],
        nombreComercialDelaMercancia: [{ value: '', disabled: this.soloLectura }],
        criterioParaConferir: [{ value: '', disabled: this.soloLectura }],
        nombreEnIngles: [{ value: '', disabled: this.soloLectura }],
        marca: [{ value: this.solicitudState?.marca, disabled: this.soloLectura }],
        cantidad: [{ value: this.solicitudState?.cantidad, disabled: this.soloLectura }, [Validators.required, Validators.pattern(REGEX_CANTIDAD_15_4), Validators.maxLength(22)]],
        umc: [{ value: this.solicitudState?.umc, disabled: this.soloLectura }, [Validators.required]],
        valorDelaMercancia: [{ value: this.solicitudState?.valorDelaMercancia, disabled: this.soloLectura }, [Validators.required, Validators.pattern(REGEX_CANTIDAD_15_4), Validators.maxLength(22)]],
        complementoDelaDescripcion: [{ value: this.solicitudState?.complementoDelaDescripcion, disabled: this.soloLectura }, [Validators.required, Validators.maxLength(200)]],
        masaBruta: [{ value: this.solicitudState?.masaBruta, disabled: this.soloLectura }, [Validators.required, Validators.pattern(REGEX_NUMERO_15_ENTEROS_4_DECIMALES), Validators.maxLength(22)]],
        unidadMedida: [{ value: this.solicitudState?.unidadMedida, disabled: this.soloLectura }, [Validators.required]],
        tipoFactura: [{ value: this.solicitudState?.tipoFactura, disabled: this.soloLectura }, [Validators.required]],
        fecha: [{ value: this.solicitudState?.fecha, disabled: this.soloLectura }, [Validators.required]],
        numeroFactura: [{ value: this.solicitudState?.numeroFactura, disabled: this.soloLectura }, [Validators.required, Validators.maxLength(50)]],
      }),
    });
  }

  /**
   * Formatea el valor del campo 'cantidad' en el formulario 'mercanciaForm' para asegurar que tenga exactamente cuatro decimales.
   *
   * - Si el valor es un número entero o no contiene decimales, se le agregan '.0000'.
   * - Si el valor ya contiene decimales, se ajusta para que tenga exactamente cuatro cifras decimales, rellenando con ceros si es necesario.
   * - No emite eventos de cambio al actualizar el valor del control.
   *
   * @remarks
   * Este método no realiza validaciones sobre el valor numérico, solo sobre el formato de los decimales.
   */
  formatearCantidad(): void {
    const CONTROL = this.mercanciaForm.get('validacionMercanciaForm.cantidad');
    let valor = CONTROL?.value;
    if (valor !== null && valor !== undefined && valor !== '') {
      valor = valor.toString();
      if (!valor.includes('.')) {
        valor = valor + '.0000';
      } else {
        const [ENTERO, DECIMALES] = valor.split('.');
        valor = ENTERO + '.' + DECIMALES.padEnd(4, '0').slice(0, 4);
      }
      CONTROL?.setValue(valor, { emitEvent: false });
    }
  }

  /**
   * Formatea el valor de la mercancía en el formulario para asegurar que tenga exactamente cuatro decimales.
   *
   * - Si el valor no contiene decimales, se le agregan '.0000'.
   * - Si el valor ya contiene decimales, se ajusta para que tenga exactamente cuatro dígitos decimales,
   *   rellenando con ceros si es necesario o truncando si hay más de cuatro.
   * - El valor formateado se establece en el control del formulario sin emitir eventos.
   *
   * @remarks
   * Este método asume que el control 'validacionMercanciaForm.valorDelaMercancia' existe en el formulario 'mercanciaForm'.
   */
  formatearValorDelaMercancia(): void {
    const CONTROL = this.mercanciaForm.get('validacionMercanciaForm.valorDelaMercancia');
    let VALOR = CONTROL?.value;
    if (VALOR === null || VALOR === undefined || VALOR === '') {
      return;
    }
    VALOR = VALOR.toString();
    if (VALOR.length > 22) {
      CONTROL?.setErrors({ maxlength: true });
      return;
    }
    const REGEX = /^\d{1,15}(\.\d{0,4})?$/;
    if (!REGEX.test(VALOR)) {
      CONTROL?.setErrors({ pattern: true });
      return;
    }
    if (!VALOR.includes('.')) {
      VALOR = VALOR + '.0000';
    } else {
      const [ENTERO, DECIMALES = ''] = VALOR.split('.');
      VALOR = ENTERO + '.' + DECIMALES.padEnd(4, '0').slice(0, 4);
    }

    CONTROL?.setValue(VALOR, { emitEvent: false });
    CONTROL?.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Formatea el valor del campo 'masaBruta' en el formulario 'mercanciaForm' para asegurar que tenga exactamente cuatro decimales.
   * 
   * - Si el valor no contiene decimales, se le agregan '.0000'.
   * - Si el valor ya contiene decimales, se ajusta para que tenga exactamente cuatro dígitos decimales, rellenando con ceros si es necesario.
   * - El valor formateado se establece en el control sin emitir eventos.
   * 
   * @remarks
   * Este método no realiza validaciones numéricas, solo formatea la cadena del valor.
   */
  formatearMasaBruta(): void {
    const CONTROL = this.mercanciaForm.get('validacionMercanciaForm.masaBruta');
    let VALOR = CONTROL?.value;
    if (VALOR !== null && VALOR !== undefined && VALOR !== '') {
      VALOR = VALOR.toString();
      if (REGEX_NUMERO_ENTERO.test(VALOR)) {
        if (!VALOR.includes('.')) {
          VALOR = VALOR + '.0000';
        } else {
          const [ENTERO, DECIMALES] = VALOR.split('.');
          VALOR = ENTERO + '.' + (DECIMALES + '0000').slice(0, 4);
        }
        CONTROL?.setValue(VALOR, { emitEvent: false });
      }
    }
  }

  /**
   * @method eliminarPedimento
   * Elimina un pedimento seleccionado de la tabla de mercancías si se confirma la acción.
   * 
   * @param borrar - Indica si se debe eliminar el registro seleccionado.
   */
  eliminarPedimento(borrar: boolean): void {
    this.ischecked = borrar;
    if (borrar && this.selectedRow) {
      this.mercanciaSeleccionadasTablaData = this.mercanciaSeleccionadasTablaData.filter((item) => item.id !== this.selectedRow.id);
      this.selectedRow = null as unknown as SeleccionadasTabla;
    }
    this.mostrarMensajeError = false;
    this.nuevaNotificacion = null;
  }

  /**
   * @method abrirModal
   * Abre un modal de notificación para mostrar un mensaje de error relacionado con la selección de archivo.
   * 
   * @param i - Índice del elemento a eliminar (por defecto 0).
   */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debes seleccionar un archivo(txt o csv)',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
    this.elementoParaEliminar = i;
  }

  /**
   * @method onFilaSeleccionadaradio
   * Evento que se ejecuta al seleccionar una fila con opción de radio.
   * 
   * @param event - Fila seleccionada en la tabla.
   */
  onFilaSeleccionadaradio(event: SeleccionadasTabla): void {
    this.selectedRow = event;
  }

  /**
   * @method cerrarEdicionMercancia
   * Cierra la edición de mercancía verificando si hay un registro seleccionado.
   * Si hay selección, solicita confirmación de eliminación;
   * en caso contrario, muestra mensaje de error.
   */
  cerrarEdicionMercancia(): void {
    if (this.selectedRow) {
      this.eliminarMensajeConfirmacion();
    }
    else {
      this.errorMessageExportador();
    }
  }

  /**
   * @method errorMessageExportador
   * Muestra un mensaje de error cuando no se ha seleccionado ninguna mercancía.
   */
  errorMessageExportador(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'info',
      titulo: 'Selección requerida',
      mensaje: 'Debes seleccionar una mercancía',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mostrarMensajeError = true;
  }

  /**
   * @method eliminarMensajeConfirmacion
   * Genera una notificación de confirmación para que el usuario decida
   * si desea eliminar el registro seleccionado.
   */
  eliminarMensajeConfirmacion(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'info',
      titulo: 'Confirmación requerida',
      mensaje: '¿Desea eliminar este dato?',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.mostrarMensajeError = true;
  }

  /**
   * @method eliminarErrorMessage
   * Maneja la acción de eliminación tras la confirmación en la notificación/modal.
   * 
   * @param event - Indica si el usuario confirmó la eliminación.
   */
  eliminarErrorMessage(event: boolean): void {
    if (event) {
      this.mercanciaSeleccionadasTablaData = this.mercanciaSeleccionadasTablaData.filter((item) => item.id !== this.selectedRow.id);
      this.selectedRow = {} as SeleccionadasTabla;
    }

    if (this.modalInstances) {
      this.modalInstances.hide();
    }
    this.mostrarMensajeError = false;
  }
  /**
   * Obtiene el catálogo de países o bloques desde el servicio y lo asigna a la propiedad `paisBloqueCertificado`.
   *
   * @returns {void}
   */
  getPaisBloque(clave:string):void{
    this.catalogoServices.getPaisesPorTratado(this.TramitesID.toString(),clave).subscribe((data) => {
      this.optionsPais.catalogos = data.datos ?? [];
    });
  }
  /**
   * Obtiene la lista de tratados y acuerdos desde el servicio `catalogoServices`
   * y actualiza las opciones del campo de formulario correspondiente con los datos recibidos.
   *  Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * Actualiza el campo 'tratado' en `optionsTratado` con las opciones obtenidas.
   */
  getTratadoCertificado(): void {
    this.catalogoServices.tratadoCatalogoPais(this.TramitesID).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      this.optionsTratado.catalogos = res.datos ?? [];
    });
  }

  /**
   * Maneja el cambio en el catálogo de UMC (Unidad de Medida de la Cantidad).
   * Actualiza la descripción de UMC en el estado de la tienda.
   * @param event Objeto del catálogo de UMC seleccionado.
   */
  onUmcChange(event: Catalogo): void {
    this.store.setUmcDescripcion(event.descripcion);
  }
  
  /**
   * Maneja el cambio en el catálogo de Unidad de Medida.
   * Actualiza la descripción de Unidad de Medida en el estado de la tienda.
   * @param event Objeto del catálogo de Unidad de Medida seleccionado.
   */
  onUnidadMedidaChange(event: Catalogo): void {
    this.store.setUnidadMedidaDescripcion(event.descripcion);
  }

  /**
   * Maneja el cambio en el catálogo de Tipo de Factura.
   * Actualiza la descripción de Tipo de Factura en el estado de la tienda.
   * @param event Objeto del catálogo de Tipo de Factura seleccionado.
   */
  onTipoFacturaChange(event: Catalogo): void {
    this.store.setTipoFacturaDescripcion(event.descripcion);
  }

  /**
   * Obtiene la lista de Unidades de Medida de la Cantidad (UMC) desde el servicio `catalogoServices`
   * y actualiza las opciones del campo de formulario correspondiente con los datos recibidos.  
   *  Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * Actualiza el campo 'umc' en `optionsUMC` con las opciones obtenidas.
   */
  getUmc(): void {
    this.catalogoServices.unidadMasaBrutaCatalogo(this.TramitesID).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      this.optionsUMC.catalogos = res.datos ?? [];
    });
  }

  /**
   * Obtiene la lista de Unidades de Medida desde el servicio `catalogoServices`
   * y actualiza las opciones del campo de formulario correspondiente con los datos recibidos.
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * Actualiza el campo 'unidadMedida' en `optionsUnidadMedida` con las opciones obtenidas.
   */
  getUnidadMedidaCertificado(): void {
    this.catalogoServices.unidadesMedidaComercialCatalogo(this.TramitesID).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      this.optionsUnidadMedida.catalogos = res.datos ?? [];
    });
  }
  /**
   * Obtiene la lista de Tipos de Factura desde el servicio `catalogoServices`
   * y actualiza las opciones del campo de formulario correspondiente con los datos recibidos.
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * Actualiza el campo 'tipoFactura' en `optionsTipoFactura` con las opciones obtenidas.
   **/
  getTipoFacturaCertificado(): void {
    this.catalogoServices.tipoFacturaCatalogo(this.TramitesID).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      this.optionsTipoFactura.catalogos = res.datos ?? [];
    });
  }

  /**
   * @method ngOnDestroy - Método del ciclo de vida que se ejecuta al destruir el componente
   * Cancela todas las suscripciones activas para evitar fugas de memoria
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
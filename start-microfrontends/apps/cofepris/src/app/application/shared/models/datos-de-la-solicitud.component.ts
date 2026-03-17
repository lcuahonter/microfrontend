import {
  ADUANA_DATA,
  CLASIFICACION_PRODUCTO_DATA,
  CLAVE_SCIAN_DATA,
  DESCRIPCION_SCIAN_DATA,
  ESPECIFICAR_DATA,
  ESTADO_DATA,
  REGIMEN_AL_QUE_DATA,
  TIPO_PRODUCTO_DATA,
} from '../../constantes/catalogs.enum';

import {
  CONFIGURACION_COLUMNAS_LISTA_CLAVE,
  CONFIGURACION_COLUMNAS_MERCANCIAS,
  CONFIGURACION_COLUMNAS_SOLI,
} from '../../constantes/column-config.enum';
import {
  Catalogo,
  InputFecha,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
  REGEX_SOLO_DIGITOS,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import{ConsultaioQuery} from '@ng-mf/data-access-user';

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CrossList, MercanciaCrossList } from '../../models/mercancia.model';
import { FilaData, FilaData2, ListaClave } from '../../models/fila-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  Solicitud260702State,
  Solicitud260702Store,
} from '../../estados/tramites260702.store';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@libs/shared/data-access-user/src';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { Modal } from 'bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrarSolicitudMcpService } from '../../services/registrar-solicitud-mcp.service';
import { Solicitud260702Query } from '../../estados/tramites260702.query';
import { TEXTOS } from '../../constants/constantes.enum';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente para gestionar los datos de la solicitud.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    InputFechaComponent,
    CrosslistComponent,
    InputCheckComponent,
    NotificacionesComponent,
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrls: ['./datos-de-la-solicitud.component.scss'],
})
export class DatosdelasolicitudComponent implements OnInit, OnDestroy {
  /** Formulario principal para los datos de la solicitud */
  dataDeLaSolicitudForm!: FormGroup;

  /** Constantes de texto utilizadas en el componente */
  TEXTOS = TEXTOS;

  /** Estado actual de los datos de la solicitud */
  dataDeLaSolicitudState!: Solicitud260702State;

  /** Sujeto para manejar la destrucción de observables */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Formulario para la clave SCIAN */
  clavaScianForm!: FormGroup;

  /** Indica si se muestra el formulario de clave SCIAN */
  public showClavaScianForm: boolean = false;
  /** Habilita o deshabilita el estado */
  habilitarEstado: boolean = true;

  /** Selección de mercancias */
  hercelosSeleccionados!: string;

  /** Datos seleccionados de mercancias */
  selectedMercanciasDatos: FilaData2[] = [];

  /** Configuración de la tabla de mercancias */
  public mercanciasConfiguracionTabla: FilaData2[] = [];

  /** Lista de claves para la tabla */
  public listaClaveTabla: ListaClave[] = [];

  /** Indica si el país de origen es colapsable */
  paisOrigen = false;
  /** Configuración del crosslist para el país de origen */
  paisOrigenCrossList: CrossList = {} as CrossList;

  /** Configuración del crosslist para el país de procedencia */
  paisProcedencisCrossList: CrossList = {} as CrossList;

  /** Indica si el país de procedencia es colapsable */
  paisProcedencisColapsable = false;

  /** Referencia al modal de alerta */
  @ViewChild('modalAlerta') modalElement!: ElementRef;

  /**
   * Configuración para la notificación actual.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Índice del elemento que se desea eliminar.
   */
  elementoParaEliminar!: number;

  /**
   * Lista de pedimentos asociados a la solicitud.
   */
  pedimentos: Array<Pedimento> = [];

  /** Configuración para el campo de fecha de fabricación */
  fechaFabricacionDatos: InputFecha = {
    labelNombre: 'Fecha de fabricación',
    required: false,
    habilitado: true,
  };
  /**
   * Configuración para el campo de fecha de caducidad.
   * Incluye nombre de etiqueta, estado de requerido y habilitación.
   */
  fechaCaducidad: InputFecha = {
    labelNombre: 'Fecha de Caducidad',
    required: false,
    habilitado: true,
  };
  /** Índice de la fila en edición */
  ediciondeindicedefila: number | null = null;

  /** Indica si el uso específico es colapsable */
  usoEspecifico = false;

  /** Configuración del crosslist para el uso específico */
  usoEspecificoCrossList: CrossList = {} as CrossList;

  /** Índice de la fila seleccionada */
  indiceFilaSeleccionada: number | null = null;

  /** Fecha inicial seleccionada */
  fechaInicialSeleccionada: string = '';

  /** Fecha final seleccionada */
  fechaFinalSeleccionada: string = '';
  /** Opciones para el botón de radio */
  opcionDeBotonDeRadio = [
    { label: 'Prórroga', value: 'prorroga' },
    { label: 'Modificación', value: 'modificacion' },
    { label: 'Modificación y prórroga', value: 'modificacion_prorroga' },
  ];

  /** Tipo de selección para las mercancias */
  tipoSeleccionsoliMercancias: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Datos de la tabla */
  tableData: FilaData[] = [];

  /** Conjunto de filas seleccionadas */
  filasSeleccionadas: Set<number> = new Set();

  /** Opciones para el botón de radio de hacerlos */
  hacerlosRadioOptions = [
    { label: 'No', value: 'no' },
    { label: 'Sí', value: 'si' },
  ];

  /** Fila seleccionada */
  selectedRow: FilaData | FilaData2 | null = null;

  /** Configuración de datos del estado */
  public estadoData = ESTADO_DATA;

  /** Configuración de datos de clave SCIAN */
  public claveScianData = CLAVE_SCIAN_DATA;

  /** Configuración de descripción del SCIAN */
  public descripcionDelScianData = DESCRIPCION_SCIAN_DATA;

  /** Configuración de datos del régimen */
  public regimenalqueData = REGIMEN_AL_QUE_DATA;

  /** Configuración de datos de la aduana */
  public aduanaData = ADUANA_DATA;

  /** Configuración para el campo de selección de clasificación del producto */
  public delProducto = CLASIFICACION_PRODUCTO_DATA;

  /** Configuración para especificar clasificación del producto */
  public especificarData = ESPECIFICAR_DATA;

  /** Configuración para el campo de selección del tipo de producto */
  public tipoProductoData = TIPO_PRODUCTO_DATA;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** 
 * RFC del solicitante.
 * Este campo almacena el Registro Federal de Contribuyentes (RFC) del solicitante.
 * Ejemplo: 'MAVL621207C95'.
 */
  rfc: string = 'MAVL621207C95';

  /**
   * Constructor del componente.
   *
   * Inyecta los servicios y utilidades necesarias para:
   * - Crear y gestionar formularios reactivos (`FormBuilder`).
   * - Registrar solicitudes MCP (`RegistrarSolicitudMcpService`).
   * - Detectar y aplicar cambios manualmente en la vista (`ChangeDetectorRef`).
   * - Gestionar el estado del trámite 260702 (`Solicitud260702Store`).
   * - Consultar el estado del trámite 260702 (`Solicitud260702Query`).
   * - Consultar el estado general de la aplicación (`ConsultaioQuery`).
   *
   * @param fb Constructor de formularios reactivos.
   * @param registrarsolicitudmcp Servicio para registrar solicitudes MCP.
   * @param cdr Referencia para detección de cambios manual.
   * @param solicitud260702Store Store para manejar el estado del trámite 260702.
   * @param solicitud260702Query Query para acceder al estado del trámite 260702.
   * @param consultaioQuery Query para acceder al estado general de la consulta.
   */
  constructor(
    private fb: FormBuilder,
    private registrarsolicitudmcp: RegistrarSolicitudMcpService,
    private cdr: ChangeDetectorRef,
    private solicitud260702Store: Solicitud260702Store,
    private solicitud260702Query: Solicitud260702Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;

          this.inicializarEstadoFormulario();
        })
      )
      
      .subscribe();
  }

  /** Configuración de columnas para la tabla de solicitud */
  configuracionColumnasoli = CONFIGURACION_COLUMNAS_SOLI;

  /** Configuración de columnas para la tabla de mercancias */
  mercanciasDatos = CONFIGURACION_COLUMNAS_MERCANCIAS;

  /** Configuración de columnas para la lista de claves */
  listaClave = CONFIGURACION_COLUMNAS_LISTA_CLAVE;

  /** Inicialización del componente */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
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
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.solicitud260702Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        // map((seccionState) => {
        //   this.dataDeLaSolicitudState = seccionState;

        // })
        map((seccionState) => {
          this.dataDeLaSolicitudState = seccionState;
          if (this.esFormularioSoloLectura && seccionState.tableData) {
            this.tableData = [...seccionState.tableData];
          } else if (seccionState.tableData) {
            this.tableData = [...seccionState.tableData];
          }
          
        })
      )
      .subscribe();

    this.createForm();
    this.getEstadosData();
    this.getClaveScianData();
    this.createclaveScianForm();
    this.getClaveDescripcionDelData();
    this.getRegimenalqueData();
    this.getAduanaData();
    this.getMercanciasData();
    this.getEspificarData();
    this.getClasificacionDelProductoData();
    this.getTipoProductoData();
    this.getListaClaveData();
    this.getMercanciaCrosslistData();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.dataDeLaSolicitudForm.disable();
      this.clavaScianForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.dataDeLaSolicitudForm.enable();
      this.clavaScianForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Método para crear el formulario principal de datos de la solicitud.
   * Inicializa un formulario reactivo con todos los campos necesarios y sus validaciones.
   */
  createForm(): void {
    this.dataDeLaSolicitudForm = this.fb.group({
      claveDeLosLotes: [
        this.dataDeLaSolicitudState?.claveDeLosLotes,
        Validators.required,
      ],
      fechaDeFabricacion: [
        this.dataDeLaSolicitudState?.fechaDeFabricacion,
        Validators.required,
      ],
      fechaDeCaducidad: [
        this.dataDeLaSolicitudState?.fechaDeCaducidad,
        Validators.required,
      ],
      descripcionFraccionArancelaria: [
        this.dataDeLaSolicitudState?.descripcionFraccionArancelaria,
       Validators.maxLength(200),
      ],
      cantidadUMT: [
        this.dataDeLaSolicitudState?.cantidadUMT,
        Validators.required,
      ],
      umt: [
        this.dataDeLaSolicitudState?.descripcionFraccionArancelaria,
        Validators.required,
      ],
      cantidadUMC: [
        this.dataDeLaSolicitudState?.cantidadUMC,
        Validators.required,
      ],
      umc: [this.dataDeLaSolicitudState?.umc, Validators.required],
      tipoProducto: [
        this.dataDeLaSolicitudState?.tipoProducto,
        Validators.required,
      ],
      clasificaionProductos: [
        this.dataDeLaSolicitudState?.clasificaionProductos,
        Validators.required,
      ],
      especificarProducto: [
        this.dataDeLaSolicitudState?.especificarProducto,
        Validators.required,
      ],
      nombreProductoEspecifico: [
        this.dataDeLaSolicitudState?.nombreProductoEspecifico,
        Validators.required,
      ],
      marca: [this.dataDeLaSolicitudState?.marca, Validators.required],
      fraccionArancelaria: [
        this.dataDeLaSolicitudState?.fraccionArancelaria,
        Validators.required,
      ],
      datosDelTramiteRealizar: this.fb.group({
         tipoOperacion: [
        { value: this.dataDeLaSolicitudState?.tipoOperacion, disabled: false },
        Validators.required,
      ],
        justification: [
          this.dataDeLaSolicitudState?.justification,
          [Validators.maxLength(2000)],
        ],
        denominacion: [
          this.dataDeLaSolicitudState?.denominacion,
         [Validators.maxLength(100)],
        ],
        correoElectronico: [
          this.dataDeLaSolicitudState?.correoElectronico,
          [Validators.email, Validators.maxLength(100)],
        ],
        codigopostal: [
          this.dataDeLaSolicitudState?.codigopostal,
         [
            Validators.required,
            Validators.maxLength(12),
             Validators.pattern(REGEX_SOLO_DIGITOS),
          ],
        ],
        estado: [this.dataDeLaSolicitudState?.estado, Validators.required],
        municipoyalcaldia: [
          this.dataDeLaSolicitudState?.municipoyalcaldia,
          Validators.required,
        ],
        localidad: [
          this.dataDeLaSolicitudState?.localidad,
         [
            Validators.required,
            Validators.maxLength(120),
            Validators.pattern(REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL),
          ],
        ],
        colonia: [this.dataDeLaSolicitudState?.colonia, [Validators.maxLength(120)]],
        calle: [this.dataDeLaSolicitudState?.calle,[Validators.maxLength(100)]],
        lada: [this.dataDeLaSolicitudState?.lada,[
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(5),
                    Validators.pattern(REGEX_SOLO_DIGITOS),
                  ],],
        telefono: [this.dataDeLaSolicitudState?.telefono, [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern(REGEX_SOLO_DIGITOS),
                  ],],
        avisoDeFuncionamiento: [
          this.dataDeLaSolicitudState?.avisoDeFuncionamiento,
          Validators.required,
        ],
        licenciaSanitaria: [
          this.dataDeLaSolicitudState?.licenciaSanitaria,
          Validators.required,
        ],
        regimenalque: [
          this.dataDeLaSolicitudState?.regimenalque
        ],
        aduana: [this.dataDeLaSolicitudState?.aduana, Validators.required],
        rfc: [this.dataDeLaSolicitudState?.rfc || this.rfc, Validators.required],
        legalRazonSocial: [
          this.dataDeLaSolicitudState?.legalRazonSocial,
          Validators.required,
        ],
        apellidoPaterno: [
          this.dataDeLaSolicitudState?.apellidoPaterno,
          Validators.required,
        ],
        apellidoMaterno: [
          this.dataDeLaSolicitudState?.apellidoMaterno,
          Validators.required,
        ],
      }),
      hacerlosPublicos: [{value: this.dataDeLaSolicitudState?.hacerlosPublicos, disabled: this.esFormularioSoloLectura}, Validators.required],

    });
  }

  /**
   * Método para limpiar la notificación actual.
   * Establece el valor de `nuevaNotificacion` a `null` para eliminar cualquier notificación activa.
   */
  clearNotificacion(): void {
    this.nuevaNotificacion = null;
  }

  /**
   * Método para cerrar el modal de agregar mercancía.
   * Busca el elemento del modal en el DOM, lo oculta y limpia cualquier notificación activa.
   */
  closeModal(): void {
    const MODAL_ELEMENT = document.getElementById('modalAgregarMercancia');
    if (MODAL_ELEMENT) {
      const MODAL = new Modal(MODAL_ELEMENT);
      MODAL.hide();
      this.clearNotificacion(); // Limpia la notificación cuando el modal se cierra programáticamente
    }
  }

  /**
   * Método para eliminar un pedimento de la lista.
   * @param borrar Indica si se debe proceder con la eliminación del pedimento.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.tableData = this.tableData.filter((row) => {
        const ROW_ID =
          row.id || (row.claveScianG && row.claveScianG.claveScian);
        return !this.filasSeleccionadas.has(Number(ROW_ID));
      });

      // Borrar la selección y la notificación
      this.filasSeleccionadas.clear();
      this.pedimentos.splice(this.elementoParaEliminar, 1);
      this.nuevaNotificacion = null; // Limpia la notificación
    }
  }

  /**
   * Método para abrir un modal y configurar la notificación correspondiente.
   * Dependiendo de los parámetros, muestra un mensaje de alerta para seleccionar un establecimiento,
   * notifica que no hay registros seleccionados o confirma la eliminación de registros seleccionados.
   *
   * @param i Índice del elemento que se desea eliminar (por defecto 0).
   * @param isSeleccionarEstablecimiento Indica si se debe mostrar el mensaje para seleccionar un establecimiento.
   */
  abrirModal(
    i: number = 0,
    isSeleccionarEstablecimiento: boolean = false
  ): void {
    if (isSeleccionarEstablecimiento) {
      // Condición específica para "Seleccionar establecimiento"
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje:
          'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    } else if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
      // No hay filas seleccionadas
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona un registro',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else {
      // Hay filas seleccionadas
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }

    this.elementoParaEliminar = i;
  }

  /**
   * Método para crear el formulario de clave SCIAN.
   * Inicializa un formulario reactivo con los campos `claveScian` y `descripcionDelScian`,
   * ambos marcados como requeridos.
   */
  createclaveScianForm(): void {
    this.clavaScianForm = this.fb.group({
      claveScianG: this.fb.group({
        claveScian: ['',],
        descripcionDelScian: [''],
      }),
    });
  }

  /**
   * Método para obtener los datos del crosslist de mercancías.
   * Realiza una solicitud al servicio `registrarsolicitudmcp` para obtener los datos
   * y actualiza las propiedades `paisOrigenCrossList`, `paisProcedencisCrossList` y `usoEspecificoCrossList`.
   * En caso de error, muestra un mensaje en la consola.
   */
  
  getMercanciaCrosslistData(): void {
    this.registrarsolicitudmcp
      .getMercanciaCrosslistData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((respuesta: MercanciaCrossList[] | MercanciaCrossList) => {
        // If the response is an array, take the first element
        const DATA = Array.isArray(respuesta) ? respuesta[0] : respuesta;
        if (DATA) {
          this.paisOrigenCrossList = DATA.paisOrigenCrossList;
          this.paisProcedencisCrossList = DATA.paisProcedencisCrossList;
          this.usoEspecificoCrossList = DATA.usoEspecificoCrossList;
        }
      });
  }
  /**
   * Método para alternar el estado colapsable del país de origen.
   * Cambia el valor de `paisOrigen` entre verdadero y falso.
   */
  paisOrigenColapsable(): void {
    this.paisOrigen = !this.paisOrigen;
  }

  /**
   * Método para alternar el estado colapsable del país de procedencia.
   * Cambia el valor de `paisProcedencisColapsable` entre verdadero y falso.
   */
  paisProcedencis_colapsable(): void {
    this.paisProcedencisColapsable = !this.paisProcedencisColapsable;
  }

  /**
   * Método para alternar el estado colapsable del uso específico.
   * Cambia el valor de `usoEspecifico` entre verdadero y falso.
   */
  usoEspecificoColapsable(): void {
    this.usoEspecifico = !this.usoEspecifico;
  }

  /** Obtiene los datos de los estados */
  getEstadosData(): void {
    this.registrarsolicitudmcp
      .getEstadosData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        this.estadoData.catalogos = data as Catalogo[];
      });
  }
  /** Obtiene los datos de clave SCIAN */
  getClaveScianData(): void {
    this.registrarsolicitudmcp
      .getClaveScianData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.claveScianData.catalogos = data as Catalogo[];
      });
  }

  /** Obtiene los datos de descripción del SCIAN */
  getClaveDescripcionDelData(): void {
    this.registrarsolicitudmcp
      .getClaveDescripcionDelData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.descripcionDelScianData.catalogos = data as Catalogo[];
      });
  }

  /** Obtiene los datos del régimen */
  getRegimenalqueData(): void {
    this.registrarsolicitudmcp
      .getRegimenalqueData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.regimenalqueData.catalogos = data as Catalogo[];
      });
  }

  /** Obtiene los datos de la aduana */
  getAduanaData(): void {
    this.registrarsolicitudmcp
      .getAduanaData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.aduanaData.catalogos = data as Catalogo[];
      });
  }
  /**
   * Método para habilitar el formulario de datos de la solicitud.
   * Cambia el estado de `habilitarEstado` a falso y habilita todos los campos del formulario.
   */
  aceptar(): void {
    this.dataDeLaSolicitudForm.enable();
    this.dataDeLaSolicitudForm.enable();
    this.habilitarEstado = false;
  }

  /** Obtiene los datos de mercancias */

  getMercanciasData(): void {
    this.registrarsolicitudmcp
      .getMercanciasData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.mercanciasConfiguracionTabla = data as unknown as FilaData2[];
      });
  }
  /** Obtiene los datos de clasificación del producto */
  getClasificacionDelProductoData(): void {
    this.registrarsolicitudmcp
      .getClasificacionDelProductoData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.delProducto.catalogos = data as Catalogo[];
      });
  }
  /** Obtiene los datos para especificar clasificación del producto */
  getEspificarData(): void {
    this.registrarsolicitudmcp
      .getEspificarData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.especificarData.catalogos = data as Catalogo[];
      });
  }

  /** Obtiene los datos del tipo de producto */
  getTipoProductoData(): void {
    this.registrarsolicitudmcp
      .getTipoProductoData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tipoProductoData.catalogos = data as Catalogo[];
      });
  }

  /** Obtiene los datos de la lista de claves */

  getListaClaveData(): void {
    this.registrarsolicitudmcp
      .getListaClaveData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.listaClaveTabla = data as unknown as ListaClave[];
      });
  }

  /** Muestra el modal de selección de establecimiento */

  seleccionarEstablecimiento(): void {
    this.abrirModal(0, true);
  }

  /** Maneja el evento de envío del formulario */

  onSubmit(): void {
      const MODAL_ELEMENT = document.getElementById('claveScianModal');
  if (MODAL_ELEMENT) {
    const MODAL_INSTANCE = Modal.getInstance(MODAL_ELEMENT) || new Modal(MODAL_ELEMENT);
    MODAL_INSTANCE.hide(); 
  }

    const FORM_DATA = { ...this.clavaScianForm.value };
    FORM_DATA.claveScianG.claveScian =
      this.claveScianData.catalogos.find(
        (item: Catalogo) =>
          String(item.id) === String(FORM_DATA.claveScianG.claveScian)
      )?.descripcion || 'Not Found';


    FORM_DATA.claveScianG.descripcionDelScian =
      this.descripcionDelScianData.catalogos.find(
        (item: Catalogo) =>
          String(item.id) === String(FORM_DATA.claveScianG.descripcionDelScian)
      )?.descripcion || 'Not Found';
    this.tableData = [...this.tableData, FORM_DATA];
    this.showClavaScianForm = false;
    this.clavaScianForm.reset();
  }
lastSelectedRow: FilaData2 | null = null;

  /** Maneja la selección de filas */
  onfilasSeleccionadas(filasSeleccionadas: FilaData[] | ListaClave[] | FilaData2[]): void {

  if (
    filasSeleccionadas.length > 0 &&
    'claveDeLosLotes' in filasSeleccionadas[0]
  ) {
    this.filasSeleccionadas = new Set(
      (filasSeleccionadas as ListaClave[]).map((row) =>
        Number(row.claveDeLosLotes)
      )
    );
        this.lastSelectedRow = null;

  } else if (filasSeleccionadas.length > 0 && 'id' in filasSeleccionadas[0]) {
    // Handles both FilaData and FilaData2 if both have 'id'
    this.filasSeleccionadas = new Set(
      (filasSeleccionadas as (FilaData | FilaData2)[]).map((row) => Number(row.id))
    );
  } else if (
    filasSeleccionadas[0] &&
    'claveScianG' in filasSeleccionadas[0] &&
    'claveScian' in filasSeleccionadas[0].claveScianG
  ) {
    this.filasSeleccionadas = new Set(
      (filasSeleccionadas as FilaData[]).map((row) =>
        Number(row.claveScianG.claveScian)
      )
    );
    
  } else {
    this.filasSeleccionadas.clear();
    this.lastSelectedRow = null;

  }
}
  /** Elimina las filas seleccionadas */
  onEliminar(): void {
    if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
      const MODAL_ELEMENT = document.getElementById('seleccionaRegistroModal');
      if (MODAL_ELEMENT) {
        const MODAL = new Modal(MODAL_ELEMENT);
        MODAL.show();
      }
    } else {
      const MODAL_ELEMENT = document.getElementById('confirmarEliminarModal');
      if (MODAL_ELEMENT) {
        const MODAL = new Modal(MODAL_ELEMENT);
        MODAL.show();
      }
    }
    this.clavaScianForm.reset();
    this.abrirModal();
  }

  /** Confirma la eliminación de las filas seleccionadas */
  confirmarEliminar(): void {
    this.listaClaveTabla = this.listaClaveTabla.filter(
      (row) => !this.filasSeleccionadas.has(Number(row.claveDeLosLotes))
    );

    
    this.filasSeleccionadas.clear();
    this.dataDeLaSolicitudForm.reset();
    this.abrirModal();
    
  }
  /** Limpia el formulario de clave SCIAN */
  onLimpiar(): void {
    this.clavaScianForm.reset();
  }

  /**
   * Muestra el formulario para agregar una nueva clave SCIAN.
   */
  onAgregar(): void {
        this.showClavaScianForm = true;

 setTimeout(() => {
    const MODAL_ELEMENT = document.getElementById('claveScianModal');
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = Modal.getInstance(MODAL_ELEMENT) || new Modal(MODAL_ELEMENT);
      MODAL_INSTANCE.show(); 
    }
  }, 0);
  }

  /**
   * Elimina las filas seleccionadas de la tabla.
   * Si no hay filas seleccionadas, muestra un mensaje de advertencia en la consola.
   */
  onDelete(): void {
    if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
      const MODAL_ELEMENT = document.getElementById('seleccionaRegistroModal');
      if (MODAL_ELEMENT) {
        const MODAL_INSTANCE = new Modal(MODAL_ELEMENT);
        MODAL_INSTANCE.show();
      }
    } else {
      const MODAL_ELEMENT = document.getElementById('confirmarEliminarModal');
      if (MODAL_ELEMENT) {
        const MODAL_INSTANCE = new Modal(MODAL_ELEMENT);
        MODAL_INSTANCE.show();
      }
    }
    this.clavaScianForm.reset();
    this.abrirModal();
    
  }

  /** Cancela la acción de agregar clave SCIAN */

  onCancelar(): void {
    this.showClavaScianForm = false;
    this.clavaScianForm.reset();
    
  }
  /** Agrega una nueva mercancia a la tabla */
agregarMercanciaGrid(): void {
  const SELECTED_ID = Array.from(this.filasSeleccionadas)[0];
  const SELECTED_ROW_INDEX = this.mercanciasConfiguracionTabla.findIndex(
     (row) => row.id === SELECTED_ID
  );

  if (SELECTED_ROW_INDEX === -1) {
    return;
  }
  this.ediciondeindicedefila = SELECTED_ROW_INDEX;
  const SELECTED_ROW = this.mercanciasConfiguracionTabla[SELECTED_ROW_INDEX];

  this.dataDeLaSolicitudForm.patchValue({
    clasificaionProductos: this.delProducto.catalogos.find(
      (item) => item.descripcion === SELECTED_ROW.clasificaionProductos
    )?.id || SELECTED_ROW.clasificaionProductos || '',
    especificarProducto: this.especificarData.catalogos.find(
      (item) => item.descripcion === SELECTED_ROW.especificarProducto
    )?.id || SELECTED_ROW.especificarProducto || '',
    nombreProductoEspecifico: SELECTED_ROW.nombreProductoEspecifico || '',
    marca: SELECTED_ROW.marca || '',
    tipoProducto: this.tipoProductoData.catalogos.find(
      (item) => item.descripcion === SELECTED_ROW.tipoProducto
    )?.id || SELECTED_ROW.tipoProducto || '',
    fraccionArancelaria: SELECTED_ROW.fraccionArancelaria || '',
    descripcionFraccionArancelaria: SELECTED_ROW.descripcionFraccionArancelaria || '',
    cantidadUMT: SELECTED_ROW.cantidadUMT || '',
    umt: SELECTED_ROW.umt || '',
    cantidadUMC: SELECTED_ROW.cantidadUMC || '',
    umc: SELECTED_ROW.umc || '',
    paisDeOrigen: SELECTED_ROW.paisDeOrigen || '',
    paisDeProcedencia: SELECTED_ROW.paisDeProcedencia || '',
    usoEspecifico: SELECTED_ROW.usoEspecifico || '',
  });

  // abrir el modal
  if (this.modalElement) {
    const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
    MODAL_INSTANCE.show();
  }
}
  /** Maneja el evento de modificación de mercancias */
onModificarMercancias(): void {
  if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
    this.abrirModal(0,false);
  } else if (this.filasSeleccionadas.size > 1) {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe seleccionar exactamente un registro para modificar.',
      cerrar: false,
      tiempoDeEspera: 0,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
      tamanioModal: 'modal-sm',
    };
  } else {
    this.onChange();
  }
}
  /**
   * Maneja el cambio en el campo "Clave de los lotes".
   * Actualiza el valor de la clave en la fila seleccionada de la tabla.
   *
   * @param event Evento que contiene el valor ingresado en el campo.
   */
  onClaveDeLosLotesChange(event: Event): void {
    const TARGET = event.target as HTMLInputElement; // Cast EventTarget to HTMLInputElement

    if (TARGET && this.ediciondeindicedefila !== null) {
      const VALUE = TARGET.value;

      this.listaClaveTabla[this.ediciondeindicedefila] = {
        ...this.listaClaveTabla[this.ediciondeindicedefila],
        claveDeLosLotes: VALUE,
      };
    } else {
      /* empty */
    }
  }
  /** Maneja el cambio de la fecha de fabricación */

  onFechaDeFabricacionChange(value: string | null): void {
    this.dataDeLaSolicitudForm.get('fechaDeFabricacion')?.setValue(value);
    if (value && this.ediciondeindicedefila !== null) {
      this.listaClaveTabla[this.ediciondeindicedefila] = {
        ...this.listaClaveTabla[this.ediciondeindicedefila],
        fechaDeFabricacion: value,
      };
    }
  }

  /** Maneja el cambio de la fecha de caducidad */

  onFechaDeCaducidadChange(value: string): void {
    this.dataDeLaSolicitudForm.get('fechaDeCaducidad')?.setValue(value);
    if (this.ediciondeindicedefila !== null) {
      this.listaClaveTabla[this.ediciondeindicedefila] = {
        ...this.listaClaveTabla[this.ediciondeindicedefila],
        fechaDeCaducidad: value,
      };
    }
  }
  /** Agrega una nueva fila a la lista de claves */

  onAgregarListaClave(): void {
    const CLAVE_DE_LOS_LOTES =
      this.dataDeLaSolicitudForm.get('claveDeLosLotes')?.value;
    const FECHA_DE_FABRICACION =
      this.dataDeLaSolicitudForm.get('fechaDeFabricacion')?.value;
    const FECHA_DE_CADUCIDAD =
      this.dataDeLaSolicitudForm.get('fechaDeCaducidad')?.value;

    if (!CLAVE_DE_LOS_LOTES && FECHA_DE_FABRICACION && FECHA_DE_CADUCIDAD) {
      console.error('All fields are required to add a row.');
      return;
    }
    const NEW_ROW = {
      id: this.listaClaveTabla.length + 1,
      claveDeLosLotes: CLAVE_DE_LOS_LOTES,
      fechaDeFabricacion: FECHA_DE_FABRICACION,
      fechaDeCaducidad: FECHA_DE_CADUCIDAD,
    };

    this.listaClaveTabla.push(NEW_ROW);
    this.dataDeLaSolicitudForm.reset();
  }

  /** Modifica una fila seleccionada en la lista de claves */

  onModificar(): void {
    if (this.filasSeleccionadas.size === 0) {
      return;
    }

    const INDICE_FILA_SELECCIONADA = Array.from(this.filasSeleccionadas)[0];
    const ROW_INDEX = this.listaClaveTabla.findIndex(
      (row) => Number(row.claveDeLosLotes) === INDICE_FILA_SELECCIONADA
    );

    if (ROW_INDEX === -1) {
      return;
    }

    this.ediciondeindicedefila = ROW_INDEX; 

    const SELECTED_ROW = this.listaClaveTabla[ROW_INDEX];

    this.dataDeLaSolicitudForm.patchValue({
      claveDeLosLotes: SELECTED_ROW.claveDeLosLotes || '',
      fechaDeFabricacion: SELECTED_ROW.fechaDeFabricacion || '',
      fechaDeCaducidad: SELECTED_ROW.fechaDeCaducidad || '',
    });
  }
  /** Obtiene el formulario de datos del trámite a realizar */

  get datosDelTramiteRealizar(): FormGroup {
    return this.dataDeLaSolicitudForm.get(
      'datosDelTramiteRealizar'
    ) as FormGroup;
  }
/** Establece valores en el store */
onSave(): void {
  const FORM_DATA = { ...this.dataDeLaSolicitudForm.value };

  FORM_DATA.tipoProducto = this.tipoProductoData.catalogos.find(
    (item: Catalogo) => String(item.id) === String(FORM_DATA.tipoProducto)
  )?.descripcion || FORM_DATA.tipoProducto;

  FORM_DATA.clasificaionProductos = this.delProducto.catalogos.find(
    (item: Catalogo) => String(item.id) === String(FORM_DATA.clasificaionProductos)
  )?.descripcion || FORM_DATA.clasificaionProductos;

  FORM_DATA.especificarProducto = this.especificarData.catalogos.find(
    (item: Catalogo) => String(item.id) === String(FORM_DATA.especificarProducto)
  )?.descripcion || FORM_DATA.especificarProducto;


  if (this.indiceFilaSeleccionada !== null) {
    this.mercanciasConfiguracionTabla = [
      ...this.mercanciasConfiguracionTabla.slice(0, this.indiceFilaSeleccionada),
      {
        ...this.mercanciasConfiguracionTabla[this.indiceFilaSeleccionada],
        ...FORM_DATA
      },
      ...this.mercanciasConfiguracionTabla.slice(this.indiceFilaSeleccionada + 1)
    ];

  } else {
    const NEW_ID = this.mercanciasConfiguracionTabla.length > 0
      ? Math.max(...this.mercanciasConfiguracionTabla.map(item => item.id || 0)) + 1
      : 1;
    this.mercanciasConfiguracionTabla = [
      ...this.mercanciasConfiguracionTabla,
      { ...FORM_DATA, id: NEW_ID }
    ];

   
  }
  
  this.dataDeLaSolicitudForm.reset();
      this.filasSeleccionadas.clear();
        this.indiceFilaSeleccionada = null; 

  this.cdr.detectChanges();
  this.closeModal();
}

/*
  * Maneja el evento de cambio en la selección de filas.
  * Si se selecciona una fila, actualiza el índice de la fila seleccionada y los valores del formulario.
  * Muestra el modal para agregar o modificar mercancías.
  */
onChange(): void {

  if (!this.filasSeleccionadas || this.filasSeleccionadas.size !== 1) {

    return;
  }

  const SELECTED_ID = Array.from(this.filasSeleccionadas)[0];
  const SELECTED_ROW_INDEX = this.mercanciasConfiguracionTabla.findIndex((row) => row.id === SELECTED_ID);

  if (SELECTED_ROW_INDEX === -1) {
    return;
  }

  this.indiceFilaSeleccionada = SELECTED_ROW_INDEX;
  const SELECTED_ROW = this.mercanciasConfiguracionTabla[SELECTED_ROW_INDEX];

  // Parche los valores del formulario con la asignación correcta para los campos del catálogo
   this.dataDeLaSolicitudForm.patchValue({

    clasificaionProductos: this.delProducto.catalogos.find(
      (item) => item.descripcion === SELECTED_ROW.clasificaionProductos
    )?.id || SELECTED_ROW.clasificaionProductos,
    especificarProducto: this.especificarData.catalogos.find(
      (item) => item.descripcion === SELECTED_ROW.especificarProducto
    )?.id || SELECTED_ROW.especificarProducto,
    nombreProductoEspecifico: SELECTED_ROW.nombreProductoEspecifico,
    marca: SELECTED_ROW.marca,
    fraccionArancelaria: SELECTED_ROW.fraccionArancelaria,
    descripcionFraccionArancelaria: SELECTED_ROW.descripcionFraccionArancelaria,
    cantidadUMT: SELECTED_ROW.cantidadUMT,
    umt: SELECTED_ROW.umt,
    cantidadUMC: SELECTED_ROW.cantidadUMC,
    umc: SELECTED_ROW.umc,
    paisDeOrigen: SELECTED_ROW.paisDeOrigen,
    paisDeProcedencia: SELECTED_ROW.paisDeProcedencia,
    usoEspecifico: SELECTED_ROW.usoEspecifico,
  });

    this.filasSeleccionadas.clear();
  // mostrar el modal
  const MODAL_ELEMENT = document.getElementById('modalAgregarMercancia');
  if (MODAL_ELEMENT) {
    const MODAL_INSTANCE = new Modal(MODAL_ELEMENT);
    MODAL_INSTANCE.show();
  } 
}

/**
 * Establece los valores en el store a partir del formulario.
 * @param form El formulario que contiene los valores.
 * @param campo El campo del formulario que se va a establecer en el store.
 * @param metodoNombre El nombre del método en el store que se va a utilizar para establecer el valor.
 */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud260702Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud260702Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /** Destrucción del componente */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

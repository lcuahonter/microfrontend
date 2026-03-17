import {
  ADUANA_DATA,
  CLASIFICACION_PRODUCTO_DATA,
  CLAVE_SCIAN_DATA,
  DESCRIPCION_SCIAN_DATA,
  ESPECIFICAR_DATA,
  ESTADO_DATA,
  ESTADO_FISICO_DATA,
  REGIMEN_AL_QUE_DATA,
  TIPO_PRODUCTO_DATA,
} from '../../constants/catalogs.enum';

import {
  AlertComponent,
  Catalogo,
  CrosslistComponent,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  CONFIGURACION_COLUMNAS_MERCANCIAS,
  CONFIGURACION_COLUMNAS_SOLI,
} from '../../constants/column-config.enum';
import {
  HACERLOS_RADIO_OPTIONS,
  LOCALIDAD_COLONIA,
  OPCION_DE_BOTON_DE_RADIO,
  TEXTOS,
} from '../../constants/constantes.enum';

import { FilaData, FilaData2 } from '../../models/fila-modal';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  Solicitud260919State,
  Solicitud260919Store,
} from '../../estados/tramites260919.store';
import { Solicitud260919Query } from '../../estados/tramites260919.query';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ImportarDeRemediosHerbalsService } from '../../services/importar-de-remedios-herbals.service';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { ReactiveFormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { Modal } from 'bootstrap';

import { CrossList, MercanciasInfo } from '../../models/mercancia.model';

import {
  REGEX_IMPORTE_PAGO,
  REGEX_LLAVE_DE_PAGO_DE_DERECHO,
  REGEX_SOLO_NUMEROS,
} from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';

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
    InputCheckComponent,
    NotificacionesComponent,
    AlertComponent,
    NotificacionesComponent,
    CrosslistComponent,
    InputFechaComponent,
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
  dataDeLaSolicitudState!: Solicitud260919State;

  /** Sujeto para manejar la destrucción de observables */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Formulario para la clave SCIAN */
  clavaScianForm!: FormGroup;

  /** Estado actual relacionado con la clave SCIAN */
claveScianState!: Solicitud260919State;

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

  /** Referencia al modal de alerta */
  @ViewChild('modalAlerta') MODAL_ELEMENT!: ElementRef;

  /** Fecha inicial seleccionada */
  fechaInicialSeleccionada: string = '';

  /** Fecha final seleccionada */
  fechaFinalSeleccionada: string = '';

  /** Opciones para el botón de radio */
  opcionDeBotonDeRadio = OPCION_DE_BOTON_DE_RADIO;

  /** Tipo de selección para las mercancias */
  tipoSeleccionsoliMercancias: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Datos de la tabla */
  tableData: FilaData[] = [];

  tableData2: MercanciasInfo[] = [];
  /** Datos de las mercancías. */
  mercanciasData: MercanciasInfo[] = [];

  /** Opciones para el botón de radio de hacerlos */
  hacerlosRadioOptions = HACERLOS_RADIO_OPTIONS;

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
  /**
   * Constante de texto utilizada para mostrar información relacionada con la localidad y colonia.
   */
  public TEXTO = LOCALIDAD_COLONIA;

  /**
   * Clase CSS utilizada para mostrar un mensaje de alerta con estilo de advertencia.
   */
  public infoAlert = 'alert-warning';

  /** Configuración de datos del estado físico */
  rfc: string = 'MAVL621207C95';

  /** Indica si el país de origen es colapsable */
  paisOrigen = false;
  /** Configuración del crosslist para el país de origen */
  paisOrigenCrossList: CrossList = {} as CrossList;

  /** Configuración del crosslist para el país de procedencia */
  paisProcedencisCrossList: CrossList = {} as CrossList;

  /** Indica si el país de procedencia es colapsable */
  paisProcedencisColapsable = false;

  /** Indica si el uso específico es colapsable */
  usoEspecifico = false;

  /** Configuración del crosslist para el uso específico */
  usoEspecificoCrossList: CrossList = {} as CrossList;
  
    /** Estado de la consulta que se obtiene del store. */
    public consultaState!: ConsultaioState;
  
    /** Consulta de estado para la solicitud */
    consultaDatos!: ConsultaioState;
    
/** Indica si el formulario es de solo lectura */
esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @param fb - Constructor para crear formularios reactivos.
   * @param importarDeRemediosHerbals - Servicio para obtener datos relacionados con remedios herbales.
   * @param cdr - Servicio para detectar y actualizar cambios en el componente.
   * @param solicitud260919Store - Almacén para gestionar el estado de la solicitud 260919.
   * @param solicitud260919Query - Consulta para obtener datos del estado de la solicitud 260919.
   */
  constructor(
    private fb: FormBuilder,
    private importarDeRemediosHerbals: ImportarDeRemediosHerbalsService,
    private cdr: ChangeDetectorRef,
    private solicitud260919Store: Solicitud260919Store,
    private solicitud260919Query: Solicitud260919Query,
     private consultaioQuery: ConsultaioQuery
  ) {}

  /** Configuración de columnas para la tabla de solicitud */
  configuracionColumnasoli = CONFIGURACION_COLUMNAS_SOLI;

  /** Configuración de columnas para la tabla de mercancias */
  mercanciasDatos = CONFIGURACION_COLUMNAS_MERCANCIAS;

  /**
   * Razón social legal del solicitante.
   */
  legalRazonSocial: string = '';

  /**
   * Apellido paterno del solicitante.
   */
  apellidoPaterno: string = '';

  /**
   * Apellido materno del solicitante.
   */
  apellidoMaterno: string = '';

  /** Índice de la fila seleccionada en la tabla */
indiceFilaSeleccionada: number | null = null;

  /** Configuración para el campo de selección de clasificación del producto */
  public delProducto = CLASIFICACION_PRODUCTO_DATA;

  /** Configuración para especificar clasificación del producto */
  public especificarData = ESPECIFICAR_DATA;

  /** Configuración para el campo de selección del tipo de producto */
  public tipoProductoData = TIPO_PRODUCTO_DATA;

  /**
   * Datos de configuración para el estado físico de la mercancía.
   */
  public estadoFisicoData = ESTADO_FISICO_DATA;

  /** Conjunto de filas seleccionadas */
  filasSeleccionadas: Set<number> = new Set();

/** Notificación nueva que se mostrará en el componente */
public nuevaNotificacion: Notificacion | null = null;
/** Elemento que se marcará para eliminar */
elementoParaEliminar!: number;

/** Lista de pedimentos asociados */
pedimentos: Array<Pedimento> = [];
/** Configuración de la fecha de pago, incluyendo el nombre del campo, si es requerido y si está habilitado */
fechaPago: InputFecha = {
  labelNombre: 'Fecha de caducidad',
  required: false,
  habilitado: true,
};

private modalElement: HTMLElement | null = null;

  /** Inicialización del componente */
  ngOnInit(): void {
      this.importarDeRemediosHerbals.getMercanciaCrosslistData().subscribe((data) => {
    const CROSSLIST_DATA = data as {
      paisOrigenCrossList: CrossList;
      paisProcedencisCrossList: CrossList;
      usoEspecificoCrossList: CrossList;
    };
    this.paisOrigenCrossList = CROSSLIST_DATA.paisOrigenCrossList;
    this.paisProcedencisCrossList = CROSSLIST_DATA.paisProcedencisCrossList;
    this.usoEspecificoCrossList = CROSSLIST_DATA.usoEspecificoCrossList;

  });
    this.solicitud260919Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.dataDeLaSolicitudState = seccionState;
        })
      )
      .subscribe();


    this.createForm();
    this.getEstadosData();
    this.getClaveScianData();
    this.getRegimenalqueData();
    this.getAduanaData();
    this.getMercanciasData();
    this.getClaveDescripcionDelData();
    this.createclaveScianForm();
    this.getTipoProductoData();
    this.getClasificacionDelProductoData();
    this.getEspificarData();
    this.getEstadoFisicoData();

     this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
            this.consultaDatos = seccionState;
            this.esFormularioSoloLectura = this.consultaDatos.readonly;
            this.inicializarEstadoFormulario();
          })
        )
        .subscribe();
        
        this.inicializarEstadoFormulario();
  }

/**
 * Método para eliminar los pedimentos seleccionados.
 * @param borrar - Indica si se deben eliminar los pedimentos seleccionados.
 */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      // Filtrar las filas seleccionadas
      this.tableData = this.tableData.filter((row) => {
        const ROW_ID =
          row.id || (row.claveScianG && row.claveScianG.claveScian);
        return !this.filasSeleccionadas.has(Number(ROW_ID));
      });

 this.mercanciasData = this.mercanciasData.filter((row) => {
      return !this.filasSeleccionadas.has(row.id);
    });
      
      // Borrar la selección y la notificación
      this.filasSeleccionadas.clear();
      this.nuevaNotificacion = null;
    }
  }
  /** 
 * Método para abrir un modal.
 * @param i - Índice del elemento relacionado con el modal (por defecto 0).
 * @param isSeleccionarEstablecimiento - Indica si el modal es para seleccionar un establecimiento.
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
        txtBtnCancelar: '',
      };
    } else if (!this.filasSeleccionadas || this.filasSeleccionadas.size === 0) {
      // No hay filas seleccionadas
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona un registro.',
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

  
  /** Configuración del formulario con validaciones para los campos del trámite. */
  createForm(): void {
    this.dataDeLaSolicitudForm = this.fb.group({
      datosDelTramiteRealizar: this.fb.group({
        tipoOperacion: [
          { value: this.dataDeLaSolicitudState.tipoOperacion || '',disabled: false },
        ],
        justification: [
          {
            value: this.dataDeLaSolicitudState.justification || '',
            disabled: true,
          },
          [Validators.required,Validators.maxLength(2000)],
        ],
        rfcDel: [
          this.dataDeLaSolicitudState?.rfcDel,
          [Validators.required,Validators.maxLength(13), Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO)],
        ],
        denominacion: [
          this.dataDeLaSolicitudState?.denominacion,
          [Validators.required,Validators.maxLength(100)],
        ],
        correoElectronico: [
          this.dataDeLaSolicitudState?.correoElectronico,
          [Validators.required,Validators.email, Validators.maxLength(100)],
        ],
        codigopostal: [
          this.dataDeLaSolicitudState?.codigopostal,
          [
            Validators.required,
            Validators.maxLength(12),
            Validators.pattern(REGEX_SOLO_NUMEROS),
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
           
            Validators.maxLength(120),
            Validators.pattern(REGEX_IMPORTE_PAGO),
          ],
        ],
        colonia: [
          this.dataDeLaSolicitudState?.colonia,
          [Validators.maxLength(120)],
        ],
        calle: [
          this.dataDeLaSolicitudState?.calle,
          [Validators.required,Validators.maxLength(100)],
        ],
        lada: [
          this.dataDeLaSolicitudState?.lada,
          [
            Validators.maxLength(5),
            Validators.pattern(/^[0-9]+$/),
          ],
        ],
        telefono: [
          this.dataDeLaSolicitudState?.telefono,
          [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern(/^[0-9]+$/),
          ],
        ],
        avisoDeFuncionamiento: [
          this.dataDeLaSolicitudState?.avisoDeFuncionamiento || false,
        ],
        licenciaSanitaria: [
          {
            value: this.dataDeLaSolicitudState?.licenciaSanitaria || '',
            disabled: this.dataDeLaSolicitudState?.avisoDeFuncionamiento,
          },
          Validators.required,
        ],
        regimenalque: [
          this.dataDeLaSolicitudState?.regimenalque,
          Validators.required,
        ],
        aduana: [this.dataDeLaSolicitudState?.aduana, Validators.required],
        rfc: [this.dataDeLaSolicitudState?.rfc || this.rfc, [
        Validators.required,
        Validators.maxLength(13), 
        Validators.pattern('^[a-zA-Z0-9]*$') 
      ]],
        legalRazonSocial: [this.dataDeLaSolicitudState?.legalRazonSocial],
        apellidoPaterno: [this.dataDeLaSolicitudState?.apellidoPaterno],
        apellidoMaterno: [this.dataDeLaSolicitudState?.apellidoMaterno],
      }),
      descripcionFraccionArancelaria: [
        this.dataDeLaSolicitudState?.descripcionFraccionArancelaria,
        Validators.maxLength(200),
      ],
      cantidadUMT: [
        this.dataDeLaSolicitudState?.cantidadUMT,
        Validators.required,
      ],
      umt: [this.dataDeLaSolicitudState?.umt, Validators.required],
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
        Validators.maxLength(200),
      ],
      denominacionDistintiva: [
        this.dataDeLaSolicitudState?.denominacionDistintiva,
        Validators.maxLength(200),
      ],
      denominacionNombre: [
        this.dataDeLaSolicitudState?.denominacionNombre,
        Validators.maxLength(200),
      ],
      estadoFisico: [
        this.dataDeLaSolicitudState?.estadoFisico,
        Validators.required,
      ],
      presentacionFarmaceutica: [
        this.dataDeLaSolicitudState?.presentacionFarmaceutica,
        Validators.maxLength(200),
      ],
      fraccionArancelaria: [
        this.dataDeLaSolicitudState?.fraccionArancelaria,
        Validators.maxLength(200),
      ],
      formaFarmaceutica: [
        this.dataDeLaSolicitudState?.formaFarmaceutica,
        Validators.maxLength(200),
      ],
      numeroDeRegistroSanitario: [
        this.dataDeLaSolicitudState?.numeroDeRegistroSanitario,
        Validators.maxLength(200),
      ],
      fechadepago: [this.dataDeLaSolicitudState?.fechadepago || '',],
      cumplocon: [this.dataDeLaSolicitudState?.cumplocon],
      hacerlosRadioOptions:[this.dataDeLaSolicitudState?.hacerlosRadioOptions]
    });
  }
  /** 
 * Método para crear el formulario de clave SCIAN.
 * Inicializa el formulario reactivo con validaciones para los campos claveScian y descripcionDelScian.
 */
  createclaveScianForm(): void {
    this.clavaScianForm = this.fb.group({
      claveScianG: this.fb.group({
        claveScian: [ '', Validators.required],
        descripcionDelScian: [ '', Validators.required],
      }),
    });
  }
  /** Obtiene el formulario de datos del trámite a realizar */

  get datosDelTramiteRealizar(): FormGroup {
    return this.dataDeLaSolicitudForm.get(
      'datosDelTramiteRealizar'
    ) as FormGroup;
  }
 
  /** 
 * Método para seleccionar la fecha de inicio.
 * Actualiza el valor del campo "fechadepago" en el formulario y lo establece en el store.
 * @param nuevo_valor - Nuevo valor de la fecha de inicio.
 */
  seleccionarFechaInicio(nuevo_valor: string): void {
    this.datosDelTramiteRealizar.patchValue({
      fechadepago: nuevo_valor,
         });
    this.solicitud260919Store.setFechadePago(nuevo_valor);
  }
  /**
 * Método para alternar el estado del control de licencia sanitaria.
 * Si el aviso de funcionamiento está activado y no hay texto en licencia sanitaria, deshabilita el control.
 * Si hay texto en licencia sanitaria, mantiene el control habilitado.
 */
toggleLicenciaSanitaria(): void {
  const AVISO_DE_FUNCIONAMIENTO = this.dataDeLaSolicitudForm.get(
    'datosDelTramiteRealizar.avisoDeFuncionamiento'
  )?.value;
  const LICENCIA_SANITARIA_CONTROL = this.dataDeLaSolicitudForm.get(
    'datosDelTramiteRealizar.licenciaSanitaria'
  );
  const LICENCIA_SANITARIA_VALUE = LICENCIA_SANITARIA_CONTROL?.value;

  if (AVISO_DE_FUNCIONAMIENTO && !LICENCIA_SANITARIA_VALUE) {
    LICENCIA_SANITARIA_CONTROL?.disable();
  } else {             
    LICENCIA_SANITARIA_CONTROL?.enable();
  }
}
  /**
   * Método para manejar el evento de cambio en el tipo de operación.
   * Si el tipo de operación es "modificación", habilita el control de justificación.
   * En caso contrario, deshabilita el control de justificación y limpia su valor.
   */
  changeEvent(): void {
    const TIPO_OPERACION = this.dataDeLaSolicitudForm.get(
      'datosDelTramiteRealizar.tipoOperacion'
    )?.value;
    const JUSTIFICACION_CONTROL = this.dataDeLaSolicitudForm.get(
      'datosDelTramiteRealizar.justification'
    );

    if (TIPO_OPERACION === 'modificacion') {
      JUSTIFICACION_CONTROL?.enable();
    } else {
      JUSTIFICACION_CONTROL?.disable();
      JUSTIFICACION_CONTROL?.setValue('');
    }
  }

  /** Obtiene los datos de los estados */
  getEstadosData(): void {
    this.importarDeRemediosHerbals
      .getEstadosData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        this.estadoData.catalogos = data as Catalogo[];
      });
  }
  /** Obtiene los datos de clave SCIAN */
  getClaveScianData(): void {
    this.importarDeRemediosHerbals
      .getClaveScianData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.claveScianData.catalogos = data as Catalogo[];
      });
  }
  /** Inicializa el estado del formulario según si es de solo lectura o no */
  getClasificacionDelProductoData(): void {
    this.importarDeRemediosHerbals
      .getClasificacionDelProductoData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.delProducto.catalogos = data as Catalogo[];
      });
  }
  /** Obtiene los datos para especificar clasificación del producto */
  getEspificarData(): void {
    this.importarDeRemediosHerbals
      .getEspificarData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.especificarData.catalogos = data as Catalogo[];
      });
  }

  /**
   * Método para obtener los datos de las mercancías.
   * Realiza una solicitud al servicio `ImportarDeRemediosHerbalsService` para obtener los datos de las mercancías.
   * Los datos obtenidos se asignan a la propiedad `mercanciasData`.
   */
  getMercanciasData(): void {
    this.importarDeRemediosHerbals
      .getMercanciasData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.mercanciasData = data as unknown as MercanciasInfo[];
      });
  }
  /**
   * Método para obtener los datos del estado físico de la mercancía.
   */
  getEstadoFisicoData(): void {
    this.importarDeRemediosHerbals
      .getEstadoFisicoData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoFisicoData.catalogos = data as Catalogo[];
      });
  }

  /** Obtiene los datos del régimen */
  getRegimenalqueData(): void {
    this.importarDeRemediosHerbals
      .getRegimenalqueData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.regimenalqueData.catalogos = data as Catalogo[];
      });
  }

  /** Obtiene los datos de la aduana */
  getAduanaData(): void {
    this.importarDeRemediosHerbals
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

  /** Método para abrir el modal de selección de establecimiento */
  seleccionarEstablecimiento(): void {
    this.abrirModal(0, true);
  }

  /** Método para obtener los datos de la solicitud */
  getSolicitudData(): void {
    this.importarDeRemediosHerbals.getSolicitudData().subscribe((data) => {
      if (data && data.length > 0) {
        const SOLICITUD_DATA = data[0];
        this.datosDelTramiteRealizar.patchValue({
          legalRazonSocial: SOLICITUD_DATA.nombreORazónSocial,
          apellidoPaterno: SOLICITUD_DATA.apellidoPaterno,
          apellidoMaterno: SOLICITUD_DATA.apellidoMaterno,
        });
        this.datosDelTramiteRealizar.get('legalRazonSocial')?.disable();
        this.datosDelTramiteRealizar.get('apellidoPaterno')?.disable();
        this.datosDelTramiteRealizar.get('apellidoMaterno')?.disable();
      }
    });
  }
  /** Método para abrir el modal de agregar mercancía */
 
onAdd(): void {
  if (!this.modalElement) {
    this.modalElement = document.getElementById('modalAgregarMercancia');
  }
  if (this.modalElement) {
    const MODAL_INSTANCE = new Modal(this.modalElement);
    MODAL_INSTANCE.show();
  }
}
  /** Método para obtener la clave y descripción del SCIAN */
  getClaveDescripcionDelData(): void {
    this.importarDeRemediosHerbals
      .getClaveDescripcionDelData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.descripcionDelScianData.catalogos = data as Catalogo[];
      });
  }
  /** Método para obtener los datos del tipo de producto */
  getTipoProductoData(): void {
    this.importarDeRemediosHerbals
      .getTipoProductoData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tipoProductoData.catalogos = data as Catalogo[];
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
  /** Método para manejar la selección de filas en la tabla */
  onfilasSeleccionadas(
    filasSeleccionadas: FilaData[] | MercanciasInfo[]
  ): void {
    if (
      filasSeleccionadas.length > 0 &&
      'especificarProducto' in filasSeleccionadas[0]
    ) {
      this.filasSeleccionadas = new Set(
        (filasSeleccionadas as MercanciasInfo[]).map((row) => row.id)
      );
    } else if (
      filasSeleccionadas.length > 0 &&
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
    }
  }
  /** Método para manejar la eliminación de filas seleccionadas */
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
  /** Método para manejar la adición de una nueva clave SCIAN */
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
  /** Método para manejar el envío del formulario de clave SCIAN */
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
  /** Método para manejar la cancelación del formulario de clave SCIAN */
  onCancelar(): void {
    this.showClavaScianForm = false;
    this.clavaScianForm.reset();
  }

  /** Método para limpiar el formulario de clave SCIAN */
  onLimpiar(): void {
    this.clavaScianForm.reset();
  }
  /** Método para manejar el guardado de los datos de la solicitud */
  onSave(): void {
    const FORM_DATA = { ...this.dataDeLaSolicitudForm.value };
    FORM_DATA.tipoProducto =
      this.tipoProductoData.catalogos.find(
        (item: Catalogo) => String(item.id) === String(FORM_DATA.tipoProducto)
      )?.descripcion || FORM_DATA.tipoProducto;

    FORM_DATA.clasificaionProductos =
      this.delProducto.catalogos.find(
        (item: Catalogo) =>
          String(item.id) === String(FORM_DATA.clasificaionProductos)
      )?.descripcion || FORM_DATA.clasificaionProductos;

    FORM_DATA.especificarProducto =
      this.especificarData.catalogos.find(
        (item: Catalogo) =>
          String(item.id) === String(FORM_DATA.especificarProducto)
      )?.descripcion || FORM_DATA.especificarProducto;

    FORM_DATA.estadoFisico =
      this.estadoFisicoData.catalogos.find(
        (item: Catalogo) => String(item.id) === String(FORM_DATA.estadoFisico)
      )?.descripcion || FORM_DATA.estadoFisico;

    FORM_DATA.descripcionFraccionArancelaria =
      FORM_DATA.descripcionFraccionArancelaria || '';
    FORM_DATA.cantidadUMT = FORM_DATA.cantidadUMT || '';
    FORM_DATA.umt = FORM_DATA.umt || '';
    FORM_DATA.cantidadUMC = FORM_DATA.cantidadUMC || '';
    FORM_DATA.umc = FORM_DATA.umc || '';
    FORM_DATA.nombreProductoEspecifico =
      FORM_DATA.nombreProductoEspecifico || '';
    FORM_DATA.denominacionDistintiva = FORM_DATA.denominacionDistintiva || '';
    FORM_DATA.denominacionNombre = FORM_DATA.denominacionNombre || '';
    FORM_DATA.presentacionFarmaceutica =
      FORM_DATA.presentacionFarmaceutica || '';
    FORM_DATA.fraccionArancelaria = FORM_DATA.fraccionArancelaria || '';
    FORM_DATA.formaFarmaceutica = FORM_DATA.formaFarmaceutica || '';
    FORM_DATA.numeroDeRegistroSanitario =
      FORM_DATA.numeroDeRegistroSanitario || '';
    FORM_DATA.fechadepago = FORM_DATA.fechadepago || '';

    if (this.indiceFilaSeleccionada !== null) {
      this.mercanciasData[this.indiceFilaSeleccionada] = {
        ...this.mercanciasData[this.indiceFilaSeleccionada],
        ...FORM_DATA,
      };
      this.indiceFilaSeleccionada = null;
    } else {
this.mercanciasData = [...this.mercanciasData, FORM_DATA];  
  }

    this.tableData2 = [...this.mercanciasData];
    this.dataDeLaSolicitudForm.reset();
  }
  /** Método para manejar la modificación de una fila seleccionada */
  onModificar(): void {
    if (!this.filasSeleccionadas || this.filasSeleccionadas.size !== 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona solo un registro para modificar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    const SELECTED_ID = Array.from(this.filasSeleccionadas)[0];
    const SELECTED_ROW_INDEX = this.mercanciasData.findIndex(
      (row) => row.id === SELECTED_ID
    );
    if (SELECTED_ROW_INDEX === -1) {
      return;
    }
    this.indiceFilaSeleccionada = SELECTED_ROW_INDEX;
    const SELECTED_ROW = this.mercanciasData[SELECTED_ROW_INDEX];
    this.dataDeLaSolicitudForm.patchValue({
      descripcionFraccionArancelaria: SELECTED_ROW.descripcionDeLaFraccion,
      cantidadUMT: SELECTED_ROW.cantidadUMT,
      umt: SELECTED_ROW.UMT,
      cantidadUMC: SELECTED_ROW.cantidadUMC,
      umc: SELECTED_ROW.UMC,
      tipoProducto:
        this.tipoProductoData.catalogos.find(
          (item) => item.descripcion === SELECTED_ROW.tipoProducto
        )?.id || SELECTED_ROW.tipoProducto,
      clasificaionProductos:
        this.delProducto.catalogos.find(
          (item) => item.descripcion === SELECTED_ROW.clasificaionProductos
        )?.id || SELECTED_ROW.clasificaionProductos,
      especificarProducto:
        this.especificarData.catalogos.find(
          (item) => item.descripcion === SELECTED_ROW.especificarProducto
        )?.id || SELECTED_ROW.especificarProducto,
      nombreProductoEspecifico: SELECTED_ROW.denominacionEspecifica,
      denominacionDistintiva: SELECTED_ROW.denominacionDistintiva,
      denominacionNombre: SELECTED_ROW.denominacionComun,
      estadoFisico:
        this.estadoFisicoData.catalogos.find(
          (item) => item.descripcion === SELECTED_ROW.estadoFisico
        )?.id || SELECTED_ROW.estadoFisico,
      presentacionFarmaceutica: SELECTED_ROW.presentacion,
      fraccionArancelaria: SELECTED_ROW.fraccionArancelaria,
      numeroDeRegistoSanitario: SELECTED_ROW.numeroDeRegistoSanitario,
      formaFarmaceutica: SELECTED_ROW.formaFarmaceutica,
      numeroDeRegistroSanitario: SELECTED_ROW.numeroDeRegistoSanitario,
      fechadepago: SELECTED_ROW.fechaDeCaducidad,
    });
    const MODAL_ELEMENT = document.getElementById('modalAgregarMercancia');
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = new Modal(MODAL_ELEMENT);
      MODAL_INSTANCE.show();
    }
  }
  /** Método para manejar la eliminación de filas seleccionadas */
  onEliminar(): void {
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
    this.abrirModal();
        }

inicializarEstadoFormulario(): void {
  if (this.esFormularioSoloLectura) {
    this.dataDeLaSolicitudForm?.disable();
    this.clavaScianForm?.disable();
    this.datosDelTramiteRealizar.disable();
  }
  else {
    this.dataDeLaSolicitudForm?.enable();
    this.clavaScianForm?.enable();
    this.datosDelTramiteRealizar.enable();
  }
}
  /**
   * Método para establecer valores en el store de la solicitud.
   * Obtiene el valor de un campo del formulario y lo asigna al método correspondiente en el store.
   * @param form - Formulario reactivo que contiene los datos.
   * @param campo - Nombre del campo del formulario cuyo valor se desea obtener.
   * @param metodoNombre - Nombre del método en el store donde se asignará el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud260919Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud260919Store[metodoNombre] as (value: unknown) => void)(
      VALOR
    );
  }

  /** Destrucción del componente */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

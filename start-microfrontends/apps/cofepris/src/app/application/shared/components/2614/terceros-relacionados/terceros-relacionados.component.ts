/**
 * Importaciones necesarias para el componente de terceros relacionados.
 * Incluye módulos y servicios para gestionar la tabla dinámica de destinatarios relacionados.
 */
import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';


import { Modal } from 'bootstrap';

import { Subject, map, takeUntil } from 'rxjs';

import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  CatalogoServices,
  ConfiguracionColumna,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_CORREO_ELECTRONICO,
  REGEX_NOMBRE,
  REG_X,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoPersona,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import {
  ID_PROCEDIMIENTO,
  PERMISO_DEFINITIVO_TITULO,
} from '../../../constantes/shared2614/solicitud-modificacion-permiso-salida-territorio.enum';

import {
  DESTINATARIO_ENCABEZADO_DE_TABLA,
  Destinatario,
} from '../../../constantes/shared2614/destinatario.enum';

import { TIPO_PERSONA_RADIO_OPTIONS } from '../../../constantes/shared2614/constantes.enum';

import { Tramite261401Store } from '../../../../tramites/261401/estados/tramite261401.store';

import {
  Solicitud2614State,
  Tramite2614Store,
} from '../../../../estados/tramites/tramite2614.store';

import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query';

import { Tramite261401Query } from '../../../../tramites/261401/estados/tramite261401.query';

import { MENSAJE_TABLA_OBLIGATORIA } from '../../../../shared/models/terceros-relacionados.model';
import { SolicitudModificacionPermisoInternacionService } from '../../../../shared/services/shared2614/solicitud-modificacion-permiso-internacion.service';


/**
 * Componente que representa la sección de terceros relacionados.
 * Este componente es standalone y utiliza CommonModule, AlertComponent, TituloComponent y TablaDinamicaComponent.
 * Gestiona la tabla dinámica de destinatarios relacionados y actualiza el estado del store.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [CommonModule, AlertComponent, TituloComponent, TablaDinamicaComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    ReactiveFormsModule,
    NotificacionesComponent
  ],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {
    /**
     * Identificador de la sección de permisos específica para este procedimiento.
     * Se espera como string.
     */
    @Input() permisoSeccion: string = '';
  /**
   * Indica si el formulario debe mostrarse solo en modo lectura.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Constante de referencia para los procedimientos válidos.
   */
  static readonly ID_PROCEDIMIENTO = ID_PROCEDIMIENTO;

  /**
   * Identificador del procedimiento asociado a este componente.
   */
  @Input() idProcedimiento: string[] = ID_PROCEDIMIENTO;

  /**
 * @property
 * @name permisoDefinitivoTitulo
 * @type {string}
 * @description Lista de identificadores de títulos de permisos definitivos asociados al trámite actual.
 */
  @Input() permisoDefinitivoTitulo: string[] = PERMISO_DEFINITIVO_TITULO;

  /**
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   * Este input permite pasar el estado de consulta desde el componente contenedor.
   * Se utiliza para controlar el modo de solo lectura y otros comportamientos dependientes del estado de la consulta.
   * @type {ConsultaioState}
   * @Input
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * Referencia al elemento modal para control programático
   */
  @ViewChild('modalRef') modalElement!: ElementRef;

  /**
   * Mensaje de alerta obligatorio para la tabla.
   */
  MENSAJE_TABLA_OBLIGATORIA = MENSAJE_TABLA_OBLIGATORIA;

  /**
   * Tipo de alerta que se muestra en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Configuración de las columnas de la tabla de destinatarios finales.
   */
  configuracionTablaDestinatarioFinal: ConfiguracionColumna<Destinatario>[] = DESTINATARIO_ENCABEZADO_DE_TABLA;

  /**
   * Tipo de selección utilizado en la tabla dinámica.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Lista de destinatarios obtenidos.
   */
  destinatarioDatos: Destinatario[] = [];

  /**
   * Subject utilizado para manejar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Conjunto de IDs de las filas seleccionadas en la tabla dinámica.
   */
  selectedRows: Set<number> = new Set();
  /**
   * Formulario reactivo para gestionar la información de los destinatarios.
   */
  destinatarioForm!: FormGroup;
  /**
   * Estado actual de la solicitud para agregar destinatarios.
   */
  agregarDestinatarioState!: Solicitud2614State;
    /**
     * Configuración para el selector de países.
     */
    /**
     * Configuración para el selector de países.
     * @property {string} labelNombre - Etiqueta que se muestra para el campo de país en el formulario.
     * @property {boolean} required - Indica si el campo de país es obligatorio.
     * @property {string} primerOpcion - Texto de la primera opción mostrada en el selector de países.
     * @property {Catalogo[]} catalogos - Arreglo de objetos de tipo Catalogo que contiene los países disponibles.
     */
    public paisData = {
      /**
       * Etiqueta que se muestra para el campo de país en el formulario.
       */
      labelNombre: 'Pais',
      /**
       * Indica si el campo de país es obligatorio.
       */
      required: true,
      /**
       * Texto de la primera opción mostrada en el selector de países.
       */
      primerOpcion: '',
      /**
       * Arreglo de objetos de tipo Catalogo que contiene los países disponibles.
       */
      catalogos: [] as Catalogo[],
    };
  /**
   * Datos que se muestran en la tabla dinámica de destinatarios.
   */
  tableData: Destinatario[] = [];
  /**
   * Opciones para el selector de tipo de persona (física o moral).
   */
  tipoPersonaRadioOptions = TIPO_PERSONA_RADIO_OPTIONS;
  /**
   * Variable para almacenar el tipo de público seleccionado.
   */
  tipoDePublicos: string = '';
  /**
   * Variable para almacenar el tipo de persona seleccionado.
   */
  tipoPersonaSeleccionada: string = '';
  /**
   * Booleano que indica si el formulario para agregar/modificar destinatarios es visible.
   */
  esFormularioVisible = false;
  /**
   * Objeto para configurar las notificaciones mostradas al usuario.
   */
  public nuevaNotificacion!: Notificacion;
    /**
     * ID del elemento que se va a eliminar.
     */
  elementoParaEliminar!: number;
  
  /**
   * Indica si estamos en modo edición (modificar) o agregando nuevo destinatario
   */
  modoEdicion = false;
  
  /**
   * ID del destinatario que se está editando
   */
  destinatarioEditandoId: number | null = null;

   /**
   * Enumeración expuesta al template para comparar el tipo de persona seleccionado (física o moral)
   * sin necesidad de codificar los valores directamente en la vista.
   */
  public TipoPersonaEnum = TipoPersona;
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados por el usuario.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   * @param solicitudDatosService Servicio para obtener los datos de los destinatarios.
   * @param tramite2614Store Store para gestionar el estado del trámite.
   * @param tramite2614Query Query para obtener datos del estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    public solicitudDatosService: SolicitudModificacionPermisoInternacionService,
    private tramite2614Store: Tramite2614Store,
    private tramite2614Query: Tramite2614Query,
    private tramite261401Store: Tramite261401Store,
    private tramite261401Query: Tramite261401Query,
    private consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef,
    private catalogoService: CatalogoServices
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
      
    this.tramite2614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((solicitudState) => {
          this.destinatarioDatos = Array.isArray(solicitudState.destinatarioDatos)
            ? ((solicitudState.destinatarioDatos as unknown) as Record<string, unknown>[]).map(item => TercerosRelacionadosComponent.mapToDestinatario(item))
            : [];
          this.agregarDestinatarioState = solicitudState;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
      
    // Suscríbase a la tienda 261401 para la persistencia de los destinatarios
    this.tramite261401Query.selectDestinatarios$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((destinatarios) => {
          if (destinatarios && destinatarios.length > 0) {
            this.tableData = [...destinatarios];
            this.destinatarioDatos = [...destinatarios];
            this.cdr.detectChanges();
          }
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene la lista de destinatarios relacionados.
   */
  ngOnInit(): void {
    this.crearFormTransporte();
    this.getPaisData();
    this.obtenerDestinatarioListo();
  }

  private static mapToDestinatario(item: Record<string, unknown>): Destinatario {
  const KEYS: (keyof Destinatario)[] = [
    'id', 'nombre', 'rfc', 'curp', 'telefono', 'correoElectronico', 'calle',
    'numeroExterior', 'numeroInterior', 'pais', 'colonia', 'municipio', 'localidad',
    'estado', 'estado2', 'codigo', 'primerApellido', 'segundoApellido', 'denominacion',
    'domicilio', 'codigopostal', 'lada', 'tipoPersona'
  ];
  const RESULT = {} as Record<keyof Destinatario, unknown>;
  for (const KEY of KEYS) {
    if (typeof item[KEY] !== 'undefined' && item[KEY] !== null) {
      RESULT[KEY] = item[KEY];
    } else {
      switch (KEY) {
        case 'id':
        case 'lada':
          RESULT[KEY] = 0;
          break;
        default:
          RESULT[KEY] = '';
      }
    }
  }
  return RESULT as Destinatario;
}

/**
 * Obtiene la lista de destinatarios desde el servicio y actualiza el estado del store.
 */
obtenerDestinatarioListo(): void {
  this.solicitudDatosService
    .obtenerDestinatarioListo()
    .pipe(
      map((data: unknown[]) => (data as Record<string, unknown>[]).map(item => TercerosRelacionadosComponent.mapToDestinatario(item))),
      takeUntil(this.destroyNotifier$)
    )
    .subscribe({
      next: (respuesta: Destinatario[]) => {
        this.destinatarioDatos = respuesta;
        this.tramite2614Store.setDestinatarioDatos(respuesta);
      },
    });
}

  /**
   * Crea y configura el formulario reactivo para los datos del destinatario.
   * Inicializa los controles del formulario con los valores actuales del estado
   * y aplica las validaciones necesarias para cada campo.
   * 
   * Los campos incluyen tipo de persona, nombre, apellidos, denominación, país,
   * domicilio, estado, código postal, calle, número exterior/interior, lada,
   * teléfono y correo electrónico.
   */
   crearFormTransporte(): void {
    this.obtenerEstadoSolicitud();
    this.destinatarioForm = this.fb.group({
     
        tipoPersona: [
          this.agregarDestinatarioState?.tipoPersona,
          Validators.required,
        ],
    
        nombre: [this.agregarDestinatarioState?.nombre, [Validators.required, Validators.pattern(REGEX_NOMBRE)]],
        primerApellido: [
          this.agregarDestinatarioState?.primerApellido,
          [Validators.required, Validators.pattern(REGEX_NOMBRE)]
        ],
        segundoApellido: [
          this.agregarDestinatarioState?.segundoApellido,
          [Validators.pattern(REGEX_NOMBRE)]
        ],
        denominacion: [
          this.agregarDestinatarioState?.denominacion,
          [Validators.required, Validators.pattern(REGEX_NOMBRE)],
        ],
        pais: [this.agregarDestinatarioState?.pais, Validators.required],
        estado: [this.agregarDestinatarioState?.estado, Validators.required],
        codigopostal: [
          this.agregarDestinatarioState?.codigopostal,
          [
            Validators.required,
            Validators.pattern(REG_X.SOLO_NUMEROS),
            Validators.maxLength(12)
          ]
        ],
        calle: [this.agregarDestinatarioState?.calle, [Validators.required]],
        numeroExterior: [
          this.agregarDestinatarioState?.numeroExterior,
          Validators.required,
        ],
        numeroInterior: [
          this.agregarDestinatarioState?.numeroInterior
        ],
        lada: [this.agregarDestinatarioState?.lada],
        telefono: [this.agregarDestinatarioState?.telefono, [Validators.pattern(REG_X.SOLO_NUMEROS)]],
        correoElectronico: [this.agregarDestinatarioState?.correoElectronico, [Validators.pattern(REGEX_CORREO_ELECTRONICO)]],
      });

      this.disableAllFieldsExceptTipoPersona();
      

  }    
  
  /**
 * Inicializa el estado de los formularios según el modo de solo lectura.
 *
 * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), llama a `guardarDatosFormulario()`
 * para deshabilitar todos los controles. En caso contrario, inicializa los formularios normalmente.
 */
   inicializarEstadoFormulario(): void {
      this.crearFormTransporte();
  }
  /**
   * Suscribe al observable `selectSolicitud$` del query para obtener el estado actual de la solicitud y actualizar la propiedad `seccionState` con los datos recibidos. La suscripción se mantiene activa hasta que se emite un valor en `destroyed$`, evitando fugas de memoria.
   */
  obtenerEstadoSolicitud(): void {
   this.tramite2614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.agregarDestinatarioState = seccionState;
        })
      )
      .subscribe();
  }
    /**
 * Guarda y actualiza el estado de los formularios según el modo de solo lectura.
 *
 * Inicializa los formularios y luego los deshabilita si el formulario está en modo solo lectura,
 * o los habilita si está en modo edición.
 */
  guardarDatosFormulario(): void {
    this.crearFormTransporte();
}
   /**
   * Guarda los datos del formulario en la tabla.
   */
  onGuardar() :void{
    if (this.isFormValidForSelectedPersonType()) {
      const FORM_DATA = this.destinatarioForm.value;
      const DESTINARIO: Partial<Destinatario> = {
        id: this.modoEdicion ? (this.destinatarioEditandoId || 0) : this.tableData.length + 1,
        tipoPersona: FORM_DATA.tipoPersona,
        nombre: FORM_DATA.nombre,
        primerApellido: FORM_DATA.primerApellido,
        segundoApellido: FORM_DATA.segundoApellido || '',
        denominacion: FORM_DATA.denominacion,
        rfc: '',
        curp: '',
        pais: this.getPaisName(FORM_DATA.pais), 
        estado: FORM_DATA.estado,
        estado2: '',
        codigopostal: FORM_DATA.codigopostal,
        codigo: FORM_DATA.codigopostal, 
        calle: FORM_DATA.calle,
        colonia: '',
        municipio: '',
        localidad: '',
        numeroExterior: FORM_DATA.numeroExterior,
        numeroInterior: FORM_DATA.numeroInterior || '',
        domicilio: FORM_DATA.calle + ', ' + FORM_DATA.numeroExterior, 
        lada: FORM_DATA.lada || 0,
        telefono: FORM_DATA.telefono || '',
        correoElectronico: FORM_DATA.correoElectronico || ''
      };
      
      if (this.modoEdicion && this.destinatarioEditandoId) {
        const INDEX = this.tableData.findIndex(item => item.id === this.destinatarioEditandoId);
        if (INDEX !== -1) {
          this.tableData[INDEX] = DESTINARIO as Destinatario;
          this.tableData = [...this.tableData];
        }
      } else {
        this.tableData = [...this.tableData, DESTINARIO as Destinatario];
      }
      
      // Guardar en ambas tiendas para persistencia
      this.tramite2614Store.actualizarEstado({ destinatarioDatos: this.tableData });
      this.tramite261401Store.setDestinatarios(this.tableData);
      
      this.cdr.detectChanges();
      this.limpiarFormulario();
      this.closeModal();
    } else {
      this.markRelevantFieldsAsTouched();
    }
  }

  /**
   * Obtiene el nombre del país a partir de su ID.
   * @param paisId ID del país.
   * @returns Nombre del país o 'N/A' si no se encuentra.
   */
  private getPaisName(paisId: string): string {
    const PAIS = this.paisData.catalogos.find(
      (catalogo) => catalogo.id === Number(paisId)
    );
    return PAIS ? PAIS.descripcion : 'N/A';
  }


  /**
   * Obtiene los datos del catálogo de países.
   */
  /**
   * Obtiene los datos del catálogo de países desde el servicio de catálogos.
   * Llama a la API usando el id del procedimiento y actualiza el arreglo de países disponibles.
   *
   * @remarks
   * - Utiliza CatalogoServices para obtener el catálogo de países.
   * - El resultado se almacena en paisData.catalogos.
   * - Si la respuesta no contiene datos, se asigna un arreglo vacío.
   */
  getPaisData(): void {
    this.catalogoService.paisesCatalogo(
      Array.isArray(this.idProcedimiento) ? this.idProcedimiento[0] : this.idProcedimiento
    )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(response => {
        /**
         * Asigna el catálogo de países obtenidos de la respuesta.
         * Si no hay datos, se asigna un arreglo vacío.
         */
        this.paisData.catalogos = Array.isArray(response?.datos)
          ? response.datos
          : [];
      });
  }

  /**
   * Valida el formulario solo para los campos relevantes según el tipo de persona seleccionado
   */
  private isFormValidForSelectedPersonType(): boolean {
    const TIPO_PERSONA = this.destinatarioForm.get('tipoPersona')?.value;
    
    if (!this.validateCommonFields()) {
      return false;
    }
    
    if (TIPO_PERSONA === TipoPersona.FISICA || TIPO_PERSONA === 'Fisica') {
      return this.validateFisicaFields();
    } else if (TIPO_PERSONA === TipoPersona.MORAL || TIPO_PERSONA === 'Moral') {
      return this.validateMoralFields();
    }
    
    return this.validateOptionalFields();
  }

  /**
   * Valida campos comunes requeridos
   */
  private validateCommonFields(): boolean {
    const COMMON_REQUIRED_FIELDS = ['tipoPersona', 'pais', 'estado', 'calle', 'numeroExterior'];
    
    for (const FIELD of COMMON_REQUIRED_FIELDS) {
      const CONTROL = this.destinatarioForm.get(FIELD);
      if (CONTROL && (CONTROL.invalid || !CONTROL.value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Valida campos específicos para persona física
   */
  private validateFisicaFields(): boolean {
    const FISICA_REQUIRED_FIELDS = ['nombre', 'primerApellido'];
    
    for (const FIELD of FISICA_REQUIRED_FIELDS) {
      const CONTROL = this.destinatarioForm.get(FIELD);
      if (CONTROL && (CONTROL.invalid || !CONTROL.value)) {
        return false;
      }
    }
    return this.validateOptionalFields();
  }

  /**
   * Valida campos específicos para persona moral
   */
  private validateMoralFields(): boolean {
    const MORAL_REQUIRED_FIELDS = ['denominacion'];
    
    for (const FIELD of MORAL_REQUIRED_FIELDS) {
      const CONTROL = this.destinatarioForm.get(FIELD);
      if (CONTROL && (CONTROL.invalid || !CONTROL.value)) {
        return false;
      }
    }
    return this.validateOptionalFields();
  }

  /**
   * Valida campos opcionales que tienen validaciones de formato
   */
  private validateOptionalFields(): boolean {
    const OPTIONAL_FIELDS_WITH_VALIDATION = ['correoElectronico', 'segundoApellido'];
    for (const FIELD of OPTIONAL_FIELDS_WITH_VALIDATION) {
      const CONTROL = this.destinatarioForm.get(FIELD);
      if (CONTROL && CONTROL.value && CONTROL.invalid) {
        return false;
      }
    }
    return true;
  }

  /**
   * Marca como touched solo los campos relevantes según el tipo de persona seleccionado
   */
  public markRelevantFieldsAsTouched(): void {
    const TIPO_PERSONA = this.destinatarioForm.get('tipoPersona')?.value;
    const COMMON_REQUIRED_FIELDS = ['tipoPersona', 'pais', 'estado', 'calle', 'numeroExterior', 'codigopostal'];
    COMMON_REQUIRED_FIELDS.forEach(FIELD => {
      const CONTROL = this.destinatarioForm.get(FIELD);
      if (CONTROL) {
        CONTROL.markAsTouched();
      }
    });
    
    if (TIPO_PERSONA === TipoPersona.FISICA || TIPO_PERSONA === 'Fisica') {
      const FISICA_REQUIRED_FIELDS = ['nombre', 'primerApellido'];
      
      FISICA_REQUIRED_FIELDS.forEach(FIELD => {
        const CONTROL = this.destinatarioForm.get(FIELD);
        if (CONTROL) {
          CONTROL.markAsTouched();
        }
      });
    } else if (TIPO_PERSONA === TipoPersona.MORAL || TIPO_PERSONA === 'Moral') {
      const MORAL_REQUIRED_FIELDS = ['denominacion'];
      
      MORAL_REQUIRED_FIELDS.forEach(FIELD => {
        const CONTROL = this.destinatarioForm.get(FIELD);
        if (CONTROL) {
          CONTROL.markAsTouched();
        }
      });
    }
    
    const OPTIONAL_FIELDS_WITH_VALIDATION = ['correoElectronico', 'segundoApellido'];
    OPTIONAL_FIELDS_WITH_VALIDATION.forEach(FIELD => {
      const CONTROL = this.destinatarioForm.get(FIELD);
      if (CONTROL && CONTROL.value) {
        CONTROL.markAsTouched();
      }
    });
  }

  /**
   * Establece el tipo de persona seleccionado.
   * Valor seleccionado (cadena o número).
   */
  setTipoPersona(value: string | number): void {
    this.tipoPersonaSeleccionada = value.toString();
    const NORMALIZED_VALUE = value.toString();
    if (NORMALIZED_VALUE === 'Fisica' || NORMALIZED_VALUE === 'fisica') {
      this.enableFieldsForPersonaFisica();
    } else if (NORMALIZED_VALUE === 'Moral' || NORMALIZED_VALUE === 'moral') {
      this.enableFieldsForPersonaMoral();
    } else {
      this.disableAllFieldsExceptTipoPersona();
    }
  }

  /**
   * Deshabilita todos los campos excepto tipoPersona
   */
  private disableAllFieldsExceptTipoPersona(): void {
    const FIELDS_TO_DISABLE = [
      'nombre', 'primerApellido', 'segundoApellido', 'denominacion',
      'pais', 'estado', 'codigopostal', 'calle', 'numeroExterior', 'numeroInterior', 
      'lada', 'telefono', 'correoElectronico'
    ];
    
    FIELDS_TO_DISABLE.forEach(field => {
      const CONTROL = this.destinatarioForm.get(field);
      if (CONTROL) {
        CONTROL.disable();
      }
    });
  }

  /**
   * Habilita campos específicos para persona física y deshabilita campos de persona moral
   */
  private enableFieldsForPersonaFisica(): void {
    const COMMON_FIELDS = [
      'pais', 'estado', 'codigopostal', 'calle', 'numeroExterior', 'numeroInterior', 
      'lada', 'telefono', 'correoElectronico'
    ];
    const FISICA_FIELDS = ['nombre', 'primerApellido', 'segundoApellido'];
    const MORAL_FIELDS = ['denominacion'];

    [...COMMON_FIELDS, ...FISICA_FIELDS].forEach(field => {
      const CONTROL = this.destinatarioForm.get(field);
      if (CONTROL) {
        CONTROL.enable();
      }
    });
    MORAL_FIELDS.forEach(field => {
      const CONTROL = this.destinatarioForm.get(field);
      if (CONTROL) {
        CONTROL.disable();
        if (this.destinatarioForm.get('tipoPersona')?.value !== 'Moral') {
          CONTROL.setValue('');
        }
        CONTROL.clearValidators();
        CONTROL.updateValueAndValidity();
      }
    });
    this.applyPersonaFisicaValidators();
  }

  /**
   * Habilita campos específicos para persona moral y deshabilita campos de persona física
   */
  private enableFieldsForPersonaMoral(): void {
    const COMMON_FIELDS = [
      'pais', 'estado', 'codigopostal', 'calle', 'numeroExterior', 'numeroInterior', 
      'lada', 'telefono', 'correoElectronico'
    ];
    
    const MORAL_FIELDS = ['denominacion'];
    
    const FISICA_FIELDS = ['nombre', 'primerApellido', 'segundoApellido'];
    
    [...COMMON_FIELDS, ...MORAL_FIELDS].forEach(field => {
      const CONTROL = this.destinatarioForm.get(field);
      if (CONTROL) {
        CONTROL.enable();
      }
    });
    
    FISICA_FIELDS.forEach(field => {
      const CONTROL = this.destinatarioForm.get(field);
      if (CONTROL) {
        CONTROL.disable();
        CONTROL.setValue('');
        CONTROL.clearValidators();
        CONTROL.updateValueAndValidity();
      }
    });
    
    this.applyPersonaMoralValidators();
  }

  /**
   * Aplica validaciones específicas para persona física
   */
  private applyPersonaFisicaValidators(): void {
    const NOMBRE_CONTROL = this.destinatarioForm.get('nombre');
    const PRIMER_APELLIDO_CONTROL = this.destinatarioForm.get('primerApellido');
    const SEGUNDO_APELLIDO_CONTROL = this.destinatarioForm.get('segundoApellido');
    
    if (NOMBRE_CONTROL) {
      NOMBRE_CONTROL.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
      NOMBRE_CONTROL.updateValueAndValidity();
    }
    
    if (PRIMER_APELLIDO_CONTROL) {
      PRIMER_APELLIDO_CONTROL.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
      PRIMER_APELLIDO_CONTROL.updateValueAndValidity();
    }
    
    if (SEGUNDO_APELLIDO_CONTROL) {
      SEGUNDO_APELLIDO_CONTROL.setValidators([Validators.pattern(REGEX_NOMBRE)]);
      SEGUNDO_APELLIDO_CONTROL.updateValueAndValidity();
    }
  }

  /**
   * Aplica validaciones específicas para persona moral
   */
  private applyPersonaMoralValidators(): void {
    const DENOMINACION_CONTROL = this.destinatarioForm.get('denominacion');
    
    if (DENOMINACION_CONTROL) {
      DENOMINACION_CONTROL.setValidators([Validators.required, Validators.pattern(REGEX_NOMBRE)]);
      DENOMINACION_CONTROL.updateValueAndValidity();
    }
  }

  /**
   * Habilita todos los campos excepto tipoPersona (método heredado - ya no usado)
   */
  private enableAllFields(): void {
    const FIELDS_TO_ENABLE = [
      'nombre', 'primerApellido', 'segundoApellido', 'denominacion',
      'pais', 'estado', 'codigopostal', 'calle', 'numeroExterior', 'numeroInterior', 
      'lada', 'telefono', 'correoElectronico'
    ];
    
    FIELDS_TO_ENABLE.forEach(field => {
      const CONTROL = this.destinatarioForm.get(field);
      if (CONTROL) {
        CONTROL.enable();
      }
    });
  }

    /**
   * Cancela la visualización del formulario y lo oculta.
   */
  cancelarFormulario(): void {
    this.esFormularioVisible = false;
  }

  /**
   * Muestra el formulario para agregar un nuevo destinatario.
   */
  mostrarFormulario(): void {
    this.limpiarFormulario();
    this.esFormularioVisible = true;
  }

  /**
   * Limpia todos los campos del formulario de destinatario.
   */
  limpiarFormulario(): void {
    this.destinatarioForm.reset();
    this.disableAllFieldsExceptTipoPersona();
    this.modoEdicion = false;
    this.destinatarioEditandoId = null;
  }

  /**
   * Abre el formulario modal para agregar un nuevo destinatario
   */
  abrirFormulario(): void {
    if (this.modoEdicion) {
      this.esFormularioVisible = true;
      return;
    }
    
    this.modoEdicion = false;
    this.destinatarioEditandoId = null;
    this.limpiarFormulario();
    this.esFormularioVisible = true;
  }

  /**
   * Cierra el modal programáticamente usando data-bs-dismiss
   */
  closeModal(): void {
    if (this.modalElement) {
      const MODAL_ELEMENT = this.modalElement.nativeElement;
      const CLOSE_BUTTON = MODAL_ELEMENT.querySelector('[data-bs-dismiss="modal"]');
      if (CLOSE_BUTTON) {
        (CLOSE_BUTTON as HTMLElement).click();
      } else {
        MODAL_ELEMENT.style.display = 'none';
        MODAL_ELEMENT.classList.remove('show');
        const BACKDROP = document.querySelector('.modal-backdrop');
        if (BACKDROP) {
          BACKDROP.remove();
        }
        document.body.classList.remove('modal-open');
      }
    }
  }
   /**
   * Getter para obtener el tipo de persona seleccionado.
   */
  get selectedTipoPersona(): string | null{
    return this.destinatarioForm.get('tipoPersona')?.value;
  }
  /**
   * Getter para obtener el formulario de agregar destinatario.
   */
  get agregarDestinatario(): FormGroup {
    return this.destinatarioForm.get('agregarDestinatario') as FormGroup;
  }

  /**
   * Maneja el cambio de filas seleccionadas en la tabla.
   * @param selectedRows Filas seleccionadas.
   */
  onSelectedRowsChange(selectedRows: Destinatario[]): void {
    this.selectedRows = new Set(selectedRows.map((row) => row.id));
    this.esFormularioVisible = false;
  }
   /**
   * Abre el formulario para modificar las mercancías seleccionadas.
   */
  openModificarMercancias(): void {
    if (this.selectedRows.size === 1) {
      const SELECTED_ID = Array.from(this.selectedRows)[0];
      const SELECTED_ROW_DATA = this.tableData.find(
        (row) => row.id === SELECTED_ID
      );

      if (SELECTED_ROW_DATA) {
        this.modoEdicion = true;
        this.destinatarioEditandoId = SELECTED_ID;
        this.enableAllFields();
        const NORMALIZED_TIPO_PERSONA = SELECTED_ROW_DATA.tipoPersona; 
        this.setTipoPersona(NORMALIZED_TIPO_PERSONA);
        setTimeout(() => {
          const PAIS_CATALOG_ITEM = this.paisData.catalogos.find(
            (catalogo) => catalogo.descripcion === SELECTED_ROW_DATA.pais
          );
          const PAIS_ID = PAIS_CATALOG_ITEM ? PAIS_CATALOG_ITEM.id : null;
          
          const DATA_TO_PATCH = {
              tipoPersona: NORMALIZED_TIPO_PERSONA, 
              nombre: SELECTED_ROW_DATA.nombre,
              primerApellido: SELECTED_ROW_DATA.primerApellido,
              segundoApellido: SELECTED_ROW_DATA.segundoApellido,
              denominacion: SELECTED_ROW_DATA.denominacion,
              pais: PAIS_ID,
              estado: SELECTED_ROW_DATA.estado,
              codigopostal: SELECTED_ROW_DATA.codigopostal,
              calle: SELECTED_ROW_DATA.calle,
              numeroExterior: SELECTED_ROW_DATA.numeroExterior,
              numeroInterior: SELECTED_ROW_DATA.numeroInterior,
              lada: SELECTED_ROW_DATA.lada,
              telefono: SELECTED_ROW_DATA.telefono,
              correoElectronico: SELECTED_ROW_DATA.correoElectronico,
          };
          
          this.destinatarioForm.patchValue(DATA_TO_PATCH);

          this.cdr.detectChanges();
        }, 100);

        this.esFormularioVisible = true;
        
        if (this.modalElement) {
          const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
          MODAL_INSTANCE.show();
        }
      }
    }
  }

    /**
   * Maneja la acción de eliminación de las filas seleccionadas.
   * Si hay filas seleccionadas, abre un modal para confirmar la eliminación.
   */
  onEliminar(): void {
    if (this.selectedRows.size > 0) {
      this.abrirModal();
    }
  }

  /** Elimina los destinatarios seleccionados de la lista.*/
  eliminarDestinatario(borrar: boolean): void {
    if (borrar) {
      const SELECTED_IDS = Array.from(this.selectedRows);
      this.tableData = this.tableData.filter(item => !SELECTED_IDS.includes(item.id));
      
      // Guardar en ambas tiendas después de eliminar
      this.tramite2614Store.actualizarEstado({ destinatarioDatos: this.tableData });
      this.tramite261401Store.setDestinatarios(this.tableData);
      
      this.selectedRows.clear();
      this.cdr.detectChanges();
      
      this.abrirModal(0, true);
    } else {
      this.nuevaNotificacion = {} as Notificacion;
    }
  }

   /**
   * Abre un modal para mostrar una notificación.
   * @param i Índice del elemento seleccionado (por defecto 0).
   * @param isDeleted Indica si se debe mostrar la notificación de éxito tras la eliminación.
   */
  abrirModal(i: number = 0, isDeleted: boolean = false): void {
    if (isDeleted) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        modo: 'action',
        titulo: '',
        mensaje: 'Datos eliminados correctamente',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else if (this.selectedRows && this.selectedRows.size > 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.elementoParaEliminar = i;
    }
  }
  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.destinatarioForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

    /**
   * @description Actualiza el almacén con nuevos valores basados en eventos de formulario.
   * @param event Evento que incluye el formulario, el campo y el método a ejecutar.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite2614Store.actualizarEstado({ [campo]: VALOR });
    
  }

  /**
   * Obtiene el título del modal basado en el número de procedimiento y el modo de edición
   * @returns {string} El título apropiado para el modal
   */
  obtenerTitulo(): string {
    let baseTitulo = 'destinatario (destino final)';
    if (this.permisoDefinitivoTitulo && this.permisoDefinitivoTitulo.includes('261402')) {
      baseTitulo = 'información de procedencia';
    }
    return this.modoEdicion ? `Modificar ${baseTitulo}` : `Agregar ${baseTitulo}`;
  }
  /**
   * Obtiene el título del modal basado en el número de procedimiento y el modo de edición
   * @returns {string} El título apropiado para el modal
   */
  tituloSeccion(): string {
  if (this.permisoDefinitivoTitulo && this.permisoDefinitivoTitulo.includes('261401')) {
    return 'Destinatario (destino final)';
  }
  return 'Información de procedencia';
}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el Subject para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
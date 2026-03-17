import { Catalogo, ConfiguracionColumna, CrossListLable, CrosslistComponent, InputFecha, InputFechaComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConsultaioQuery,ConsultaioState} from '@ng-mf/data-access-user';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MERCANCIAS_DATA, MercanciasInfo, NICO_TABLA, NicoInfo } from '@libs/shared/data-access-user/src/core/models/260211/domicilo.model'; 
import { Notificacion,NotificacionesComponent } from '@ng-mf/data-access-user';
import { Solicitud260211State, Tramite260211Store } from '../../../../estados/tramites/tramite260211.store';
import { Subject, map, takeUntil } from 'rxjs';
import { BANCOS_DATA } from '../../constantes/derechos.model';
import { CROSLISTA_DE_PAISES } from '@libs/shared/data-access-user/src/core/enums/260211/domicilo.enum';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { FECHA_DE_PAGO } from '@libs/shared/data-access-user/src/core/enums/260211/manifiestos.enum';
import { HttpClient } from '@angular/common/http';
import { Modal } from 'bootstrap';
import { SanitarioService } from '../../services/sanitario.service';
import { Tramite260211Query } from '../../../../estados/queries/tramite260211.query';
/**
 * Interfaz para la respuesta de la tabla de NICO.
 */
export interface RespuestaTabla {
  /**
   * Código de respuesta.
   */
  código: number;
  /**
   * Datos de la tabla NICO.
   */
  datos: NicoInfo[];
  /**
   * Mensaje de la respuesta.
   */
  mensaje: string;
}

/**
 * Interfaz para la respuesta de la tabla de mercancías.
 */
export interface MercanciasTabla {
  /**
   * Código de respuesta.
   */
  código: number;
  /**
   * Datos de la tabla de mercancías.
   */
  datos: MercanciasInfo[];
  /**
   * Mensaje de la respuesta.
   */
  mensaje: string;
}

/**
 * Componente principal para gestionar el formulario de domicilio.
 */
@Component({
  selector: 'app-domicillo',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    CrosslistComponent,
    InputFechaComponent,
    NotificacionesComponent
  ],
  templateUrl: './domicillo.component.html',
  styleUrl: './domicillo.component.scss',
})
export class DomicilloComponent implements OnInit, OnDestroy {
  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  public esFormularioSoloLectura: boolean = false;
  /**
  * Indica si ningún elemento ha sido seleccionado.
  * Se utiliza para controlar el estado de selección.
  */
  public noSeleccionado: boolean = true;

  /**
   * Lista de componentes Crosslist disponibles en la vista.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud260211State;

  /**
   * Notificador para destruir los observables al finalizar.
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * property {Subject<void>} destroyed$
   * description Sujeto utilizado para manejar la destrucción de observables.
   * private
   */
  private destroyed$ = new Subject<void>();
  /**
   * Lista de filas seleccionadas del componente tabla de NICO.
   * Se utiliza para manejar la selección de filas en la tabla.
   */
  selectedRowsEvent: MercanciasInfo[] = [];
  /*
   * Lista de filas seleccionadas del componente tabla de mercancías.
   * Se utiliza para manejar la selección de filas en la tabla de mercancías.
   */
  selectedRows: NicoInfo[] = [];
  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;
  /*
    * Maneja el evento de cambio de selección en la tabla de NICO.
    * @param selected Lista de filas seleccionadas.
    */
  onSeleccionChangeEvent(selected: MercanciasInfo[]): void {
    this.selectedRowsEvent = selected;
    if (this.selectedRowsEvent.length === 1) {
      this.noSeleccionado = false;
    }
    else {
      this.noSeleccionado = true;
    }
  }
  /** 
   Recibe los seleccionados del componente tabla
  */
  onSeleccionChange(selected: NicoInfo[]): void {
    this.selectedRows = selected;
  }
  /**
   *  Elimina las filas seleccionadas
   *  */
  eliminarSeleccionados(): void {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: this.selectedRows.length > 0 ? '¿Estás seguro que deseas eliminar los registros marcados?' : 'Selecciona un registro.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: this.selectedRows.length > 0 ? 'Cancelar' : '',
      };
  }
/*
  * Elimina las filas seleccionadas de la tabla NICO si se confirma la acción.
  */
   eliminarPedimentoDatos(borrar: boolean):void {
    if (borrar) {
       this.nicoTablaDatos = this.nicoTablaDatos.filter(
      (row) => !this.selectedRows.includes(row)
    );
    this.selectedRows = [];
    } 
  }

  /**
   * Elimina las filas seleccionadas
   */
  eliminarMercanciaSeleccionados(): void {
    this.mercanciasTablaDatos = this.mercanciasTablaDatos.filter(
      (row) => !this.selectedRowsEvent.includes(row)
    );
    // Reinicia el arreglo de eventos de filas seleccionadas, dejándolo vacío.
    this.selectedRowsEvent = [];
    // Indica que ningún elemento ha sido seleccionado
    this.noSeleccionado = true;
  }
    /*
  * @description Estado actual de la consulta, obtenido desde el store.
  */
  public consultaState!: ConsultaioState;
  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param httpServicios Cliente HTTP para servicios API.
   * @param tramite260211Store Almacén del trámite 260211.
   * @param tramite260211Query Consulta del trámite 260211.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly httpServicios: HttpClient,
    private tramite260211Store: Tramite260211Store,
    private tramite260211Query: Tramite260211Query,
    private service: SanitarioService,
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
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.consultaState = seccionState;

            if (this.consultaState.update) {               
           this.obtenerTablaDatos();     
           
           }

          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }
  /**
   * Índice de la mercancía que se está editando.
   * Si es `null`, no hay mercancía en edición.
   */
  editMercanciaIndex: number | null = null;
  /**
   * Grupo de formularios para domicilio.
   */
  domicilio!: FormGroup;

  /**
   * Grupo de formularios para agente.
   */
  formAgente!: FormGroup;

  /**
   * Grupo de formularios para mercancías.
   */
  formMercancias!: FormGroup;

  /**
   * Control para la fecha de aduanas de entrada.
   */
  aduanasDeEntradaFecha: FormControl = new FormControl('');

  /**
   * Control para la fecha seleccionada de aduanas de entrada.
   */
  aduanasDeEntradaFechaSeleccionada: FormControl = new FormControl('');

  /**
   * Lista de catálogos de estados.
   */
  estado: Catalogo[] = BANCOS_DATA;

  /**
   * Lista de países para la selección de origen.
   */
  public crosListaDePaises = CROSLISTA_DE_PAISES;

  /**
   * Configuración de tabla para selección de tipo checkbox.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla NICO.
   */
  nicoTabla: ConfiguracionColumna<NicoInfo>[] = NICO_TABLA;

  /**
   * Datos cargados para la tabla NICO.
   */
  nicoTablaDatos: NicoInfo[] = [];

  /**
   * Configuración de columnas para la tabla de mercancías.
   */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIAS_DATA;

  /**
   * Datos cargados para la tabla de mercancías.
   */
  mercanciasTablaDatos: MercanciasInfo[] = [];

  /**
   * Lista de aduanas seleccionadas.
   */
  aduanasDeEntradaSeleccionadas: string[] = [];

  /**
   * Lista de datos de aduanas de entrada.
   */
  aduanasDeEntradaDatos: string[] = [];
/**
 * Referencia al modal para agregar agente.
 */
   @ViewChild('modalAddAgent', { static: false }) modalAddAgent!: ElementRef;
  
  /**
   * Indica si la sección es colapsable.
   */
  colapsable: boolean = false;

  /**
   * Indica si la sección "Duo" es colapsable.
   */
  colapsableDos: boolean = false;

  /**
   * Indica si la sección "Tres" es colapsable.
   */
  colapsableTres: boolean = false;

  /**
   * Lista de países para seleccionar el origen de la primera sección.
   */
  seleccionarOrigenDelPais: string[] = this.crosListaDePaises;

  /**
   * Lista de países para seleccionar el origen de la segunda sección.
   */
  seleccionarOrigenDelPaisDos: string[] = this.crosListaDePaises;

  /**
   * Lista de países para seleccionar el origen de la tercera sección.
   */
  seleccionarOrigenDelPaisTres: string[] = this.crosListaDePaises;

  /**
   * Etiqueta para el crosslist de país de origen.
   */
  public paisDeOrigenLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de orígen:',
    derecha: 'País(es) seleccionados:',
  };

  /**
   * Etiqueta para el crosslist de país de procedencia.
   */
  public paisDeProcedenciaLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia:',
    derecha: 'País(es) seleccionados:',
  };

  /**
   * Etiqueta para el crosslist de uso específico.
   */
  public usoEspecificoLabel: CrossListLable = {
    tituluDeLaIzquierda: 'Uso específico:',
    derecha: 'Uso(s) específico(s) seleccionado(s):',
  };

  /**
   * Configuración de las fechas de inicio y fin.
   * @type {InputFecha}
   */
  public fechaCaducidadInput: InputFecha = FECHA_DE_PAGO;
  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();   
    this.obtenerMercanciasDatos();


  }

  /**
   * Modifica una fila de la tabla NICO con los datos del formulario de agente.
   * Si hay una fila seleccionada, actualiza el índice de edición y carga los datos en el formulario.
   */
  modificarMercancia(): void {
    if (this.selectedRowsEvent && this.selectedRowsEvent.length === 1) {
      const ROW = this.selectedRowsEvent[0];
      this.editMercanciaIndex = this.mercanciasTablaDatos.findIndex(
        r => r.numeroRegistro === ROW.numeroRegistro // Use a unique property
      );
      this.formMercancias.patchValue(ROW);
      // Indica que ningún elemento ha sido seleccionado
      this.noSeleccionado = true;

    }
  }

  
  /**
   * Agrega una nueva fila a la tabla NICO con los datos del formulario de agente.
   * Si el formulario es válido, crea un nuevo objeto `NicoInfo` con los valores del formulario y lo agrega a la lista `nicoTablaDatos`.
   */
  agregarFilaScian(): void {
    if (this.formAgente.valid) {
      const NEWVA_FILA: NicoInfo = {
        clave_Scian: this.estado.find(item => item.id === Number(this.formAgente.value.claveScianModal))?.descripcion ?? '',
        descripcion_Scian: this.formAgente.get('claveDescripcionModal')?.value,
      };

      this.nicoTablaDatos = [...this.nicoTablaDatos, NEWVA_FILA];

      const MODALELEMENT = document.getElementById('modalAddAgent');

    if(MODALELEMENT) {
    const MODALINSTANCE = Modal.getInstance(MODALELEMENT) || new Modal(MODALELEMENT);
    MODALINSTANCE.hide();
    }
    const BACKDROP_ELEMENTS = document.querySelectorAll('.modal-backdrop');
    BACKDROP_ELEMENTS.forEach((backdrop) => backdrop.remove());

    
    }
    else
    {
      this.formAgente.markAllAsTouched();
    }
  }
  /*
  * Método que se ejecuta al inicializar el componente.
  */
  agregarFilaMercancia(): void {
    if (this.formMercancias.valid) {
      const MERCANCIA_DATA: MercanciasInfo = {
        clasificacion: this.estado.find(item => item.id === Number(this.formMercancias.value.clasificacion))?.descripcion ?? '',
        especificar: this.estado.find(item => item.id === Number(this.formMercancias.value.especificar))?.descripcion ?? '',
        denominacionEspecifica: this.formMercancias.get('denominacionEspecifica')?.value,
        denominacionDistintiva: this.formMercancias.get('denominacionDistintiva')?.value,
        denominacionComun: this.formMercancias.get('denominacionComun')?.value,
        formaFarmaceutica: this.formMercancias.get('fraccionArancelaria')?.value,
        estadoFisico: this.estado.find(item => item.id === Number(this.formMercancias.value.estadoFisico))?.descripcion ?? '',
        fraccionArancelaria: this.formMercancias.get('fraccionArancelaria')?.value,
        descripcionFraccion: this.formMercancias.get('descripcionFraccion')?.value,
        cantidadUMC: this.formMercancias.get('cantidadUMC')?.value,
        unidad: this.estado.find(item => item.id === Number(this.formMercancias.value.UMC))?.descripcion ?? '',
        cantidadUMT: this.formMercancias.get('cantidadUMT')?.value,
        unidadUMT: this.formMercancias.get('UMT')?.value,
        presentacion: this.formMercancias.get('presentacion')?.value,
        numeroRegistro: this.formMercancias.get('numeroRegistro')?.value,
        paisDeOrigen: this.formMercancias.get('paisDeOrigen')?.value,
        paisDeProcedencia: this.formMercancias.get('paisDeProcedencia')?.value,
        tipoProducto: this.estado.find(item => item.id === Number(this.formMercancias.value.tipoDeProducto))?.descripcion ?? '',
        usoEspecifico: this.formMercancias.get('usoEspecifico')?.value,
        fechaCaducidad: this.formMercancias.get('fechaCaducidad')?.value,
      };

      if (this.editMercanciaIndex !== null && this.editMercanciaIndex > -1) {
        const UPDATED = [...this.mercanciasTablaDatos];
        UPDATED[this.editMercanciaIndex] = MERCANCIA_DATA;
        this.mercanciasTablaDatos = UPDATED;
        this.editMercanciaIndex = null;
        // Reinicia la lista de filas seleccionadas, dejándola vacía.
        this.selectedRowsEvent = [];
      } else {
        this.mercanciasTablaDatos = [...this.mercanciasTablaDatos, MERCANCIA_DATA];
      }
      this.formMercancias.reset();
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
      this.domicilio.disable();
      this.formAgente.disable();
      this.formMercancias.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.domicilio.enable();
      this.formAgente.enable();
      this.formMercancias.enable();
    }
  }
  /**
   * Inicializa el formulario con los datos de la solicitud.
   * Se suscribe al estado de la solicitud para obtener los valores iniciales.
   * Los campos del formulario se configuran como deshabilitados o requeridos según sea necesario.
   */
  inicializarFormulario(): void {
    this.tramite260211Query
      .selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    /**
  * Inicialización del formulario de domicilio.
  */
    this.domicilio = this.fb.group({
      codigoPostal: [this.solicitudState?.codigoPostal, Validators.required],
      estado: [this.solicitudState?.estado, Validators.required],
      muncipio: [this.solicitudState?.muncipio, Validators.required],
      localidad: [this.solicitudState?.localidad],
      colonia: [this.solicitudState?.colonia],
      calle: [this.solicitudState?.calle],
      lada: [this.solicitudState?.lada],
      telefono: [this.solicitudState?.telefono, Validators.required],
      avisoCheckbox: [this.solicitudState?.avisoCheckbox],
      licenciaSanitaria: [this.solicitudState?.licenciaSanitaria, { disabled: false }],
      regimen: [this.solicitudState?.regimen],
      aduanasEntradas: [this.solicitudState?.aduanasEntradas],
      numeroPermiso: [this.solicitudState?.numeroPermiso],

    });
    
this.domicilio.get('licenciaSanitaria')?.valueChanges
  .pipe(takeUntil(this.destroyed$))
  .subscribe((value: string) => {
    const AVIS0VALOR = this.domicilio.get('avisoCheckbox');
    if (value && value.trim() !== '') {
      AVIS0VALOR?.disable({ emitEvent: false });
    } else {
      AVIS0VALOR?.enable({ emitEvent: false });
    }
  });
    /**
     * Inicialización del formulario de agente.
     */
    this.formAgente = this.fb.group({
      claveScianModal: [this.solicitudState?.claveScianModal, Validators.required],
      claveDescripcionModal: [this.solicitudState?.claveDescripcionModal, Validators.required],
    });

    /**
     * Inicialización del formulario de mercancías.
     */
    this.formMercancias = this.fb.group({
      clasificacion: [this.solicitudState?.clasificacion, Validators.required],
      especificarClasificacionProducto: [this.solicitudState?.especificarClasificacionProducto, Validators.required],
      denominacionEspecifica: [this.solicitudState?.denominacionEspecifica, Validators.required],
      denominacionDistintiva: [this.solicitudState?.denominacionDistintiva, Validators.required],
      denominacionComun: [this.solicitudState?.denominacionComun, Validators.required],
      tipoDeProducto: [this.solicitudState?.tipoDeProducto, Validators.required],
      estadoFisico: [this.solicitudState?.estadoFisico, Validators.required],
      fraccionArancelaria: [this.solicitudState?.fraccionArancelaria, Validators.required],
      descripcionFraccion: [{ value: this.solicitudState?.descripcionFraccion, disabled: true }, Validators.required],
      cantidadUMT: [this.solicitudState?.cantidadUMT, Validators.required],
      UMT: [{ value: this.solicitudState?.UMT, disabled: true }, Validators.required],
      cantidadUMC: [this.solicitudState?.cantidadUMC, Validators.required],
      UMC: [this.solicitudState?.UMC, Validators.required],
      presentacion: [this.solicitudState?.presentacion, Validators.required],
      numeroRegistro: [this.solicitudState?.numeroRegistro, Validators.required],
      fechaCaducidad: [this.solicitudState?.fechaCaducidad],
    });

    if (this.esFormularioSoloLectura) {
      this.domicilio.disable();
      this.formAgente.disable();
      this.formMercancias.disable();
    }
  }
  /**
   * Botones de acción para gestionar listas de países en la primera sección.
   */
  paisDeProcedenciaBotons = [
    { btnNombre: 'Agregar todos', class: 'btn-primary', funcion: (): void => this.crossList.toArray()[0].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-default', funcion: (): void => this.crossList.toArray()[0].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-danger', funcion: (): void => this.crossList.toArray()[0].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: (): void => this.crossList.toArray()[0].quitar('t') },
  ];

  /**
   * Botones de acción para gestionar listas de países en la segunda sección.
   */
  paisDeProcedenciaBotonsDos = [
    { btnNombre: 'Agregar todos', class: 'btn-primary', funcion: (): void => this.crossList.toArray()[1].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-default', funcion: (): void => this.crossList.toArray()[1].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-danger', funcion: (): void => this.crossList.toArray()[1].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: (): void => this.crossList.toArray()[1].quitar('t') },
  ];

  /**
   * Botones de acción para gestionar listas de países en la tercera sección.
   */
  paisDeProcedenciaBotonsTres = [
    { btnNombre: 'Agregar todos', class: 'btn-primary', funcion: (): void => this.crossList.toArray()[2].agregar('t') },
    { btnNombre: 'Agregar selección', class: 'btn-default', funcion: (): void => this.crossList.toArray()[2].agregar('') },
    { btnNombre: 'Restar selección', class: 'btn-danger', funcion: (): void => this.crossList.toArray()[2].quitar('') },
    { btnNombre: 'Restar todos', class: 'btn-default', funcion: (): void => this.crossList.toArray()[2].quitar('t') },
  ];
  /**
   * Obtiene los datos para la tabla de NICO desde un archivo JSON.
   */
  obtenerTablaDatos(): void {
    this.service.obtenerTablaDatos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const DATOS = data?.datos;
        this.nicoTablaDatos = DATOS;
      });
  }

  /**
   * Obtiene los datos de la tabla de mercancías desde un archivo JSON.
   */
  obtenerMercanciasDatos(): void {
    this.service.obtenerMercanciasDatos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const DATOS = data?.datos;
        this.mercanciasTablaDatos = DATOS;
      });
  }
  /*
    * Limpia el formulario de domicilio.
    */
  limpiarFormAgente(): void {
    this.formAgente.reset();
  }
  /**
   * Limpia el formulario de mercancías.
   */
  limpiarForm(): void {
    this.formMercancias.reset();
  }
  /**
   * Maneja el cambio del checkbox en el formulario y actualiza el estado correspondiente.
   * @param event Evento del checkbox.
   * @param form Formulario en el que se realiza el cambio.
   * @param campo Nombre del campo afectado.
   * @param metodoNombre Método correspondiente del store para actualizar el valor.
   */
  onAvisoCheckboxChange(
    event: Event,
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260211Store
  ): void {
    const CHECKBOX = event.target as HTMLInputElement;

    const LICENCIASANITARIOCONTROL = this.domicilio.get('licenciaSanitaria');

    if (CHECKBOX.checked) {
      LICENCIASANITARIOCONTROL?.setValue('');
      LICENCIASANITARIOCONTROL?.disable();
    } else {
      LICENCIASANITARIOCONTROL?.enable();
    }
    this.setValoresStore(this.domicilio, 'licenciaSanitaria', 'setLicenciaSanitaria');

    const VALOR = form.get(campo)?.value;
    (this.tramite260211Store[metodoNombre] as (value: string | number | boolean) => void)(VALOR);
  }


  /**
   * Alterna el estado colapsable de la primera sección.
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Alterna el estado colapsable de la segunda sección.
   */
  mostrar_colapsableDos(): void {
    this.colapsableDos = !this.colapsableDos;
  }

  /**
   * Alterna el estado colapsable de la tercera sección.
   */
  mostrar_colapsableTres(): void {
    this.colapsableTres = !this.colapsableTres;
  }

  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite260211Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260211Store[metodoNombre] as (value: string | number | boolean) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }


  /**
   * Cambia el valor de la fecha final en el formulario.
   * @param nuevo_valor Nuevo valor de la fecha final.
   */
  public cambioFechaFinal(nuevo_valor: string): void {

    this.formMercancias.get('fechaCaducidad')?.setValue(nuevo_valor);
    this.formMercancias.get('fechaCaducidad')?.markAsUntouched();
  }

}

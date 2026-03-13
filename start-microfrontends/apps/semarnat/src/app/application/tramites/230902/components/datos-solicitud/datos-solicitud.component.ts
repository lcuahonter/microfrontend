/**
 * Componente para gestionar los datos de la solicitud.
 * Este componente permite la gestión de formularios, tablas y datos relacionados con la solicitud.
 * 
 * Métodos:
 * - ngOnInit: Inicializa el componente y configura las suscripciones necesarias.
 * - crearFormularioSolicitud: Crea y configura el formulario para los datos de la solicitud.
 * - resetSolicitudForm: Resetea el formulario de solicitud.
 * - createNewMercanciaItem: Crea y configura el formulario para los datos de mercancía.
 * - cambiarTipoDeMovimiento: Maneja el cambio en el tipo de movimiento seleccionado.
 * - updateFilaSeleccionada: Actualiza la fila seleccionada en la tabla.
 * - modficarMercanciaItem: Modifica un elemento de mercancía en la tabla.
 * - esInvalido: Verifica si un control del formulario es inválido.
 * - onTipoRegimenChange: Maneja el cambio en el tipo de régimen seleccionado.
 * - hadleFilaSeleccionada: Maneja la fila seleccionada en la tabla de mercancías.
 * - alternarVisibilidadModalMercancia: Alterna la visibilidad del modal de datos de mercancía.
 * - mostrarFormularioMercanciaModal: Muestra el formulario de mercancía en un modal.
 * - enviarFormularioMercancia: Envía el formulario de mercancía y agrega los datos a la tabla.
 * - ngOnDestroy: Limpia las suscripciones cuando el componente se destruye.
 */
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CONFIGURACION_TABLA_MERCANCIA, ConfiguracionItem } from '../../enum/mercancia.enum';
import { CROSLISTA_ENTRADA, CROSSLIST_BOTONS, CrosslistBoton } from '../../enum/crossList-botons.enum';
import { Catalogo, CategoriaMensaje, ConfiguracionColumna, CrossListLable, CrosslistComponent, Notificacion, REGEX_SEPARADO_POR_COMAS, TablaSeleccion, TipoNotificacionEnum } from '@libs/shared/data-access-user/src';
import { Solicitud230902State, Tramite230902Store} from '../../estados/tramite230902.store';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs';
import { ALERTA_MERCANCIA } from '../../enum/mercancia-alert.enum';
import { AQUANDAS_LABEL } from '../../enum/adnuana-botons.enum';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MOVIMIENTO_LABEL } from '../../enum/movimiento.enum';
import { PermisoCitesService } from '../../services/permiso-cites.service';
import { Tramite230902Query } from '../../estados/tramite230902.query';

@Component({
  selector: 'app-datos-solicitud',
  templateUrl: './datos-solicitud.component.html',
  styleUrls: ['./datos-solicitud.component.scss'],
})
export class DatosSolicitudComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Referencia al componente Crosslist.
   * Se utiliza para interactuar con el componente Crosslist desde este componente.
   */
  @ViewChild("CrosslistComponentAduanas") crosslistComponent!: CrosslistComponent;
  @ViewChild("CrosslistComponentFinalidad") crosslistComponentFinalidad!: CrosslistComponent;
  /** Botones para la lista cruzada. */
  crossListBotons!: CrosslistBoton[];

  /** Botones para el movimiento. */
  movimientoBotons!: CrosslistBoton[];

  /** Botones para las aduanas. */
  aduanasBotons!: CrosslistBoton[];

  /** Formulario de solicitud. Contiene los datos y validaciones del formulario de solicitud. */
  formSolicitud!: FormGroup;

  /** Formulario de mercancía. Contiene los datos y validaciones del formulario de mercancía. */
  formMercancia!: FormGroup;

  /** Tipo de movimiento seleccionado. Representa el tipo de movimiento actualmente seleccionado en el formulario. */
  tipoMovimientoSeleccionada!: number;

  /** Indica si se ha seleccionado otra fracción. Se utiliza para habilitar o deshabilitar campos relacionados con fracciones. */
  otraFraccionSeleccionada!: boolean;

  /** Estado de la solicitud 230902. Contiene el estado actual de la solicitud. */
  solicitud230902State!: Solicitud230902State;

  /** Etiqueta de Aquaandas. Configuración de la etiqueta utilizada en la lista cruzada de Aquaandas. */
  aquandasLabel: CrossListLable = AQUANDAS_LABEL;

  /** Lista original de aduanas. Contiene las aduanas disponibles antes de realizar selecciones. */
  listaOriginalAduanas: string[] = CROSLISTA_ENTRADA;

  /** Lista seleccionada de aduanas. Contiene las aduanas seleccionadas por el usuario. */
  listaSeleccionadaAduanas: string[] = [];

  /** Etiqueta de movimiento. Configuración de la etiqueta utilizada en la lista cruzada de movimientos. */
  movimientoLabel: CrossListLable = MOVIMIENTO_LABEL;

  /** Configuración de la tabla de mercancías. Define las columnas y configuraciones de la tabla de mercancías. */
  configuracionTabla: ConfiguracionColumna<ConfiguracionItem>[] = CONFIGURACION_TABLA_MERCANCIA;

  /** Mensaje de alerta relacionado con la mercancía. Se muestra cuando ocurre un error o advertencia relacionada con la mercancía. */
  public alert_message: string = ALERTA_MERCANCIA;

  /** Lista original de movimientos. Contiene los movimientos disponibles antes de realizar selecciones. */
  listaOriginalMovimiento: string[] = CROSLISTA_ENTRADA;

  /** Lista seleccionada de movimientos. Contiene los movimientos seleccionados por el usuario. */
  listSeleccionadaMovimiento: string[] = [];

  /** Tipo de selección de la tabla. Define el tipo de selección que se puede realizar en la tabla. */
  tablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Indica si se ha seleccionado un archivo. Se utiliza para rastrear el estado de la selección de archivos en el componente. */
  isFileSelected: boolean = false;

  /** Método para cargar los datos de la tabla. Realiza una solicitud al servicio para obtener los datos de la tabla. */
  listaFilaSeleccionadaMercancia!: ConfiguracionItem[];

  /** Datos de la tabla de mercancías. Contiene las filas de datos que se muestran en la tabla de mercancías. */
  tablaDatos: ConfiguracionItem[] = [];

  /** Fila seleccionada en la tabla de mercancías. Representa la fila actualmente seleccionada por el usuario. */
  filaSeleccionada!: ConfiguracionItem;

  /** Indica si se debe mostrar el modal de datos de mercancía. Controla la visibilidad del modal de datos de mercancía. */
  showDatosMercanciaModal: boolean = false;

  /**
   * Observable utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   * Se utiliza para cancelar suscripciones activas cuando el componente se destruye.
   */
  private destroyed$ = new Subject<void>();

  /** Indica si la operación actual es una actualización. Se utiliza para diferenciar entre crear un nuevo elemento y actualizar uno existente. */
  esOperacionDeActualizacion: boolean = false;

  /** Indica si el botón "Modificar" está habilitado. Se utiliza para controlar la disponibilidad del botón de modificación. */
  enableModficarBoton: boolean = false;

  /** Indica si el botón "Eliminar" está habilitado. Se utiliza para controlar la disponibilidad del botón de eliminación. */
  enableEliminarBoton: boolean = false;

  /** Indica si el popup de selección múltiple está abierto. Controla la visibilidad del popup de selección múltiple. */
  multipleSeleccionPopupAbierto: boolean = false;

  /** Indica si el popup de selección múltiple está cerrado. */
  multipleSeleccionPopupCerrado: boolean = true;

  /** Indica si el popup de confirmación para eliminar está abierto. Controla la visibilidad del popup de confirmación para eliminar elementos. */
  confirmEliminarPopupAbierto: boolean = false;

  /** Indica si el popup de confirmación para eliminar está cerrado. */
  confirmEliminarPopupCerrado: boolean = true;

  /** Nombre del modal actual. */
  modal: string = '';

  /** Título del modal actual. */
  tituloModal!: string;

  /** Mensaje del modal actual. */
  mensajeModal!: string;

  /** Notificación actual. */
  public nuevaNotificacion!: Notificacion;

  /** Indica si el formulario está en modo solo lectura. Si es verdadero, los campos del formulario estarán deshabilitados para edición. */
  esFormularioSoloLectura: boolean = false;

  /** Suscripción general para manejar y limpiar las suscripciones del componente. Se utiliza para evitar fugas de memoria. */
  private subscription: Subscription = new Subscription();
  /**
   * @property {boolean} sinRegistro
   * @description
   * Indica si no hay registros seleccionados al intentar modificar un elemento.
   * Controla la visualización de mensajes de alerta cuando no se ha seleccionado
   * ningún registro para modificar.
   */
  sinRegistro: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacionModificar
   * @description
   * Objeto que almacena la configuración de la notificación que se muestra
   * cuando hay errores al intentar modificar un registro (por ejemplo, cuando
   * se seleccionan múltiples registros o ninguno).
   */
  public nuevaNotificacionModificar!: Notificacion;

  /**
   * @property {boolean} sinEliminar
   * @description
   * Indica si no hay registros seleccionados al intentar eliminar elementos.
   * Controla la visualización de mensajes de alerta cuando no se ha seleccionado
   * ningún registro para eliminar.
   */
  sinEliminar: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacionEliminar
   * @description
   * Objeto que almacena la configuración de la notificación que se muestra
   * cuando hay errores al intentar eliminar registros (por ejemplo, cuando
   * no se ha seleccionado ningún registro).
   */
  public nuevaNotificacionEliminar!: Notificacion;
  /**
   * @property {boolean} tablaError
   * @description
   * Indica si hay un error relacionado con la tabla de mercancías.
   * Se establece a `true` cuando se intenta validar el formulario pero la tabla de datos está vacía,
   * mostrando un mensaje de error para indicar que se requiere al menos una mercancía en la tabla.
   */
  tablaError: boolean = false;

  /**
   * Constructor del componente.
   * Inicializa los servicios y dependencias necesarias para la gestión de datos y formularios.
   */
  constructor(
    public permisoCitesService: PermisoCitesService,
    private tramite230902Store: Tramite230902Store,
    private tramite230902Query: Tramite230902Query,
    public formBuilder: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
  ) {
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

  /**
   * Inicializa el estado del formulario dependiendo si es solo lectura o editable.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormularioSolicitud();
    }
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   */
  guardarDatosFormulario(): void {
    this.crearFormularioSolicitud();
    if (this.esFormularioSoloLectura) {
      this.formSolicitud.disable();
    } else {
      this.formSolicitud.enable();
    }
  }

  /**
   * Inicializa el componente.
   * Configura los formularios, datos iniciales y suscripciones necesarias.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.permisoCitesService.inicializaDatosSolicitudDatosCatalogos();

    this.tramite230902Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => {
        this.solicitud230902State = state;
        
        // Initialize tablaDatos from store to maintain data across component switches
        if (state.mercanciaTablaDatos) {
          this.tablaDatos = [...state.mercanciaTablaDatos];
        }
        
        // Initialize tipoMovimientoSeleccionada when state is updated
        if (state.tipodeMovimiento) {
          this.tipoMovimientoSeleccionada = parseInt(state.tipodeMovimiento, 10);
        } else {
          this.tipoMovimientoSeleccionada = 0;
        }

        this.storeCrosslistaDatos();
      });
    this.nuevaNotificacionModificar = {} as Notificacion;
  }

  /**
   * Se ejecuta después de que la vista del componente se ha inicializado.
   * Configura los componentes crosslist cuando están disponibles.
   */
  async ngAfterViewInit(): Promise<void> {
    await this.esperarComponentesCrosslistListos();
    this.configurarComponentesCrosslist();
    this.cambiarTipoDeMovimiento();
  }

  /**
   * Espera hasta que los componentes crosslist estén listos para su uso.
   * Implementa un mecanismo de polling asíncrono para verificar la disponibilidad.
   */
  private esperarComponentesCrosslistListos(): Promise<void> {
    return new Promise<void>((resolve) => {
      const VERIFICAR_COMPONENTES = (): void => {
        if (this.crosslistComponent && this.crosslistComponentFinalidad) {
          resolve();
        } else {
          setTimeout(VERIFICAR_COMPONENTES, 50);
        }
      };
      VERIFICAR_COMPONENTES();
    });
  }

  /**
   * Configura los componentes crosslist una vez que están disponibles.
   */
  private configurarComponentesCrosslist(): void {
    this.crossListBotons = CROSSLIST_BOTONS(this.crosslistComponent);
    this.movimientoBotons = CROSSLIST_BOTONS(this.crosslistComponentFinalidad);
    this.aduanasBotons = this.crossListBotons;
  }

  /**
   * Crea y configura el formulario para los datos de la solicitud.
   * Define los campos y validaciones necesarias.
   */
  crearFormularioSolicitud(): void {
    this.subscription.add(
      this.tramite230902Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
            this.solicitud230902State = seccionState;
          })
        )
        .subscribe()
    );
    this.formSolicitud = this.formBuilder.group({
      tipodeMovimiento: [this.solicitud230902State.tipodeMovimiento, Validators.required],
      tipoRegimen: [this.solicitud230902State.tipoRegimen, Validators.required],
    });

    // Initialize tipoMovimientoSeleccionada based on stored value
    if (this.solicitud230902State.tipodeMovimiento) {
      this.tipoMovimientoSeleccionada = parseInt(this.solicitud230902State.tipodeMovimiento, 10);
    }

    // Subscribe to form changes to update crosslist buttons
    this.subscription.add(
      this.formSolicitud.get('tipodeMovimiento')?.valueChanges
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.cambiarTipoDeMovimiento();
        }) || new Subscription()
    );
  }

  /**
   * Crea y configura el formulario para los datos de mercancía.
   * Define los campos y validaciones necesarias. Recibe datos iniciales opcionales.
   * data Datos iniciales opcionales para el formulario de mercancía.
   */
  crearNuevoFormularioMercancia(data?: ConfiguracionItem): void {
    const DEFAULT_DATA: ConfiguracionItem = {
      id: 0,
      fraccionArancelaria: '',
      fraccionDescripcion: '',
      otraFraccion: false,
      descripcion: '',
      rendimientoProducto: '',
      clasificacionTaxonomica: '',
      nombreCientifico: '',
      nombreComun: '',
      marca: '',
      cantidad: '',
      unidadMedida: '',
      paisOrigen: '',
      paisProcedencia: '',
      ...data,
    };

    this.formMercancia = this.formBuilder.group({
      id: [DEFAULT_DATA.id],
      fraccionArancelaria: [DEFAULT_DATA.fraccionArancelaria, Validators.required],
      fraccionDescripcion: [DEFAULT_DATA.fraccionDescripcion],
      otraFraccion: [DEFAULT_DATA.otraFraccion],
      descripcion: [DEFAULT_DATA.descripcion, [Validators.required, Validators.maxLength(1000)]],
      rendimientoProducto: [DEFAULT_DATA.rendimientoProducto, [Validators.maxLength(1000)]],
      clasificacionTaxonomica: [DEFAULT_DATA.clasificacionTaxonomica, Validators.required],
      nombreCientifico: [DEFAULT_DATA.nombreCientifico, Validators.required],
      nombreComun: [DEFAULT_DATA.nombreComun, Validators.required],
      marca: [DEFAULT_DATA.marca, [Validators.required, DatosSolicitudComponent.noSpecialCharactersValidator]],
      cantidad: [DEFAULT_DATA.cantidad, [Validators.required, Validators.pattern(/^\d{1,12}(\.\d{1,3})?$/)]],
      unidadMedida: [DEFAULT_DATA.unidadMedida, Validators.required],
      paisOrigen: [DEFAULT_DATA.paisOrigen, Validators.required],
      paisProcedencia: [DEFAULT_DATA.paisProcedencia, Validators.required],
    });

    if (this.formMercancia.get('otraFraccion')?.value) {
      this.otraFraccionSeleccionada = true;
    }
    this.formMercancia.get('fraccionDescripcion')?.disable();
  }

  /**
   * Maneja el cambio en el campo "otraFracción".
   * Si el campo está seleccionado, agrega un control adicional al formulario
   * y reinicia los valores relacionados con la fracción arancelaria.
   * Si no está seleccionado, elimina el control adicional.
   */
  manejarCambioOtraFraccion(): void {
    const CHECKED = this.formMercancia.get('otraFraccion')?.value;
    if (CHECKED) {
      this.formMercancia.addControl('fraccionVigenteTIGIE', this.formBuilder.control(''));
      this.formMercancia.get('fraccionArancelaria')?.setValue('0');
      this.formMercancia.get('fraccionDescripcion')?.reset();
      this.otraFraccionSeleccionada = true;
    } else {
      this.otraFraccionSeleccionada = false;
      this.formMercancia.removeControl('fraccionVigenteTIGIE');
    }
  }

  /**
   * Limpia todos los campos del formulario de mercancía.
   * Resetea el formulario a sus valores iniciales y restaura el estado de "otraFraccion".
   */
  limpiarFormularioMercancia(): void {
    this.formMercancia.reset();
    this.otraFraccionSeleccionada = false;
    
    if (this.formMercancia.contains('fraccionVigenteTIGIE')) {
      this.formMercancia.removeControl('fraccionVigenteTIGIE');
    }
    
    this.formMercancia.patchValue({
      id: 0,
      fraccionArancelaria: '',
      fraccionDescripcion: '',
      otraFraccion: false,
      descripcion: '',
      rendimientoProducto: '',
      clasificacionTaxonomica: '',
      nombreCientifico: '',
      nombreComun: '',
      marca: '',
      cantidad: '',
      unidadMedida: '',
      paisOrigen: '',
      paisProcedencia: '',
    });
    
    this.formMercancia.get('fraccionDescripcion')?.disable();
    
    this.formMercancia.markAsUntouched();
    this.formMercancia.markAsPristine();
  }

  /**
   * Maneja el cambio en el tipo de movimiento seleccionado.
   * Actualiza el estado y los botones relacionados con el movimiento.
   */
  cambiarTipoDeMovimiento(): void {
    const TIPO_DE_MOVIMIENTO = this.formSolicitud.get('tipodeMovimiento')?.value;
     
    this.tramite230902Store.establecerDatos({ tipodeMovimiento: TIPO_DE_MOVIMIENTO });
    
    // Recreate crosslist buttons if they are undefined or empty
    if (!this.crossListBotons || this.crossListBotons.length === 0) {
      this.configurarComponentesCrosslist();
    }
    
    // Ensure crosslist components are initialized before using them
    if (this.crossListBotons && this.crossListBotons.length > 0) {
      if (TIPO_DE_MOVIMIENTO === '1' || TIPO_DE_MOVIMIENTO === '3') {
        this.aduanasBotons = this.crossListBotons.slice(1);
      } else {
        this.aduanasBotons = this.crossListBotons;
      }
    }
    
    this.tipoMovimientoSeleccionada = parseInt(TIPO_DE_MOVIMIENTO, 10);
  }

  /**
   * Actualiza la fila seleccionada en la tabla.
   * Sincroniza los datos de la fila seleccionada con el formulario.
   */
  updateFilaSeleccionada(): void {
    const UPDATED_DATA = this.tablaDatos.find(
      (item) => item.id === this.filaSeleccionada.id
    );
    if (UPDATED_DATA) {
      this.filaSeleccionada = { ...UPDATED_DATA };
    }
  }

  /**
   * Verifica si un control del formulario es inválido.
   * Devuelve verdadero si el control es inválido y ha sido tocado o modificado.
   * formControlName Nombre del control en el formulario.
   */
  esInvalido(formControlName: string): boolean {
    const CONTROL = this.formMercancia.get(formControlName);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Maneja la fila seleccionada en la tabla de mercancías.
   * Actualiza el formulario con los datos de la fila seleccionada.
   * fila Fila seleccionada en la tabla.
   */
  hadleFilaSeleccionada(fila: ConfiguracionItem[]): void {
    this.listaFilaSeleccionadaMercancia = fila;
    if (fila.length === 0) {
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
    this.filaSeleccionada = fila[fila.length - 1];
    this.enableModficarBoton = true;
    this.enableEliminarBoton = true;
  }

  /**
   * Modifica un elemento de mercancía en la tabla.
   * Actualiza los datos del formulario con los valores de la fila seleccionada.
   */
  modficarMercanciaItem(): void {
    if(this.tablaDatos.length === 0) {
      this.sinRegistro = true;
      this.nuevaNotificacionModificar = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona sólo un registro para modificar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      }
    }
    if (this.listaFilaSeleccionadaMercancia.length < 2) {
      this.sinRegistro = false;
      const GET_INDEX = (array: Catalogo[], value: string): number =>
        array.findIndex((item) => item.descripcion === value) + 1;

      this.updateFilaSeleccionada();
      this.esOperacionDeActualizacion = true;
      const FRACCION_DESCRIPCION =
        this.permisoCitesService.fraccionArancelariaDescripcion.find(
          (item) => Number(item.id) === Number(this.filaSeleccionada.fraccionArancelaria)
        )?.descripcion || '';

      const MERCANCIA_CONFIGURACION_ITEM: ConfiguracionItem = {
        id: this.filaSeleccionada.id,
        fraccionArancelaria: GET_INDEX(
          this.permisoCitesService.fraccionArancelaria,
          this.filaSeleccionada.fraccionArancelaria
        ).toString(),
        fraccionDescripcion: FRACCION_DESCRIPCION,
        otraFraccion: this.filaSeleccionada.otraFraccion,
        descripcion: this.filaSeleccionada.descripcion,
        rendimientoProducto: this.filaSeleccionada.rendimientoProducto,
        clasificacionTaxonomica: GET_INDEX(
          this.permisoCitesService.clasificacionTaxonomica,
          this.filaSeleccionada.clasificacionTaxonomica
        ).toString(),
        nombreCientifico: GET_INDEX(
          this.permisoCitesService.nombreCientifico,
          this.filaSeleccionada.nombreCientifico
        ).toString(),
        nombreComun: GET_INDEX(
          this.permisoCitesService.nombreComun,
          this.filaSeleccionada.nombreComun
        ).toString(),
        marca: this.filaSeleccionada.marca,
        cantidad: this.filaSeleccionada.cantidad,
        unidadMedida: GET_INDEX(
          this.permisoCitesService.unidadMedida,
          this.filaSeleccionada.unidadMedida
        ).toString(),
        paisOrigen: GET_INDEX(
          this.permisoCitesService.paisOrigen,
          this.filaSeleccionada.paisOrigen
        ).toString(),
        paisProcedencia: GET_INDEX(
          this.permisoCitesService.paisProcedencia,
          this.filaSeleccionada.paisProcedencia
        ).toString(),
      };

      this.crearNuevoFormularioMercancia(MERCANCIA_CONFIGURACION_ITEM);
      this.alternarVisibilidadModalMercancia();
    } else {
      this.abrirMultipleSeleccionPopup();
    }
  }

  /**
   * Abre el popup de selección múltiple.
   * Muestra un mensaje de error si se seleccionan múltiples registros para modificar.
   */
  abrirMultipleSeleccionPopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: 'Aviso',
      mensaje: 'Selecciona sólo un registro para modificar.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    if (this.enableModficarBoton) {
      this.multipleSeleccionPopupAbierto = true;
    }
  }

  /**
   * Cierra el popup de selección múltiple.
   */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }

  /**
   * Elimina los elementos seleccionados de la tabla de mercancías.
   * Actualiza el estado global con los datos restantes.
   */
  eliminarMercanciaItem(event: boolean): void {
    if(event === false || this.listaFilaSeleccionadaMercancia.length === 0) {
      this.cerrarEliminarConfirmationPopup();
      return;
    }
    const IDS_TO_DELETE = this.listaFilaSeleccionadaMercancia.map(item => item.id);

    this.tablaDatos = this.tablaDatos.filter(
      item => !IDS_TO_DELETE.includes(item.id)
    );

    this.listaFilaSeleccionadaMercancia = [];
    this.tramite230902Store.setMercanciaTablaDatos(this.tablaDatos);
    this.cerrarEliminarConfirmationPopup();
  }

  /**
   * Abre el popup de confirmación para eliminar elementos.
   * Muestra un mensaje de confirmación antes de eliminar los registros seleccionados.
   */
  abrirElimninarConfirmationopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: 'Aviso',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.confirmEliminarPopupAbierto = true;
  }

  /**
   * Cierra el popup de confirmación para eliminar elementos.
   */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
   * Confirma la eliminación de los elementos seleccionados.
   * Abre el popup de confirmación si hay elementos seleccionados.
   */
  confirmEliminarMercanciaItem(): void {
    if(this.tablaDatos.length === 0) {
      this.sinEliminar = true;
      this.nuevaNotificacionEliminar = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona un registro.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
    if (this.listaFilaSeleccionadaMercancia.length === 0) {
      return;
    }
    this.abrirElimninarConfirmationopup();
  }

  /**
   * Alterna la visibilidad del modal de datos de mercancía.
   * Muestra u oculta el modal según el estado actual.
   */
  alternarVisibilidadModalMercancia(): void {
    this.showDatosMercanciaModal = !this.showDatosMercanciaModal;
  }

  /**
   * Muestra el formulario de mercancía en un modal.
   * Inicializa los datos necesarios para el formulario.
   */
  mostrarformMercanciaModal(): void {
    this.esOperacionDeActualizacion = false;
    this.permisoCitesService.inicializaMercanciaDatosCatalogos();
    this.crearNuevoFormularioMercancia();
    this.alternarVisibilidadModalMercancia();
  }

  /**
   * Maneja el cambio en la fracción arancelaria seleccionada.
   * Actualiza la descripción de la fracción en el formulario.
   * $event Evento que contiene la fracción seleccionada.
   */
  manejarCambioFraccionArancelaria($event: Catalogo): void {
    const FRACCION_DESCRIPCION =
      this.permisoCitesService.fraccionArancelariaDescripcion.find(
        (item) => Number(item.id) === Number($event.descripcion)
      );
    this.formMercancia
      .get('fraccionDescripcion')
      ?.setValue(FRACCION_DESCRIPCION?.descripcion);
  }

  /**
   * Envía el formulario de mercancía y agrega los datos a la tabla.
   * Valida el formulario antes de agregar los datos.
   */
  enviarFormularioMercancia(): void {
    if (this.formMercancia.invalid || (!this.otraFraccionSeleccionada && this.formMercancia.get('fraccionArancelaria')?.value === '0')) {
      return;
    }
    const GET_DESCRIPTION = (array: Catalogo[], index: number): string => array[index - 1]?.descripcion || '';

    const TABLA_ROW: ConfiguracionItem = {
      id: this.esOperacionDeActualizacion
        ? this.formMercancia.get('id')?.value
        : this.tablaDatos.length + 1,
      fraccionArancelaria: GET_DESCRIPTION(
        this.permisoCitesService.fraccionArancelaria,
        this.formMercancia.get('fraccionArancelaria')?.value
      ),
      fraccionDescripcion: this.formMercancia.get('fraccionDescripcion')?.value,
      otraFraccion: this.formMercancia.get('otraFraccion')?.value,
      descripcion: this.formMercancia.get('descripcion')?.value,
      rendimientoProducto: this.formMercancia.get('rendimientoProducto')?.value,
      clasificacionTaxonomica: GET_DESCRIPTION(
        this.permisoCitesService.clasificacionTaxonomica,
        this.formMercancia.get('clasificacionTaxonomica')?.value
      ),
      nombreCientifico: GET_DESCRIPTION(
        this.permisoCitesService.nombreCientifico,
        this.formMercancia.get('nombreCientifico')?.value
      ),
      nombreComun: GET_DESCRIPTION(
        this.permisoCitesService.nombreComun,
        this.formMercancia.get('nombreComun')?.value
      ),
      marca: this.formMercancia.get('marca')?.value,
      cantidad: this.formMercancia.get('cantidad')?.value,
      unidadMedida: GET_DESCRIPTION(
        this.permisoCitesService.unidadMedida,
        this.formMercancia.get('unidadMedida')?.value
      ),
      paisOrigen: GET_DESCRIPTION(
        this.permisoCitesService.paisOrigen,
        this.formMercancia.get('paisOrigen')?.value
      ),
      paisProcedencia: GET_DESCRIPTION(
        this.permisoCitesService.paisProcedencia,
        this.formMercancia.get('paisProcedencia')?.value
      ),
    };

    const EXISTING_INDEX = this.tablaDatos.findIndex(item => item.id === TABLA_ROW.id);

    if (EXISTING_INDEX > -1) {
      this.tablaDatos[EXISTING_INDEX] = TABLA_ROW;
    } else {
      this.tablaDatos = [...this.tablaDatos, TABLA_ROW];
    }

    this.tramite230902Store.setMercanciaTablaDatos(this.tablaDatos);
    this.formMercancia.reset();
    this.alternarVisibilidadModalMercancia();
  }

  /**
   * Actualiza los datos de las listas cruzadas basándose en el estado actual.
   * 
   * Sincroniza las listas seleccionadas y originales con el estado de la aplicación.
   * Si las matrices del estado están vacías o indefinidas, utiliza valores predeterminados.
   */
  storeCrosslistaDatos(): void {
    // Función auxiliar para verificar si una matriz es válida y no está vacía
    const ES_MATRIZ_VALIDA = (array: string[] | undefined | null): boolean => 
      Array.isArray(array) && array.length > 0;

    // Usar CROSLISTA_ENTRADA si listaOriginalAduanas es indefinida, nula o está vacía
    this.listaOriginalAduanas = ES_MATRIZ_VALIDA(this.solicitud230902State.listaOriginalAduanas)
      ? this.solicitud230902State.listaOriginalAduanas as string[]
      : CROSLISTA_ENTRADA;
    
    // Usar matriz vacía o la matriz del estado si listaSeleccionadaAduanas existe
    this.listaSeleccionadaAduanas = this.solicitud230902State.listaSeleccionadaAduanas || [];

    // Usar CROSLISTA_ENTRADA si listaOriginalMovimiento es indefinida, nula o está vacía
    this.listaOriginalMovimiento = ES_MATRIZ_VALIDA(this.solicitud230902State.listaOriginalMovimiento)
      ? this.solicitud230902State.listaOriginalMovimiento as string[]
      : CROSLISTA_ENTRADA;
    
    // Usar matriz vacía o la matriz del estado si listaSeleccionadaMovimiento existe
    this.listSeleccionadaMovimiento = this.solicitud230902State.listaSeleccionadaMovimiento || [];
  }

  /**
   * Método setValoresStore
   * Actualiza un valor específico en el store utilizando el método correspondiente.
   * form Formulario reactivo que contiene los datos.
   * campo Nombre del campo cuyo valor se actualizará en el store.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite230902Store.establecerDatos({ [campo]: VALOR });
  }
  /**
   * @method cerrarSinRegistro
   * @description
   * Cierra la notificación de alerta que se muestra cuando no hay registros seleccionados para modificar.
   * Establece la propiedad `sinRegistro` a `false` para ocultar el mensaje de alerta correspondiente.
   * 
   * @returns {void}
   */
  cerrarSinRegistro(): void {
    this.sinRegistro = false;
  }

  /**
   * @method cerrarSinEliminar
   * @description
   * Cierra la notificación de alerta que se muestra cuando no hay registros seleccionados para eliminar.
   * Establece la propiedad `sinEliminar` a `false` para ocultar el mensaje de alerta correspondiente.
   * 
   * @returns {void}
   */
  cerrarSinEliminar(): void {
    this.sinEliminar = false;
  }
  /**
   * @method validarFormulario
   * @description
   * Valida los formularios de solicitud y mercancía del componente.
   * Verifica que ambos formularios sean válidos antes de permitir el envío o avance.
   * Si algún formulario es inválido:
   * - Establece `tablaError` basándose en si existen datos en la tabla
   * - Marca todos los controles como "tocados" para mostrar los errores de validación
   * - Retorna `false` para indicar que la validación falló
   * 
   * @returns {boolean} `true` si ambos formularios son válidos, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    if (this.formSolicitud.valid) {
      if(this.tablaDatos.length > 0) {
        return true;
      }
    }
    this.tablaError = this.tablaDatos.length === 0 ? true : false;
    this.formSolicitud.markAllAsTouched();
    if(this.formMercancia) {
      this.formMercancia.markAllAsTouched();
    }
    return false
  }
  /**
   * @method noSpecialCharactersValidator
   * @description
   * Validador personalizado estático que verifica si un campo contiene caracteres especiales no permitidos.
   * Utiliza una expresión regular para detectar caracteres como: !"#$%/()=?=)(/&%$#""#$%$#"#$&
   * Si se detectan caracteres especiales, retorna un error de validación que puede ser usado para mostrar
   * el mensaje "Ingresa datos validos." en la interfaz de usuario.
   * 
   * @param {AbstractControl} control - El control de formulario que se está validando.
   * @returns {ValidationErrors | null} Objeto con el error 'hasSpecialCharacters' si hay caracteres especiales, null si la validación pasa.
   * @static
   */
  static noSpecialCharactersValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const SPECIALCHARACTERREGEX = /[!"#$%/()=?=)(/&%$#""#$%$#"#$&]/;
    const HASSPECIALCHAR = SPECIALCHARACTERREGEX.test(control.value);

    return HASSPECIALCHAR ? { hasSpecialCharacters: true } : null;
  }
  /**
   * Limpia las suscripciones cuando el componente se destruye.
   * Evita fugas de memoria al completar el Subject.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
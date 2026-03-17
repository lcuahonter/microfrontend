import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// --- Bootstrap / externos ---
import { Modal } from 'bootstrap';

// --- RxJS ---
import { Subject, takeUntil } from 'rxjs';

// --- @libs / @ng-mf ---
import {
  BotonAccionesTipos,
  Catalogo,
  ConsultaioQuery,
  ConsultaioState,
  InputTypes,
  Notificacion,
  NotificacionesComponent,
  SoloNumerosDirective,
  esControlValido,
} from '@ng-mf/data-access-user';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';

import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';

// --- Locales (../../) ---
import { ActionType } from '../../enum/aviso.enum';

import { MERCANCIA_TRASFERIDA } from '../../constants/aviso.enum';

import {
  DatosDomicilioLugar,
  DatosMercanciaSubmanufactura,
} from '../../models/aviso.model';

import { AgregarMercanciaComponent } from '../agregar-mercancia/agregar-mercancia.component';

import { CatalogoT32504Service } from '../../services/catalogo-t32504.service';

import { Tramite32504Query } from '../../estados/tramite32504.query';
import { Tramite32504Store } from '../../estados/tramite32504.store';

@Component({
  selector: 'app-manual-aviso',
  templateUrl: './manual-aviso.component.html',
  styleUrl: './manual-aviso.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    AgregarMercanciaComponent,
    NotificacionesComponent,
    SoloNumerosDirective,
  ],
  standalone: true,
})
export class ManualAvisoComponent implements OnInit, OnDestroy {
  /**
   * FormGroup para los datos de la persona o entidad que recibe.
   */
  formularioQuienRecibe!: FormGroup;

  /**
   * FormGroup para los datos del domicilio/lugar donde se realizan operaciones.
   */
  formularioDomicilioLugar!: FormGroup;

  /**
   * Domicilio actualmente en edición; `null` cuando se crea uno nuevo.
   */
  domicilioAModificar: DatosDomicilioLugar | null | undefined = null;

  @Input() set domicilioInput(
    domicilioAModificar: DatosDomicilioLugar | null | undefined
  ) {
    this.domicilioAModificar = domicilioAModificar;
    this.procesarDomicilio();
  }

  get domicilioInput(): DatosDomicilioLugar | null | undefined {
    return this.domicilioAModificar;
  }

  /**
   * Referencia al elemento del DOM del modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancia') modalAgregarMercancias!: ElementRef;

  /**
   * Evento que se emite cuando se desea agregar una nueva fila a la tabla.
   * Emite un objeto de tipo ColumnasTabla hacia el componente padre.
   */
  @Output() agregarFila = new EventEmitter<DatosDomicilioLugar>();
  /**
   * Evento que emite acciones de los botones principales del formulario.
   * @type {EventEmitter<boolean>}
   */
  @Output() emitButtonAction = new EventEmitter<boolean>();

  /**
   * Evento que se emite para cerrar el modal del formulario.
   * @type {EventEmitter<boolean>}
   */
  @Output() cerrarModalAction = new EventEmitter<void>();

  /**
   * Evento que se emite cuando se ha agregado un nuevo registro correctamente.
   */
  @Output() registroAgregado = new EventEmitter<void>();

  /**
   * Notificador para destruir suscripciones activas y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si se debe mostrar el popup que confirma que un registro fue agregado.
   * Valor booleano que controla la visibilidad del mensaje emergente de confirmación.
   */
  public mostrarPopupRegistroAgregado = false;

  /**
   * Mensaje que se muestra en el popup al agregar un registro exitosamente.
   * Informa al usuario que la operación se realizó correctamente.
   */
  public mensajePopupRegistroAgregado =
    'El registro fue agregado correctamente.';

  /**
   * Formulario reactivo principal del componente.
   * @type {FormGroup}
   */
  formulario!: FormGroup;

  /**
   * Enumeración de los tipos de acciones de los botones.
   * @type {typeof BotonAccionesTipos}
   */
  botonAccionesTipos = BotonAccionesTipos;

  /**
   * Enumeración de los tipos de acción del formulario.
   * @type {typeof ActionType}
   */
  actionTypes = ActionType;

  /**
   * Enumeración para la selección de filas en la tabla.
   * @type {typeof TablaSeleccion}
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Objeto para almacenar eventos de interacción.
   * @type {any}
   */
  event = {};
  /** Almacena el estado actual de la consulta relacionada con el trámite.
   *  Contiene información necesaria para mostrar o procesar datos en el componente. */
  public consultaState!: ConsultaioState;
  /**
   * Enumeración de los tipos de input disponibles.
   * @type {typeof InputTypes}
   */
  inputTypes = InputTypes;

  estadosCatalogo: Catalogo[] = [];
  municipiosCatalogo: Catalogo[] = [];
  coloniasCatalogo: Catalogo[] = [];
  /**
   * Catálogo de mercancías ya agregadas para este domicilio.
   */
  mercanciasAgregadas: DatosMercanciaSubmanufactura[] = [];

  /**
   * Mercancía seleccionada para edición dentro del modal.
   */
  mercanciaAModificar?: DatosMercanciaSubmanufactura | null | undefined = null;

  /**
   * Configuración de columnas para la tabla de mercancías transferidas.
   */
  mercanciasTablaConfig = MERCANCIA_TRASFERIDA;

  /** Lista de elementos seleccionados en la tabla */
  itemsSeleccionados: Set<number> = new Set();

  /**
   * Índices de filas seleccionadas en la tabla de mercancías.
   */
  filasSeleccionadas: number[] = [];

  /**
   * Indicador de si existe un error de validación en el formulario.
   */
  tieneError: boolean = false;

  /**
   * Mensaje de error actual mostrado en el componente.
   */
  errorMensaje!: string;

  /**
   * Contenido HTML usado para mostrar alertas en el formulario.
   */
  public formErrorAlert = '';

  /**
   * Indica si se debe mostrar una notificación de información.
   */
  mostrarInfo: boolean = false;

  /**
   * Indica si se debe mostrar una alerta simple.
   */
  mostrarAlertaSimple: boolean = false;

  /**
   * Notificación para mostrar información específica.
   * @property {Notificacion} nuevaNotificacionInfo
   */
  public nuevaNotificacionInfo!: Notificacion;

  /**
   * Índice de la fila seleccionada en la tabla de mercancías.
   */
  public filaSeleccionadaIndex: number | null = null;

  /**
   * Inicializa el componente, inyecta los servicios necesarios y crea el formulario principal.
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {CatalogosService} catalogosServicios - Servicio para obtener catálogos.
   * @param {Tramite32504Store} store - Store para la gestión del estado del trámite.
   * @param {ConsultaioQuery} consultaQuery - Query para consultar el estado de consulta.
   */
  constructor(
    private fb: FormBuilder,
    private catalogosServicios: CatalogoT32504Service,
    private store: Tramite32504Store,
    private consultaQuery: ConsultaioQuery,
    private query: Tramite32504Query
  ) {}

  /**
   * Inicializa los grupos del formulario y suscribe el estado de solo lectura para habilitar o deshabilitar el formulario según corresponda.
   */
  ngOnInit(): void {
    this.obtenerEstados();
  }

  @ViewChild(TablaDinamicaComponent)
  tablaComponent!: TablaDinamicaComponent<DatosMercanciaSubmanufactura>;

  /**
   * Control `entidadFederativa` del formulario de domicilio.
   * @returns {FormControl} Control del campo entidad federativa.
   */
  get entidadFederativaCtrl(): FormControl {
    return this.formularioDomicilioLugar.get(
      'clave_entidad_federativa'
    ) as FormControl;
  }

  /**
   * Control `colonias` del formulario de domicilio.
   * @returns {FormControl} Control del campo colonias.
   */
  get coloniaCtrl(): FormControl {
    return this.formularioDomicilioLugar.get('colonias') as FormControl;
  }

  /**
   * Control `alcalida_municipio` del formulario de domicilio.
   * @returns {FormControl} Control del campo alcalida/municipio.
   */
  get municipioCtrl(): FormControl {
    return this.formularioDomicilioLugar.get(
      'clave_delegacion_municipio'
    ) as FormControl;
  }

  /**
   * Crea el formulario principal e inicializa los subgrupos.
   * @returns {void}
   */
  crearFormulario(): void {
    this.formularioQuienRecibe = this.fb.group({
      rfc: ['', Validators.required],
      programaImmex: [''],
      anioImmex: [''],
    });

    this.formularioDomicilioLugar = this.fb.group({
      nombreComercial: [''],
      clave_entidad_federativa: ['', Validators.required],
      clave_delegacion_municipio: ['', Validators.required],
      colonias: ['', Validators.required],
      calle: ['', Validators.required],
      numeroExterior: ['', Validators.required],
      numeroInterior: [''],
      codigoPostal: ['', Validators.required],
    });
    this.mercanciasAgregadas = [];
  }

  /**
   * Maneja las acciones de los botones del formulario y la tabla secundaria según el tipo de acción seleccionada.
   * @param {ActionType} accionTipo - Tipo de acción que define el tipo de formulario.
   * @param {BotonAccionesTipos} accione - Tipo de acción a ejecutar.
   * @returns {void}
   */
  accionesBotones(accionTipo: ActionType, accione: BotonAccionesTipos): void {
    switch (accionTipo) {
      case 'FORM_ACTION':
        switch (accione) {
          case BotonAccionesTipos.AGREGAR:
            break;
          case BotonAccionesTipos.CANCELAR:
            this.errorMensaje = '';
            this.cerrarModalAction.emit();
            this.limpiarForm();
            break;
          case BotonAccionesTipos.MODIFICAR:
            if (this.itemsSeleccionados.size > 0) {
              this.abrirModalMercancia();
              this.itemsSeleccionados.clear();
            }

            break;

          default:
            break;
        }
        break;
      case 'TABLE_ACTION':
        switch (accione) {
          case BotonAccionesTipos.AGREGAR:
            this.mercanciaAModificar = null;
            break;
          case BotonAccionesTipos.ELIMINAR:
            this.preguntarBorrarMercancia();
            this.emitButtonAction.emit(false);
            break;
          case BotonAccionesTipos.MODIFICAR:
            if (this.itemsSeleccionados.size > 0) {
              this.abrirModalMercancia();
              this.itemsSeleccionados.clear();
            }
            break;

          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  /**
   * Resetea los formularios (`formularioDomicilioLugar` y `formularioQuienRecibe`) y
   * limpia la lista de `mercanciasAgregadas`.
   * @returns {void}
   */
  limpiarForm(): void {
    this.formularioDomicilioLugar.reset();
    this.formularioQuienRecibe.reset();
    this.mercanciasAgregadas = [];
  }

  /**
   * Maneja el comportamiento del botón de la tabla secundaria.
   * @param {BotonAccionesTipos} action - Tipo de acción a ejecutar.
   * @returns {void}
   */
  static botonDeTablaInfantilAccion(action: BotonAccionesTipos): void {
    switch (action) {
      case BotonAccionesTipos.AGREGAR:
      case BotonAccionesTipos.CANCELAR:
        break;
      default:
        break;
    }
  }

  /**
   * Crea el HTML para mostrar un mensaje de error en el formulario.
   * @param mensaje Texto que se mostrará dentro del contenedor de error.
   */
  generaMensajeError(mensaje: string): void {
    this.formErrorAlert = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      ${mensaje}
    </div>
  </div>
</div>
`;
  }

  /**
   * Valida los grupos de formulario "datosQuienRecibe" y "datosDomicilioLugar", y si son válidos, emite una nueva fila.
   * Si hay errores, marca los controles como tocados; si no, combina los datos y emite el evento de agregar fila.
   */
  validarNewAgregarFila(): void {
    const GROUPO_QUIEN_RECIBE = this.formularioQuienRecibe;
    const GROUPO_DOMICILIO_LUGAR = this.formularioDomicilioLugar;

    if (!GROUPO_QUIEN_RECIBE.valid || !GROUPO_DOMICILIO_LUGAR.valid) {
      this.tieneError = true;
      this.generaMensajeError(
        'Debe registrar correctamente datos del domicilio del lugar en donde se llavarán a cabo las operaciones de submanufactura.'
      );
      GROUPO_DOMICILIO_LUGAR.markAllAsTouched();
      GROUPO_QUIEN_RECIBE.markAllAsTouched();
    } else {
      this.mercanciaAModificar = null;
      this.tieneError = false;
      this.abrirModalMercancia();
    }
  }

  /**
   * Inicializa el formulario y, si existe un domicilio en edición, parchea los valores
   * y asigna las mercancías asociadas para su edición.
   * @returns {void}
   */
  procesarDomicilio(): void {
    this.crearFormulario();
    if (this.domicilioAModificar) {
      this.mercanciasAgregadas = this.domicilioAModificar.mercancias;
      this.formularioQuienRecibe.patchValue({
        rfc: this.domicilioAModificar.rfc,
        programaImmex: this.domicilioAModificar.programa_immex,
        anioImmex: this.domicilioAModificar.anio_programa_immex,
      });
      this.formularioDomicilioLugar.patchValue({
        nombreComercial: this.domicilioAModificar.nombre_comercial,
        clave_entidad_federativa: this.domicilioAModificar.clave_entidad_federativa,
        clave_delegacion_municipio: this.domicilioAModificar.clave_delegacion_municipio,
        colonias: this.domicilioAModificar.colonias,
        calle: this.domicilioAModificar.calle,
        numeroExterior: this.domicilioAModificar.numero_exterior,
        numeroInterior: this.domicilioAModificar.numero_interior,
        codigoPostal: this.domicilioAModificar.codigo_postal,
      });
    }
  }

  /**
   * Valida los formularios `datosQuienRecibe` y `datosDomicilioLugar`.
   * Si son válidos, ejecuta la acción de agregar y emite el evento `registroAgregado`.
   */
  onAgregarClick(): void {
    const ID_MODIFICAR = this.domicilioAModificar?.idTemporal;
    const GROUPO_QUIEN_RECIBE = this.formularioQuienRecibe;
    const GROUPO_DOMICILIO_LUGAR = this.formularioDomicilioLugar;
    this.tieneError = false;

    if (!GROUPO_QUIEN_RECIBE.valid) {
      GROUPO_QUIEN_RECIBE.markAllAsTouched();
    }
    if (!GROUPO_DOMICILIO_LUGAR.valid) {
      GROUPO_DOMICILIO_LUGAR.markAllAsTouched();
    }

    if (!GROUPO_QUIEN_RECIBE.valid || !GROUPO_DOMICILIO_LUGAR.valid) {
      return;
    }

    if (this.mercanciasAgregadas.length === 0) {
      this.tieneError = true;
      this.generaMensajeError('Debe registrar al menos una mercancía.');
      return;
    }

    this.accionesBotones(
      this.actionTypes.FORM_ACTION,
      this.botonAccionesTipos.AGREGAR
    );

    const ND = this.construirNuevoDomicilioLugar();
    if (ID_MODIFICAR) {
      const DOMICILIOS_EXISTENTES = this.query.getValue().direcciones;

      const IDX = DOMICILIOS_EXISTENTES.findIndex(
        (e) => e.idTemporal === ID_MODIFICAR
      );

      if (IDX !== -1) {
        const DOMS_MODIFICADOS = [...DOMICILIOS_EXISTENTES];
        DOMS_MODIFICADOS.splice(IDX, 1, ND);
        this.store.setDirecciones(DOMS_MODIFICADOS);
      }
    } else {
      this.store.setDirecciones([...this.query.getValue().direcciones, ND]);
    }

    this.agregarFila.emit();
    this.formularioDomicilioLugar.reset();
    this.formularioQuienRecibe.reset();
    this.mercanciasAgregadas = [];
  }

  /**
   * Construye y retorna un objeto `DatosDomicilioLugar` con los valores actuales del formulario,
   * incluyendo las descripciones calculadas para entidad, municipio y colonia.
   * @returns {DatosDomicilioLugar}
   */
  construirNuevoDomicilioLugar(): DatosDomicilioLugar {
    return {
      idTemporal: Math.floor(Math.random() * 100),
      rfc: this.formularioQuienRecibe.get('rfc')?.value,
      programa_immex: this.formularioQuienRecibe.get('programaImmex')?.value,
      anio_programa_immex: this.formularioQuienRecibe.get('anioImmex')?.value,
      nombre_comercial:
        this.formularioDomicilioLugar.get('nombreComercial')?.value,
      clave_entidad_federativa:
        this.formularioDomicilioLugar.get('clave_entidad_federativa')?.value,
      clave_delegacion_municipio:
        this.formularioDomicilioLugar.get('clave_delegacion_municipio')?.value,
      colonias: this.formularioDomicilioLugar.get('colonias')?.value,
      calle: this.formularioDomicilioLugar.get('calle')?.value,
      numero_exterior:
        this.formularioDomicilioLugar.get('numeroExterior')?.value,
      numero_interior:
        this.formularioDomicilioLugar.get('numeroInterior')?.value,
      codigo_postal: this.formularioDomicilioLugar.get('codigoPostal')?.value,
      mercancias: this.mercanciasAgregadas,
      descAlcaldiaMunicipio: ManualAvisoComponent.obtenerDescripciones(
        this.municipiosCatalogo,
        this.formularioDomicilioLugar.get('clave_delegacion_municipio')?.value
      ),
      descColonias: ManualAvisoComponent.obtenerDescripciones(
        this.coloniasCatalogo,
        this.formularioDomicilioLugar.get('colonias')?.value
      ),
      descEntidadFederativa: ManualAvisoComponent.obtenerDescripciones(
        this.estadosCatalogo,
        this.formularioDomicilioLugar.get('clave_entidad_federativa')?.value
      ),
    };
  }

  /**
   * Añade una mercancía a la lista `mercanciasAgregadas` o la actualiza si ya existe.
   * Cierra el modal de edición y muestra una notificación de éxito.
   * @param mercancia Mercancía a agregar o actualizar.
   */
  agregarMercancia(mercancia: DatosMercanciaSubmanufactura): void {
    const IDX = this.mercanciasAgregadas.findIndex(
      (m) => m.idTemporal === mercancia.idTemporal
    );

    this.mercanciasAgregadas =
      IDX !== -1
        ? this.mercanciasAgregadas.map((m, i) => (i === IDX ? mercancia : m))
        : [...this.mercanciasAgregadas, mercancia];
    this.cerrarModal();
    this.mostrarNotificacion('El registro fue agregado correctamente.');
  }

  // eslint-disable-next-line class-methods-use-this
  /**
   * Comprueba si un control dentro de un `FormGroup` es válido.
   * Usa el helper `esControlValido` y retorna un booleano.
   * @param formulario Grupo de formulario que contiene el control.
   * @param campo Nombre del control a validar.
   * @returns {boolean} True si el control es válido, false en caso contrario.
   */
  controlValido(formulario: FormGroup, campo: string): boolean {
    return esControlValido(formulario, campo) ?? false;
  }

  /**
   * Solicita y asigna el catálogo de estados al arreglo `estadosCatalogo`.
   * Realiza la suscripción hasta que se emita `destroyNotifier$`.
   * @returns {void}
   */
  obtenerEstados(): void {
    this.catalogosServicios
      .obtenerEstados()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => {
        this.estadosCatalogo = res.datos ?? [];
      });
  }

  /**
   * Maneja el cambio de `entidadFederativa` en el formulario.
   * Reinicia los catálogos de `municipiosCatalogo` y `coloniasCatalogo`,
   * y solicita los municipios para la clave de estado seleccionada.
   * @returns {void}
   */
  onChangeEstado(): void {
    this.municipiosCatalogo = [];
    this.coloniasCatalogo = [];
    this.coloniaCtrl.reset();
    this.municipioCtrl.reset();
    const CVE_ESTADO =
      this.formularioDomicilioLugar.get('clave_entidad_federativa')?.value;
    this.obtenerMunicipios(CVE_ESTADO);
  }

  /**
   * Maneja el cambio de `alcalida_municipio` en el formulario.
   * Reinicia `coloniasCatalogo` y solicita las colonias para el municipio seleccionado.
   * @returns {void}
   */
  onChangeMunicipio(): void {
    this.coloniasCatalogo = [];
    this.coloniaCtrl.reset();
    const CVE_MUNICIPIO =
      this.formularioDomicilioLugar.get('clave_delegacion_municipio')?.value;
    this.obtenerColonias(CVE_MUNICIPIO);
  }

  /**
   * Solicita y asigna el catálogo de municipios para la clave de estado proporcionada.
   * @param cveEstado Clave del estado para obtener municipios.
   * @returns {void}
   */
  obtenerMunicipios(cveEstado: string): void {
    this.catalogosServicios
      .obtenerMunicipios(cveEstado)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => {
        this.municipiosCatalogo = res.datos ?? [];
      });
  }

  /**
   * Solicita y asigna el catálogo de colonias para la clave de municipio proporcionada.
   * @param cveMunicipio Clave del municipio para obtener colonias.
   * @returns {void}
   */
  obtenerColonias(cveMunicipio: string): void {
    this.catalogosServicios
      .obtenerColonias(cveMunicipio)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => {
        this.coloniasCatalogo = res.datos ?? [];
      });
  }

  /**
   * Abre el modal para agregar o editar una mercancía con opciones de backdrop y teclado deshabilitadas.
   * @returns {void}
   */
  abrirModalMercancia(): void {
    const MODAL = new Modal(this.modalAgregarMercancias.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });
    MODAL.show();
  }

  /**
   * Cierra el modal de agregar/editar mercancía e limpia la selección en la tabla dinámica.
   * @returns {void}
   */
  cerrarModal(): void {
    const MODAL = Modal.getInstance(this.modalAgregarMercancias.nativeElement);
    MODAL?.hide();
    this.tablaComponent.clearSelection();
  }

  /**
   * Metodo estático para obtener la descripción de un catálogo dado una clave.
   * @param catalogo catálogo de búsqueda.
   * @param clave clave a buscar en el catálogo.
   * @returns descripción correspondiente a la clave o la clave misma si no se encuentra.
   */
  static obtenerDescripciones(catalogo: Catalogo[], clave: string): string {
    const ENCONTRADO = catalogo.find((c) => c.clave === clave);
    return ENCONTRADO ? ENCONTRADO.descripcion : clave;
  }

  /**
   * Maneja la selección de una fila en la tabla de mercancías.
   * Si `fila` es null se limpia la selección; si no, se marca la fila para edición.
   * @param fila Fila seleccionada o null si se deselecciona.
   */
  onFilasSeleccionadas(fila: DatosMercanciaSubmanufactura | null): void {
    this.itemsSeleccionados.clear();

    if (!fila) {
      this.mercanciaAModificar = null;
      return;
    }

    this.itemsSeleccionados.add(fila.idTemporal ?? 0);
    this.mercanciaAModificar = fila;
  }

  /**
   * Pregunta al usuario si desea borrar el domicilio seleccionado.
   * @returns nada
   */
  preguntarBorrarMercancia(): void {
    if (this.itemsSeleccionados.size === 0) {
      return;
    }
    this.mostrarInfo = true;
    this.nuevaNotificacionInfo = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Desea eliminar el registro seleccionado?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }

  /**
   * Borra los domicilios seleccionados en la tabla dinámica.
   * @returns
   */
  borrarMercancia(): void {
    const IDS = Array.from(this.itemsSeleccionados);
    this.itemsSeleccionados.clear();

    this.mercanciasAgregadas = this.mercanciasAgregadas.filter(
      (d) => d.idTemporal && !IDS.includes(d.idTemporal)
    );
    this.tablaComponent.clearSelection();
    this.mostrarNotificacion('El registro fue eliminado correctamente.');
  }

  /**
   * Maneja la acción de aceptar en la información mostrada.
   * @param event Evento que indica si se aceptó la acción.
   */
  aceptarInfo(event: boolean): void {
    if (event) {
      this.mostrarInfo = false;
      this.borrarMercancia();
    } else {
      this.mostrarInfo = false;
    }
  }

  /**
   * Cierra la alerta modal.
   * @method aceptar
   */
  aceptarAlerta(): void {
    this.mostrarAlertaSimple = false;
  }

  /**
   * Metodo para mostrar una notificación simple.
   * @param mensaje el mensaje a mostrar en la notificación.
   */
  mostrarNotificacion(mensaje: string): void {
    this.mostrarInfo = false;
    this.mostrarAlertaSimple = true;
    this.nuevaNotificacionInfo = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 800,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Libera los recursos y destruye las suscripciones activas al destruir el componente.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

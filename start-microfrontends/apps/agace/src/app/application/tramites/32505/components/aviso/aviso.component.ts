import {
  ALPHANUMERIC_PATTERN,
  ENCABEZADAS_CONSTANT,
  ENCABEZADAS_CONSTANT_CONSULTA,
  RADIO_OPCIONS,
  RADIO_OPCIONS_AVISO,
  RADIO_OPCIONS_CONFIRMIDAD,
  RADIO_TIPO_AVISO,
  TABLA_DE_DATOS_AVISO,
  TABLA_DE_DATOS_AVISO_CONSULTA,
} from '../../constants/avios-procesos.enum';
import {
  AvisoTablaDatos,
  CatalogoLista,
  ColumnasTabla,
  ColumnasTablaConsulta,
} from '../../models/avios-model';
import {
  BotonAccionesTipos,
  Catalogo,
  CatalogoSelectComponent,
  REG_X,
  TablaDinamicaComponent,
  TablaSeleccion,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  Solicitud32505State,
  Tramite32505Store,
} from '../../../../estados/tramites/trimite32505.store';
import { map, takeUntil } from 'rxjs';
import { AvisoService } from '../../services/aviso.service';
import { CargaMasivaComponent } from '../carga-masiva/carga-masiva.component';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Tramite32505Query } from '../../../../estados/queries/tramite32505.query';

/**
 * @component AvisoComponent
 * @description Componente encargado de gestionar la interfaz de usuario para el manejo de avisos relacionados con trámites.
 * Proporciona formularios, tablas dinámicas y modales para capturar, visualizar y gestionar datos de avisos.
 *
 * @selector app-aviso
 * @templateUrl ./aviso.component.html
 * @styleUrl ./aviso.component.scss
 * @standalone true
 */
@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.scss',
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    CargaMasivaComponent,
    InputRadioComponent,
    NotificacionesComponent,
  ],
  standalone: true,
})
export class AvisoComponent implements OnInit, OnDestroy {


  /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /**
   * @property {ReplaySubject<boolean>} destroyed$
   *  @description Sujeto que emite un valor cuando el componente se destruye.
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   *  @type {ReplaySubject<boolean>}
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  /**
   * @property {typeof RADIO_OPCIONS} radioOpcions
   * @description Opciones de radio disponibles para selección.
   */
  radioOpcions = RADIO_OPCIONS;

  /**
   * @property {typeof RADIO_TIPO_AVISO} radioTipoAviso
   * @description Opciones de tipo de aviso disponibles para selección.
   */
  radioTipoAviso = RADIO_TIPO_AVISO;
  /**
   * @property {typeof RADIO_OPCIONS_CONFIRMIDAD} radioConfirmidad
   * @description Opciones de confirmidad disponibles para selección.
   */
  radioConfirmidad = RADIO_OPCIONS_CONFIRMIDAD;

  /**
   * @property {typeof RADIO_OPCIONS_AVISO} radioOpcionsAviso
   * @description Opciones de radio específicas para avisos.
   */
  radioOpcionsAviso = RADIO_OPCIONS_AVISO;

  /**
   * @property {boolean} esPopupAbierto
   * @description Indica si el popup está abierto.
   */
  esPopupAbierto: boolean = false;

  /**
   * @property {boolean} datosDelVehiculo
   * @description Indica si se deben mostrar los datos del vehículo.
   */
  datosDelVehiculo: boolean = false;

  /**
   * @property {boolean} datosDelImportacion
   * @description Indica si se deben mostrar los datos de importación.
   */
  datosDelImportacion: boolean = false;

  /**
   * @property {boolean} datosFolioVUCEM
   * @description Indica si se deben mostrar los datos relacionados con el folio VUCEM.
   */
  datosFolioVUCEM: boolean = false;

  /**
   * @property {boolean} datosDelVenta
   * @description Indica si se deben mostrar los datos de la venta.
   */
  datosDelVenta: boolean = false;

  /**
   * @property {boolean} datosNIVNumeroSerie
   * @description Indica si se deben mostrar los datos del NIV o número de serie.
   */
  datosNIVNumeroSerie: boolean = false;

  /**
   * @property {boolean} esManualAsivoAgregarClicked
   * @description Indica si se ha hecho clic en el botón para agregar manualmente un aviso.
   */
  esManualAsivoAgregarClicked = false;

  /**
   * @property {typeof TablaSeleccion} TablaSeleccion
   * @description Referencia a la clase TablaSeleccion para gestionar tablas dinámicas.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * @property {typeof BotonAccionesTipos} botonAccionesTipos
   * @description Referencia a las acciones disponibles para los botones.
   */
  botonAccionesTipos = BotonAccionesTipos;

  /**
   * @property {Object} tablaDeDatos
   * @description Configuración de la tabla de datos utilizada en el componente.
   */
  tablaDeDatos: {
    encabezadas: (typeof ENCABEZADAS_CONSTANT)[];
    datos: ColumnasTabla[];
  } = TABLA_DE_DATOS_AVISO;

  /**
 * @property {Object} tablaDeDatos
 * @description Configuración de la tabla de datos utilizada en el componente.
 */
  tablaDeDatosConsulta: {
    encabezadas: (typeof ENCABEZADAS_CONSTANT_CONSULTA)[];
    datos: ColumnasTablaConsulta[];
  } = TABLA_DE_DATOS_AVISO_CONSULTA;
  
  /**
   * @property {ElementRef} datosAviso
   * @description Referencia al elemento del modal para buscar mercancías.
   */
  @ViewChild('datosAviso') datosAviso!: ElementRef;

  /**
   * @property {FormGroup} aviosForm
   * @description Formulario para capturar datos adicionales relacionados con el registro.
   */
  aviosForm!: FormGroup;

  /**
   * @property {Solicitud32505State} solicitudState
   * @description Estado de la solicitud.
   */
  public solicitudState!: Solicitud32505State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Sujeto para manejar la destrucción de observables.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Catalogo[]} optionsPais
   * @description Opciones disponibles para los países.
   */
  optionsPais!: Catalogo[];

  /**
   * @property {Catalogo[]} optionsAnio
   * @description Opciones disponibles para los años.
   */
  optionsAnio!: Catalogo[];

  /**
   * @property {Catalogo[]} optionCilindros
   * @description Opciones disponibles para los cilindros.
   */
  optionCilindros!: Catalogo[];

  /**
   * @property {Catalogo[]} anoModelo
   * @description Opciones disponibles para los años modelo de vehículos.
   */
  anoModelo!: Catalogo[];

  /**
   * @property {Catalogo[]} optionCombustible
   * @description Opciones disponibles para los tipos de combustible.
   */
  optionCombustible!: Catalogo[];

  /**
   * @property {Catalogo[]} optionAduana
   * @description Opciones disponibles para las aduanas.
   */
  optionAduana!: Catalogo[];

  /**
   * @property {Catalogo[]} paisIssued
   * @description Opciones de países que emitieron el título de propiedad.
   */
  paisIssued!: Catalogo[];

  /**
   * @property {boolean} datosDelAvisoVisible
   * @description Indica si la sección de datos del aviso es visible.
   */
  datosDelAvisoVisible: boolean = false;

  /**
   * @property {boolean} mostrarTipoDeCarga
   * @description Indica si se debe mostrar la sección de tipo de carga en el formulario.
   */
  mostrarTipoDeCarga: boolean = false;

  /**
   * @property {boolean} datosCargaMasiva
   * @description Indica si la sección de carga masiva es visible.
   */
  datosCargaMasiva: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacion
   * @description Representa una nueva instancia de notificación asociada con el componente.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {ColumnasTabla[]} filaSeleccionadaLista
   * @description Lista de filas seleccionadas en la tabla de avisos.
   */
  filaSeleccionadaLista: ColumnasTabla[] = [];
  /**
    * @property {ElementRef} closeDomicilio
    * @description Referencia al botón o elemento que cierra el modal de domicilio.
    */
  @ViewChild('closeDomicilio') public closeDomicilio!: ElementRef;



  /**
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite32505Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite32505Query} tramiteQuery - Servicio para realizar consultas relacionadas con el trámite.
   * @param {AvisoService} avisoService - Servicio para gestionar datos relacionados con avisos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   */
  constructor(
    private fb: FormBuilder,
    public store: Tramite32505Store,
    public tramiteQuery: Tramite32505Query,
    private avisoService: AvisoService,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {
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
  }

  /**
   * @method ngOnInit
   * @description Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();
    this.inicializarEstadoFormulario();
    this.cargarPais();
    this.cargarAnio();
    this.mostrarCampos();
    this.mostrarCamposAviso();
    this.cargarCilindros();
    this.cargarAnoModelo();
    this.cargarCombustible();
    this.cargarPaisIssued();
    this.cargarAduana();

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
      this.aviosForm.disable();
    } else {
      this.aviosForm.enable();
    }
  }


  /**
   * @method abrirPopup
   * @description Abre el popup estableciendo esPopupAbierto a true.
   */
  abrirPopup(): void {
    this.esPopupAbierto = true;
  }

  /**
   * @method datosDelAviso
   * @description Muestra el modal para cargar un archivo.
   */
  datosDelAviso(): void {
    this.esPopupAbierto = true;
    this.aviosForm.reset();
    if (this.datosAviso) {
      const MODAL_INSTANCE = new Modal(this.datosAviso.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * @method accionesBotones
   * @description Maneja las acciones de los botones.
   * @param {BotonAccionesTipos} accione - Acción del botón.
   */
  accionesBotones(accione: BotonAccionesTipos): void {
    switch (accione) {
      case BotonAccionesTipos.AGREGAR:
        this.esManualAsivoAgregarClicked = true;
        break;
      case BotonAccionesTipos.ELIMINAR:
        if (this.filaSeleccionadaLista.length === 0) {
          this.mostrarNotificacionSeleccion('Selecciona el(los) registro(s) a eliminar');
        }
        break;
      case BotonAccionesTipos.MODIFICAR:
        if (this.filaSeleccionadaLista.length === 0) {
          this.mostrarNotificacionSeleccion('Selecciona un registro para modificar');
        }
        break;
      default:
        break;
    }
  }

  /**
   * @method isValid
   * @description Valida un campo del formulario.
   * @param {FormGroup} form - Formulario a validar.
   * @param {string} field - Campo a validar.
   * @returns {boolean | null} Resultado de la validación.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * @method get adaceForm
   * @description Obtiene el grupo de formulario 'adaceForm'.
   * @returns {FormGroup} Grupo de formulario.
   */
  get adaceForm(): FormGroup {
    return this.aviosForm.get('adaceForm') as FormGroup;
  }

  /**
   * @method get adace
   * @description Obtiene el campo 'adace' del formulario.
   * @returns {FormGroup} Campo del formulario.
   */
  get adace(): FormGroup {
    return this.aviosForm.get('adaceForm.adace') as FormGroup;
  }

  /**
   * @method get pais
   * @description Obtiene el campo 'pais' del formulario.
   * @returns {FormGroup} Campo del formulario.
   */
  get pais(): FormGroup {
    return this.aviosForm.get('adaceForm.pais') as FormGroup;
  }

  /**
   * @method get anio
   * @description Obtiene el campo 'anio' del formulario.
   * @returns {FormGroup} Campo del formulario.
   */
  get anio(): FormGroup {
    return this.aviosForm.get('adaceForm.anio') as FormGroup;
  }

  /**
   * @method get tipoBusqueda
   * @description Obtiene el campo 'tipoBusqueda' del formulario.
   * @returns {FormGroup} Campo del formulario.
   */
  get tipoBusqueda(): FormGroup {
    return this.aviosForm.get('adaceForm.tipoBusqueda') as FormGroup;
  }

  /**
   * @method get tipoBusquedaAviso
   * @description Obtiene el campo 'tipoBusquedaAviso' del formulario.
   * @returns {FormGroup} Campo del formulario.
   */
  get tipoBusquedaAviso(): FormGroup {
    return this.aviosForm.get('adaceForm.tipoBusquedaAviso') as FormGroup;
  }

  /**
   * @method get folioTipo
   * @description Obtiene el campo 'folioTipo' del formulario.
   * @returns {FormGroup} Campo del formulario.
   */
  get folioTipo(): FormGroup {
    return this.aviosForm.get('adaceForm.folioTipo') as FormGroup;
  }

  /**
   * @method get cilindros
   * @description Obtiene el campo 'cilindros' del formulario.
   * @returns {FormGroup} Campo del formulario.
   */
  get cilindros(): FormGroup {
    return this.aviosForm.get('adaceForm.cilindros') as FormGroup;
  }



  /**
   * @method mostrarCamposAviso
   * @description Muestra los campos según el tipo de búsqueda seleccionado.
   */
  mostrarCamposAviso(): void {
    const AVISO_TIPO_BUSQUEDA = this.adaceForm.get('tipoBusquedaAviso')?.value;
    const FOLIO_TIPO = this.adaceForm.get('folioTipo')?.value;

    if (AVISO_TIPO_BUSQUEDA === 'Importación') {
      this.datosDelVehiculo = true;
      this.datosFolioVUCEM = false;
      this.datosDelImportacion = true;
      this.datosDelVenta = false;
      this.datosNIVNumeroSerie = false;
    } else if (AVISO_TIPO_BUSQUEDA === 'Venta') {
      this.datosFolioVUCEM = true;
      this.datosDelVehiculo = false;
      this.datosDelImportacion = false;
      this.datosDelVenta = true;
      this.datosNIVNumeroSerie = false;

      if (FOLIO_TIPO === 'Si') {
        this.datosDelVenta = true;
        this.datosDelVehiculo = false;
        this.datosDelImportacion = false;
        this.datosFolioVUCEM = true;
        this.datosNIVNumeroSerie = true;
      } else if (FOLIO_TIPO === 'No') {
        this.datosDelVenta = true;
        this.datosDelVehiculo = false;
        this.datosDelImportacion = false;
        this.datosFolioVUCEM = true;
        this.datosNIVNumeroSerie = false;
      }
    } else if (AVISO_TIPO_BUSQUEDA === 'Importación y venta') {
      this.datosDelVehiculo = true;
      this.datosFolioVUCEM = false;
      this.datosDelImportacion = true;
      this.datosDelVenta = true;
    } else {
      this.datosFolioVUCEM = true;
      this.datosDelVehiculo = true;
      this.datosDelImportacion = true;
    }
  }

  /**
   * @method mostrarCampos
   * @description Muestra los campos según el tipo de búsqueda seleccionado.
   */
  mostrarCampos(): void {
    const TIPO_BUSQUEDA = this.adaceForm.get('tipoBusqueda')?.value;

    if (TIPO_BUSQUEDA === 'Manual') {
      this.datosDelAvisoVisible = true;
      this.datosCargaMasiva = false;
    } else if (TIPO_BUSQUEDA === 'Carga masiva') {
      this.datosDelAvisoVisible = true;
      this.datosCargaMasiva = true;
    }
  }

  /**
   * @method mostrarTipoDeCargaCampos
   * @description Controla la visibilidad de los campos del tipo de carga basándose en el valor de confirmidad.
   * Evalúa el valor del campo 'confirmidad' del formulario y actualiza la propiedad `mostrarTipoDeCarga`
   */
  mostrarTipoDeCargaCampos(): void {
    const CONFIRMIDAD = this.adaceForm.get('confirmidad')?.value;
    if (CONFIRMIDAD === 'si') {
      this.mostrarTipoDeCarga = true;
    } else if (CONFIRMIDAD === 'no'){
      this.mostrarTipoDeCarga = false;
    }
  }


  /**
   * @method cargarPais
   * @description Carga las opciones disponibles para los países.
   */
  cargarPais(): void {
    this.avisoService
      .obtenerPais()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.optionsPais = datos.datos;
      });
  }

  /**
   * @method cargarAnio
   * @description Carga las opciones disponibles para los años.
   */
  cargarAnio(): void {
    this.avisoService
      .obtenerAnio()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.optionsAnio = datos.datos;
      });
  }

  /**
   * @method cargarCilindros
   * @description Carga las opciones disponibles para los cilindros.
   */
  cargarCilindros(): void {
    this.avisoService
      .obtenerCilindros()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.optionCilindros = datos.datos;
      });
  }

  /**
   * @method cargarCilindros
   * @description Carga las opciones disponibles para los cilindros.
   */
  cargarAnoModelo(): void {
    this.avisoService
      .obtenerAnoModelo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.anoModelo = datos.datos;
      });
  }

  /**
   * @method cargarCombustible
   * @description Carga las opciones disponibles para los tipos de combustible.
   */
  cargarCombustible(): void {
    this.avisoService
      .obtenerCombustible()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.optionCombustible = datos.datos;
      });
  }

  /**
   * @method cargarPaisIssued
   * @description Carga las opciones disponibles para los países que emitieron el título de propiedad.
   */
  cargarPaisIssued(): void {
    this.avisoService
      .obtenerPaisIssued()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.paisIssued = datos.datos;
      });
  }

  /**
   * @method cargarAduana
   * @description Carga las opciones disponibles para las aduanas.
   */
  cargarAduana(): void {
    this.avisoService
      .obtenerAduana()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.optionAduana = datos.datos;
      });
  }

  /**
   * @method cargarAvisoTabla
   * @description Carga los datos de la tabla de avisos.
   */
  public cargarAvisoTabla(): void {
    this.avisoService
      .obtenerAvisoTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: AvisoTablaDatos) => {
        this.tablaDeDatos.datos = datos.datos;
      });
  }


  /**
   * @method agregarDomicilio
   * @description Agrega domicilios a la tabla de avisos.
   */
  agregarDomicilio(): void {
    this.cargarAvisoTabla();
    this.closeDomicilio.nativeElement.click();
    this.abrirModal();
  }

  /**
   * @method abrirModal
   * @description Configura y abre un modal de notificación.
   */
  public abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Se ha guardado correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * @method filaSeleccionada
   * @description Maneja las filas seleccionadas en la tabla de avisos.
   * @param {ColumnasTabla[]} evento - Filas seleccionadas.
   */
  filaSeleccionada(evento: ColumnasTabla[]): void {
    this.filaSeleccionadaLista = evento;
  }

  /**
   * @method openModalCancelarTramite
   * @description Abre el modal para cancelar el trámite.
   */
  openModalCancelarTramite(): void {
    this.adaceForm.reset();
    this.optionsPais = [];
  }

  /**
   * @method setValoresStore
   * @description Actualiza un valor en el store del trámite.
   * @param {FormGroup} form - Formulario que contiene el valor.
   * @param {string} campo - Nombre del campo.
   * @param {keyof Tramite32505Store} metodoNombre - Nombre del método en el store.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32505Store): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /** 
   * @method crearFormSolicitud
   * @description Crea el formulario principal de la solicitud.
   **/
  donanteDomicilio(): void {
    this.aviosForm = this.fb.group({
      adaceForm: this.fb.group({
        adace: [{ value: this.solicitudState.adace, disabled: true }, [Validators.required]],
        pais: [{ value: this.solicitudState.pais, disabled: this.soloLectura }, [Validators.required]],
        anio: [{ value: this.solicitudState.anio, disabled: this.soloLectura }, [Validators.required]],
        confirmidad: [this.solicitudState?.confirmidad ],
        tipoBusqueda: [this.solicitudState?.tipoBusqueda, [Validators.required]],
        tipoBusquedaAviso: [this.solicitudState?.tipoBusquedaAviso, Validators.required],
        folioTipo: [this.solicitudState?.folioTipo, [Validators.required]],
        numeroSerie: [{ value: this.solicitudState?.numeroSerie, disable: this.soloLectura }, [Validators.required, Validators.pattern(ALPHANUMERIC_PATTERN)]],
        numeroNIV: [this.solicitudState?.numeroNIV, [Validators.required, Validators.pattern(ALPHANUMERIC_PATTERN), Validators.maxLength(17)]],
        anoModelo: [this.solicitudState?.anoModelo, [Validators.required]],
        marca: [this.solicitudState?.marca, [Validators.required, Validators.maxLength(250)]],
        modelo: [this.solicitudState?.modelo, [Validators.required, Validators.maxLength(250)]],
        tipoVariante: [this.solicitudState?.tipoVariante, [Validators.required, Validators.maxLength(250)]],
        cilindros: [this.solicitudState?.cilindros, [Validators.required]],
        puertas: [this.solicitudState?.puertas, [Validators.required]],
        combustible: [this.solicitudState?.combustible, [Validators.required]],
        propiedad: [this.solicitudState?.propiedad, [Validators.required, Validators.pattern(ALPHANUMERIC_PATTERN), Validators.maxLength(250)]],
        nombreTitulo: [this.solicitudState?.nombreTitulo, [Validators.required, Validators.maxLength(250)]],
        paisEmitio: [this.solicitudState?.paisEmitio, [Validators.required]],
        provinciaEmision: [this.solicitudState?.provinciaEmision, [Validators.required, Validators.maxLength(250)]],
        procedencia: [this.solicitudState?.procedencia, [Validators.maxLength(250)]],
        vehiculoImportado: [this.solicitudState?.vehiculoImportado, [Validators.required]],
        exportacion: [this.solicitudState?.exportacion, [Validators.required, Validators.maxLength(250)]],
        aduanaImportacion: [this.solicitudState?.aduanaImportacion, [Validators.required]],
        patenteImportacion: [this.solicitudState?.patenteImportacion, [Validators.required, Validators.maxLength(4)]],
        pedimentoImportacion: [this.solicitudState?.pedimentoImportacion, [Validators.required, Validators.maxLength(7)]],
        valorAduana: [this.solicitudState?.valorAduana, [Validators.required, Validators.maxLength(11),Validators.pattern(REG_X.SOLO_NUMEROS)]],
        kilometraje: [this.solicitudState?.kilometraje, [Validators.required, Validators.maxLength(9), Validators.pattern(REG_X.SOLO_NUMEROS)]],
        montoIGI: [this.solicitudState?.montoIGI, [Validators.required, Validators.maxLength(9), Validators.pattern(REG_X.SOLO_NUMEROS)]],
        formaPagoIGI: [this.solicitudState?.formaPagoIGI, [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)]],
        montoDTA: [this.solicitudState?.montoDTA, [Validators.required, Validators.maxLength(9), Validators.pattern(REG_X.SOLO_NUMEROS)]],
        montoIVA: [this.solicitudState?.montoIVA, [Validators.required, Validators.maxLength(9), Validators.pattern(REG_X.SOLO_NUMEROS)]],
        valorDolares: [this.solicitudState?.valorDolares, [Validators.required, Validators.maxLength(9), Validators.pattern(REG_X.SOLO_NUMEROS)]],
        folioCFDI: [this.solicitudState?.folioCFDI, [Validators.pattern(ALPHANUMERIC_PATTERN), Validators.maxLength(32)]],
        folioVenta: [this.solicitudState?.folioVenta, [Validators.required, Validators.pattern(ALPHANUMERIC_PATTERN), Validators.maxLength(32)]],
        valorVenta: [this.solicitudState?.valorVenta, [Validators.required, Validators.maxLength(13)]],
        identificadorTransaccionVucem: [this.solicitudState?.identificadorTransaccionVucem],
        nivNumeroSerie: [this.solicitudState?.nivNumeroSerie, [Validators.required]],
      }),
    });
    this.mostrarCampos();
    this.mostrarCamposAviso();
  }

  /**
   * @method mostrarNotificacionSeleccion
   * @description Muestra una notificación de alerta con el mensaje proporcionado.
   * @param {string} mensaje - El mensaje a mostrar en la notificación.
   */
  mostrarNotificacionSeleccion(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * @method ngOnDestroy
   * @description Método de limpieza al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  CatalogoServices,
  ConfiguracionColumna,
  ConsultaioQuery,
  Notificacion,
  NotificacionesComponent,
  SeccionLibQuery,
  SeccionLibState,
  SoloNumerosDirective,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  doDeepCopy,
  esValidArray,
  esValidObject,
} from '@ng-mf/data-access-user';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  forwardRef
} from '@angular/core';
import { ERROR_CANDIDAD_POR_PERIODO, ERROR_CANTIDAD, ERROR_CAPACIDAD, ERROR_NICO, ERROR_REQ_MERCANCIA } from '../../constantes/immex-registro-de-solicitud-modality.enums';
import {
  FRACCION_EXPORTACION,
  FraccionInfo,
  IMMEX_SERVICIO,
  ImmexRegistroform,
  NICO_TABLA,
  NicoInfo,
  PermisoImmexGridDatos,
} from '../../modelos/immex-registro-de-solicitud-modality.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImmexRegistroQuery } from '../../estados/queries/tramite80203.query';
import { ImmexRegistroStore } from '../../estados/tramites/tramite80203.store';
import { Modal } from 'bootstrap';
import { PermisoImmexDatosService } from '../../servicios/immex/permiso-immex-datos.service';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';

/**
 * @component
 * @name Anexo1Component
 * @description
 * Componente responsable de manejar el formulario de registro IMMEX.
 * Permite la captura, visualización y validación de los datos relacionados con el trámite IMMEX.
 * Gestiona la obtención de datos desde servicios, la gestión de formularios reactivos y la interacción con tablas dinámicas para exportación e importación.
 *
 * - Obtiene y muestra datos de servicios, fracciones arancelarias y NICO.
 * - Gestiona el estado y validación del formulario de registro IMMEX.
 * - Permite la interacción con tablas dinámicas para seleccionar y visualizar información.
 * - Sincroniza el estado del formulario con el store y permite el modo solo lectura.
 *
 * @example
 * <anexo-1></anexo-1>
 *
 * @property {FormGroup} immexRegistroform - Formulario principal del registro IMMEX.
 * @property {immexRegistroform} immexRegitroAnexoState - Estado del formulario de registro IMMEX.
 * @property {TablaSeleccion} tablaSeleccionRadio - Tipo de selección de la tabla (Radio).
 * @property {TablaSeleccion} tablaSeleccionCheckbox - Tipo de selección de la tabla (Checkbox).
 * @property {ConfiguracionColumna<immexInfo>[]} permisoImmexTabla - Configuración de las columnas de la tabla para servicios IMMEX.
 * @property {immexInfo[]} immexTableDatos - Datos de los servicios IMMEX.
 * @property {ConfiguracionColumna<FraccionInfo>[]} fraccionExportacionTabla - Configuración de las columnas de la tabla para fracciones de exportación.
 * @property {FraccionInfo[]} fraccionTablaDatos - Datos de las fracciones arancelarias.
 * @property {ConfiguracionColumna<NicoInfo>[]} nicoTabla - Configuración de las columnas de la tabla para NICO.
 * @property {NicoInfo[]} nicoTablaDatos - Datos de NICO.
 * @property {string} immexRegistro - Variable de estado para IMMEX Registro.
 * @property {Subject<void>} destroyNotifier$ - Subject para manejar la desuscripción de observables.
 * @property {any[]} permisoImmexDatos - Array de datos permiso immex.
 * @property {FraccionInfo[]} fraccionDatos - Array de datos fracción.
 * @property {NicoInfo[]} nicoDatos - Array de datos NICO.
 * @property {Catalogo[]} nico - Configuración para el select de unidad de medida.
 * @property {boolean} showTableExport - Estado de visibilidad de la tabla de exportación.
 * @property {boolean} showTableImport - Estado de visibilidad de la tabla de importación.
 * @property {boolean} showTableFractionExp - Estado de visibilidad de la tabla de fracción de exportación.
 * @property {boolean} esFormularioSoloLectura - Indica si el formulario debe mostrarse solo en modo de lectura.
 *
 * @method ngOnInit Inicializa el componente y obtiene los datos necesarios.
 * @method ngAfterViewInit Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido inicializada.
 * @method creatFormSolicitud Inicializa el formulario reactivo principal.
 * @method inicializarEstadoFormulario Inicializa el estado del formulario dependiendo si está en modo solo lectura.
 * @method ngOnDestroy Maneja la limpieza de recursos antes de destruir el componente.
 * @method fetchData Obtiene los datos de los fabricantes desde el servicio.
 * @method obtenerIngresoSelectList Obtiene la lista para el select de unidad de medida.
 * @method showFraccionExportacion Muestra la sección de fracción de exportación.
 * @method showTableExportacion Muestra la tabla de exportación.
 * @method showTableImportacion Muestra la tabla de importación.
 * @method showTableFractionExport Muestra la tabla de fracción de exportación.
 * @method showTableNicoExport Muestra la tabla NICO exportación.
 * @method showTableNicoImport Muestra la tabla NICO importación.
 * @method showProductoImportacion Muestra la sección de producto de importación.
 * @method showCommodityImportacion Muestra la sección de commodity de importación.
 * @method disableFormControls Deshabilita los controles específicos del formulario.
 *
 * @see PermisoImmexDatosService
 * @see NicoService
 * @see ImmexRegistroQuery
 * @see ImmexRegistroStore
 * @see SeccionLibQuery
 * @see SeccionLibStore
 * @see ConsultaioQuery
 */
@Component({
  selector: 'anexo-1',
  templateUrl: './anexo-1.component.html',
  styleUrls: ['./anexo-1.component.scss'],
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    NotificacionesComponent,
    AlertComponent,
    forwardRef(() => SoloNumerosDirective),
  ],
})
export class Anexo1Component implements OnInit, OnDestroy {
  /**
   * Referencia al elemento del modal de importación de mercancía.
   * Utilizado para mostrar u ocultar el modal mediante la API de Bootstrap.
   */
  @ViewChild('mercanciaImportacionModal')
  mercanciaImportacionModal!: ElementRef;

  /**
   * Referencia al elemento del modal de exportación de mercancía.
   * Utilizado para mostrar u ocultar el modal mediante la API de Bootstrap.
   */
  @ViewChild('mercanciaExportacionModal')
  mercanciaExportacionModal!: ElementRef;

  /**
   * ID del trámite actual.
   */
  tramiteId: string = '80203';

  /**
   * @property {FormGroup} immexRegistroform
   * @description Formulario principal del registro IMMEX.
   */
  immexRegistroform!: FormGroup;

  /**
   * @property {immexRegistroform} immexRegitroAnexoState
   * @description Estado del formulario de registro IMMEX.
   */
  immexRegitroAnexoState!: ImmexRegistroform;

  /**
   * @property {TablaSeleccion} tablaSeleccionRadio
   * @description Tipo de selección de la tabla (Radio).
   */
  tablaSeleccionRadio: TablaSeleccion = TablaSeleccion.RADIO;

  /**
   * @property {TablaSeleccion} tablaSeleccionCheckbox
   * @description Tipo de selección de la tabla (Checkbox).
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * @property {ConfiguracionColumna<immexInfo>[]} permisoImmexTabla
   * @description Configuración de las columnas de la tabla para servicios IMMEX.
   */
  permisoImmexTabla: ConfiguracionColumna<PermisoImmexGridDatos>[] = IMMEX_SERVICIO;

  /**
   * @property {immexInfo[]} immexTableDatos
   * @description Datos de los servicios IMMEX.
   */
  immexTableDatos: PermisoImmexGridDatos[] = [];

  /**
   * @property {ConfiguracionColumna<FraccionInfo>[]} fraccionExportacionTabla
   * @description Configuración de las columnas de la tabla para fracciones de exportación.
   */
  fraccionExportacionTabla: ConfiguracionColumna<FraccionInfo>[] =
    FRACCION_EXPORTACION;

  /**
   * @property {FraccionInfo[]} fraccionTablaDatos
   * @description Datos de las fracciones arancelarias.
   */
  fraccionTablaDatos: FraccionInfo[] = [];

  /**
   * @property {ConfiguracionColumna<NicoInfo>[]} nicoTabla
   * @description Configuración de las columnas de la tabla para NICO.
   */
  nicoTabla: ConfiguracionColumna<NicoInfo>[] = NICO_TABLA;

  /**
   * @property {NicoInfo[]} nicoTablaDatosImportacion
   * @description Datos de NICO.
   */
  nicoTablaDatosImportacion: NicoInfo[] = [];

  /**
   * @property {NicoInfo[]} nicoTablaDatosExportacion
   * @description Datos de NICO.
   */
  nicoTablaDatosExportacion: NicoInfo[] = [];

  /**
   * @property {string} immexRegistro
   * @description Variable de estado para IMMEX Registro.
   */
  immexRegistro!: string;

  /**
   * @private
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para manejar la desuscripción de observables y evitar memory leaks.
   * Se emite cuando el componente se destruye.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {any[]} permisoImmexDatos
   * @description Array que contiene los datos de permisos IMMEX obtenidos del servicio.
   * Almacena la información necesaria para mostrar los permisos disponibles en la tabla.
   */
  permisoImmexDatos: PermisoImmexGridDatos[] = [];

  isFormValid = true;

  errorAlerta: string = "";

  /**
   * @property {FraccionInfo[]} fraccionDatos
   * @description Array que contiene los datos de fracciones arancelarias obtenidos del servicio.
   * Estos datos se utilizan para poblar las tablas de fracciones de exportación e importación.
   */
  fraccionDatos: FraccionInfo[] = [];

  /**
   * @property {NicoInfo[]} nicoDatos
   * @description Array que contiene los datos de NICO (Nomenclatura de Identificación de Commodities)
   * obtenidos del servicio. Se utiliza para mostrar información relacionada con commodities.
   */
  nicoDatos: NicoInfo[] = [];

  /**
   * @property {Catalogo[]} nico
   * @description Configuración para el select de unidad de medida NICO.
   * Contiene las opciones disponibles para el catálogo desplegable de NICO.
   */
  nico: Catalogo[] = [];

  /**
   * @property {boolean} showTableExport
   * @description Controla la visibilidad de la tabla de exportación.
   * Cuando es true, muestra la tabla de datos de exportación.
   */
  showTableExport: boolean = false;

  /**
   * @property {boolean} showTableImport
   * @description Controla la visibilidad de la tabla de importación.
   * Cuando es true, muestra la tabla de datos de importación.
   */
  showTableImport: boolean = false;

  /**
   * @property {boolean} showTableFractionExp
   * @description Controla la visibilidad de la tabla de fracción de exportación.
   * Cuando es true, muestra la tabla específica para fracciones de exportación.
   */
  showTableFractionExp: boolean = false;

  /**
   * @property {boolean} eliminarPlantasConfirmacion
   * @description
   * Indica si se debe mostrar el modal de confirmación para eliminar plantas seleccionadas.
   */
  eliminarPlantasConfirmacion: boolean = false;

  /**
   * @property {boolean} eliminarPlantasAlerta
   * @description
   * Indica si se debe mostrar una alerta cuando no se ha seleccionado ninguna planta para eliminar.
   */
  eliminarPlantasAlerta: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacion
   * @description
   * Objeto que contiene la información de la notificación a mostrar en el componente de notificaciones.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {boolean} espectaculoAlerta
   * @description
   * Indica si se debe mostrar una alerta relacionada con la selección de entidad federativa o plantas.
   */
  espectaculoAlerta: boolean = false;

  /**
   * @property {boolean} eliminarPermisoImmexConfirmacion
   * @description
   * Indica si se debe mostrar el modal de confirmación para eliminar un permiso IMMEX seleccionado.
   */
  eliminarPermisoImmexConfirmacion: boolean = false;

  /**
   * @property {FilaPlantas[]} listSelectedView
   * @description
   * Arreglo que contiene las plantas seleccionadas en la tabla dinámica para realizar acciones como eliminar.
   */
  listSelectedView: NicoInfo[] = [];

  /**
   * @private
   * @property {SeccionLibState} seccion
   * @description Estado de la sección actual obtenido del store.
   * Contiene información sobre el estado de validación y navegación de las secciones.
   */
  private seccion!: SeccionLibState;

  /**
   * @property {immexInfo | null} listaFilaSeleccionada
   * @description
   * Almacena la fila seleccionada de la tabla de permisos IMMEX.
   * Se utiliza para realizar acciones como eliminar o editar la fila seleccionada.
   */
  listaFilaSeleccionada: PermisoImmexGridDatos | null = null;

  /**
   * @property {FraccionInfo | null} listaFilaSeleccionadaFraccion
   * @description
   * Almacena la fila seleccionada de la tabla de fracciones arancelarias.
   * Se utiliza para realizar acciones como eliminar o editar la fracción seleccionada.
   */
  listaFilaSeleccionadaFraccion: FraccionInfo | null = null;

  /**
   * @property {FormGroup} mercanciaImportacionForm
   * @description Formulario separado para el modal de mercancía de importación.
   */
  mercanciaImportacionForm!: FormGroup;

  /**
   * @property {FormGroup} mercanciaExportacionForm
   * @description Formulario separado para el modal de mercancía de exportación.
   */
  mercanciaExportacionForm!: FormGroup;

  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * Si es `true`, todos los controles del formulario estarán deshabilitados y solo podrán visualizarse.
   * Si es `false`, el formulario será editable.
   *
   * @type {boolean}
   * @memberof Anexo1Component
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el formulario está en modo de actualización.
   * Si es `true`, el formulario está en estado de edición/actualización de datos existentes.
   * Si es `false`, el formulario está en modo de alta/nuevo registro.
   *
   * @type {boolean}
   * @memberof Anexo1Component
   */
  esFormularioActualizacion: boolean = false;

  /**
   * @property {Catalogo[]} NICO_SELECCIONADO
   * @description
   * Almacena el catálogo seleccionado de NICO para operaciones de exportación e importación.
   * Se utiliza para mantener el estado de la selección actual en los selects de NICO.
   */
  NICO_SELECCIONADO: Catalogo[] = [];
  /**
   * @property {boolean} eliminarNICOAlerta
   * @description
   * Indica si se debe mostrar una alerta cuando no se ha seleccionado ningún elemento NICO para eliminar.
   * Se establece a `true` cuando el usuario intenta eliminar códigos NICO sin haber seleccionado ninguno,
   * mostrando un mensaje de error que solicita elegir al menos un NICO para eliminar.
   */
  eliminarNICOAlerta: boolean = false

  /**
   * @constructor
   * @description
   * Constructor del componente Anexo1Component.
   * Inicializa los servicios y stores necesarios para la gestión del formulario IMMEX, la obtención de datos y la interacción con el estado global.
   *
   * @param {FormBuilder} fb - Servicio para la creación y gestión de formularios reactivos.
   * @param {PermisoImmexDatosService} permisoImmexDatosService - Servicio para obtener datos de permiso IMMEX.
   * @param {ImmexRegistroQuery} immexRegistroQuery - Query para consultar el estado del registro IMMEX.
   * @param {ImmexRegistroStore} immexRegistroStore - Store para manejar el estado del registro IMMEX.
   * @param {SeccionLibQuery} seccionQuery - Query para consultar el estado de la sección.
   * @param {SeccionLibStore} seccionStore - Store para manejar el estado de la sección.
   * @param {ConsultaioQuery} consultaQuery - Query para consultar el estado de la consulta.
   */
  constructor(
    public fb: FormBuilder,
    public permisoImmexDatosService: PermisoImmexDatosService,
    public immexRegistroQuery: ImmexRegistroQuery,
    public immexRegistroStore: ImmexRegistroStore,
    public seccionQuery: SeccionLibQuery,
    public seccionStore: SeccionLibStore,
    public readonly consultaQuery: ConsultaioQuery,
    public catalogoService: CatalogoServices
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if (!seccionState.create && seccionState.procedureId === '80203') {
            this.esFormularioSoloLectura = seccionState.readonly;
            this.esFormularioActualizacion = seccionState.update;
          }
          if (seccionState) {
            this.showTableExport = true;
            this.showTableImport = true;
            this.showTableFractionExp = true;
          }
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se inicializa.
   * Inicializa el estado del formulario dependiendo si está en modo solo lectura.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * @method obtenerConfiguracionDeNotificacion
   * @description Obtiene la configuración de notificación para mostrar mensajes al usuario.
   *
   * @param {string} mensaje - El mensaje a mostrar en la notificación.
   * @param {string} [titulo=''] - El título de la notificación.
   * @param {string} [categoria=''] - La categoría de la notificación (ej. 'success', 'error').
   * @param {string} [txtBtnCancelar=''] - El texto del botón de cancelar.
   * @returns {Notificacion} La configuración de la notificación.
   */
  obtenerConfiguracionDeNotificacion(mensaje: string, titulo: string = '', categoria: string = '', txtBtnCancelar: string = ''): Notificacion {
    return {
        tipoNotificacion: 'alert',
        categoria: categoria,
        modo: 'action',
        titulo: titulo,
        mensaje: mensaje,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: txtBtnCancelar,
      };
  }

  /**
   * @method creatFormSolicitud
   * @description Inicializa el formulario reactivo immexRegistroform con campos planos
   * sin anidamiento para facilitar el mantenimiento y comprensión del código.
   *
   * @returns {void}
   */
  creatFormSolicitud(): void {
    this.immexRegistroform = this.fb.group({
      permisoImmexDatos: [this.immexRegitroAnexoState?.permisoImmexDatos || ''],
      fraccionArancelariaExportacion: [this.immexRegitroAnexoState?.fraccionArancelariaExportacion || ''],
      FraccionDescExportacion: [this.immexRegitroAnexoState?.FraccionDescExportacion || ''],
    });

    // Initialize the separate form for mercanciaImportacion
    this.mercanciaImportacionForm = this.fb.group({
      candiadAnual: [this.immexRegitroAnexoState?.candiadAnual || '', Validators.required],
      capacidadPeriodo: [this.immexRegitroAnexoState?.capacidadPeriodo || '', Validators.required],
      candidadPorPeriodo: [this.immexRegitroAnexoState?.candidadPorPeriodo || '', Validators.required],
      commodityImportacion: [{ value: this.immexRegitroAnexoState?.commodityImportacion, disabled: true }],
      commodityDescImportacion: [{ value: this.immexRegitroAnexoState?.commodityDescImportacion, disabled: true }],
      nico: [this.immexRegitroAnexoState?.nico || '', Validators.required],
      commodityNicoDescImportacion: [{ value: this.immexRegitroAnexoState?.commodityNicoDescImportacion, disabled: true }]
    });

    // Initialize the separate form for mercanciaExportacion
    this.mercanciaExportacionForm = this.fb.group({
      productoArancelariaExportacion: [{ value: this.immexRegitroAnexoState?.productoArancelariaExportacion, disabled: true }],
      productoDescExportacion: [{ value: this.immexRegitroAnexoState?.productoDescExportacion, disabled: true }],
      nico: [this.immexRegitroAnexoState?.nico || '', Validators.required],
      exportacionDescExportacion: [{ value: this.immexRegitroAnexoState?.exportacionDescExportacion, disabled: true }]
    });
  }

  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario basándose en la configuración de solo lectura.
   * Si el formulario no existe, lo crea mediante creatFormSolicitud(). Posteriormente, evalúa
   * si el formulario debe estar en modo solo lectura (esFormularioSoloLectura) y aplica el
   * estado correspondiente: deshabilitado para solo lectura o habilitado para edición.
   *
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.initActionFormBuild();
    }
    if (!this.immexRegistroform) {
      this.creatFormSolicitud();
    }
  }

  /**
   * Habilita o deshabilita el formulario dependiendo del modo de solo lectura.
   *
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.initActionFormBuild();
    if (this.esFormularioSoloLectura) {
      this.immexRegistroform?.disable();
      this.mercanciaImportacionForm?.disable();
      this.mercanciaExportacionForm?.disable();
    } else {
      this.immexRegistroform?.enable();
      this.mercanciaImportacionForm?.enable();
      this.mercanciaExportacionForm?.enable();
    }
  }

  /**
   * Inicializa el formulario de acción.
   * @method initActionFormBuild
   * @returns {void}
   */
  initActionFormBuild(): void {
    this.immexRegistroQuery.selectImmexRegistro$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.immexRegitroAnexoState = seccionState.immexRegistro;
          this.immexTableDatos = seccionState.immexTableDatos;
          this.fraccionTablaDatos = seccionState.fraccionTablaDatos;
        })
      )
      .subscribe();

    this.creatFormSolicitud();
  }

  /**
   * @method fetchData
   * @description Obtiene los datos necesarios desde el servicio PermisoImmexDatosService.
   * Realiza dos llamadas principales:
   * 1. Primera llamada: Obtiene datos estructurados (permisoImmexDatos, fraccionDatos, nicoDatos)
   *    y los asigna a las propiedades del componente para poblar las tablas dinámicas.
   *    También actualiza campos específicos del formulario con los primeros elementos de cada array.
   * 2. Segunda llamada: Obtiene datos adicionales para actualizar el formulario mediante patchValue.
   *
   * Todas las suscripciones se manejan con takeUntil para evitar memory leaks.
   *
   * @returns {void}
   */
  fetchData(PERMISO_IMMEX_DATOS: string): void {

    this.permisoImmexDatosService
      .getDatos(PERMISO_IMMEX_DATOS)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {

          this.immexRegistroform.patchValue({
            permisoImmexDatos: ''
          });

          const RESPONSE_DATA = response[0];

          if (RESPONSE_DATA) {

            this.immexTableDatos = RESPONSE_DATA.permisoImmexGridDatos ? RESPONSE_DATA.permisoImmexGridDatos : [];
            this.fraccionTablaDatos = RESPONSE_DATA.fraccionGridDatos ? RESPONSE_DATA.fraccionGridDatos : [];

            this.immexRegistroStore.establecerDatos({
              immexTableDatos: this.immexTableDatos,
              fraccionTablaDatos: this.fraccionTablaDatos
            });
            
            this.permisoImmexDatos = RESPONSE_DATA.permisoImmexGridDatos;
            this.fraccionDatos = RESPONSE_DATA.fraccionGridDatos;
          }
        },
      });
  }

  /**
   * Obtiene la lista de opciones para el select de unidad de medida NICO.
   * Realiza una llamada al servicio nicoService para obtener el menú desplegable desde
   * el archivo 'nico.json' y asigna los datos obtenidos a la propiedad nico del componente.
   * Esta lista se utiliza para poblar los selects relacionados con códigos NICO.
   *
   * @returns {void}
   */
  obtenerIngresoSelectList(tipo: 'importacion' | 'exportacion'): void {
    const CLAVE_FRACCION = tipo === 'importacion' ? this.listaFilaSeleccionada?.fraccion : this.listaFilaSeleccionadaFraccion?.fraccionArancelaria.cveFraccion;
    this.catalogoService.nicosCatalogo(this.tramiteId, CLAVE_FRACCION ?? '')
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((datos) => {
        const TRANSFORMED_DATOS = {
          ...datos,
          datos: (datos.datos ?? []).map((item: Catalogo) => ({
            ...item,
            nicoDescription: item.descripcion,
            descripcion: item.clave
          }))
        };
        return TRANSFORMED_DATOS;
      })
    )
    .subscribe((datos)=>{
      this.nico = datos.datos as Catalogo[];
    })
  }


  // Update the nico selection method for importacion modal
  cambioSeleccionNicoImportacion(params: Catalogo): void {
    this.mercanciaImportacionForm.patchValue({
      commodityNicoDescImportacion: params.nicoDescription,
      nico: params.clave
    });
    const NICO_ENCONTRADO = this.nico.find(
      (item) => item.clave === params.clave
    );
    this.NICO_SELECCIONADO = NICO_ENCONTRADO ? [NICO_ENCONTRADO] : [];
  }

  /**
   * @method cambioSeleccionNicoExportacion
   * @description
   * Actualiza la selección de NICO en el formulario de exportación.
   * Establece el valor de exportacionDescExportacion según la selección de NICO.
   *
   * @param {Catalogo | null} event - Objeto de catálogo NICO seleccionado o null.
   * @returns {void}
   */
  cambioSeleccionNicoExportacion(event: Catalogo | null): void {
    if (event?.nicoDescription) {
      this.mercanciaExportacionForm.get('exportacionDescExportacion')?.setValue(event.nicoDescription);
      this.mercanciaExportacionForm.get('nico')?.setValue(event.clave);
    } else {
      this.mercanciaExportacionForm.get('exportacionDescExportacion')?.setValue('');
    }
    
    const NICO_ENCONTRADO = this.nico.find(
      (item) => item.clave === event?.clave
    );
    this.NICO_SELECCIONADO = NICO_ENCONTRADO ? [NICO_ENCONTRADO] : [];
  }

  /**
   * @method showTableExportacion
   * @description Controla la visibilidad de la tabla de exportación.
   * Establece la propiedad showTableExport en true para mostrar la tabla
   * de datos de exportación en la interfaz de usuario.
   *
   * @returns {void}
   */
 showTableExportacion(): void {
  const PERMISO_VALUE = this.immexRegistroform.get('permisoImmexDatos')?.value;
  
  this.obtenerpermisoImmexDatos(PERMISO_VALUE);
  
  this.showTableExport = true;
  this.showTableFractionExp = true;
  this.immexRegistroform.get('permisoImmexDatos')?.setValue('');
}


obtenerpermisoImmexDatos(PERMISO_VALUE: string): void {
  if (!PERMISO_VALUE || PERMISO_VALUE.trim() === '') {
    this.espectaculoAlerta = true;
    this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Tiene que introducir el permiso immex.');
    return;
  }

  const PAYLOAD = {
    "tipoSolicitud": "",
    "idProyecto": PERMISO_VALUE,
    "rfcSolicitante": "BRO180601EW5"
  };

  this.permisoImmexDatosService
    .getPermisoImmex(PAYLOAD)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        if (esValidObject(response)) {
          const API_DATOS = doDeepCopy(response);
          
          if (API_DATOS.codigo !== "00") {
            this.espectaculoAlerta = true;
            this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion(API_DATOS.error || API_DATOS.mensaje || 'El permiso IMMEX solicitado no existe.', 'Error', 'danger');
            this.immexTableDatos = [];
            this.fraccionTablaDatos = [];
            this.immexRegistroStore.establecerDatos({ 
              immexTableDatos: [],
              fraccionTablaDatos: []
            });
            return;
          }

          if (esValidObject(API_DATOS.datos)) {
            let totalRecords = 0;
            
            if (esValidArray(API_DATOS.datos.datosConsultaProgramaDtos)) {
              // this.immexTableDatos = IMMEX_RESPONSE;
              this.immexTableDatos = API_DATOS.datos.datosConsultaProgramaDtos;
              totalRecords += API_DATOS.datos.datosConsultaProgramaDtos.length;
              this.immexTableDatos = this.immexTableDatos.map((item: PermisoImmexGridDatos, index: number) => ({
                ...item,
                consecutivo: index + 1
              }));
            }

            if (esValidArray(API_DATOS.datos.productoExportacionDtoList)) {
              this.fraccionTablaDatos = API_DATOS.datos.productoExportacionDtoList;
              this.fraccionTablaDatos = this.fraccionTablaDatos.map((item: FraccionInfo, index: number) => ({
                ...item,
                fraccionArancelaria: {
                  ...item.fraccionArancelaria,
                  consecutivo: index + 1
                }
              }));
              totalRecords += API_DATOS.datos.productoExportacionDtoList.length;
            }

            this.immexRegistroStore.establecerDatos({ 
              immexTableDatos: this.immexTableDatos,
              fraccionTablaDatos: this.fraccionTablaDatos
            });
            
            this.espectaculoAlerta = true;
            this.nuevaNotificacion = {
              tipoNotificacion: 'success',
              categoria: 'success',
              modo: 'action',
              titulo: 'Éxito',
              mensaje: `Se encontraron ${totalRecords} registro(s) para el permiso IMMEX.`,
              cerrar: true,
              tiempoDeEspera: 3000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          } else {
            this.espectaculoAlerta = true;
            this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('No se encontraron datos para el permiso IMMEX especificado.', 'Advertencia', 'warning');
            this.immexTableDatos = [];
            this.fraccionTablaDatos = [];
            this.immexRegistroStore.establecerDatos({ 
              immexTableDatos: [],
              fraccionTablaDatos: []
            });
          }
        }
      },
      error: (error) => {
        console.error('Error al obtener permiso IMMEX:', error);
        this.espectaculoAlerta = true;
        this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Error al conectar con el servidor. Intente nuevamente.', 'Error de conexión', 'danger');
        this.immexTableDatos = [];
        this.fraccionTablaDatos = [];
        this.immexRegistroStore.establecerDatos({ 
          immexTableDatos: [],
          fraccionTablaDatos: []
        });
      }
    });
}


  /**
   * @method mostrarDetalleMercancia
   * @description
   * Muestra el modal de detalle de mercancía de importación.
   * Utiliza la instancia de Bootstrap Modal para mostrar el cuadro de diálogo
   * asociado al elemento mercanciaImportacionModal.
   *
   * @returns {void}
   */
  mostrarDetalleMercancia(): void {
    if (!this.listaFilaSeleccionada) {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Debe seleccionar un permiso immex.');
    } else {
      this.espectaculoAlerta = false;
      this.obtenerIngresoSelectList('importacion');
      this.mercanciaImportacionForm?.patchValue({
        commodityImportacion: this.listaFilaSeleccionada?.fraccion,
        commodityDescImportacion: this.listaFilaSeleccionada?.descripcion,
      });
      const MODAL_INSTANCIA = new Modal(this.mercanciaImportacionModal.nativeElement);
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * @method mostrarDetalleMercanciaExportacion
   * @description
   * Muestra el modal de detalle de mercancía de exportación.
   * Utiliza la instancia de Bootstrap Modal para mostrar el cuadro de diálogo
   * asociado al elemento mercanciaExportacionModal.
   *
   * @returns {void}
   */
  mostrarDetalleMercanciaExportacion(): void {
    if (!this.listaFilaSeleccionadaFraccion) {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Debe seleccionar una fracción de importación');
    } else {
      this.obtenerIngresoSelectList('exportacion');
       this.mercanciaExportacionForm?.patchValue({
        productoArancelariaExportacion: this.listaFilaSeleccionadaFraccion.fraccionArancelaria.cveFraccion,
        productoDescExportacion: this.listaFilaSeleccionadaFraccion.fraccionArancelaria.descripcion
      });
      this.espectaculoAlerta = false;
      const MODAL_INSTANCIA = new Modal(
        this.mercanciaExportacionModal.nativeElement
      );
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * @method showTableImportacion
   * @description Controla la visibilidad de la tabla de importación.
   * Establece la propiedad showTableImport en true para mostrar la tabla
   * de datos de importación en la interfaz de usuario.
   *
   * @returns {void}
   */
  showTableImportacion(): void {
    this.showTableImport = true;
  }

  /**
   * @method showTableFractionExport
   * @description Controla la visibilidad de la tabla de fracción de exportación.
   * Establece la propiedad showTableFractionExp en true para mostrar la tabla
   * específica de fracciones arancelarias de exportación en la interfaz de usuario.
   *
   * @returns {void}
   */
  showTableFractionExport(): void {
    this.showTableFractionExp = true;
    this.espectaculoAlerta = false;
    const FRACCION_VALUE = this.immexRegistroform.get('fraccionArancelariaExportacion')?.value;
    const FRACCION_DESC = this.immexRegistroform.get('FraccionDescExportacion')?.value;

    if (!FRACCION_VALUE || FRACCION_VALUE.trim() === '') {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Tiene que introducir la Fracción arancelaria y su descripción');
      return;
    }

    if (!this.listaFilaSeleccionada) {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Debe seleccionar un permiso immex.');
      return;
    }

    const EL = this.fraccionTablaDatos.find(item => item.fraccionArancelaria.cveFraccion === FRACCION_VALUE && item.fraccionArancelaria.descripcionUsuario === FRACCION_DESC);
    if(EL){
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('La fracción que intenta ingresar ya se encuentra registrada.');
      return;
    }

    this.immexRegistroform?.patchValue({
      fraccionArancelariaExportacion: '',
      FraccionDescExportacion: ''
    });

    this.obtenerFraccionDatos(FRACCION_VALUE, FRACCION_DESC); 
  }

  obtenerFraccionDatos(FRACCION_VALUE:string, FRACCION_DESC:string): void {

    const PAYLOAD = {
      "fraccion": FRACCION_VALUE,
      "descFraccion": FRACCION_DESC,
      "idProductoPadre": this.listaFilaSeleccionada ? this.listaFilaSeleccionada.numeroPrograma : '',
      "fraccionPadre": this.listaFilaSeleccionada ? this.listaFilaSeleccionada.fraccion : ''
    };

    this.permisoImmexDatosService
      .getFraccionArancelaria(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (esValidObject(response)) {
            const API_DATOS = doDeepCopy(response);
            
            if (response.codigo !== "00") {
              this.espectaculoAlerta = true;
              this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion(API_DATOS.error || API_DATOS.mensaje || 'El permiso IMMEX solicitado no existe.');
              return;
            }

            if (esValidObject(API_DATOS.datos)) {
              const DATOS = {
                fraccionArancelaria: {
                  ...API_DATOS.datos
                }
              }
              this.fraccionTablaDatos = [...this.fraccionTablaDatos, DATOS];
              this.fraccionTablaDatos = this.fraccionTablaDatos.map((item: FraccionInfo, index: number) => ({
                ...item,
                fraccionArancelaria: {
                  ...item.fraccionArancelaria,
                  consecutivo: index + 1
                }
              }));
              this.immexRegistroStore.establecerDatos({
                fraccionTablaDatos: [
                  ...this.fraccionTablaDatos
                ]
              })
            }

          }
        }
      });
  }

  /**
   * @method showTableNicoExport
   * @description Controla la visibilidad de la tabla NICO de exportación.
   * Establece la propiedad showTableNicoExp en true para mostrar la tabla
   * de códigos NICO relacionados con exportación en la interfaz de usuario.
   *
   * @returns {void}
   */
  showTableNicoExport(): void {
    if (this.NICO_SELECCIONADO) {
      const NUEVO_ELEMENTO: NicoInfo = {
        claveNico: this.NICO_SELECCIONADO[0]?.clave ?? '',
        descripcion: this.NICO_SELECCIONADO[0]?.nicoDescription ?? ''
      };
      const YA_EXISTE = this.nicoTablaDatosExportacion.some(
        (item) => item.claveNico === NUEVO_ELEMENTO.claveNico
      );
      if (!YA_EXISTE) {
        this.nicoTablaDatosExportacion = [...this.nicoTablaDatosExportacion, NUEVO_ELEMENTO];
      }
    }
  }

  /**
   * @method showTableNicoImport
   * @description Adds NICO data to the table for the importacion modal.
   */
  showTableNicoImport(): void {
    const NICO_VALUE = this.mercanciaImportacionForm.get('nico')?.value;
    
    if (NICO_VALUE) {
      const NUEVO_ELEMENTO: NicoInfo = {
        claveNico: this.NICO_SELECCIONADO[0]?.clave ?? '',
        descripcion: this.NICO_SELECCIONADO[0]?.nicoDescription ?? ''
      };

      const YA_EXISTE = this.nicoTablaDatosImportacion.some(
        (item) => item.claveNico === NUEVO_ELEMENTO.claveNico
      );
      
      if (!YA_EXISTE) {
        this.nicoTablaDatosImportacion = [...this.nicoTablaDatosImportacion, NUEVO_ELEMENTO];
      }
    }
  }

  /**
   * Cancela el cuadro de diálogo modal para el registro de enlaces operativos.
   *
   * @description
   * Cierra el modal activo y restablece el formulario a su estado inicial.
   * Se ejecuta cuando el usuario cancela la operación de agregar o editar
   * un enlace operativo.
   */
  modalCancelar(param:string): void {
    const ELEMENT = param === 'Importacion' ? this.mercanciaImportacionModal : this.mercanciaExportacionModal;
    const MODAL_INSTANCIA = Modal.getInstance(
      ELEMENT.nativeElement
    );
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }

  /**
   * @method disableFormControls
   * @description Deshabilita controles específicos del formulario relacionados con la exportación e importación.
   * Los campos deshabilitados incluyen códigos arancelarios y descripciones de productos que no deben ser
   * editables por el usuario, ya que se calculan automáticamente o se obtienen de otras fuentes.
   *
   * Campos deshabilitados:
   * - productoArancelariaExportacion: Código arancelario del producto de exportación
   * - productoDescExportacion: Descripción del producto de exportación
   * - commodityImportacion: Código del commodity de importación
   * - commodityDescImportacion: Descripción del commodity de importación
   * - commodityNicoDescImportacion: Descripción NICO del commodity de importación
   *
   * @returns {void}
   */
  disableFormControls(): void {
    this.immexRegistroform.get('productoArancelariaExportacion')?.disable();
    this.immexRegistroform.get('productoDescExportacion')?.disable();
    this.mercanciaImportacionForm.get('commodityImportacion')?.disable();
    this.mercanciaImportacionForm.get('commodityDescImportacion')?.disable();
    this.mercanciaImportacionForm.get('commodityNicoDescImportacion')?.disable();
  }

  /**
   * @method seleccionTabla
   * @description
   * Actualiza la lista de plantas seleccionadas en la tabla dinámica y sincroniza el estado en el store.
   * @param {NicoInfo[]} event - Arreglo de plantas seleccionadas.
   */
  seleccionTabla(event: NicoInfo[]): void {
    this.listSelectedView = event;
    this.seccionStore.update((state) => ({
      ...state,
      selectedDatos: event,
    }));
  }

  eliminarNico(params:string): void {
    if (this.listSelectedView.length === 0) {
      this.eliminarNICOAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Debe elegir al menos un nico para eliminar.');
    }
    const SELECTED_IDS = new Set(
      this.listSelectedView.map((item) => item.claveNico)
    );
    if(params === 'Importacion'){
      this.nicoTablaDatosImportacion = this.nicoTablaDatosImportacion.filter(
        (item) => !SELECTED_IDS.has(item.claveNico)
      );
    } else if(params === 'Exportacion'){
      this.nicoTablaDatosExportacion = this.nicoTablaDatosExportacion.filter(
        (item) => !SELECTED_IDS.has(item.claveNico)
      );
    }

    this.listSelectedView = [];
    this.seccionStore.update((state) => ({
      ...state,
      selectedDatos: this.listSelectedView,
    }));
  }

  /**
   * @method onFilaSeleccionada
   * @description
   * Maneja la selección de una fila en la tabla de permisos IMMEX.
   * Actualiza la propiedad listaFilaSeleccionada con el elemento seleccionado.
   * @param {PermisoImmexGridDatos} event - Fila seleccionada.
   */
  onFilaSeleccionada(event: PermisoImmexGridDatos): void {
    this.listaFilaSeleccionada = event;
  }

  /**
   * @method onFilaSeleccionadaFraccion
   * @description
   * Maneja la selección de una fila en la tabla de fracciones arancelarias.
   * Actualiza la propiedad listaFilaSeleccionadaFraccion con el elemento seleccionado.
   * @param {FraccionInfo} event - Fila seleccionada.
   */
  onFilaSeleccionadaFraccion(event: FraccionInfo): void {
    this.listaFilaSeleccionadaFraccion = event;
  }

  /**
   * @method eliminarPermisoImmex
   * @description
   * Elimina el permiso IMMEX seleccionado de la tabla.
   * Muestra notificaciones de alerta si no hay selección o de confirmación si hay selección.
   * Actualiza el estado en el store tras la eliminación.
   */
  eliminarPermisoImmex(): void {
    
    if (!this.listaFilaSeleccionada) {
      this.espectaculoAlerta = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Selecciona la planta que desea eliminar.');
    } else if (this.listaFilaSeleccionada) {
      this.eliminarPermisoImmexConfirmacion = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Al eliminar el permiso también se eliminaran las fracciones relacionadas. ¿Desea eliminar el registro?', '', 'danger', 'Cancelar');
    }
  }

  eliminarPermisoImmexDatos(event: boolean): void {
    if (event === true) {
      if (this.listaFilaSeleccionada) {
        this.immexTableDatos = this.immexTableDatos.filter(
          (item) => item.consecutivo !== this.listaFilaSeleccionada?.consecutivo
        ).map((item, index)=>{
          item.consecutivo = index + 1
          return item;
        });
        this.listaFilaSeleccionada = null;
        this.immexRegistroStore.establecerDatos({
          immexTableDatos: this.immexTableDatos,
        });
      }
    }
  }

  /**
   * @method eliminarFraccion
   * @description
   * Elimina la fracción arancelaria seleccionada de la tabla.
   * Muestra notificaciones de alerta si no hay selección o de confirmación si hay selección.
   * Actualiza el estado en el store tras la eliminación.
   */
  eliminarFraccion(): void {
    if (!this.listaFilaSeleccionadaFraccion) {
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('Selecciona la planta que desea eliminar.');
      this.espectaculoAlerta = true;
    } else if (this.listaFilaSeleccionadaFraccion) {
      this.eliminarPlantasConfirmacion = true;
      this.nuevaNotificacion = this.obtenerConfiguracionDeNotificacion('¿Estás seguro de eliminar la(s) planta(s)?', '', 'danger', 'Cancelar');
      if (this.listaFilaSeleccionadaFraccion) {
        this.fraccionTablaDatos = this.fraccionTablaDatos.filter(
          (item) => item.fraccionArancelaria.consecutivo !== this.listaFilaSeleccionadaFraccion?.fraccionArancelaria.consecutivo
        ).map((item, index)=>{
          item.fraccionArancelaria.consecutivo = index + 1
          return item;
        });
        this.listaFilaSeleccionadaFraccion = null;
        this.immexRegistroStore.establecerDatos({
          fraccionTablaDatos: this.fraccionTablaDatos,
        });
      }
    }
  }

  /**
   * @description
   * Actualiza el valor en el store basado en el formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.immexRegistroStore.establecerDatos({ [campo]: VALOR });
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Se encarga de la limpieza de recursos para evitar memory leaks. Emite una señal a través de
   * destroyNotifier$ para cancelar todas las suscripciones activas y luego completa el subject.
   *
   * @returns {void}
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Add method to save mercancia importacion data
   */ 
  guardarMercanciaImportacion(): void {
    this.errorAlerta = '';
    this.isFormValid = true;
    if(this.nicoTablaDatosImportacion.length === 0) {
      this.isFormValid = false;
      this.errorAlerta = ERROR_NICO;
      document.getElementsByClassName("modal")[0].scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (this.mercanciaImportacionForm.valid) {
      setTimeout(()=>{
        const CANDIDAD_ANNUAL = Number(this.mercanciaImportacionForm.get('candiadAnual')?.value);
        const CAPACIDAD_PERIODO = Number(this.mercanciaImportacionForm.get('capacidadPeriodo')?.value);
        const CANDIDAD_POR_PERIODO = Number(this.mercanciaImportacionForm.get('candidadPorPeriodo')?.value);
        if( CANDIDAD_ANNUAL <= 0 || CAPACIDAD_PERIODO <= 0 || CANDIDAD_POR_PERIODO <= 0){
          this.isFormValid = false;
          this.errorAlerta = ERROR_CANTIDAD;
          document.getElementsByClassName("modal")[0].scrollTo({ top: 0, behavior: 'smooth' });
          return
        }
        if(CANDIDAD_ANNUAL < CAPACIDAD_PERIODO){
          this.isFormValid = false;
          this.errorAlerta = ERROR_CAPACIDAD;
          document.getElementsByClassName("modal")[0].scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        if(CANDIDAD_POR_PERIODO > CANDIDAD_ANNUAL / 3) {
          this.isFormValid = false;
          this.errorAlerta = ERROR_CANDIDAD_POR_PERIODO;
          document.getElementsByClassName("modal")[0].scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const VALOR = this.nicoTablaDatosImportacion;
        this.immexRegistroStore.establecerDatos({ ['nicoTablaDatosImportacion']: VALOR });
        this.modalCancelar('Importacion');
      },500);
    } else {
      setTimeout(()=>{
        this.mercanciaImportacionForm.markAllAsTouched();
        this.isFormValid = false;
        this.errorAlerta = ERROR_REQ_MERCANCIA;
        document.getElementsByClassName("modal")[0].scrollTo({ top: 0, behavior: 'smooth' });
      },500);
    }
  }

  /**
   * Cierra el modal de confirmación.
   */
  cerrarModal(): void {
    this.espectaculoAlerta = false;
  }

  /**
   * Add method to save mercancia exportacion data
   */
  guardarMercanciaExportacion(): void {
    this.isFormValid = true;
    if(this.nicoTablaDatosExportacion.length === 0) {
      this.isFormValid = false;
      this.errorAlerta = ERROR_NICO;
      document.getElementById("mercanciaExportacionModal")?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (this.mercanciaExportacionForm.valid) {
      const VALOR = this.nicoTablaDatosExportacion;

      if (this.listaFilaSeleccionadaFraccion && this.listaFilaSeleccionadaFraccion.fraccionArancelaria) {

        const SELECTED_FRACCION_ID = this.listaFilaSeleccionadaFraccion?.fraccionArancelaria.cveFraccion;
        this.fraccionTablaDatos = this.fraccionTablaDatos.map(item => {
          if (
            SELECTED_FRACCION_ID !== undefined &&
            item.fraccionArancelaria &&
            item.fraccionArancelaria.cveFraccion === SELECTED_FRACCION_ID
          ) {
            return {
              ...item,
              fraccionArancelaria: {
                ...item.fraccionArancelaria,
                nicoDtos: VALOR
              }
            };
          }
          return item;
        });

        this.immexRegistroStore.establecerDatos({ fraccionTablaDatos: this.fraccionTablaDatos });
      }
      
      this.modalCancelar('Exportacion');
    } else {
      // Handle form validation errors
      this.mercanciaExportacionForm.markAllAsTouched();
    }
  }
  /**
   * @method validarFormulario
   * @description
   * Valida el formulario de registro IMMEX verificando múltiples condiciones:
   * 1. Verifica que existan datos en las tablas de IMMEX y fracciones arancelarias
   * 2. Si ambas tablas tienen datos, valida el formulario de mercancía de importación
   * 3. Si las tablas están vacías, marca el formulario principal como tocado y establece errores específicos en el store
   * 
   * Establece errores específicos en el store para cada condición no cumplida:
   * - mercanciaImportacionFormError: cuando el formulario de importación es inválido
   * - IMMEXTablaError: cuando la tabla de permisos IMMEX está vacía
   * - fraccionTablaError: cuando la tabla de fracciones arancelarias está vacía
   * 
   * @returns {boolean} `true` si todas las validaciones pasan correctamente, `false` en caso contrario
   */
  validarFormulario(): boolean {
      let VALID = true;
      if (this.immexTableDatos.length > 0 && this.fraccionTablaDatos.length > 0) {
        // if(this.mercanciaImportacionForm.valid){
          VALID = true;
        // }
        // else{  
        //   VALID = false;
        //   this.immexRegistroStore.establecerDatos({
        //     mercanciaImportacionFormError: true
        //   })
        // }
      } else {
        this.immexRegistroform.markAllAsTouched();
        VALID = false;
        if(this.immexTableDatos.length === 0){
          this.immexRegistroStore.establecerDatos({
            IMMEXTablaError: true
          })
        }
        if(this.fraccionTablaDatos.length === 0){
          this.immexRegistroStore.establecerDatos({
            fraccionTablaError: true
          })
        }
      }
      return VALID;
    }
}


import { AlertComponent, CategoriaMensaje, ConfiguracionColumna, ConsultaioQuery, ConsultaioState,INSTANCIA, INSTANCIA_ALIANZA, Notificacion, NotificacionesComponent, Pedimento, TabEvaluarTratadosResponse, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';

import { CriterioTratadoResponse } from '../../models/response/tratado-criterio-response.model';

import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { EmpaqueResponse, InsumoResponse } from '../../models/response/insumos-empaques-response.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitante110101State,Tramite110101Store, createSolicitanteInitialState} from '../../estados/tramites/solicitante110101.store';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CatalogosTramiteService } from '../../services/catalogo.service';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CommonModule } from '@angular/common';
import { CriterioConfiguracionRequest } from '../../models/request/tratado-configuracion-request.model';
import { CriterioConfiguracionResponse } from '../../models/response/tratado-configuracion-response.model';
import { DatosCriterioResumenResponse } from '../../models/response/tratado-criterio-resumen-response.model';
import { EvaluacionTratadosService } from '../../services/evaluacion-tratados.service';
import { EvaluarTratadosResponse } from '../../models/response/tratados-evaluar-response.model';
import { GenerarDictamenClasificacionService } from '../../../../shared/services/generar-dictamen-clasificacion.service';
import { MENSAJE_ALERTA_TRATADOS } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { OtrasInstanciasComponent } from '../otras-instancias/otras-instancias.component';
import { PantallasSvcService } from '../../services/pantallas-svc.service';
import { RegistroDeSolicitudesTabla} from '../../models/panallas110101.model';
import { ResumenValoresFormularioComponent } from '../resumen-valores-formulario/resumen-valores-formulario.component';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TratadoAcuerdoCriterioRequest } from '../../models/request/tratado-criterio-request.model';
import { TratadosSolicitudService } from '../../services/tratados-solicitud.service';
import { TratadosTabla } from '../../models/panallas110101.model';
import tratadosTable from '@libs/shared/theme/assets/json/110101/tratados-table.json';

/**
 * Componente Tratados que se utiliza para mostrar y gestionar los tratados.
 * 
 * Este componente utiliza varios subcomponentes como TituloComponent, CommonModule,
 * TableComponent y AlertComponent para mostrar información y permitir al usuario seleccionar y agregar tratados.
 * 
 * @component
 */
@Component({
  selector: 'app-tratados',
  templateUrl: './tratados.component.html',
  styleUrl: './tratados.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    AlertComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    NotificacionesComponent,
    OtrasInstanciasComponent,
    ResumenValoresFormularioComponent
  ]
})
export class TratadosComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} esCalificacionBandera
   * @description Indica si se está mostrando boton de calificación con bandera.
   * Por defecto es false.
   */
  @Input() esCalificacionBandera: boolean = false;

  /**
   * Evento que se emite cuando los tratados son actualizados.
   * Se utiliza para notificar al componente padre sobre los cambios en los tratados.
   */
  @Output() tratadosActualizados = new EventEmitter<TabEvaluarTratadosResponse[]>(); 

   /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion ;

  /**
   * Texto que describe el requisito del proceso.
   */
  public textoRequisitoProceso!: string;
  
  /**
   * Evento que se emite para habilitar la pestaña siguiente en el flujo del trámite.
   * Se utiliza para notificar al componente padre que la pestaña puede ser activada,
   * generalmente después de agregar o modificar un tratado exitosamente.
   *
   * @event habilitarPestana
   * @type {EventEmitter<void>}
   */
  @Output() habilitarPestana = new EventEmitter<void>();


  /**
   * @property otrasInstancias - Referencia al componente `OtrasInstanciasComponent` que maneja
   *                             la lógica y validación de las instancias asociadas dentro del paso actual.
   * @command El decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
   */
  @ViewChild('otrasInstancias') otrasInstancias!: OtrasInstanciasComponent;

  /**
   * Evento que se emite para deshabilitar o cerrar una pestaña en el flujo del trámite.
   * Se utiliza para notificar al componente padre que la pestaña debe desactivarse.
   *
   * @event cerrarPestana
   * @type {EventEmitter<void>}
   */
  @Output() cerrarPestana = new EventEmitter<void>();

  /**
   * Array de filas seleccionadas en la tabla de tratados.
   * 
   * @property {RegistroDeSolicitudesTabla[]} selectedRows - Array que contiene las filas seleccionadas en la tabla.
   */
  selectedRows: RegistroDeSolicitudesTabla[] = [];
  /*
  * Indice de la fila seleccionada en la tabla de tratados.
  */
  selectedRowIndex: number | null = null;
/**
 * Indica si el componente está en modo de edición.
 * Cuando es `true`, permite editar los tratados seleccionados.
 */
  isEditMode: boolean = false;

  /**
 * Vista instancia uruguay.
 * Cuando es `true`, permite ver la vista.
 */
  isUruguay: boolean = false;

  /**
   * Formulario reactivo para gestionar los tratados.
   * 
   * @property {FormGroup} formularioTratados - El formulario reactivo que contiene los campos para los tratados.
   */
  formularioTratados!: FormGroup;

  dictaminador!: FormGroup;

  /**
  * **Subject utilizado para manejar la destrucción de suscripciones**
  * 
  * Este `Subject` se emite en `ngOnDestroy` para notificar y completar todas las
  * suscripciones activas, evitando posibles fugas de memoria en el componente.
  */
  private destroy$ = new Subject<void>();
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**Variable para mostrar el modal */
  public mostrarModal: boolean = false;

  /**Variable para asociar la respuesta del modal */
  valoresFormularioResumen!: DatosCriterioResumenResponse;

  /** Evento que se emite al cerrar el modal */
  @Output() cerrar = new EventEmitter<void>();

  /**
    * Instancia del modal de Bootstrap utilizada para abrir y cerrar el diálogo de agregar o editar mercancías.
    * Se inicializa al abrir el modal y se utiliza para controlar su visibilidad desde el componente.
    *
    * @type {Modal}
    * @private
    * @memberof DatosMercanciaComponent
    * @example
    * this.modalInstance.show();
    * this.modalInstance.hide();
    */
  private modalInstance!: Modal;

    /**
     * Representa el estado actual del solicitante (Solicitante) para el trámite 110101.
     * Esta propiedad contiene toda la información relevante sobre los datos y el estado
     * del solicitante dentro del contexto del trámite.
     */
  public solicitudeState!: Solicitante110101State;
  /**
   * Catálogo de países disponibles para selección en el componente.
   */
  public paisCatalogo: Catalogo[] = [];
    /**
   * Catálogo de países disponibles para selección en el componente.
   */
  public tratadoCatalogo: Catalogo[] = [];
  /**
   * Catálogo de países disponibles para selección en el componente.
   */
  public origenCatalogo: Catalogo[] = [];

  /**
   * Lista de países que tienen configuraciones de instancias especiales.
   * 
   * @property {string[]} paisesInstancias - Array de claves de países que requieren manejo especial de instancias.
  */
  paisesInstancias: string[] = [];

  /**
   * @property {boolean} mostrarTabla - Indica si se debe mostrar la tabla.
   * Controla la visibilidad de la tabla disponibles en la interfaz.
   * Se utiliza para alternar la visibilidad de la tabla según el estado de la aplicación.
   */
  mostrarTabla = true;

  /**
   * Referencia al elemento modal para agregar mercancías.
  */
  @ViewChild('modalAgregar', { static: false }) modalElement!: ElementRef;

  /**
   * Referencia al elemento modal para agregar insumos y empaques de la mercancía.
  */
  @ViewChild('modalInsumoEmpaques', { static: false }) modalElementInsumosEmpaques!: ElementRef;

  /**
   * Referencia al elemento modal para mostrar el resumen de valores.
  */
  @ViewChild('modalResumenValores', { static: false }) modalElementResumenValores!: ElementRef;

   /**
   * Referencia al elemento modal para mostrar el Requisito de proceso.
  */
  @ViewChild('modalRequisitoProceso', { static: false }) modalRequisitoProceso!: ElementRef;


  /** Almacena las filas seleccionadas de la tabla */
  public tratadoSeleccionado: EvaluarTratadosResponse[] = [];
  /** Estado de la consulta */
  public consultaState!: ConsultaioState;
  /** Suscripción para manejo de observables */
  private subscription!: Subscription;
  /** Bandera de aladi */
  public noAceptada!: boolean | null;
    /**
     * Inicializa el TratadosComponent.
     * @param fb - Servicio FormBuilder utilizado para crear y gestionar formularios reactivos.
     * @param tramite110101Store - Servicio store para gestionar el estado del Trámite 110101.
     * @param solicitanteQuery - Servicio query para acceder al estado del solicitante.
     * @param consultaioQuery - Servicio query para acceder al estado de consultaio.
     * 
     * Se suscribe al observable `selectConsultaioState$` para actualizar la propiedad `esFormularioSoloLectura`
     * e inicializar el formulario de tratados cada vez que cambia el estado de consultaio. La suscripción se
     * cancela automáticamente cuando el componente es destruido.
     */
  constructor(private fb: FormBuilder,
    private tramite110101Store: Tramite110101Store,
    private solicitanteQuery: Solicitante110101Query,
    private consultaioQuery: ConsultaioQuery,
    private pantallaService: PantallasSvcService,
    private catalogosTramiteService: CatalogosTramiteService,
    private cd: ChangeDetectorRef,
    private tratadosSolicitudService: TratadosSolicitudService,
    private evaluacionTratadosService: EvaluacionTratadosService,
    private generarDictamenClasificacionService: GenerarDictamenClasificacionService
  ) { 
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => { 
          this.consultaState= seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarFormularioTratados();
        })
      )
      .subscribe();

      this.dictaminador = this.fb.group({
      opcionSeleccionada: [''],
    });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Llama al método `inicializarFormularioTratados` para configurar el formulario reactivo.
   * 
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.solicitanteQuery.selectSolicitante$.pipe(takeUntil(this.destroy$),map((seccionState) => {
        this.solicitudeState = seccionState;
    })).subscribe();
     this.subscription = this.generarDictamenClasificacionService.noAceptada$.subscribe(valor => {
      this.noAceptada = valor;
     if (valor !== null) {
      this.modificarRegistrosAladi();
     }
    });
    if (this.solicitudeState.respuestaServicioDatosTabla.length) {
      this.respuestaServicioDatosTabla = this.solicitudeState.respuestaServicioDatosTabla

      this.registroDeSolicitudesTablaDatos = this.respuestaServicioDatosTabla.map(item => ({
        pais: item.nombre_pais_bloque,
        tratado: item.tratado_nombre,
        origen: item.cve_grupo_criterio
      }));
      const SELECTED = this.registroDeSolicitudesTablaDatos[this.selectedRowIndex ?? 0];

      const GETCATALOGO= this.solicitudeState.respuestaServicioDatosTabla.find(item => item.tratado_nombre === SELECTED.tratado);
        if(GETCATALOGO?.cve_pais === null){
          this.getCatalogoTratadoAcuerdoBloque(GETCATALOGO?.cve_tratado_acuerdo ?? "");
        }else{
          this.getCatalogoTratadoAcuerdo(GETCATALOGO?.cve_pais ?? "");
        }
     
      this.getCatalogoCriterios(GETCATALOGO?.id_tratado_acuerdo.toString() ?? "");
        this.configurarPaisesInstancias(this.solicitudeState.respuestaServiceConfiguracion);
        this.habilitarPestana.emit();
    }else{
      this.tramite110101Store.reset();
       this.cerrarPestana.emit();
    }
    if(this.consultaState.create === true){
        this.getCatalogoPaisBloques();
    }

    if(this.solicitudeState.validacion_formularios.validacion_tab_tratados_otras_inmstancias === false){
      this.validarFormulario();
    }
  }

  /**
   * Inicializa el formulario reactivo para los tratados.
   * 
   * Este método configura el formulario reactivo con los campos `pais`, `tratado` y `origen`,
   * todos ellos con validadores requeridos.
   * 
   * @method inicializarFormularioTratados
   */

  public inicializarFormularioTratados(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

    /**
     * Inicializa el formulario `formularioTratados` con valores predeterminados de `solicitudeState`.
     * El formulario incluye los siguientes controles requeridos: `pais`, `tratado` y `origen`.
     * Cada control se prellena con el valor correspondiente de `solicitudeState`.
     * @remarks
     * Este método debe llamarse para configurar el formulario antes de la interacción del usuario.
     */
  public inicializarFormulario(): void {
    this.formularioTratados = this.fb.group({
      pais: [ null, Validators.required],
      tratado: [ null, Validators.required],
      origen: [ null, Validators.required],
    });
  }

  /**
   * Mensaje de alerta para tratados.
   * 
   * @property {string} alert - El mensaje de alerta que se mostrará en el componente.
   */

  alerta = MENSAJE_ALERTA_TRATADOS;

  /**
   * Mensaje de alerta para instancia de uruguay.
   * 
   * @property {string} mensajeGenericoInstancias - El mensaje de alerta que se mostrará en el componente.
   */
  mensajeGenericoInstancias = INSTANCIA;

  /**
   * Mensaje específico para instancias de alianza del pacífico.
   * 
   * @property {string} mensajeAlianza - El mensaje de alerta específico para acuerdos de alianza.
   */
  mensajeAlianza= INSTANCIA_ALIANZA;

    /**
     * Obtiene los datos de los catálogos desde el servicio backend y actualiza las propiedades de catálogos del componente.
     * Este método se suscribe al observable `getCatalogoDatos` de `pantallaService`, procesa la respuesta de la API,
     * y asigna los datos resultantes a `paisCatalogo`, `tratadoCatalogo` y `origenCatalogo` respectivamente.
     * La suscripción se cancela automáticamente cuando el componente es destruido para evitar fugas de memoria.
     */
  public getCatalogoList(): void {
    this.pantallaService.getCatalogoDatos().pipe(takeUntil(this.destroy$)).subscribe((response) => {
      const API_RESPONSE = JSON.parse(JSON.stringify(response));
      this.paisCatalogo = API_RESPONSE.pais;
      this.tratadoCatalogo = API_RESPONSE.tratado;
      this.origenCatalogo = API_RESPONSE.origen;
    });
  }

  /**
   * @method getCatalogoPaisBloques
   * @description Obtiene el catálogo de países y bloques comerciales
   * 
   * Realiza una petición al servicio para recuperar el catálogo de países y bloques.
   * Si la respuesta es exitosa (código '00'), transforma los datos al formato requerido
   * y los asigna a la propiedad paisCatalogo.
   * 
   * @returns {void}
 */
  public getCatalogoPaisBloques(): void {
    this.catalogosTramiteService.getCatPaisBloques()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
           
            const DATOS = response.datos || [];

          // Transformación a tu respuesta a response Catalogo
          this.paisCatalogo = DATOS.map((item, index) => ({
             id: item.id !== null && item.id !== undefined ? Number(item.id) : index + 1,
            descripcion: item.descripcion,
            clave: item.clave,
            bloque: item.bloque,
          }));
        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response.error || 'Error catalogo pais bloque.',
            mensaje: response.causa || response.mensaje || 'Error catalogo de pais bloque',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error catalogo pais bloque.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }

  /**
   * @method getCatalogoTratadoAcuerdo
   * @description Obtiene el catálogo de tratados y acuerdos por país
   * 
   * Realiza una petición al servicio para recuperar los tratados y acuerdos
   * específicos de un país. Si la respuesta es exitosa (código '00'), 
   * transforma los datos al formato requerido y los asigna a tratadoCatalogo.
   * 
   * @param {string} cvePais - Clave del país para filtrar los tratados
   * @returns {void}
 */
  public getCatalogoTratadoAcuerdo(cvePais: string): void {
  this.catalogosTramiteService.getCatTratadosAcuerdos(cvePais)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.codigo === CodigoRespuesta.EXITO) {
         
          const DATOS = response.datos || [];

          // Transformación a tu respuesta a response Catalogo
          this.tratadoCatalogo = DATOS.map((item, index) => ({
            id: index + 1,
            descripcion: item.descripcion,
            clave: item.clave,
          }));
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response?.error || 'Error tratado acuerdo.',
            mensaje: response?.causa || response?.mensaje || 'Error catálogo de tratado acuerdo',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error tratado acuerdo.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
}

  /**
   * @method getCatalogoTratadoAcuerdoBloque
   * @description Obtiene el catálogo de tratados y acuerdos por bloque comercial
   * 
   * Realiza una petición al servicio para recuperar los tratados y acuerdos
   * específicos de un bloque comercial. Si la respuesta es exitosa (código '00'), 
   * transforma los datos al formato requerido y los asigna a tratadoCatalogo.
   * 
   * @param {string} cvePais - Clave del país para determinar el bloque comercial
   * @returns {void}
   */
  public getCatalogoTratadoAcuerdoBloque(cvePais: string): void {
    this.catalogosTramiteService.getCatTratadosAcuerdosBloque(cvePais)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            
            const DATOS = response.datos || [];

          // Transformación a tu respuesta a response Catalogo
          this.tratadoCatalogo = DATOS.map((item, index) => ({
            id: index + 1,
            descripcion: item.descripcion,
            clave: item.clave,
          }));
        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response?.error || 'Error tratado acuerdo bloque.',
            mensaje: response?.causa || response?.mensaje || 'Error catálogo de tratado acuerdo bloque',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error tratado acuerdo bloque.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }

  /**
   * @method getCatalogoCriterios
   * @description Obtiene el catálogo de criterios de origen por tratado o acuerdo
   * 
   * Realiza una petición al servicio para recuperar los criterios de origen
   * específicos de un tratado o acuerdo. Si la respuesta es exitosa (código '00'), 
   * transforma los datos al formato requerido y los asigna a origenCatalogo.
   * 
   * @param {string} idTratadoAcuerdo - Clave del tratado o acuerdo para filtrar los criterios
   * @returns {void}
   */
  public getCatalogoCriterios(idTratadoAcuerdo: string): void {
    this.catalogosTramiteService.getCatCriterios(idTratadoAcuerdo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            const DATOS = response.datos || [];

          // Transformación a tu respuesta a response Catalogo
          this.origenCatalogo = DATOS.map((item, index) => ({
            id: index + 1,
            descripcion: item.descripcion,
            clave: item.clave,
          }));
        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response.error || 'Error catálogo de criterios.',
            mensaje: response.causa || response.mensaje || 'Error catálogo de criterios',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error catálogo de criterios.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }

  /**
   * Encabezados comunes de la tabla de tratados.
   * 
   * @property {string[]} encabezadosComunesTabla - Array de cadenas de encabezados de tabla.
   */
  encabezadosComunesTabla = tratadosTable.tableHeader;

 

 /**
     * Un array de objetos `RegistroDeSolicitudesTabla` que representa los datos para la tabla de solicitudes.
     */
    public registroDeSolicitudesTablaDatos: RegistroDeSolicitudesTabla[] = [];

  /**
   * Un array de objetos `CriterioTratadoResponse` que representa los datos para la tabla de solicitudes de la respuesta de validacion.
  */
  public respuestaServicioDatosTabla: CriterioTratadoResponse[] = [];

  /**
   * Un array de objetos `CriterioConfiguracionResponse` que representa los datos para la la configuracion de los tratados agregados.
  */
  public respuestaTratadosConfiguracion?: CriterioConfiguracionResponse;

  /**
   * Datos de la tabla de tratados.
   * Este array contiene objetos de tipo `TratadosTabla` que representan los datos de los
   */
    public tratadosTablaDatos: TratadosTabla[] = [ ];

  /**
   * Datos de la tabla de evaluación de tratados.
   * Este array contiene objetos de tipo `EvaluarTratadosResponse` que representan
   * el resultado de la evaluación de los tratados ingresados.
   */
  public tratadosEvaluacionTablaDatos: EvaluarTratadosResponse[]= []

  /**
   * Datos de la tabla de insumos.
   * Este array contiene objetos de tipo `InsumoResponse` que representan
   * el resultado de los insumos de la mercancía.
   */
  public tratadosInsumosTablaDatos: InsumoResponse[]= []

  /**
   * Datos de la tabla de empaques.
   * Este array contiene objetos de tipo `EmpaqueResponse` que representan
   * el resultado de los empaques de la mercancía.
   */
  public tratadosEmpaquesTablaDatos: EmpaqueResponse[]= []

  /**
   * Registro seleccionado en la tabla de tratados.
   */
  public registroSeleccionado: EvaluarTratadosResponse | null = null;

  /**
   * Verifica si un item está seleccionado.
   * @param item EvaluarTratadosResponse que se desea verificar si está seleccionado.
   * @returns true si el item está seleccionado, false en caso contrario.
   */
  isSelected(item: EvaluarTratadosResponse): boolean {
    return this.registroSeleccionado?.id_criterio_tratado === item.id_criterio_tratado;
  }

  /**
   * Alterna la selección de una fila en la tabla de tratados.
   * @param item EvaluarTratadosResponse que se desea alternar su selección.
   */
  toggleFila(item: EvaluarTratadosResponse): void {
    if (this.isSelected(item)) {
      this.registroSeleccionado = null;
      this.tratadoSeleccionado = [];
    } else {
      this.registroSeleccionado = item;
      this.tratadoSeleccionado = [item];
    }
  }

  /**
   * Se ejecuta al hacer clic en el checkbox de una fila.
   * @param event Evento del clic en el checkbox.
   * @param item EvaluarTratadosResponse asociado al checkbox.
   */
  toggleCheckbox(event: Event, item: EvaluarTratadosResponse): void {
    event.stopPropagation(); 
    this.registroSeleccionado = item;
    this.tratadoSeleccionado = [item];
  }

  /**
   * Tipo de selección utilizado en la tabla, definido como casillas de verificación (checkbox).
   * @type {TablaSeleccion}
   */
    tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /** Configuración de la tabla de sectores */
  public configuracionTabla: ConfiguracionColumna<RegistroDeSolicitudesTabla>[] = [
    { encabezado: 'País o bloque', clave: (item: RegistroDeSolicitudesTabla) => item.pais, orden: 1 },
    { encabezado: "Tratado o Acuerdo", clave: (item: RegistroDeSolicitudesTabla) => item.tratado, orden: 2 },
    { encabezado: "Criterio de origen", clave: (item: RegistroDeSolicitudesTabla) => item.origen, orden: 3 }
  ];

  /**
   * Configuración de la tabla de tratados seleccionados.
   * 
   * Define las columnas que se mostrarán en la tabla de evaluación de tratados,
   * incluyendo encabezado, clave de acceso a los datos y orden de despliegue.
   * 
   * Cada columna se representa mediante un objeto de tipo `ConfiguracionColumna<EvaluarTratadosResponse>`.
   */
  public tablaSeleccionada: ConfiguracionColumna<EvaluarTratadosResponse>[] = [
    { encabezado: 'País o bloque', clave: (item) => item.pais_bloque_nombre, orden: 1 },
    { encabezado: "Tratado o Acuerdo", clave: (item) => item.tratado_acuerdo, orden: 2 },
    { encabezado: "Criterio de origen", clave: (item) => item.criterio_origen, orden: 3 },
    { encabezado: "Norma de origen", clave: (item) => item.norma_origen, orden: 4 },
    { encabezado: "Requisito especifico", clave: (item) => item.requisito_especifico, orden: 5 },
    { encabezado: "Calificación sistema", clave: (item) => item.cal_aprobada_sistema ? 'APROBADA' : 'NO APROBADA', orden: 6 },
    { encabezado: "Calificación dictaminador", clave: (item) => item.cal_aprobada_dictaminador ? 'APROBADA' : 'NO APROBADA', orden: 7 },
    { encabezado: "Criterio Otras instancias", clave: (item) => item.otras_instancias, orden: 8 },
    { encabezado: "Proceso de transformación", clave: (item) => item.proceso_transformacion ?? '', orden: 9 }];

  /**
   * Configuración de la tabla que muestra la información detallada de los insumos
   * utilizados en la evaluación de mercancías.
   *
   * Cada columna corresponde a un campo del objeto {@link InsumoResponse}.
   */  
  public tablaInsumos: ConfiguracionColumna<InsumoResponse>[] = [
    { encabezado: "Nombre Técnico", clave: (item) => item.nombre, orden: 1 },
    { encabezado: "Proveedor", clave: (item) => item.proveedor, orden: 2 },
    { encabezado: "Fabricante y/o Productor", clave: (item) => item.fabricante_productor, orden: 3 },
    { encabezado: "RFC Fabricante y/o Productor", clave: (item) => item.rfc_fabricante_productor, orden: 4 },
    { encabezado: "Fracción Arancelaria", clave: (item) => item.clave_fraccion_arancelaria, orden: 5 },
    { encabezado: 'Descripción de la Fracción Arancelaria', clave: (item) => item.descripcion_fraccion, orden: 6 },
    { encabezado: "Capitulo", clave: (item) => item.capitulo, orden: 7 },
    { encabezado: "Descripción Capitulo", clave: (item) => item.nombre_capitulo, orden: 8 },
    { encabezado: "Partida", clave: (item) => item.partida, orden: 9 },
    { encabezado: "Descripción Partida", clave: (item) => item.nombre_partida, orden: 10 },
    { encabezado: "Subpartida", clave: (item) => item.subpartida, orden: 11 },
    { encabezado: "Descripción Subpartida", clave: (item) => item.nombre_subpartida, orden: 12 },
    { encabezado: "Valor en Dólares", clave: (item) => item.valor, orden: 13 },
    { encabezado: "Originario/No originario", clave: (item) => item.es_originario, orden: 14 },
    { encabezado: "País de Origen", clave: (item) => item.pais_origen, orden: 15 },
    { encabezado: "Peso", clave: (item) => item.peso, orden: 16 },
    { encabezado: "Volumen", clave: (item) => item.volumen, orden: 17 }];

  /**
   * Configuración de la tabla que presenta la información de los empaques
   * empleados en la mercancía evaluada.
   *
   * Cada columna corresponde a un campo del objeto {@link EmpaqueResponse}.
   */
  public tablaEmpaques: ConfiguracionColumna<EmpaqueResponse>[] = [
    { encabezado: 'Nombre Técnico', clave: (item) => item.nombre, orden: 1 },
    { encabezado: "Proveedor", clave: (item) => item.proveedor, orden: 2 },
    { encabezado: "Fabricante y/o Productor", clave: (item) => item.fabricante_productor, orden: 3 },
    { encabezado: "Fracción Arancelaria", clave: (item) => item.clave_fraccion_arancelaria, orden: 4 },
    { encabezado: "Valor en Dólares", clave: (item) => item.valor, orden: 5 },
    { encabezado: "Originario/No originario", clave: (item) => item.es_originario, orden: 6 }];


  /**
   * Agrega un nuevo tratado a la tabla.
   * 
   * Este método verifica si el formulario es válido, y si lo es, agrega el nuevo tratado
   * al cuerpo de la tabla y reinicia el formulario.
   * 
   * @method agregarTratado
   */
 
agregarTratado(): void {
  if (this.formularioTratados.valid) {
    const PAIS_ID = this.formularioTratados.get('pais')?.value;
    const TRATADO_ID = this.formularioTratados.get('tratado')?.value;
    const ORIGEN_ID = this.formularioTratados.get('origen')?.value;

    const PAIS_DESC = this.paisCatalogo.find(item => item.id === Number(PAIS_ID)) || null;
    const TRATADO_DESC = this.tratadoCatalogo.find(item => item.id === Number(TRATADO_ID)) || null;
    const ORIGENDESC = this.origenCatalogo.find(item => item.id === Number(ORIGEN_ID)) || null;

    if (this.isEditMode && this.selectedRowIndex !== null && this.selectedRowIndex > -1) {
      const SELECTED_ITEM = this.respuestaServicioDatosTabla[this.selectedRowIndex];

      this.respuestaServicioDatosTabla = this.respuestaServicioDatosTabla.filter(
        item => item.id_criterio_tratado !== SELECTED_ITEM.id_criterio_tratado
      );
      
      const PAYLOAD: TratadoAcuerdoCriterioRequest = {
        id_tratado_acuerdo: Number(TRATADO_DESC?.clave ?? 0),
        clave_pais_bloque: PAIS_DESC?.clave,
        criterio_certificado: ORIGENDESC?.clave,
        requiere_juegos_o_surtidos: false,
        is_bloque: PAIS_DESC?.bloque === 'true',
        tratados_agregados: this.respuestaServicioDatosTabla.map(item => ({
          id_criterio_tratado: item.id_criterio_tratado,
          id_bloque: item.id_bloque ?? null, 
          id_tratado_acuerdo: item.id_tratado_acuerdo,
          cve_grupo_criterio: item.cve_grupo_criterio,
          nombre_pais_bloque: item.nombre_pais_bloque,
          tratado_nombre: item.tratado_nombre,
          cve_tratado_acuerdo: item.cve_tratado_acuerdo ?? null,
          cve_pais: item.cve_pais ?? null,
          mensaje_agregado: item.mensaje_agregado
        }))
      };

      this.tratadoCriterioAgregar(PAYLOAD);

      this.isEditMode = false;
      this.selectedRowIndex = null;
      this.selectedRows = [];
    } else {
    const DATOS_SELECCIONADOS: TratadoAcuerdoCriterioRequest = {
      id_tratado_acuerdo: Number(TRATADO_DESC?.clave ?? 0),
      clave_pais_bloque: PAIS_DESC?.clave,
      criterio_certificado: ORIGENDESC?.clave,
      requiere_juegos_o_surtidos: false,
      is_bloque: PAIS_DESC?.bloque === "true"
    }
    this.tratadoCriterioAgregar(DATOS_SELECCIONADOS);
     
    }
  }
}

  /** 
   * @method tratadoCriterioAgregar
   * @description Realiza una petición para validar si se agrega los tratados.
   * @return {void}
   */
  public tratadoCriterioAgregar(datos: TratadoAcuerdoCriterioRequest): void {
    const PAYLOAD: TratadoAcuerdoCriterioRequest = {
      id_tratado_acuerdo: datos.id_tratado_acuerdo,
      clave_pais_bloque: datos.clave_pais_bloque,
      criterio_certificado: datos.criterio_certificado,
      requiere_juegos_o_surtidos: false,
      is_bloque: datos.is_bloque,
      tratados_agregados: this.respuestaServicioDatosTabla.map(item => ({
        id_criterio_tratado: item.id_criterio_tratado,
        id_bloque: item.id_bloque ?? null, 
        id_tratado_acuerdo: item.id_tratado_acuerdo,
        cve_grupo_criterio: item.cve_grupo_criterio,
        nombre_pais_bloque: item.nombre_pais_bloque,
        tratado_nombre: item.tratado_nombre,
        cve_tratado_acuerdo: item.cve_tratado_acuerdo,
        cve_pais: item.cve_pais ?? undefined, 
        mensaje_agregado: item.mensaje_agregado
      }))
    };
    this.tratadosSolicitudService.postTratadoCriterio(PAYLOAD)
    .subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.respuestaServicioDatosTabla = resp.datos ?? [];
          this.mostrarTabla = false;
          
          //Llenado de tabla
           this.registroDeSolicitudesTablaDatos = this.respuestaServicioDatosTabla.map(item => ({
            pais: item.nombre_pais_bloque,
            tratado: item.tratado_nombre,
            origen: item.cve_grupo_criterio
          }));
          this.cd.detectChanges();
          this.mostrarTabla = true;

          this.tramite110101Store.setRespuestaServicioDatosTabla(this.respuestaServicioDatosTabla);
          const PAYLOADRESPUESTA: CriterioConfiguracionRequest[] = this.respuestaServicioDatosTabla.map(item => ({
            cve_grupo_criterio: item.cve_grupo_criterio,
            cve_tratado_acuerdo: item.cve_tratado_acuerdo ?? '',
            cve_pais: item.cve_pais && item.cve_pais.trim() !== '' ? item.cve_pais : null,
            id_tratado_acuerdo: item.id_tratado_acuerdo
          }));
          this.configuracion(PAYLOADRESPUESTA);

          const MENSAJE = resp?.datos
            ?.find(item => item.mensaje_agregado && item.mensaje_agregado.trim() !== '')
            ?.mensaje_agregado;

          if (MENSAJE) {
            this.mostrarModalMensaje(MENSAJE);
          }

        }else{
           window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: resp.error || 'Error agregar tratado.',
            mensaje:
              resp.causa ||
              resp.mensaje ||
              'Error agregar tratado.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
       
      },
      error: (error) => {
        const MENSAJE = error?.error?.error || 'Error agregar tratado.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }

  /**
   * @method configuracion
   * @description Realiza la configuración adicional de criterios para los tratados agregados.
   *              Envía una solicitud POST con los datos de configuración y maneja la respuesta.
   * @param {CriterioConfiguracionRequest[]} datos - Array de objetos con datos de configuración de criterios
   * @return {void}
   */
  configuracion(datos:CriterioConfiguracionRequest[]): void{
    const PAYLOAD: CriterioConfiguracionRequest[] = datos.map(item => ({
      cve_grupo_criterio: item.cve_grupo_criterio,
      cve_tratado_acuerdo: item.cve_tratado_acuerdo,
      cve_pais: item.cve_pais,
      id_tratado_acuerdo: item.id_tratado_acuerdo
    }));
    this.tratadosSolicitudService.postTratadoConfiguracion(PAYLOAD)
    .subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.respuestaTratadosConfiguracion = resp.datos;
          this.tramite110101Store.clearRespuestaServicioDatosConfiguracion();
          this.tramite110101Store.setRespuestaServicioDatosConfiguracion(this.respuestaTratadosConfiguracion ?? {} as CriterioConfiguracionResponse);
          this.configurarPaisesInstancias(this.respuestaTratadosConfiguracion ?? {} as CriterioConfiguracionResponse);
          //Se elimina valores guardados en otros tabs por si lleno otros tabs y se cambia a tratados
          const INITIALSTATE = createSolicitanteInitialState();
          this.tramite110101Store.update(state => ({
            ...INITIALSTATE,
            respuestaServicioDatosTabla: state.respuestaServicioDatosTabla,
            respuestaServiceConfiguracion: state.respuestaServiceConfiguracion
          }));
          this.habilitarPestana.emit();
          this.formularioTratados.reset();
        }else{
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: resp.error || 'Error configuracion tratado.',
            mensaje:
              resp.causa ||
              resp.mensaje ||
              'Error configuracion tratado.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
       
      },
      error: (error) => {
        const MENSAJE = error?.error?.error || 'Error configuracion tratado';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }


/**
 * Modifica un tratado existente en la tabla.
 * Este método se activa cuando se selecciona una fila en la tabla.
 * Si hay una fila seleccionada, cambia el modo de edición a `true` y carga
 */
modificarTratado(): void {
  if (this.selectedRows.length === 0 ||
    this.selectedRowIndex === null ||
    this.selectedRowIndex < 0) {
   this.abrirModal();
    return;
  }
  this.isEditMode = true;
  const SELECTED = this.registroDeSolicitudesTablaDatos[this.selectedRowIndex];

  const PAIS_ID = this.paisCatalogo.find(item => item.descripcion === SELECTED.pais)?.id ?? '';
  const TRATADO_ID = this.tratadoCatalogo.find(item => item.descripcion === SELECTED.tratado)?.id ?? '';
  const ORIGEN_ID = this.origenCatalogo.find(item => item.clave === SELECTED.origen)?.id ?? ''; 

  this.formularioTratados.patchValue({
    pais: PAIS_ID,
    tratado: TRATADO_ID,
    origen: ORIGEN_ID
  });
  this.mostrarTabla = false;
  this.cd.detectChanges();
  this.mostrarTabla = true;
}
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  public guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
     this.formularioTratados.disable();

    this.evaluacionTablaTratados(() => {
      this.noAceptada = this.generarDictamenClasificacionService.getNoAceptadaActual();
      this.modificarRegistrosAladi();
    });
    } else if (!this.esFormularioSoloLectura) {
      this.formularioTratados.enable();
    }
  }

/**
 * Objeto que representa los datos de una fila en la tabla de registros de solicitudes.
 * 
 * @property {string} pais - Nombre del país asociado al registro.
 * @property {string} tratado - Nombre del tratado relacionado.
 * @property {string} origen - Origen del registro.
 */
talbleData: RegistroDeSolicitudesTabla = {
  pais:'',
  tratado: '',
  origen: ''
}
  
/**
 * Obtiene la descripción correspondiente a un valor seleccionado en un formulario
 * a partir de un arreglo de catálogo y la asigna a la propiedad correspondiente
 * en el objeto `talbleData`.
 *
 * @param arr - Arreglo de objetos de tipo `Catalogo` que contiene los datos del catálogo.
 * @param formControl - Nombre del control del formulario cuyo valor se utilizará para buscar la descripción.
 *
 * Asigna la descripción encontrada a la propiedad correspondiente de `talbleData` según el control:
 * - Si `formControl` es 'pais', asigna a `talbleData.pais`.
 * - Si `formControl` es 'tratado', asigna a `talbleData.tratado`.
 * - Si `formControl` es 'origen', asigna a `talbleData.origen`.
 */
 getLabelFromCatalogData(arr:Catalogo[],formControl:string): void {
  const ID = this.formularioTratados.get(formControl)?.value;
  const LABLE = arr.find(item => item.id.toString() === ID)?.descripcion;
  if(formControl === 'pais') {
    this.talbleData.pais = LABLE || '';
  }else if(formControl === 'tratado') {
    this.talbleData.tratado = LABLE || '';
}else if(formControl === 'origen') {
    this.talbleData.origen = LABLE || '';
  }
}

/**
 * Configura los países e instancias basado en los criterios de configuración recibidos.
 * @param config - Objeto de configuración que contiene las banderas para mostrar las diferentes instancias.
 */
configurarPaisesInstancias(config: CriterioConfiguracionResponse): void {
   if (!config) {
     return;
   }
  this.paisesInstancias = [];
  if (config.mostrar_otras_instancias) {
    this.paisesInstancias.push('OTRASINSTANCIAS');
  }
  if (config.mostrar_otras_instancias_peru) {
    this.paisesInstancias.push('INSTANCIASPERU');
  }
  if (config.mostrar_otras_instancias_uruguay) {
    this.paisesInstancias.push('INSTANCIASURUGUAY');
  }
  if (config.mostrar_otras_instancias_alianza_p) {
    this.paisesInstancias.push('INSTANCIASPACIFICO');
  }
}


  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite110101Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite110101Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * @method onTratadoAcuerdo
   * @description Maneja el evento de cambio de selección en el catálogo..
   * @param {Catalogo} selectedOption - La opción seleccionada del catálogo.
   * @returns {void} No retorna ningún valor.
   */
  onTratadoAcuerdo(selectedOption: Catalogo, campo: string): void {
    switch (campo) {
      case 'pais':
        if (selectedOption.bloque === 'false') {
          this.getCatalogoTratadoAcuerdo(selectedOption.clave || '');
        } else if (selectedOption.bloque === 'true') {
          this.getCatalogoTratadoAcuerdoBloque(selectedOption.clave || '');
        }
         
            
        break;
      case 'tratado':
        this.getCatalogoCriterios(selectedOption.clave || '');
        break;
      default:
        break;
    }
  }

  /**
   * @method onTratadoAcuerdo
   * @description Maneja el evento de cambio de selección en el catálogo de tratados o países.
   *              Dependiendo del campo seleccionado, realiza diferentes acciones:
   *              - Para 'pais': Obtiene el catálogo de tratados según el tipo (país o bloque)
   *              - Para 'tratado': Obtiene el catálogo de criterios asociados al tratado
   * @param {Catalogo} selectedOption - La opción seleccionada habilita un catálogo.
   * @param {string} campo - El tipo de campo que generó el evento ('pais' o 'tratado').
   * @returns {void} No retorna ningún valor.
  */
  instanciasConfig: Record<string, { titulo: string; alerta: string, cargarCatalogo: boolean, modificacionText?: boolean}> = {
    OTRASINSTANCIAS: {
      titulo: 'Otras Instancias',
      alerta: this.mensajeGenericoInstancias.MENSAJE,
      cargarCatalogo: false,
    },
    INSTANCIASPERU: {
      titulo: 'Otras Instancias para TLC-Perú',
      alerta: this.mensajeGenericoInstancias.MENSAJE,
      cargarCatalogo: true
    },
    INSTANCIASURUGUAY: {
      titulo: 'Otras Instancias para TLC-Uruguay',
      alerta: this.mensajeGenericoInstancias.MENSAJE,
      cargarCatalogo: true
    },
    INSTANCIASPACIFICO: {
      titulo: 'Otras Instancias para el Acuerdo alianza del pacifico',
      alerta: this.mensajeAlianza.MENSAJE,
      cargarCatalogo: false,
      modificacionText: true
    },
  };




/**
 * 
 * @param selected - Array de registros seleccionados en la tabla.
 * Este método maneja el cambio de selección en la tabla de tratados.
 */
onSeleccionChange(selected: RegistroDeSolicitudesTabla[]) :void{
  if (selected && selected.length === 1) {
    this.selectedRows = [selected[0]];
    this.selectedRowIndex = this.registroDeSolicitudesTablaDatos.findIndex(
      row => row === selected[0]
    );
  
  } else {
    this.selectedRows = [];
    this.selectedRowIndex = null;
    this.formularioTratados.reset();
  }
}

/**
 * 
 * @returns boolean
 * Este método verifica si hay filas seleccionadas en la tabla de tratados.
 */
eliminarTratado(): void {
  if (this.selectedRows.length === 0) {
    this.abrirModal();
    return;
  }
  this.registroDeSolicitudesTablaDatos = this.registroDeSolicitudesTablaDatos.filter(
    row => !this.selectedRows.includes(row)
  );

  this.respuestaServicioDatosTabla = this.respuestaServicioDatosTabla.filter(
    item => !this.selectedRows.some(sel =>
      sel.pais === item.nombre_pais_bloque &&
      sel.tratado === item.tratado_nombre &&
      sel.origen === item.cve_grupo_criterio
    )
  );
  this.tramite110101Store.clearRespuestaServicioDatosTabla();
  this.tramite110101Store.setRespuestaServicioDatosTabla(this.respuestaServicioDatosTabla);

  this.selectedRows = [];
  const INITIALSTATE = createSolicitanteInitialState();
  this.tramite110101Store.update(state => ({
    ...INITIALSTATE,
    respuestaServicioDatosTabla: state.respuestaServicioDatosTabla
  }));
  if(this.respuestaServicioDatosTabla.length){
    this.configuracion(this.respuestaServicioDatosTabla) 
  }
  
  if(this.respuestaServicioDatosTabla.length === 0 || this.respuestaServicioDatosTabla.length === 0){ 
    this.tramite110101Store.reset();
     this.cerrarPestana.emit();
  }
 
}

  /**
   * Lista de pedimentos.
   *
   * Esta propiedad almacena un arreglo de objetos de tipo `Pedimento`, que representan
   * los pedimentos gestionados en el componente.
   */
  pedimentos: Array<Pedimento> = [];
   /**
   * Índice del elemento que se desea eliminar.
   *
   * Esta propiedad almacena el índice del elemento seleccionado para su eliminación
   * en la lista de pedimentos.
   */
  elementoParaEliminar!: number;
  /**
   * Abre el modal de confirmación para eliminar un pedimento.
   *
   * Este método configura los datos de la notificación que se mostrará en el modal
   * de confirmación. También almacena el índice del elemento que se desea eliminar.
   *
   * @param i - Índice del pedimento que se desea eliminar. Por defecto, es 0.
   */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'Seleccione un país/tratado/criterio',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };
    this.elementoParaEliminar = i;
  }

  /**
   * Abre el modal de error para tratados en evaluación.
   * 
   * Este método configura los datos de la notificación que se mostrará en el modal
   * cuando no se ha seleccionado un país, bloque-tratado o acuerdo.
   */
  abrirModalTratadosEvaluacion(): void {
    this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'Debe seleccionar un País/bloque-tratado/acuerdo',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
    };
  }

  /**
   * Abre el modal de error.
   */
  abrirModalGlobalAccion(): void {
    this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'La acción no es permitida para este tipo de criterio',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };
  }

  /**
   * Abre el modal de error dictaminador.
   */
  abrirModalErrorDictaminador(): void {
    this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'No es posible modificar la calificación  ya que la calificación  del sistema es "NO APROBADA".',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };
  }

   /**
   * Abre el modal de error dictaminador aladi.
   */
  abrirModalErrorDictaminadorAladi(): void {
    this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'No es posible modificar la calificación ya que la descripción es "No Aceptada".',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };
  }

  /**
   * Abre el modal de error.
   */
  mostrarModalMensaje(mensaje: string): void {
    this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: mensaje,
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };
  }
    
  /**
   *              
   * @param borrar
   * @description Elimina un pedimento de la lista si el parámetro `borrar` es `true`. 
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }
  
  /**
   * @method InsumosEmpaques
   * @description Consulta los insumos y/o empaques asociados a una solicitud a través del servicio.
   * @returns {void}
   */
  insumosEmpaques(): void {
    if(this.tratadoSeleccionado.length === 0 || this.tratadoSeleccionado.length > 1) {
      this.abrirModalTratadosEvaluacion();
      return;
    }
    const TRATADO = this.tratadoSeleccionado[0];
    const CRITERIO_ORIGEN = TRATADO.cve_grupo_criterio?.trim() ?? '';
    const CVE_PAIS = TRATADO.cve_pais?.trim() ?? '';
    const TRATADO_ACUERDO = TRATADO.tratado_acuerdo?.trim() ?? '';
    if (
       !(
    CRITERIO_ORIGEN === 'OTROS' ||
    CRITERIO_ORIGEN === 'B' ||
    CRITERIO_ORIGEN === 'OTRASINST' ||
    (CVE_PAIS === 'PAN' && TRATADO_ACUERDO === '505')
  )
    ) {
      this.abrirModalGlobalAccion();
      return;
    }
    this.tratadosSolicitudService.getInsumosEmpaques(this.consultaState.id_solicitud, this.tratadoSeleccionado[0].id_tratado_acuerdo.toString(),
      this.tratadoSeleccionado[0].id_bloque ?? null, this.tratadoSeleccionado[0].cve_pais)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            const INSUMOS = response.datos?.insumos ?? [];
            const EMPAQUES = response.datos?.empaques ?? [];

            if (INSUMOS.length > 0 || EMPAQUES.length > 0){
              this.tratadosInsumosTablaDatos = INSUMOS;
              this.tratadosEmpaquesTablaDatos = EMPAQUES;

              this.modalInstance = new Modal(this.modalElementInsumosEmpaques.nativeElement);
              this.modalInstance?.show();
            }else{
              this.abrirModalGlobalAccion();
            }
        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response?.error || 'Error en la consulta de insumos empaques.',
            mensaje: response?.causa || response?.mensaje || 'Error en la consulta de insumos empaques.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error en la consulta de insumos empaques.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
  }

  /**
   * Obtiene la evaluación de tratados para la solicitud actual y actualiza la tabla de evaluación.
   *
   * Este método llama al servicio `evaluacionTratadosService.getEvaluarTratados` pasando el ID de la solicitud.
   * - Si la respuesta es exitosa (`CodigoRespuesta.EXITO`), actualiza `tratadosEvaluacionTablaDatos`.
   * - Si ocurre un error o la respuesta es incorrecta, muestra una notificación de error.
   */
  evaluacionTablaTratados(callback?: () => void): void {
    this.evaluacionTratadosService.getEvaluarTratados(this.consultaState.id_solicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.tratadosEvaluacionTablaDatos = response.datos ?? [];
            this.tratadosActualizados.emit(this.tratadosEvaluacionTablaDatos);
             callback?.();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error obtener tratados.',
              mensaje: response.causa || response.mensaje || 'Error obtener tratados.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error obtener tratados.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * @method CriterioTratadoResumen
   * @description Consulta el resumen de valores de un criterio tratado por su identificador.
   * @returns {void}
   */
  criterioTratadoResumen(): void {
    if(this.tratadoSeleccionado.length === 0 || this.tratadoSeleccionado.length > 1) {
      this.abrirModalTratadosEvaluacion();
      return;
    }

    const CRITERIO_ORIGEN = this.tratadoSeleccionado[0].cve_grupo_criterio
    if (CRITERIO_ORIGEN === 'OTROS' || CRITERIO_ORIGEN === 'OTRASINST') {
     
    
    this.tratadosSolicitudService.getCriterioTratadoResumen(this.tratadoSeleccionado[0].id_criterio_tratado.toString())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.modalInstance = new Modal(this.modalElementResumenValores.nativeElement);
            this.modalInstance?.show();
            this.valoresFormularioResumen = response.datos ?? {} as DatosCriterioResumenResponse;            
        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response?.error || 'Error en la consulta de resumen de criterio tratado.',
            mensaje: response?.causa || response?.mensaje || 'Error en la consulta de resumen de criterio tratado.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error en la consulta de resumen de criterio tratado.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
    }else{
      this.abrirModalGlobalAccion();
    }
  }

  /**
   * @method requisitoProceso
   * @description Muestra el requisito del proceso asociado al tratado seleccionado.
   * @returns {void}
   */
  requisitoProceso(): void {  
    if(this.tratadoSeleccionado.length === 0 || this.tratadoSeleccionado.length > 1) {
      this.abrirModalTratadosEvaluacion();
      return;
    }   
    if(this.tratadoSeleccionado[0].descripcion_proceso === null || this.tratadoSeleccionado[0].descripcion_proceso === '') {
      this.abrirModalGlobalAccion();
    }else{
      this.textoRequisitoProceso = this.tratadoSeleccionado[0].descripcion_proceso;
      this.modalInstance = new Modal(this.modalRequisitoProceso.nativeElement);
      this.modalInstance?.show();        
    }
  }

  /**
   * Maneja el cambio de selección de la tabla tratados.
   * @param tratadoSeleccionado 
   */
  onSeleccionChangeEvaluacion(tratadoSeleccionado: EvaluarTratadosResponse[]) :void{
    this.tratadoSeleccionado = [...tratadoSeleccionado];
  }

  /**
   * @method modificarRegistros
   * @description Este método modifica los registros seleccionados en la tabla de evaluación de tratados.
   * Actualiza la calificación dictaminada según la opción seleccionada en el formulario.
   * Si no hay tratados seleccionados, muestra una advertencia en la consola.
   * Finalmente, refresca la tabla y cierra el diálogo modal.
   * @returns void
   */
  modificarRegistros(): void {
    if (!this.tratadoSeleccionado) {
      return;
    }

    const OPCION = this.dictaminador.get('opcionSeleccionada')?.value;
    const APROBADO = OPCION === 'true';

    // Actualiza solo los tratados seleccionados dentro de la tabla completa
    this.tratadosEvaluacionTablaDatos = this.tratadosEvaluacionTablaDatos.map(tratado => {
      // Si este tratado está dentro de los seleccionados, actualiza
      if (this.tratadoSeleccionado.some(sel => sel.id_criterio_tratado === tratado.id_criterio_tratado)) {
        return {
          ...tratado,
          cal_aprobada_dictaminador: APROBADO,
          calificacion_dictaminador: APROBADO ? 'APROBADA' : 'NO APROBADA'
        };
      }
      return { ...tratado };
    });

    // Refresca la tabla
    this.tratadosEvaluacionTablaDatos = [...this.tratadosEvaluacionTablaDatos];
    this.tratadosActualizados.emit(this.tratadosEvaluacionTablaDatos);

    this.limpiarSeleccion();
    this.cerrarDialogo();
  }

/**
 * @method modificarRegistrosAladi
 * @description Este método modifica los registros ALADI en la tabla de evaluación de tratados.
 * Establece como no aprobados los tratados con IDs específicos restringidos.
 * @returns void
 */
  modificarRegistrosAladi():void{
     if (this.noAceptada === null) {  
      return;
    }

   const IDS_RESTRINGIDOS = [102, 103, 104, 105, 106];
  this.tratadosEvaluacionTablaDatos.forEach(item => {
    if (IDS_RESTRINGIDOS.includes(item.id_tratado_acuerdo)) {
      if (this.noAceptada === false) {
      item.cal_aprobada_dictaminador = false;
      item.calificacion_dictaminador = 'NO APROBADO';
      }else{
        item.cal_aprobada_dictaminador = true;
        item.calificacion_dictaminador = 'APROBADA';
      }
    }
  });
  this.noAceptada = null;
  this.tratadosEvaluacionTablaDatos = [...this.tratadosEvaluacionTablaDatos];
   this.tratadosActualizados.emit(this.tratadosEvaluacionTablaDatos);
  }

  /**
   * @method limpiarSeleccion
   * @description Limpia la selección de tratados en la tabla de evaluación.
   */
  limpiarSeleccion(): void {
    this.tratadoSeleccionado = [];
  }

  /**
   * @method abrirModalDictaminador
   * @description Método para abrir el modal de confirmación de eliminación de facturas.
   * Muestra el modal y prepara la interfaz para que el usuario confirme o cancele la eliminación.
   */
  abrirModalDictaminador(): void {
    if(!this.tratadoSeleccionado || this.tratadoSeleccionado.length === 0) {
      this.abrirModal();
      return;
    }
      
    if(this.tratadoSeleccionado[0].calificacion_dictaminador === 'NO APROBADA'){
      this.abrirModalErrorDictaminadorAladi();
      return;
    }
     if(this.tratadoSeleccionado[0].cal_aprobada_dictaminador === false){
      this.abrirModalErrorDictaminador();
      return;
    }
    const RADIOSELECCIONADO = this.tratadoSeleccionado && 
                              this.tratadoSeleccionado.length > 0 &&
                              this.tratadoSeleccionado.every(item => item.id_criterio_tratado);

    if (!RADIOSELECCIONADO) {
      this.abrirModal();
      return;
    }

    if (this.modalElement && this.modalElement.nativeElement) {
      if (this.modalInstance) {
        this.modalInstance?.hide?.(); 
      }
      this.dictaminador.get('opcionSeleccionada')?.setValue('true');
      this.modalInstance = new Modal(this.modalElement.nativeElement);
      this.modalInstance?.show();
    }
  }

 /**
 * @description Valida el formulario principal y el de otras instancias antes de continuar.
 * Verifica que existan datos en la tabla y que los formularios asociados sean válidos.
 * @method validarFormulario
 * @returns {boolean} Retorna `true` si todos los formularios son válidos, de lo contrario `false`.
 */
  validarFormulario(): boolean {
    // Si no hay datos en la tabla → inválido
    if (this.solicitudeState.respuestaServicioDatosTabla.length === 0) {
      return false;
    }
    //  Si el componente otrasInstancias no existe → no avanzar, pero sin error
    if (!this.otrasInstancias) {
      return true;
    }

    // Si el formulario dentro de otrasInstancias no existe → no avanzar
    if (!this.otrasInstancias.formularioInstancias) {
      return true;
    }

    // Si el formulario de otras instancias no es válido → inválido
    if (this.otrasInstancias.formularioInstancias.valid === false) {
      this.otrasInstancias.formularioInstancias.markAllAsTouched();
      return false;
    }
    return true;
  }

 /**
   * Cierra el modal de agregar o editar mercancías.
   * Utiliza la instancia del modal de Bootstrap para ocultar el diálogo actualmente abierto.
   *
   * @example
   * this.cerrarDialogo();
   * // El modal se oculta.
   */
  cerrarDialogo(): void {
    this.modalInstance?.hide();
  }

  /**
   * **Ciclo de vida: OnDestroy**
   * 
   * Este método se ejecuta cuando el componente se destruye. 
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   * 
   * - Envía un valor a `destroy$` para notificar a los observables que deben completarse.
   * - Completa `destroy$` para liberar los recursos asociados.
   */
  ngOnDestroy(): void {
    this.tramite110101Store.setValidacionFormulario('validacion_tab_tratados_otras_inmstancias', this.validarFormulario() || null);
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }
}

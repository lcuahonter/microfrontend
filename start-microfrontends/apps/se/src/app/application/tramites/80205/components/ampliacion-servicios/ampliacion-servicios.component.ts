import {
  CONFIGURACION_DOMICILIOS,
  CONFIGURACION_SERVICIO_AUTORIZADO,
  CONFIGURACION_SERVICIO_IMMEX,
} from '../../constantes/modificacion.enum';
import {
  CatalogoServices,
  CategoriaMensaje,
  ConsultaioQuery,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
} from '@ng-mf/data-access-user';
import { EmpresaNacional, EmpresasNacionalesResponse, ServicioDtosKey, ServicioItemResponse } from '../../../../shared/models/modelo-interface.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Input, OnDestroy, OnInit } from '@angular/core';
import { ServicioAmpliacion, ServicioAutorizado } from '../../models/datos-info.model';
import { Subject,Subscription,filter,map,shareReplay,takeUntil} from 'rxjs';
import { AmpliacionServiciosQuery } from '../../estados/tramite80205.query';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { AmpliacionServiciosState } from '../../estados/tramite80205.store';
import { AmpliacionServiciosStore } from '../../estados/tramite80205.store';
import { ApiResponse } from '../../models/datos-info.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Catalogo } from '../../constantes/modificacion.enum';
import {CatalogoSelectComponent} from'@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '../../models/configuracion-columna.model';
import { Notificacion } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import {ViewChild} from '@angular/core';

/**
 * Componente para la gestión de ampliación de servicios IMMEX.
 * @export
 * @class AmpliacionServiciosComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-ampliacion-servicios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CatalogoSelectComponent,
    FormsModule,
    TablaDinamicaComponent,
    NotificacionesComponent,
  ],
  providers: [NotificacionesService],
  templateUrl: './ampliacion-servicios.component.html',
  styleUrl: './ampliacion-servicios.component.scss',
})
export class AmpliacionServiciosComponent implements OnInit, OnDestroy {

  /**
   * Lista de identificadores de mercancías seleccionadas.
   *
   * Este arreglo almacena los IDs de las mercancías que el usuario ha elegido,
   * ya sea para registrar, modificar o visualizar en el contexto del formulario.
   *
   * @type {number[]}
   */
  mercanciasSeleccionados: number[] = [];
  /**
   * Lista de identificadores de la segunda tabla seleccionados.
   * @type {number[]}
   */
  tablaDosSeleccionados: number[] = [];

  /**
 * Referencia a la tabla dinámica A.
 * @property {TablaDinamicaComponent<ServicioAmpliacion>} tablaA
 */
@ViewChild('tablaA') tablaA!: TablaDinamicaComponent<ServicioAmpliacion>;
/**
 * Referencia a la tabla dinámica B.
 * @property {TablaDinamicaComponent<ServicioAutorizado>} tablaB
 */
@ViewChild('tablaB') tablaB!: TablaDinamicaComponent<ServicioAutorizado>;
/**
 * Referencia a la tabla dinámica C.
 * @property {TablaDinamicaComponent<EmpresaNacional>} tablaC
 */
@ViewChild('tablaC') tablaC!: TablaDinamicaComponent<EmpresaNacional>;
  /**
   * Índice de la pestaña.
   * @property {number} tabindex
   */
  @Input() tabindex!: number;
  /**
   * Suscripción para manejar observables.
   * @property {Subscription} subscription
   */
  private subscription: Subscription = new Subscription();

  /**
   * Formulario principal del componente.
   * @property {FormGroup} formulario
   */
  formulario: FormGroup;

  /**
   * Formulario para la información de registro.
   * @property {FormGroup} formularioInfoRegistro
   */
  formularioInfoRegistro!: FormGroup;

  /**
   * Tipo de selección en la tabla.
   * @property {TablaSeleccion} tablaSeleccion
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.RADIO;

  /**
   * RFC de la empresa.
   * @property {string} rfcEmpresa
   */
  rfcEmpresa: string = '';

  
  /**
   * Estado del trámite de ampliación de servicios.
   * @type {AmpliacionServiciosState}
   */
  tramiteState: AmpliacionServiciosState = {} as AmpliacionServiciosState;

  /**
   * Número del programa IMMEX.
   * @property {string} numeroPrograma
   */
  numeroPrograma: string = '';

  /**
   * Tiempo del programa IMMEX.
   * @property {string} tiempoPrograma
   */
  tiempoPrograma: string = '';

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 
  
  /**
   * Indica si el campo debe ser deshabilitado.
   * @property {boolean} campoDeshabilitar
   */
  campoDeshabilitar:boolean= false;

  /**
   * Configuración de columnas para la tabla de domicilios.
   * @property {ConfiguracionColumna<EmpresasNacionales[]>} configuracionTabla
   */
  configuracionTabla: ConfiguracionColumna<EmpresaNacional>[] =
    CONFIGURACION_DOMICILIOS;

  /**
   * Configuración de columnas para la tabla de servicios IMMEX.
   * @property {ConfiguracionColumna<Servicio>[]} configuracionTablaServicio
   */
  configuracionTablaServicio: ConfiguracionColumna<ServicioAmpliacion>[] =
    CONFIGURACION_SERVICIO_IMMEX;

  /**
   * Configuración de columnas para la tabla de servicios autorizados.
   * @type {ConfiguracionColumna<ServicioAutorizado>[]}
   */
  configuracionTablaServicioAutorizado: ConfiguracionColumna<ServicioAutorizado>[] =
    CONFIGURACION_SERVICIO_AUTORIZADO;

  /**
   * Lista de empresas relacionadas con IMMEX.
   * @property {EmpresaNacional[]} empresas
   */
  empresas: EmpresaNacional[] = [];

  /**
   * Datos de servicios IMMEX.
   * @property {Servicio[]} datosImmex
   */
  datosImmex: ServicioAmpliacion[] = [];

  /**
   * Datos de servicios autorizados.
   * @type {ServicioAutorizado[]}
   */
  datosAutorizados:ServicioAutorizado[]=[];

   /**
     * @public
     * @property {Notificacion} nuevaNotificacion
     * @description Representa una nueva notificación que se utilizará en el componente.
     * @command Este campo debe ser inicializado antes de su uso.
     */
   public nuevaNotificacion!: Notificacion;

  /**
   * Domicilios seleccionados.
   * @property {ServicioAmpliacion[]} domiciliosSeleccionados - Selected services with ampliacion data
   */
  domiciliosSeleccionados: ServicioAmpliacion[] = [];
 /**
  * Autorizados seleccionados.
  * @property {Servicio[]} autorizadosSeleccionados
  */
  autorizadosSeleccionados: ServicioAutorizado[] = [];

  /**
   * Empresas seleccionadas.
   * @property {EmpresaNacional[]} empresasSeleccionados
   */
  empresasSeleccionados: EmpresaNacional[] = [];

  /**
 * @property {boolean} esHabilitarElDialogo
 * Indica si el diálogo de confirmación para agregar servicios está habilitado y visible.
 */

  esHabilitarElDialogo: boolean = false;
  /**
   * Indica si el diálogo de confirmación para eliminar servicios está habilitado y visible.
   * @property {boolean} esEliminar
   */
  esEliminar: boolean = false;
  /**
   * Indica si el diálogo de confirmación para eliminar empresas nacionales está habilitado y visible.
   * @property {boolean} esEliminar
   */

  /**
   * Indica si el diálogo de agregar empresas está habilitado.
   * @type {boolean}
   */
  esAgregarDos: boolean = false;

  /**
   * Indica si el diálogo de confirmación para eliminar empresas nacionales está habilitado y visible.
   * @property {boolean} esEliminar
   */

  /**
   * Indica si el diálogo de eliminar empresas está habilitado.
   * @type {boolean}
   */
  esEliminarDos: boolean = false;
  /**
   * Indica si se han recibido datos de respuesta.
   * @property {boolean} esDatosRespuesta
   */

  /**
   * Indica si no se ha seleccionado ninguna fila.
   * @type {boolean}
   */
  rowNotSeleccionada: boolean = false;

  /**
   * Indica si se han recibido datos de respuesta.
   * @property {boolean} esDatosRespuesta
   * */

  /**
   * Indica si no hay fila seleccionada.
   * @type {boolean}
   */
  noRowSelected: boolean = false;

   /**
   * Indica si se han recibido datos de respuesta.
   * @property {boolean} esDatosRespuesta
   * */
   /**
   * Indica si no hay fila seleccionada en la tabla C.
   * @type {boolean}
   */
   noRowSelectedTablaC: boolean = false;


  /**
   * Lista de aduanas de ingreso.
   * @property {Catalogo[]} aduanaDeIngreso
   */
  aduanaDeIngreso!: Catalogo[];
  /**
   * Valor predeterminado para la selección de aduanas.
   * @property {number} predeterminado
   */
  predeterminado=-1;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
   * Identificador del trámite.
   * @type {string}
   */
  tramiteID:string ='80205';

  /**
   * Identificador del servicio IMMEX seleccionado.
   * @type {string}
   */
  serviciosImmexServId!:string;

  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para la creación de formularios.
   * @param {AmpliacionServiciosService} ampliacionServiciosService - Servicio para obtener datos de ampliación de servicios.
   */
  constructor(
    private fb: FormBuilder,
    private ampliacionServiciosService: AmpliacionServiciosService,
    private catalogoServices: CatalogoServices,
    private ampliacionServiciosQuery: AmpliacionServiciosQuery,
    private ampliacionServiciosStore: AmpliacionServiciosStore,
    private consultaioQuery: ConsultaioQuery,
    private serviciosService: ServiciosService,
    private notificacionesService: NotificacionesService
  ) {
       /**
     * Inicializa el formulario principal del componente con los campos necesarios.
     * @method inicializarFormularioPrincipal
     */
    this.formulario = this.fb.group({
      entidadFederativa: [{ value:""}, Validators.required],
    });
    
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      ).subscribe();
    
    /**
     * Suscripción al observable `selectAduanaDeIngresoSelecion$` del query `ampliacionServiciosQuery`.
     *
     * Este observable emite la aduana de ingreso seleccionada, y al recibir un valor válido,
     * se actualiza el campo `entidadFederativa` del formulario con el `id` de la aduana.
     *
     * Además, se actualiza el estado global `formValida` en el store `ampliacionServiciosStore`,
     * indicando si el campo `entidadFederativa` es válido dentro del formulario.
     *
     * @observable selectAduanaDeIngresoSelecion$
     * @returns {void}
     */
    this.ampliacionServiciosQuery.selectAduanaDeIngresoSelecion$
      .pipe()
      .subscribe((aduanaDeIngresoSelecion) => {
        if (aduanaDeIngresoSelecion) {
          this.formulario.patchValue({
            entidadFederativa: aduanaDeIngresoSelecion.id,
          });
        }
        this.ampliacionServiciosStore.setFormValida({
          entidadFederativa: this.formulario.valid,
        });
      });
  }

  
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormularioInfoRegistro();
    }  
    
  }

  /**
   * Método de inicialización del componente.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.obtenerIngresoSelectList(this.tramiteID);
    this.getDatos();
    this.inicializarEstadoFormulario();
    this.suscribirseADatosImmex();
    this.suscribirseADatos();
    this.suscribirseAFields();
    this.getTablaDatos();

  }
  /**
   * Maneja los cambios en los campos de entrada y actualiza el estado correspondiente
   * en el store de ampliación de servicios.
   *
   * @param fieldName - El nombre del campo que ha cambiado.
   * @param newValue - El nuevo valor asignado al campo.
   */
  enCambioDeCampo(fieldName: string, newValue: string): void {
    switch (fieldName) {
      case 'rfcEmpresa':
        this.ampliacionServiciosStore.setRfcEmpresa(newValue);
        break;
      case 'numeroPrograma':
        this.ampliacionServiciosStore.setNumeroPrograma(newValue);
        break;
      case 'tiempoPrograma':
        this.ampliacionServiciosStore.setTiempoPrograma(newValue);
        break;
      default:
        break;
    }
  }

  /**
   * Obtiene los datos del servicio.
   * @method getDatos
   */
  suscribirseADatos(): void {
    this.subscription.add(
      this.ampliacionServiciosQuery.select('empresas').subscribe((empresas) => {
        this.empresas = empresas; // Actualiza el array local de empresas cuando cambian los datos del store
      })
    );
  }

 /**
  * Actualiza el grid de empresas nacionales.
  * @method actualizaGridEmpresasNacionales
  * 
  * @return {void}
  */
  getTablaDatos(): void {
    this.serviciosService.postServiciosAutorizadosTabla(this.tramiteID,{
      rfc: 'NOV0509053I7',
      numeroPrograma: '2',
      idPrograma: '121517',
      tipoPrograma: 'TICPSE.IMMEX'
    })
      .pipe(
        takeUntil(this.destroyNotifier$),
        shareReplay(1),
        filter((data: BaseResponse<ServicioDtosKey>) => data.codigo === '00'),
        map((data: BaseResponse<ServicioDtosKey>) => {
          const SERVICIOS_ITEMS = data.datos?.servicioDtos || [];
          return SERVICIOS_ITEMS
            .filter((item: ServicioItemResponse) => item.idServicio !== null && item.idServicio !== undefined)
            .map((item: ServicioItemResponse) => ({
              idServicio: String(item.idServicio),
              descripcion: item.descripcion,
              descripcionTipo: item.descripcionTipo,
              descripcionTestado: item.descripcionTestado,
              estatus: item.estatus,
              desEstatus: item.desEstatus,
              idSolicitud: item.idSolicitud ? String(item.idSolicitud) : undefined,
              solicitud: item.solicitud,
              tipoServicio: item.tipoServicio,
              claveServicio: item.claveServicio,
              fecIniVigencia: item.fecIniVigencia,
              fecFinVigencia: item.fecFinVigencia
            } as unknown)) as ServicioAutorizado[];
        })
      )
      .subscribe({
        next: (datosAutorizados: ServicioAutorizado[]) => {
          this.datosAutorizados = datosAutorizados;
          this.ampliacionServiciosStore.datosAutorizados(this.datosAutorizados);
        },
        error: (error) => {
          ServiciosService.generarAlertaDeError('Error al cargar datos autorizados');
          console.error('Error loading authorized services:', error);
        }
      });
  }

    /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
   
    this.esHabilitarElDialogo = false;
  }
  /**
   * Método para cerrar el modal de eliminación.
   * @param {boolean} evento - Indica si se debe proceder con la eliminación.
   * @return {void}
   */
  cerrarModalEliminar(evento:boolean): void {
    if(evento===true){
    this.eliminarServiciosGrid();
    }
    this.esEliminar=false;
  }
/**
 * Actualiza el grid de empresas nacionales.
 * @method actualizaGridEmpresasNacionales
 * @return {void}
 * 
 */
  cerrarModalAgregar(): void {
    this.esAgregarDos=false;
  }

  /**
   * Elimina las empresas nacionales seleccionadas del grid.
   * @method eliminarEmpresasNacionales
   * @return {void}
   */

  cerrarEliminarDos(evento:boolean): void {
    if(evento===true){
    this.eliminarEmpresasNacionales();}
    this.esEliminarDos=false;
    
  }
  /**
   * Elimina las empresas nacionales seleccionadas del grid.
   * @method eliminarEmpresasNacionales
   * @return {void}
   */

  /**
   * Cierra la notificación de "no hay fila seleccionada".
   * Establece la propiedad `noRowSelected` en `false` para ocultar la notificación.
   * 
   * @method cerrarNoRow
   * @returns {void} Este método no retorna ningún valor.
   */
  cerrarNoRow(): void {
    this.noRowSelected=false;
  }
  /**
   * Cierra la notificación de fila no seleccionada.
   * @method cerrarNotSeleccainda
   * @return {void}
   * 
   */
  cerrarNotSeleccainda(): void {
    
    this.rowNotSeleccionada=false;
  }

  /**
   * Suscribe a los campos seleccionados del estado de `ampliacionServiciosQuery`
   * y actualiza las propiedades locales del componente con los valores obtenidos.
   *
   * @remarks
   * Este método agrega una suscripción al objeto `subscription` del componente,
   * lo que asegura que los valores de `rfcEmpresa`, `numeroPrograma` y `tiempoPrograma`
   * se mantengan sincronizados con el estado de la consulta.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  suscribirseAFields(): void {
    this.subscription.add(
      this.ampliacionServiciosQuery
        .select((state) => ({
          rfcEmpresa: state.rfcEmpresa,
          numeroPrograma: state.numeroPrograma,
          tiempoPrograma: state.tiempoPrograma,
        }))
        .subscribe((fields) => {
          this.rfcEmpresa = fields.rfcEmpresa;
          this.numeroPrograma = fields.numeroPrograma;
          this.tiempoPrograma = fields.tiempoPrograma;
        })
    );
  }

  /**
   * Obtiene los datos necesarios desde el servicio `ampliacionServiciosService`
   * y los almacena en el store `ampliacionServiciosStore`. Además, inicializa
   * el formulario con la información obtenida del store.
   *
   * @remarks
   * - Suscribe al observable proporcionado por `getDatos` del servicio.
   * - Convierte la respuesta en un objeto de tipo `ApiResponse`.
   * - Almacena la información de servicios en el store mediante `setInfoRegistro`.
   * - Llama a `initializeFormFromStore` para inicializar el formulario con los datos del store.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  getDatos(): void {
    this.ampliacionServiciosService.getDatos()
      .pipe(
        takeUntil(this.destroyNotifier$),
        shareReplay(1)
      )
      .subscribe({
        next: (respuesta) => {
          const RESPONSE = respuesta as unknown as ApiResponse;
          if (RESPONSE) {
            this.ampliacionServiciosStore.setInfoRegistro(RESPONSE.infoServicios);
            this.initializeFormFromStore();

          }
        },
        error: (_error) => {
          // Manejar el error apropiadamente
        }
      });
  }
  /**
   * Se suscribe al observable `selectDatosImmex$` del store para obtener los datos de IMMEX
   * de forma reactiva y mantener el componente actualizado con los cambios.
   *
   * @remarks
   * Este método actualiza la variable local `datosImmex` con los datos más recientes
   * proporcionados por el store.
   */
  suscribirseADatosImmex(): void {
    /**
     * @method suscribirseADatosImmex
     * @description
     * Se suscribe al observable `selectDatosImmex$` del store para obtener los datos de servicios IMMEX
     * de forma reactiva y mantener el componente actualizado con los cambios en el estado.
     *
     * @remarks
     * Este método actualiza la variable local `datosImmex` con los datos más recientes proporcionados por el store.
     *
     * @returns {void} Este método no retorna ningún valor.
     */
    this.ampliacionServiciosQuery.selectDatosImmex$.subscribe((datosImmex) => {
      this.datosImmex = datosImmex;
    });
  }
  /**
   * Inicializa el formulario `formularioInfoRegistro` con los datos obtenidos del store.
   *
   * Este método se suscribe al observable `selectInfoRegistro$` del query `ampliacionServiciosQuery`.
   * Cuando se emiten datos desde el store, se crea un formulario reactivo (`FormGroup`) con los valores
   * proporcionados y los campos se configuran como deshabilitados.
   *
   * @remarks
   * - Los campos inicializados en el formulario son:
   *   - `seleccionaLaModalidad`: Modalidad seleccionada, deshabilitada.
   *   - `folio`: Folio del registro, deshabilitado.
   *   - `ano`: Año del registro, deshabilitado.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  initializeFormFromStore(): void {
    /**
     * @property {FormGroup} formularioInfoRegistro
     * @description
     * Inicializa un formulario reactivo con los campos correspondientes a la información del registro.
     *
     * Los campos del formulario son:
     * - `seleccionaLaModalidad`: Campo deshabilitado que contiene la modalidad seleccionada.
     * - `folio`: Campo deshabilitado que contiene el folio del registro.
     * - `ano`: Campo deshabilitado que contiene el año del registro.
     *
     * @example
     * this.formularioInfoRegistro = this.fb.group({
     *   seleccionaLaModalidad: [{ value: infoRegistro.seleccionaLaModalidad, disabled: true }],
     *   folio: [{ value: infoRegistro.folio, disabled: true }],
     *   ano: [{ value: infoRegistro.ano, disabled: true }],
     * });
     */
    this.ampliacionServiciosQuery.selectInfoRegistro$.subscribe(
      (infoRegistro) => {
        this.formularioInfoRegistro = this.fb.group({
          seleccionaLaModalidad: [
            { value: infoRegistro.seleccionaLaModalidad, disabled: true },
          ],
          folio: [{ value: infoRegistro.folio, disabled: true }],
          ano: [{ value: infoRegistro.ano, disabled: true }],
        });
      }
    );
  }

  /**
   * @method inicializarFormularioInfoRegistro
   * @description
   * Inicializa el formulario `formularioInfoRegistro` con campos deshabilitados y valores vacíos.
   * Este formulario se utiliza para capturar y mostrar información relacionada con el registro.
   *
   * @remarks
   * Los campos inicializados en el formulario son:
   * - `seleccionaLaModalidad`: Campo deshabilitado que representa la modalidad seleccionada.
   * - `folio`: Campo deshabilitado que representa el folio del registro.
   * - `ano`: Campo deshabilitado que representa el año del registro.
   *
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * this.inicializarFormularioInfoRegistro();
   */
  inicializarFormularioInfoRegistro(): void {
    this.formularioInfoRegistro = this.fb.group({
      seleccionaLaModalidad: [{ value: '', disabled: true }],
      folio: [{ value: '', disabled: true }],
      ano: [{ value: '', disabled: true }],
    });
  }

  /**
   * Crea un formulario vacío con dos grupos de formularios, datosGenerales y domicilioFiscal.
   * @method crearFormulario
   */

  /**
   * Obtiene la lista de selección de ingreso.
   * @method obtenerIngresoSelectList
   */
  obtenerIngresoSelectList(tramite:string): void {
    /**
     * Obtiene la lista de selección de ingreso desde el servicio `ampliacionServiciosService`
     * y actualiza el estado global con los datos obtenidos.
     *
     * @method obtenerIngresoSelectList
     * @returns {void} Este método no retorna ningún valor.
     */
    this.catalogoServices
      .immexCatalogo(tramite)
      .pipe(
        takeUntil(this.destroyNotifier$),
        shareReplay(1)
      )
      .subscribe({
        next: (data) => {
          const DATOS = data.datos as Catalogo[];
          this.aduanaDeIngreso = DATOS;
          this.formulario.get('entidadFederativa')?.setValue(this.tramiteState?.aduanaDeIngresoSelecion?.id || this.predeterminado);
        },
        error: (error) => {
          console.error('Error loading immexCatalogo:', error);
        }
      });
  }
  
  /**
   * Guarda los datos del formulario y actualiza el estado del componente.
   * Si el formulario está en modo solo lectura, deshabilita los campos.
   * Si no, habilita los campos para permitir la edición.
   *
   * @method guardarDatosFormulario
   * @returns {void} Este método no retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormularioInfoRegistro();
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar=true;
    } else {
      this.campoDeshabilitar=false;
    }

}

  /**
   * Elimina servicios del grid.
   * @method eliminarServiciosGrid
   */
  eliminarServiciosGrid(): void {
    const INDICE = this.datosImmex.findIndex(
      (item: ServicioAmpliacion) =>
        item.idServicio ===
        this.domiciliosSeleccionados[0]?.['idServicio']
    );
    if (INDICE !== -1) {
      const DATOS_IMMEX_ACTUALIZADOS = [...this.datosImmex];
      DATOS_IMMEX_ACTUALIZADOS.splice(INDICE, 1);
      this.ampliacionServiciosStore.setDatosImmex(DATOS_IMMEX_ACTUALIZADOS);
      this.domiciliosSeleccionados = [];
      this.tablaA?.clearSelection();
     
    }
  }
  /**
   * Elimina las empresas nacionales seleccionadas del grid.
   * @method eliminarEmpresasNacionales
   * @return {void}
   */

  /**
   * Cierra la notificación de "no hay fila seleccionada" para la tabla C.
   * Establece la propiedad `noRowSelectedTablaC` en `false` para ocultar la notificación
   * específica de la tabla de empresas nacionales.
   * 
   * @method cerrarNoRowTablaC
   * @returns {void} Este método no retorna ningún valor.
   */
  cerrarNoRowTablaC(): void {
    this.noRowSelectedTablaC=false;
  }
  /**
   * Muestra una notificación de confirmación al intentar agregar un servicio duplicado.
   * @method doConfirmAgregar
   * @returns {void} Este método no retorna ningún valor.
   */
 
  doConfirmAgregar(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'El servicio que intenta ingresar ya ha sido registrado anteriormente.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.esHabilitarElDialogo = true;
  }
 /**
  * Muestra una notificación de confirmación al intentar eliminar un servicio.
  * @method doConfirmEliminar
  * @return {void} Este método no retorna ningún valor.
  */
  doConfirmEliminar(): void {
    if(this.domiciliosSeleccionados[0]?.idServicio===undefined || this.domiciliosSeleccionados.length === 0){
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Debe seleccionar el Servicio que desea eliminar',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.noRowSelected = true;

    }
    else{
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Esta seguro de eliminar el(los) servicio(s) seleccionado(s)?',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
      alineacionBtonoCerrar: 'justify-content-start flex-row-reverse'
    };
    this.esEliminar = true;}}
  /**
   * Muestra una notificación de confirmación al intentar agregar un servicio.
   * @method doAgregarDos
   * @return {void} Este método no retorna ningún valor.
   *  
   * */
    doAgregarDos(): void {
      if(this.rfcEmpresa.trim() === ''){
        this.formularioValidacionModal('Introduzca un RFC válido');
        return;
      } else if(this.numeroPrograma.trim() === ''){
        this.formularioValidacionModal('Introduzca un no. de Programa valido');
        return;
      } else if(this.tiempoPrograma.trim() === ''){
        this.formularioValidacionModal('Introduzca un Año valido');
        return;
      }else if((this.domiciliosSeleccionados.length===0 &&this.autorizadosSeleccionados.length===0)|| (this.domiciliosSeleccionados[0]?.idServicio===undefined&&this.autorizadosSeleccionados[0]?.idServicio===undefined)){
        this.formularioValidacionModal('Debe seleccionar un Servicio.');
        return;
      }

      this.actualizaGridEmpresasNacionales();
    }

/**
 * Muestra un modal de validación con un mensaje personalizado.
 * 
 * Este método configura y muestra una notificación modal de tipo alerta
 * con el mensaje proporcionado. Establece `rowNotSeleccionada` en `true`
 * para activar la visualización del modal.
 * 
 * @method formularioValidacionModal
 * @param {string} mensaje - El mensaje que se mostrará en el modal de validación
 * @returns {void} Este método no retorna ningún valor
 * 
 * @example
 * ```typescript
 * this.formularioValidacionModal('Debe seleccionar un servicio');
 * ```
 */
formularioValidacionModal(mensaje:string): void {
  this.rowNotSeleccionada = true;
  this.nuevaNotificacion = {
  tipoNotificacion: TipoNotificacionEnum.ALERTA,
  categoria: CategoriaMensaje.ALERTA,
  modo: 'modal',
  titulo: '',
  mensaje: mensaje,
  cerrar: false,
  txtBtnAceptar: 'Aceptar',
  txtBtnCancelar: '',
  };
}

    /**
     * Muestra una notificación de confirmación al intentar eliminar un servicio.
     * @method doEliminarDos
     * @return {void} Este método no retorna ningún valor.
     * */
    doEliminarDos(): void {
      if(this.empresasSeleccionados.length===0){
        this.nuevaNotificacion = {
          tipoNotificacion: TipoNotificacionEnum.ALERTA,
          categoria: CategoriaMensaje.ALERTA,
          modo: 'modal',
          titulo: '',
          mensaje: 'Selecciona un registro.',
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
          this.noRowSelectedTablaC = true;
      }
      else{
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: '¿Está seguro de eliminar el servicio seleccionado?',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.esEliminarDos = true;}}
    

 /**
   * Agrega servicios a la ampliación.
   * @method agregarServiciosAmpliacion
   */

  agregarServiciosAmpliacion(event?: Event): void {
    // Prevenir la propagación del evento para evitar activar la validación del formulario padre
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Verificar si se ha seleccionado un servicio
    if (!this.serviciosImmexServId || this.serviciosImmexServId === '-1') {
      this.formularioValidacionModal('Debe elegir en la pestaña de servicios, el servicio que se realizará a las mercancías a capturar');
      return;
    }

    const ID = this.serviciosImmexServId;
    
    // Verificar duplicados ANTES de realizar la llamada API
    const ISDUPLICATE = this.datosImmex.some(item => item.idServicio === ID);
    if (ISDUPLICATE) {
      this.doConfirmAgregar();
      return; 
    }

    const PAYLOAD = {
      servicio: ID,
      servicioSeleccionado: this.datosAutorizados.map(item => ({
        idServicio: Number(item.idServicio),
        claveServicio: Number(item.claveServicio)
      })),
      modalidad: this.tramiteID,
      idPrograma: "121517"
    };

    this.serviciosService.postServiciosImmexTabla(this.tramiteID, PAYLOAD).pipe(
      filter((data: BaseResponse<Partial<ServicioItemResponse[]>>) => {
        if (data.codigo !== '00') {
            this.notificacionesService.showNotification({
            tipoNotificacion: TipoNotificacionEnum.TOASTR,
            categoria: CategoriaMensaje.ERROR,
            modo: '',
            titulo: 'Error',
            mensaje: `${data.error}`,
            cerrar: true,
            txtBtnAceptar: '',
            txtBtnCancelar: ''
          });
          return false;
        }
        return true;
      }),
      map((data: BaseResponse<any>) => {
        return ((data.datos?.servicios ?? []))
          .filter((item:ServicioItemResponse): item is ServicioItemResponse => item !== undefined && item.descripcion !== null)
          .map((item:ServicioItemResponse) => ({
            idServicio: String(item.idServicio), // Convertir a string para coincidir con la interfaz
            descripcion: item.descripcion,
            tipoServicio: item.tipoServicio,
            descripcionTipo: item.descripcionTipo,
            claveServicio: item.claveServicio
          })) as unknown as ServicioAmpliacion[];
      }),
      filter((datosImmex: ServicioAmpliacion[]) => datosImmex.length > 0)
    ).subscribe({
      next: (datosImmex: ServicioAmpliacion[]) => {
        const CUERPODATOS: ServicioAmpliacion = {
          idServicio: String(datosImmex[0]?.idServicio || ID), // Convertir a string
          descripcion: datosImmex[0]?.descripcion,
          tipoServicio: datosImmex[0]?.tipoServicio,
          descripcionTipo: datosImmex[0]?.descripcionTipo,
          claveServicio: datosImmex[0]?.claveServicio,
          descripcionTestado: datosImmex[0]?.descripcionTestado ?? '',
          solicitud: datosImmex[0]?.solicitud ?? '',
          fecIniVigencia: datosImmex[0]?.fecIniVigencia ?? '',
          fecFinVigencia: datosImmex[0]?.fecFinVigencia ?? ''
        };

        // Actualizar el store con los nuevos datos
        this.ampliacionServiciosStore.setDatosImmex([
          ...this.datosImmex,
          CUERPODATOS,
        ]);
        
      }
    });
  }

  /**
   * Elimina empresas nacionales.
   * @method eliminarEmpresasNacionales
   */
  eliminarEmpresasNacionales(): void {
    const INDICE = (this.empresas as EmpresaNacional[]).findIndex(
      (item: EmpresaNacional) =>
        item.descripcionServicio ===
        this.empresasSeleccionados[0]?.descripcionServicio
    );
    if (INDICE !== -1) {
      const EMPRESAS_ACTUALIZADAS = [...this.empresas];
      EMPRESAS_ACTUALIZADAS.splice(INDICE, 1);
      this.ampliacionServiciosStore.setEmpresas(EMPRESAS_ACTUALIZADAS);
      this.empresasSeleccionados = [];
      this.tablaC?.clearSelection();
    }
    
  }

  /**
   * Actualiza el grid de empresas nacionales.
   * @method actualizaGridEmpresasNacionales
   */
  actualizaGridEmpresasNacionales(): void {
    this.serviciosService.postServiciosEmpresasNacionales(this.tramiteID,{
      rfcEmpresaNacional: this.rfcEmpresa,
      idServicio: this.domiciliosSeleccionados[0]?.idServicio ?? "8",
      descripcionServicio: this.domiciliosSeleccionados[0]?.descripcion || this.autorizadosSeleccionados[0]?.descripcion || "",
      modalidad: this.tramiteID,
      numeroPrograma: this.numeroPrograma,
      tiempoPrograma: this.tiempoPrograma,
      idServicioAutorizado: this.autorizadosSeleccionados[0]?.idServicio || ""
    })
      .pipe(
        takeUntil(this.destroyNotifier$),
        shareReplay(1),
        filter((data: BaseResponse<EmpresasNacionalesResponse>) => data.codigo === '00'),
        map((data: BaseResponse<EmpresasNacionalesResponse>) => {
          if(data?.datos?.empresasNacionales === null) {
            const ERROR_MSG = data?.datos?.resultado ? data.datos.resultado : data?.mensaje;
            this.notificacionesService.showNotification({
            tipoNotificacion: TipoNotificacionEnum.TOASTR,
            categoria: CategoriaMensaje.ERROR,
            modo: '',
            titulo: 'Error',
            mensaje: `${ERROR_MSG}`,
            cerrar: true,
            txtBtnAceptar: '',
            txtBtnCancelar: ''
          });
            return [];
          }
          const SERVICIOS_ITEMS = data.datos?.empresasNacionales || [];
          return SERVICIOS_ITEMS
            .filter((item: EmpresaNacional) => item.idServicio !== null && item.idServicio !== undefined)
            .map((item: EmpresaNacional) => ({
                idCompuestoEmpresa: item.idCompuestoEmpresa,
                idServicioAutorizado: item.idServicioAutorizado,
                idServicio: item.idServicio,
                descripcionServicio: item.descripcionServicio,
                rfc: item.rfc,
                razonSocial: item.razonSocial,
                numeroPrograma: item.numeroPrograma,
                tiempoPrograma: item.tiempoPrograma
            } as unknown)) as EmpresaNacional[];
        }
      ))
      .subscribe({
        next: (empresas: EmpresaNacional[]) => {
          // Actualizar solo el store con los nuevos datos sin duplicar
          this.ampliacionServiciosStore.setEmpresas(empresas);
          
          // Limpiar los campos del formulario
          this.rfcEmpresa = '';
          this.numeroPrograma = '';
          this.tiempoPrograma = '';
        }
      });  
  }
  

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Maneja los datos recibidos del componente hijo. 
   * @method procesarDatosDelHijo
   * @param {any} data - Datos recibidos.
   */
  procesarDatosDelHijo(): void {
    const ID= this.formulario.value.entidadFederativa;
    const SELECTED_DATOS = this.aduanaDeIngreso.find((item: Catalogo) => item.clave === ID);
    const DATOS = { id: ID, descripcion: SELECTED_DATOS?.descripcion ?? '' };
    this.serviciosImmexServId = ID;
    this.ampliacionServiciosStore.setAduanaDeIngresoSeleccion(DATOS as Catalogo);
  }

  /**
   * Selecciona domicilios.
   * @method seleccionarDomicilios
   * @param {any} domicilios - Domicilios seleccionados.
   */
  seleccionarDomicilios(servicio: ServicioAmpliacion): void {
    if (!servicio) {
      this.domiciliosSeleccionados = [];
      this.mercanciasSeleccionados = [];
      return;
    }
    
    this.domiciliosSeleccionados = [servicio];
    this.mercanciasSeleccionados = [Number(servicio.idServicio)];
    this.tablaB?.clearSelection();
  }
  /**
   * Selecciona autorizados.
   * @method seleccionarAutorizados
   * @param {any} autorizados - Autorizados seleccionados.
   */

  seleccionarAutorizados(autorizados: ServicioAutorizado): void {
    if (!autorizados) {
      this.autorizadosSeleccionados = [];
      this.tablaDosSeleccionados = [];
      return;
    }
    
    this.autorizadosSeleccionados= [{ ...autorizados }];
    this.tablaDosSeleccionados = [Number(autorizados.idServicio)];
    this.tablaA?.clearSelection();
  }

  /**
   * Selecciona empresas.
   * @method seleccionarEmpresas
   * @param {any} empresas - Empresas seleccionadas.
   */
  seleccionarEmpresas(empresas: EmpresaNacional): void {
    if (!empresas) {
      this.empresasSeleccionados = [];
      return;
    }
    
    this.empresasSeleccionados = [{ ...empresas }];
  }
}

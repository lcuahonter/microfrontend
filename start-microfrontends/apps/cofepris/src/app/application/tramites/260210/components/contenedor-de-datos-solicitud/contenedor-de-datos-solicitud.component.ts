import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, RegistroSolicitudService } from '@ng-mf/data-access-user';
import {
  DatosDeTablaSeleccionados,
  DatosSolicitudFormState,
  TablaMercanciasDatos,
  TablaOpcionConfig,
  TablaScianConfig,
  TablaSeleccion,
} from '../../../../shared/models/datos-solicitud.model';
import {
  OPCION_TABLA,
  PRODUCTO_TABLA,
  SCIAN_TABLA,
} from '../../../../shared/constantes/datos-solicitud.enum';
import {
  Tramite260210State,
  Tramite260210Store,
} from '../../estados/tramite260210Store.store';
import { distinctUntilChanged, map, takeUntil } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { Subject } from 'rxjs';
import { Tramite260210Query } from '../../estados/tramite260210Query.query';
import { ViewChild } from '@angular/core';

/**
 * @component ContenedorDeDatosSolicitudComponent
 * @description Componente contenedor que orquesta las interacciones del usuario
 * para ingresar y gestionar "datos de la solicitud".
 * Integra el `DatosDeLaSolicitudComponent` y sincroniza los datos
 * con el estado global gestionado por `Tramite260210Store`.
 **/
@Component({
  selector: 'app-contenedor-de-datos-solicitud',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  templateUrl: './contenedor-de-datos-solicitud.component.html',
  styleUrl: './contenedor-de-datos-solicitud.component.scss',
   providers: [RegistroSolicitudService],
})
export class ContenedorDeDatosSolicitudComponent implements OnInit, OnDestroy {
  /**
   * @property elementosRequeridos
   * @description Arreglo de campos requeridos para el formulario de datos de la solicitud,
   * utilizado para propósitos de validación.
   * @type {string[]}
   */
  elementosRequeridos = [
    'denominacionRazon',
    'scian',
    'correoElectronico',
    'manifesto'
  ];
  /**
   * @property destroyNotifier$
   * @description Subject utilizado para cancelar suscripciones de observables
   * de manera elegante cuando el componente es destruido.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property tramiteState
   * @description Contiene el estado actual del proceso "Tramite 260210",
   * recuperado del store a través de `Tramite260210Query`.
   * @type {Tramite260210State}
   */
  public tramiteState!: Tramite260210State;

  /**
   * @property opcionConfig
   * @description Objeto de configuración para la tabla de "opciones",
   * incluye el tipo de selección, configuración de tabla y arreglo de datos.
   */
  public opcionConfig = {
    tipoSeleccionTabla: undefined,
    configuracionTabla: OPCION_TABLA,
    datos: [] as TablaOpcionConfig[],
  };

  /**
   * @property scianConfig
   * @description Objeto de configuración para la tabla SCIAN,
   * incluye el tipo de selección, configuración de tabla y arreglo de datos.
   */
  public scianConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: SCIAN_TABLA,
    datos: [] as TablaScianConfig[],
  };

  /**
   * @property tablaMercanciasConfig
   * @description Objeto de configuración para la tabla de "mercancías",
   * incluye el tipo de selección, configuración de tabla y arreglo de datos.
   */
  public tablaMercanciasConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: PRODUCTO_TABLA,
    datos: [] as TablaMercanciasDatos[],
  };

  /**
   * @property scianConfigDatos
   * @description Almacena la lista de configuraciones de tabla SCIAN
   * actualmente en uso dentro del componente.
   * @type {TablaScianConfig[]}
   */
  public scianConfigDatos: TablaScianConfig[] = [];

  /**
   * @property tablaMercanciasConfigDatos
   * @description Almacena la lista de objetos de datos de "mercancías"
   * actualmente en uso dentro del componente.
   * @type {TablaMercanciasDatos[]}
   */
  public tablaMercanciasConfigDatos: TablaMercanciasDatos[] = [];

  /**
   * @property seleccionadoopcionDatos
   * @description Almacena los datos de "opciones" seleccionados provenientes de la tabla.
   * @type {TablaOpcionConfig[]}
   */
  public seleccionadoopcionDatos: TablaOpcionConfig[] = [];

  /**
   * @property seleccionadoScianDatos
   * @description Almacena los datos SCIAN seleccionados provenientes de la tabla.
   * @type {TablaScianConfig[]}
   */
  public seleccionadoScianDatos: TablaScianConfig[] = [];

  /**
   * @property seleccionadoTablaMercanciasDatos
   * @description Almacena los datos de "mercancías" seleccionados
   * provenientes de la tabla respectiva.
   * @type {TablaMercanciasDatos[]}
   */
  public seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[] = [];

  /**
   * @property idProcedimiento
   * @description ID del procedimiento actual, definido como una propiedad de solo lectura.
   * @type {string | number}
   * @readonly
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

   /**
       * @property {DatosDeLaSolicitudComponent} datosDeLaSolicitudComponent
       * @description
       * Referencia al componente hijo `DatosDeLaSolicitudComponent` obtenida
       * mediante el decorador `@ViewChild`.
       *
       * Esta propiedad permite acceder a los métodos públicos y propiedades
       * del componente hijo, por ejemplo para validar formularios o recuperar datos.
       *
       * > Nota: Angular inicializa esta referencia después de que la vista
       * ha sido renderizada, normalmente en el ciclo de vida `ngAfterViewInit`.
       */
      @ViewChild(DatosDeLaSolicitudComponent)
      datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;
   

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @constructor
   * @description Inicializa las dependencias y servicios utilizados dentro de este componente.
   *
   * @param {Tramite260210Query} Tramite260210Query - Servicio de consulta para recuperar el estado
   * actual del "Tramite 260210" desde el store.
   * @param {Tramite260210Store} Tramite260210Store - Servicio de store para actualizar el
   * estado del "Tramite 260210" con los datos seleccionados del componente.
   */
  constructor(
    private tramite260210Query: Tramite260210Query,
    private tramite260210Store: Tramite260210Store,
    private consultaQuery: ConsultaioQuery,
    private registroSolicitudService: RegistroSolicitudService,
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida de Angular que se ejecuta una vez que el componente es inicializado.
   * Se suscribe a los cambios de estado del "Tramite260210" y actualiza los objetos de configuración
   * locales del componente con datos del store.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.cargarTablaOpcionConfigSolicitud();
    this.tramite260210Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        distinctUntilChanged((prev, curr) => {
          // Solo activa actualizaciones cuando los arreglos de datos principales realmente cambien
          // Verifica si opcionConfigDatos, scianConfigDatos, o tablaMercanciasConfigDatos han cambiado
          const PREV_OPCION = JSON.stringify(prev.opcionConfigDatos || []);
          const CURR_OPCION = JSON.stringify(curr.opcionConfigDatos || []);
          const PREV_SCIAN = JSON.stringify(prev.scianConfigDatos || []);
          const CURR_SCIAN = JSON.stringify(curr.scianConfigDatos || []);
          const PREV_MERCANCIAS = JSON.stringify(prev.tablaMercanciasConfigDatos || []);
          const CURR_MERCANCIAS = JSON.stringify(curr.tablaMercanciasConfigDatos || []);
          
          return PREV_OPCION === CURR_OPCION && 
                 PREV_SCIAN === CURR_SCIAN && 
                 PREV_MERCANCIAS === CURR_MERCANCIAS;
        }),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.opcionConfig.datos = this.tramiteState.opcionConfigDatos ?? [];
          this.scianConfig.datos = this.tramiteState.scianConfigDatos ?? [];
          this.tablaMercanciasConfig.datos =
            JSON.parse(JSON.stringify(this.tramiteState.tablaMercanciasConfigDatos)) ?? [];
        })
      )
      .subscribe();
  }

enIdSolicitudPrellenado($event:number): void {
    const SOLICITUDE_ID = $event;
    this.registroSolicitudService.parcheOpcionesPrellenadas(260210, SOLICITUDE_ID).subscribe((res:any) => {
      if(res && res.datos){
        GuardarMappingAdapter.patchToStore(res.datos, this.tramite260210Store);
      }
    });
  }
  
  /**
   * Maneja el evento cuando se selecciona una opción en la tabla.
   *
   * @param event - Un arreglo de configuraciones de opciones de la tabla (`TablaOpcionConfig[]`)
   *                que representa las opciones seleccionadas.
   *
   * Actualiza la configuración de datos en el store `Tramite260210Store`
   * con las opciones seleccionadas.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    // Actualizar el estado local primero para evitar activar la suscripción del store
    this.seleccionadoopcionDatos = event;
    // Solo actualizar el store con datos reales, no estados de selección
    this.tramite260210Store.updateOpcionConfigDatos(event);
  }

  /**
   * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
   *
   * @param event - Arreglo de configuraciones seleccionadas de la tabla SCIAN.
   *
   * Este método actualiza los datos de configuración SCIAN en el estado del trámite 260210
   * utilizando el evento proporcionado.
   */
  scianSeleccionado(event: TablaScianConfig[]): void {
    // Actualizar el estado local primero para evitar activar la suscripción del store
    this.seleccionadoScianDatos = event;
    // Solo actualizar el store con datos reales, no estados de selección
    this.tramite260210Store.updateScianConfigDatos(event);
  }
  /**
   * Maneja el evento de selección de mercancías en la tabla.
   *
   * @param event - Arreglo de objetos de tipo `TablaMercanciasDatos` que contiene
   *                los datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    // Actualizar el estado local primero para evitar activar la suscripción del store  
    this.seleccionadoTablaMercanciasDatos = event;
    // Solo actualizar el store con datos reales, no estados de selección
    this.tramite260210Store.updateTablaMercanciasConfigDatos(event);
  }

  /**
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param event - El nuevo estado del formulario de datos de la solicitud de tipo `DatosSolicitudFormState`.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260210Store.updateDatosSolicitudFormState(event);
  }

  /**
   * Actualiza el estado de la tienda `Tramite260210Store` con los datos seleccionados
   * provenientes del evento de la tabla.
   *
   * @param event - Objeto que contiene las opciones seleccionadas, los datos SCIAN seleccionados
   * y las mercancías seleccionadas de la tabla.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    // Actualizar el estado local primero para evitar activadores innecesarios del store
    this.seleccionadoopcionDatos = event.opcionSeleccionados;
    this.seleccionadoScianDatos = event.scianSeleccionados;
    this.seleccionadoTablaMercanciasDatos = event.mercanciasSeleccionados;
    
    // Solo actualizar el store si hay cambios reales para evitar activar la suscripción
    const CURRENT_STATE = this.tramiteState;
    const HAS_CHANGES = 
      JSON.stringify(CURRENT_STATE?.seleccionadoopcionDatos || []) !== JSON.stringify(event.opcionSeleccionados) ||
      JSON.stringify(CURRENT_STATE?.seleccionadoScianDatos || []) !== JSON.stringify(event.scianSeleccionados) ||
      JSON.stringify(CURRENT_STATE?.seleccionadoTablaMercanciasDatos || []) !== JSON.stringify(event.mercanciasSeleccionados) ||
      CURRENT_STATE?.opcionesColapsableState !== event.opcionesColapsableState;
    
    if (HAS_CHANGES) {
      this.tramite260210Store.update((state) => ({
        ...state,
        seleccionadoopcionDatos: event.opcionSeleccionados,
        seleccionadoScianDatos: event.scianSeleccionados,
        seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
        opcionesColapsableState: event.opcionesColapsableState,
      }));
    }
  }

   /**
   * @description
   * Método que se encarga de validar el formulario contenido en
   * el componente `DatosDeLaSolicitudComponent`.
   *
   * Utiliza el método `formularioSolicitudValidacion()` del componente hijo
   * para comprobar si el formulario es válido.
   * En caso de que el hijo no esté inicializado o devuelva `null/undefined`,
   * se retorna `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el formulario es válido.
   * - `false`: si el formulario no es válido o el componente hijo aún no está disponible.
   */
   validarContenedor(): boolean {
    return (
      this.datosDeLaSolicitudComponent?.formularioSolicitudValidacion() ?? false
    );
  }


  cargarTablaOpcionConfigSolicitud(): void {    
    this.registroSolicitudService.cargarOpcionesPrellenadoSolicitud(260213, 'AAL0409235E6').subscribe((res:BaseResponse<unknown>) => {
      const DATOS = res.datos as TablaOpcionConfig[];
      
      // Procesar los datos para manejar valores nulos en el proveedor
      const DATOS_PROCESADOS = DATOS.map(item => ({
        ...item,
        proveedor: item.proveedor && item.proveedor.trim() !== '' ? item.proveedor : 'N/A'
      }));
      
      this.opcionConfig.datos = DATOS_PROCESADOS;
      this.opcionSeleccionado(DATOS_PROCESADOS);
    });
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

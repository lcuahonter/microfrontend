import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { DatosDeTablaSeleccionados, DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig, TablaSeleccion } from '../../../../shared/models/datos-solicitud.model';
import { OPCION_TABLA, PRODUCTO_TABLA, SCIAN_TABLA } from '../../../../shared/constantes/datos-solicitud.enum';
import { Tramite260212State, Tramite260212Store } from '../../estados/tramite260212.store';
import { distinctUntilChanged, map, takeUntil } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { GuardarAdapter_260212 } from '../../adapters/guardar-mapping.adapter';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { Subject } from 'rxjs';
import { Tramite260212Query } from '../../estados/tramite260212.query';
import { ViewChild } from '@angular/core';

/**
 * @component ContenedorDeDatosSolicitudComponent
 * @description Container component that orchestrates user interactions
 * for entering and managing “datos de la solicitud” (request data).
 * Integrates the `DatosDeLaSolicitudComponent` and synchronizes data
 * with the global state managed by `Tramite260212Store`.
 **/
@Component({
  selector: 'app-contenedor-de-datos-solicitud',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  templateUrl: './contenedor-de-datos-solicitud.component.html',
  styleUrl: './contenedor-de-datos-solicitud.component.scss',
})
export class ContenedorDeDatosSolicitudComponent implements OnInit, OnDestroy {
  /**
     * @property {string} idProcedimiento
     * @description
     * Identificador del procedimiento.
     */
    public readonly idProcedimiento = ID_PROCEDIMIENTO;
      /**
     * @property {boolean} formularioDeshabilitado
     * @description
     * Indica si el formulario está deshabilitado. Por defecto es `false`.
     */
    formularioDeshabilitado: boolean = false;
  
  
    
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
    @ViewChild(DatosDeLaSolicitudComponent) datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;
    /**
     * Sujeto utilizado como notificador para destruir suscripciones y evitar fugas de memoria.
     * Este observable se completa cuando el componente se destruye.
     */
    private destroyNotifier$: Subject<void> = new Subject();
    /**
     * Representa el estado actual del trámite 260212.
     * 
     * @type {Tramite260212State}
     * @public
     */
    public tramiteState!: Tramite260212State;
  
    /**
     * Configuración de opciones para la tabla.
     * 
     * @property {undefined} tipoSeleccionTabla - Define el tipo de selección en la tabla. Actualmente no está definido.
     * @property {typeof OPCION_TABLA} configuracionTabla - Configuración predeterminada de la tabla basada en la constante `OPCION_TABLA`.
     * @property {TablaOpcionConfig[]} datos - Arreglo que contiene los datos de configuración de la tabla.
     */
    public opcionConfig = {
      tipoSeleccionTabla: undefined,
      configuracionTabla: OPCION_TABLA,
      datos: [] as TablaOpcionConfig[],
    }
    /**
     * Configuración para la tabla SCIAN en el componente.
     * 
     * - `tipoSeleccionTabla`: Define el tipo de selección que se puede realizar en la tabla. 
     *   En este caso, se utiliza una selección de tipo CHECKBOX.
     * - `configuracionTabla`: Especifica la configuración de la tabla SCIAN, 
     *   que se define en la constante `SCIAN_TABLA`.
     * - `datos`: Contiene un arreglo de configuraciones de tipo `TablaScianConfig`. 
     *   Inicialmente, este arreglo está vacío.
     */
    public scianConfig = {
      tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
      configuracionTabla: SCIAN_TABLA,
      datos: [] as TablaScianConfig[],
    }
    /**
     * Configuración para la tabla de mercancías.
     * 
     * @property {TablaSeleccion} tipoSeleccionTabla - Define el tipo de selección que se puede realizar en la tabla (en este caso, CHECKBOX).
     * @property {any} configuracionTabla - Configuración específica de la tabla, basada en la constante PRODUCTO_TABLA.
     * @property {TablaMercanciasDatos[]} datos - Arreglo que contiene los datos de la tabla, inicialmente vacío.
     */
    public tablaMercanciasConfig = {
      tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
      configuracionTabla: PRODUCTO_TABLA,
      datos: [] as TablaMercanciasDatos[],
    }
    /**
     * Configuración de la tabla SCIAN.
     * 
     * Esta propiedad almacena un arreglo de configuraciones para la tabla SCIAN,
     * que se utiliza para gestionar y mostrar datos relacionados con el catálogo
     * del Sistema de Clasificación Industrial de América del Norte (SCIAN).
     */
    public scianConfigDatos: TablaScianConfig[] = [];
    /**
     * Configuración de datos para la tabla de mercancías.
     * 
     * Esta propiedad almacena un arreglo de objetos del tipo `TablaMercanciasDatos`,
     * que representan los datos necesarios para configurar y mostrar la tabla
     * de mercancías en el componente.
     */
    public tablaMercanciasConfigDatos: TablaMercanciasDatos[] = [];
    /**
     * Arreglo que almacena la configuración de opciones de la tabla.
     * 
     * Este arreglo se utiliza para gestionar las opciones seleccionadas
     * en la tabla dentro del componente. Cada elemento del arreglo es 
     * de tipo `TablaOpcionConfig`, que define la estructura de las opciones.
     */
    public seleccionadoopcionDatos: TablaOpcionConfig[] = [];
    /**
     * Arreglo que almacena la configuración de datos seleccionados de la tabla SCIAN.
     * 
     * Este arreglo se utiliza para gestionar y almacenar los datos seleccionados
     * relacionados con la tabla SCIAN en el componente.
     */
    public seleccionadoScianDatos: TablaScianConfig[] = [];
  
  /**
     * que indica si el formulario está en modo solo lectura.
     * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
     *
     * @type {boolean}
     */
    esFormularioSoloLectura!: boolean;
    /**
     * Arreglo que almacena los datos seleccionados de la tabla de mercancías.
     * 
     * Este arreglo contiene objetos de tipo `TablaMercanciasDatos` que representan
     * los elementos seleccionados en la tabla correspondiente. Se utiliza para 
     * gestionar y manipular los datos seleccionados en el contexto de la solicitud.
     */
    public seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[] = [];
  
    /**
    * Arreglo que almacena los elementos requeridos para la solicitud.
    */
    public elementosRequeridos = ['rfcSanitario', 'denominacionRazon', 'correoElectronico'];
    /**
     * Identificador del procedimiento.
     */
    public procedureId!: number;
    /**
     * Constructor de la clase ContenedorDeDatosSolicitudComponent.
     * 
     * Este constructor inicializa las dependencias necesarias para el componente.
     * 
     * @param tramite260212Query - Servicio para realizar consultas relacionadas con el trámite 260212.
     * @param tramite260212Store - Almacén para gestionar el estado del trámite 260212.
     * @param consultaQuery - Servicio para realizar consultas adicionales relacionadas con la aplicación.
     */
    constructor(public tramite260212Query: Tramite260212Query,
      public tramite260212Store: Tramite260212Store,
      public consultaQuery: ConsultaioQuery,
      private registroSolicitudService: RegistroSolicitudService,
    ) {
       this.consultaQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => { 
            this.formularioDeshabilitado = seccionState.readonly;
          })
        )
        .subscribe();
     }
  
    /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * 
     * Este método realiza las siguientes acciones:
     * 
     * 1. Suscribe al estado del trámite (`tramite260212Query.selectTramiteState$`) y actualiza las configuraciones
     *    de datos del componente (`opcionConfig`, `scianConfig`, `tablaMercanciasConfig`) basándose en el estado
     *    del trámite recibido. La suscripción se completa automáticamente cuando el observable `destroyNotifier$` emite un valor.
     * 
     * 2. Configura la propiedad `esFormularioSoloLectura` como un observable que determina si el formulario debe
     *    estar en modo solo lectura. Esto se basa en el estado de consulta (`consultaQuery.selectConsultaioState$`),
     *    verificando si el trámite no está en modo creación (`create`) y si el `procedureId` corresponde a '260212'.
     *    En caso de cumplir estas condiciones, se asigna el valor de `readonly` del estado de consulta; de lo contrario,
     *    se asigna `false`.
     * 
     * @returns void
     */
    ngOnInit(): void {
      this.cargarTablaOpcionConfigSolicitud();
      this.tramite260212Query.selectTramiteState$
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
            this.opcionConfig.datos = this.tramiteState.opcionConfigDatos;
            this.scianConfig.datos = this.tramiteState.scianConfigDatos;
            this.tablaMercanciasConfig.datos = JSON.parse(JSON.stringify(this.tramiteState.tablaMercanciasConfigDatos));
          })
        ).subscribe();
  
    }
  
    enIdSolicitudPrellenado($event:number): void {
      const SOLICITUDE_ID = $event;
      this.registroSolicitudService.parcheOpcionesPrellenadas(260212, SOLICITUDE_ID).subscribe((res:any) => {
        if(res && res.datos){
          GuardarAdapter_260212.patchToStore(res.datos, this.tramite260212Store);
        }
      });
    }
    /**
     * Maneja el evento cuando se selecciona una opción en la tabla.
     * 
     * @param event - Un arreglo de configuraciones de opciones de la tabla (`TablaOpcionConfig[]`) 
     *                que representa las opciones seleccionadas.
     * 
     * Actualiza la configuración de datos en el store `tramite260212Store` 
     * con las opciones seleccionadas.
     */
    opcionSeleccionado(event: TablaOpcionConfig[]): void {
      this.seleccionadoopcionDatos = event;
      this.tramite260212Store.updateOpcionConfigDatos(event);
    }
  
    /**
     * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
     * 
     * @param event - Arreglo de configuraciones seleccionadas de la tabla SCIAN.
     * 
     * Este método actualiza los datos de configuración SCIAN en el estado del trámite 260212
     * utilizando el evento proporcionado.
     */
    scianSeleccionado(event: TablaScianConfig[]): void {
      this.seleccionadoScianDatos = event;
      this.tramite260212Store.updateScianConfigDatos(event);
    }
  
    /**
     * Maneja el evento de selección de mercancías en la tabla.
     * 
     * @param event - Arreglo de objetos de tipo `TablaMercanciasDatos` que contiene 
     *                los datos seleccionados en la tabla de mercancías.
     */
    mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
      this.seleccionadoTablaMercanciasDatos = event;
      this.tramite260212Store.updateTablaMercanciasConfigDatos(event);
    }
  
  
    /**
     * Actualiza el estado del formulario de datos de la solicitud en el store.
     *
     * @param event - El nuevo estado del formulario de datos de la solicitud de tipo `DatosSolicitudFormState`.
     */
    datasolicituActualizar(event: DatosSolicitudFormState): void {
      this.tramite260212Store.updateDatosSolicitudFormState(event);
    }
  
    /**
     * Actualiza el estado de la tienda `tramite260212Store` con los datos seleccionados
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
        this.tramite260212Store.update((state) => ({
          ...state,
          seleccionadoopcionDatos: event.opcionSeleccionados,
          seleccionadoScianDatos: event.scianSeleccionados,
          seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
          opcionesColapsableState: event.opcionesColapsableState,
        }));
      }
    }
    
     cargarTablaOpcionConfigSolicitud(): void {    
      this.registroSolicitudService.cargarOpcionesPrellenadoSolicitud(this.idProcedimiento, 'AAL0409235E6').subscribe((res:BaseResponse<unknown>) => {
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
  }
import { BehaviorSubject, Subject,Subscription,map, takeUntil } from 'rxjs';
import {
  Catalogo,
  CatalogoServices,
  ConfiguracionColumna,
  ConsultaioQuery,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  doDeepCopy,
  esValidArray,
  esValidObject,
  
} from '@ng-mf/data-access-user';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PLANTAS_TABLA_CONFIGURACION,SUBFABRICANTE_TABLA_CONFIGURACION } from '../../constantes/subfabricante-tabla-configuracion.enum';
import {PlantasDireccionModelo,SubfabricanteDireccionModelo
} from '../../modelos/subfabricante.model';
import {CatalogoSelectComponent} from '@libs/shared/data-access-user/src'
import { CommonModule } from '@angular/common';
import { SubfabricanteService } from '../../servicios/servicios-subfabricante.service';
import { Tramites80207Queries } from '../../estados/tramite80207.query';
import { Tramites80207Store } from '../../estados/tramite80207.store';

/**
 * @fileoverview Componente especializado para la gestión integral de empresas submanufactureras.
 * @description
 * Este archivo contiene la implementación completa del componente que maneja toda la lógica
 * relacionada con la administración de empresas submanufactureras en el trámite 80207.
 * Incluye funcionalidades de búsqueda, selección, agregación y eliminación de plantas submanufactureras.
 * 
 * @module EmpresasSubmanufactureras
 * @tramite 80207
 * @version 1.0.0
 * @author Sistema VUCEM
 */

/**
 * @class EmpresasSubFabricanteComponent
 * @description
 * Componente principal para la gestión completa de empresas submanufactureras dentro del trámite 80207.
 * Proporciona una interfaz interactiva para buscar, seleccionar y administrar plantas submanufactureras
 * que participan en operaciones IMMEX (Industria Manufacturera, Maquiladora y de Servicios de Exportación).
 * 
 * @implements {OnInit} - Interfaz para inicialización del componente
 * @implements {OnDestroy} - Interfaz para limpieza de recursos al destruir el componente
 * 
 * @functionality
 * - **Búsqueda de subfabricantes**: Permite buscar empresas por RFC y estado
 * - **Gestión de formularios**: Maneja formularios reactivos para captura de datos
 * - **Administración de tablas**: Controla visualización de tablas dinámicas
 * - **Validación de datos**: Implementa validaciones en tiempo real
 * - **Gestión de estado**: Integra con store Akita para manejo de estado reactivo
 * 
 * @business_rules
 * - RFC debe ser válido y estar registrado en el sistema
 * - Estado debe ser seleccionado de catálogo oficial
 * - Al menos una planta debe ser seleccionada para agregar
 * - Validación de permisos para operaciones IMMEX
 * 
 * @user_experience
 * - Interfaz responsiva con validación en tiempo real
 * - Notificaciones informativas para guiar al usuario
 * - Tablas interactivas con selección múltiple
 * - Modo solo lectura para consulta de información
 */

@Component({
  selector: 'app-empresas-subfabricante',
  templateUrl: './empresas-subfabricante.component.html',
  styleUrls: ['./empresas-subfabricante.component.scss'],
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    NotificacionesComponent
  ],
  providers: [SubfabricanteService]
})
export class EmpresasSubFabricanteComponent implements OnInit, OnDestroy {
    /**
     * @property {Notificacion} nuevaNotificacion
     * @description
     * Objeto que almacena la configuración de notificaciones del sistema para mostrar
     * mensajes informativos, de advertencia o error al usuario durante las operaciones.
     * 
     * @usage
     * Se utiliza para mostrar mensajes como:
     * - Validaciones de formulario
     * - Confirmaciones de eliminación
     * - Errores de servicio
     * - Mensajes informativos de proceso
     * 
     * @example
     * ```typescript
     * this.nuevaNotificacion = {
     *   tipoNotificacion: 'alert',
     *   categoria: 'warning',
     *   mensaje: 'Debe introducir el RFC',
     *   txtBtnAceptar: 'Aceptar'
     * };
     * ```
     */
    public nuevaNotificacion!: Notificacion;

  /**
   * @property {FormGroup} formularioInfoRegistro
   * @description
   * Formulario reactivo que contiene la información básica de registro del trámite.
   * Incluye datos como modalidad, folio y año, los cuales son de solo lectura
   * ya que provienen del sistema y no pueden ser modificados por el usuario.
   * 
   * @fields
   * - **modalidad**: Tipo de modalidad del trámite (disabled)
   * - **folio**: Número de folio asignado automáticamente (disabled)
   * - **ano**: Año de registro del trámite (disabled)
   * 
   * @readonly true
   * @validation No requiere validaciones ya que es informativo
   */
  formularioInfoRegistro!: FormGroup;

  /**
   * @property {FormGroup} formularioDatosSubcontratista
   * @description
   * Formulario reactivo principal para capturar los datos del subcontratista.
   * Permite al usuario ingresar RFC y seleccionar estado para realizar búsquedas
   * de empresas submanufactureras disponibles en el sistema.
   * 
   * @fields
   * - **rfc**: RFC de la empresa submanufacturera (required)
   * - **estado**: Estado de la federación donde opera (required)
   * 
   * @validation
   * - RFC: Campo obligatorio, debe seguir formato oficial
   * - Estado: Selección obligatoria de catálogo oficial
   * 
   * @integration
   * Los valores se sincronizan automáticamente con el store para mantener
   * el estado global de la aplicación actualizado.
   */
  formularioDatosSubcontratista!: FormGroup;


  /**
   * @property {Catalogo[]} estadoCatalogo
   * @description
   * Catálogo de estados de la República Mexicana obtenido del servicio oficial.
   * Se utiliza para poblar el dropdown de selección de estados en el formulario
   * de búsqueda de subfabricantes.
   * 
   * @source Servicio de catálogos gubernamentales
   * @format Array de objetos Catalogo con id, nombre y descripción
   * @initialization Se carga automáticamente al inicializar el componente
   * 
   * @example
   * ```typescript
   * [
   *   { id: '01', nombre: 'Aguascalientes', descripcion: 'Estado de Aguascalientes' },
   *   { id: '02', nombre: 'Baja California', descripcion: 'Estado de Baja California' }
   * ]
   * ```
   */
  estadoCatalogo: Catalogo[] = [];

  /**
   * @property {TablaSeleccion} tablaSeleccion
   * @description
   * Configuración del tipo de selección para las tablas dinámicas del componente.
   * Define que las tablas utilizarán checkboxes para permitir selección múltiple
   * de registros por parte del usuario.
   * 
   * @value TablaSeleccion.CHECKBOX
   * @purpose Permite selección múltiple de plantas subfabricantes
   * @behavior Los usuarios pueden seleccionar uno o más registros simultáneamente
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * @property {ConfiguracionColumna<SubfabricanteDireccionModelo>[]} configuracionTabla
   * @description
   * Configuración de columnas para la tabla de subfabricantes disponibles.
   * Define la estructura, formato y comportamiento de cada columna que se mostrará
   * en la tabla de resultados de búsqueda de empresas submanufactureras.
   * 
   * @source SUBFABRICANTE_TABLA_CONFIGURACION constante importada
   * @includes Configuración de headers, tipos de datos, ancho de columnas
   * @purpose Estructura la presentación de datos de subfabricantes
   */
  configuracionTabla: ConfiguracionColumna<SubfabricanteDireccionModelo>[] =
  SUBFABRICANTE_TABLA_CONFIGURACION;

 /**
  * @property {ConfiguracionColumna<PlantasDireccionModelo>[]} configuracionTablaPlantas
  * @description
  * Configuración de columnas para la tabla de plantas seleccionadas.
  * Define la estructura visual y funcional de la tabla que muestra las plantas
  * que han sido agregadas al trámite para operaciones IMMEX.
  * 
  * @source PLANTAS_TABLA_CONFIGURACION constante importada
  * @includes Headers, tipos de columna, formateo de datos
  * @purpose Estructura la visualización de plantas agregadas al trámite
  * @interaction Permite operaciones de eliminación de plantas seleccionadas
  */
  configuracionTablaPlantas: ConfiguracionColumna<PlantasDireccionModelo>[] =
  PLANTAS_TABLA_CONFIGURACION;

  /**
   * @property {SubfabricanteDireccionModelo[]} datosDelSubfabricanteSeleccionado
   * @description
   * Array que almacena temporalmente los registros de subfabricantes que el usuario
   * ha seleccionado en la tabla de búsqueda. Estos datos se utilizan como paso
   * intermedio antes de agregarlos definitivamente al trámite.
   * 
   * @state Temporal - se limpia después de agregar plantas
   * @interaction Se actualiza cuando el usuario selecciona checkboxes en la tabla
   * @validation Debe contener al menos un registro para permitir agregar plantas
   * @flow búsqueda → selección → temporal → agregación → limpieza
   */
  datosDelSubfabricanteSeleccionado: SubfabricanteDireccionModelo[] = [];

  /**
   * @property {SubfabricanteDireccionModelo[]} datosSubfabricanteParaSerAgregados
   * @description
   * Colección de datos de subfabricantes que están listos para ser agregados
   * al trámite. Representa el estado intermedio entre la selección del usuario
   * y la confirmación final de agregación.
   * 
   * @purpose Buffer de datos antes de persistir en el store
   * @lifecycle Se llena con selecciones del usuario y se vacía tras confirmación
   * @synchronization Se sincroniza con el store global al confirmar cambios
   */
  datosSubfabricanteParaSerAgregados: SubfabricanteDireccionModelo[] = [];

  /**
   * @property {PlantasDireccionModelo[]} datosPlantasParaSerAgregados
   * @description
   * Array principal que contiene todas las plantas subfabricantes que han sido
   * agregadas al trámite. Este es el dataset definitivo que se utiliza para
   * mostrar la tabla de plantas seleccionadas y realizar operaciones IMMEX.
   * 
   * @persistence Se sincroniza con el store para persistencia
   * @operations Soporta agregación y eliminación de plantas
   * @validation Cada planta debe tener datos completos de dirección y contacto
   * @business_impact Define las ubicaciones autorizadas para operaciones IMMEX
   */
  datosPlantasParaSerAgregados: PlantasDireccionModelo[] = [];

  /**
   * @property {SubfabricanteDireccionModelo[]} datosTablaSubfabricantesDisponibles
   * @description
   * Resultados de búsqueda de subfabricantes disponibles en el sistema.
   * Contiene todos los registros que coinciden con los criterios de búsqueda
   * (RFC y estado) ingresados por el usuario.
   * 
   * @source API de búsqueda de subfabricantes
   * @filter Filtrado por RFC y entidad federativa
   * @display Se muestra en tabla dinámica con selección múltiple
   * @refresh Se actualiza cada vez que se realiza una nueva búsqueda
   */
  datosTablaSubfabricantesDisponibles: SubfabricanteDireccionModelo[] = [];

  /**
   * @property {PlantasDireccionModelo[]} listaDeSubfabricantesPorEliminar
   * @description
   * Array temporal que almacena las plantas seleccionadas por el usuario
   * para eliminación. Se utiliza como buffer antes de confirmar la operación
   * de eliminación definitiva.
   * 
   * @purpose Buffer para operación de eliminación
   * @confirmation Requiere confirmación del usuario antes de procesar
   * @rollback Permite cancelar la operación antes de confirmar
   * @cleanup Se limpia automáticamente después de procesar la eliminación
   */
listaDeSubfabricantesPorEliminar:PlantasDireccionModelo[] = [];

  /**
   * @property {BehaviorSubject<boolean>} mostrarTablaSubfabricantesDisponibles$
   * @description
   * Observable que controla la visibilidad de la tabla de subfabricantes disponibles.
   * Utiliza BehaviorSubject para permitir suscripciones reactivas y mantener
   * el último estado de visibilidad emitido.
   * 
   * @reactive true - Los componentes pueden suscribirse a cambios
   * @initial_value false - La tabla inicia oculta
   * @triggers
   * - true: Cuando se obtienen resultados de búsqueda exitosos
   * - false: Al destruir el componente o limpiar resultados
   * 
   * @subscription Los componentes hijo se suscriben para mostrar/ocultar tabla
   */
  mostrarTablaSubfabricantesDisponibles$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * @property {boolean} mostrarTablaSubfabricantesSeleccionadas
   * @description
   * Flag booleano que determina si se debe mostrar la tabla de plantas
   * subfabricantes que han sido agregadas al trámite. Se activa cuando
   * existen plantas en la lista de agregados.
   * 
   * @default false
   * @condition true cuando datosPlantasParaSerAgregados.length > 0
   * @purpose Controla la visibilidad de la sección de plantas agregadas
   * @interaction Se actualiza automáticamente según el contenido del store
   */
  mostrarTablaSubfabricantesSeleccionadas: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @private
   * @description
   * Subject utilizado para implementar el patrón de limpieza de suscripciones
   * en el ciclo de vida del componente. Emite una señal cuando el componente
   * se destruye para cancelar todas las suscripciones activas.
   * 
   * @pattern Subscription Management Pattern
   * @purpose Prevenir memory leaks por suscripciones no canceladas
   * @usage Se utiliza con takeUntil() en todas las suscripciones del componente
   * @lifecycle Se completa en ngOnDestroy()
   * 
   * @example
   * ```typescript
   * this.service.getData()
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe(data => { ... });
   * ```
   */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
  * @property {number} SIN
  * @description
  * Número de identificación del Sistema de Información Nacional.
  * Identificador único utilizado para vincular el registro del trámite
  * con los sistemas gubernamentales centralizados.
  * 
  * @default -1 - Indica que aún no se ha asignado un SIN válido
  * @format Número entero positivo cuando está asignado
  * @purpose Trazabilidad y referencia en sistemas gubernamentales
  * @assignment Se asigna automáticamente por el sistema al procesar el trámite
  */
  SIN:number=-1;

  /**
  * @property {boolean} esFormularioSoloLectura
  * @description
  * Indicador que determina si el formulario debe operar en modo de solo lectura.
  * Cuando está activo, todos los campos del formulario se deshabilitan y
  * las operaciones de modificación se bloquean.
  * 
  * @default false - El formulario inicia en modo editable
  * @source Se obtiene del estado global de la aplicación (ConsultaioQuery)
  * @impact 
  * - true: Deshabilita formularios y botones de acción
  * - false: Permite edición completa de datos
  * 
  * @use_cases
  * - Consulta de trámites finalizados
  * - Revisión de datos sin permisos de edición
  * - Estados de trámite que no permiten modificaciones
  */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {boolean} campoDeshabilitar
   * @description
   * Flag auxiliar que controla el estado de habilitación de campos específicos
   * del formulario. Trabaja en conjunto con esFormularioSoloLectura para
   * proporcionar control granular sobre la interactividad de elementos.
   * 
   * @default false - Los campos inician habilitados
   * @relationship Dependiente de esFormularioSoloLectura
   * @scope Campos específicos del formulario de datos de subcontratista
   * @update Se actualiza automáticamente según el modo del formulario
   */
  campoDeshabilitar:boolean= false;

     /**
     * @property {Subscription} subscription
     * @private
     * @description
     * Contenedor principal para gestionar suscripciones a observables que requieren
     * limpieza manual. Se utiliza como alternativa al patrón destroyNotifier$
     * para casos específicos que necesitan control granular de suscripciones.
     * 
     * @pattern Subscription Management
     * @purpose Agrupa múltiples suscripciones para limpieza eficiente
     * @cleanup Se desuscribe manualmente en ngOnDestroy()
     * @use_case Suscripciones que requieren lógica de limpieza personalizada
     * 
     * @example
     * ```typescript
     * this.subscription.add(
     *   this.service.getData().subscribe(data => { ... })
     * );
     * ```
     */
    private subscription: Subscription = new Subscription();
   
    /**
     * @property {string} tramiteId
     * @description
     * Identificador único del tipo de trámite que maneja este componente.
     * Se utiliza para obtener catálogos específicos y configuraciones
     * particulares del trámite 80207 de Empresas Submanufactureras.
     * 
     * @value '80207' - Código oficial del trámite
     * @usage 
     * - Obtención de catálogos específicos del trámite
     * - Configuración de validaciones particulares
     * - Integración con servicios gubernamentales
     * @immutable No debe modificarse durante el ciclo de vida del componente
     */
    tramiteId: string = '80207';

    /**
     * @property {boolean} deleteMessageExportacion
     * @description
     * Flag que controla la visibilidad del modal de confirmación para
     * operaciones de eliminación. Se activa cuando el usuario intenta
     * eliminar plantas subfabricantes del trámite.
     * 
     * @default false - El modal de confirmación está oculto
     * @trigger Se activa al intentar eliminar registros seleccionados
     * @purpose Proporcionar confirmación de usuario para operaciones destructivas
     * @behavior
     * - true: Muestra modal de confirmación de eliminación
     * - false: Oculta modal y permite operaciones normales
     */
  public deleteMessageExportacion: boolean = false;
 

  /**
   * @constructor
   * @description
   * Constructor del componente que inicializa todas las dependencias necesarias
   * para el funcionamiento completo del módulo de empresas subfabricantes.
   * Configura la inyección de dependencias y establece suscripciones iniciales.
   * 
   * @param {FormBuilder} fb 
   * Servicio de Angular para construcción de formularios reactivos.
   * Se utiliza para crear y configurar los FormGroup del componente con
   * validaciones y controles dinámicos.
   * 
   * @param {SubfabricanteService} subfabricanteDatosService 
   * Servicio especializado que encapsula toda la lógica de negocio relacionada
   * con subfabricantes. Incluye operaciones de búsqueda, obtención de datos
   * y transformación de respuestas de API.
   * 
   * @param {Tramites80207Queries} query 
   * Servicio de consultas reactivas que proporciona acceso a selectores
   * específicos del estado del trámite 80207. Implementa patrón Query de Akita
   * para separar lógica de lectura del estado.
   * 
   * @param {Tramites80207Store} store 
   * Store principal del trámite que maneja el estado global y las mutaciones.
   * Centraliza todas las operaciones de escritura y actualización de estado
   * siguiendo principios de inmutabilidad.
   * 
   * @param {ConsultaioQuery} consultaioQuery 
   * Query global que proporciona información sobre el modo de operación
   * del sistema (lectura/escritura). Determina si el formulario debe ser
   * de solo lectura o permitir edición.
   * 
   * @param {CatalogoServices} catalogoService 
   * Servicio para obtención de catálogos oficiales del gobierno.
   * Proporciona acceso a listas de estados, municipios y otros catálogos
   * requeridos para el trámite.
   * 
   * @initialization
   * El constructor configura automáticamente:
   * - Suscripción al estado de solo lectura
   * - Inicialización reactiva del estado del formulario
   * - Configuración de observables para cambios de estado
   * 
   * @pattern Dependency Injection + Reactive State Management
   */
  constructor(
    private fb: FormBuilder,
    private subfabricanteDatosService: SubfabricanteService,
    public query: Tramites80207Queries,
    private store: Tramites80207Store,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices

  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      ).subscribe();
    
  }

  /**
   * @method ngOnInit
   * @lifecycle OnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta inmediatamente después
   * de la construcción del componente. Realiza toda la inicialización necesaria
   * para preparar el componente para la interacción del usuario.
   * 
   * @execution_order
   * 1. **inicializarEstadoFormulario()**: Configura formularios según modo de operación
   * 2. **obtenerDatosDeRegistro()**: Carga información básica del trámite
   * 3. **obtenerDatosDelAlmacen()**: Establece suscripciones a observables del store
   * 4. **obtenerListaEstado()**: Carga catálogo de estados para selección
   * 
   * @purpose
   * - Preparar formularios reactivos con validaciones
   * - Establecer conexiones con servicios de datos
   * - Configurar suscripciones a cambios de estado
   * - Cargar catálogos necesarios para operación
   * 
   * @side_effects
   * - Crea suscripciones a observables del store
   * - Inicializa formularios con validaciones activas
   * - Carga datos asíncronos de servicios externos
   * 
   * @error_handling
   * Los errores de servicios se manejan individualmente en cada método llamado
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.obtenerDatosDeRegistro();
    this.obtenerDatosDelAlmacen();
    this.obtenerListaEstado(this.tramiteId);
  }

  /**
   * @method obtenerDatosDelAlmacen
   * @description
   * Establece todas las suscripciones necesarias a los observables del store
   * para mantener el componente sincronizado con el estado global de la aplicación.
   * Este método configura la reactividad del componente.
   * 
   * @subscriptions
   * 
   * **infoRegisterEstado$**: 
   * - Actualiza formularioInfoRegistro con datos de registro del trámite
   * - Datos de solo lectura (modalidad, folio, año)
   * 
   * **datosSubcontratistaEstado$**: 
   * - Sincroniza formularioDatosSubcontratista con RFC y estado guardados
   * - Actualiza validación del formulario en el store
   * 
   * **plantasBuscadas$**: 
   * - Recibe resultados de búsqueda de subfabricantes
   * - Activa visualización de tabla de disponibles cuando hay resultados
   * 
   * **plantas$**: 
   * - Observa cambios en la lista de plantas agregadas
   * - Actualiza datos locales para visualización en tabla
   * 
   * **plantasSubfabricantesAgregar$**: 
   * - Controla visibilidad de tabla de plantas seleccionadas
   * - Maneja lógica de mostrar/ocultar sección según contenido
   * 
   * @reactive_pattern
   * Utiliza patrón reactive con takeUntil() para limpieza automática
   * de suscripciones al destruir el componente.
   * 
   * @memory_management
   * Todas las suscripciones se cancelan automáticamente en ngOnDestroy
   * mediante destroyNotifier$ para prevenir memory leaks.
   */
  obtenerDatosDelAlmacen(): void {
    this.query.infoRegisterEstado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((infoRegister) => {
        this.formularioInfoRegistro.setValue(infoRegister);
      });

    this.query.datosSubcontratistaEstado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosSubcontratista) => {
        this.formularioDatosSubcontratista.patchValue({rfc:datosSubcontratista.rfc,estado: datosSubcontratista.estado});
        this.store.setFormValida({
          esDatosSubcontratistaValido: this.formularioDatosSubcontratista.valid,
        });
      });

      this.query.plantasBuscadas$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((plantasBuscadas)=>{
        if(plantasBuscadas.length>0){
          this.datosTablaSubfabricantesDisponibles=plantasBuscadas;
          this.mostrarTablaSubfabricantesDisponibles$.next(true);
        }
      })

      this.query.plantas$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((plantas)=>{
        if(plantas.length>0){
          this.datosPlantasParaSerAgregados=plantas;
        }
      })



    this.query.plantasSubfabricantesAgregar$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((plantasSubfabricantesAgregar) => {
        if (plantasSubfabricantesAgregar.length > 0) {
      
            this.mostrarTablaSubfabricantesSeleccionadas = true;
        }
        else{
          this.datosSubfabricanteParaSerAgregados =[];
          this.mostrarTablaSubfabricantesSeleccionadas = false;
        }
      });

  }

  /**
   * @method enEstadoSeleccionado
   * @description
   * Procesa la selección de estado del catálogo y actualiza el store con
   * los datos del subcontratista. Convierte el valor seleccionado a string
   * y sincroniza con el estado global de la aplicación.
   * 
   * @functionality
   * 1. Actualiza el campo estado en el formulario convirtiéndolo a string
   * 2. Guarda los datos completos del formulario en el store
   * 3. Mantiene sincronización entre UI y estado global
   * 
   * @data_flow
   * Selección Usuario → Formulario → Store → Estado Global
   * 
   * @validation
   * Se ejecuta la validación automática del formulario y se actualiza
   * el estado de validez en el store para otros componentes.
   * 
   * @side_effects
   * - Actualiza formularioDatosSubcontratista
   * - Modifica estado global a través del store
   * - Puede disparar validaciones en otros componentes
   */
  enEstadoSeleccionado(): void {
    this.formularioDatosSubcontratista.patchValue({
      estado: this.formularioDatosSubcontratista.value.estado.toString(),
    })
    this.store.setDatosContr(this.formularioDatosSubcontratista.value);
  }

  /**
   * @method obtenerRFC
   * @description
   * Captura el valor del RFC del formulario y lo sincroniza con el store.
   * Se ejecuta cada vez que el usuario modifica el campo RFC para mantener
   * el estado global actualizado en tiempo real.
   * 
   * @trigger
   * - Cambios en el campo RFC del formulario
   * - Eventos de blur o cambio en el input
   * - Validaciones en tiempo real
   * 
   * @data_synchronization
   * Toma todos los valores del formularioDatosSubcontratista y los
   * envía al store, no solo el RFC, para mantener consistencia completa.
   * 
   * @validation_impact
   * Al actualizar el store, se disparan las validaciones automáticas
   * del formulario y se actualiza el estado de validez global.
   * 
   * @performance
   * Método liviano que solo actualiza el store sin procesamiento adicional,
   * optimizado para ejecución frecuente durante la edición del usuario.
   */
  obtenerRFC(): void {
    this.store.setDatosContr(this.formularioDatosSubcontratista.value);
  }

  /**
   * @method obtenerDatosDeRegistro
   * @description
   * Obtiene los datos básicos de registro del trámite desde el servicio
   * especializado y los almacena en el store para uso global. Estos datos
   * incluyen información como modalidad, folio y año del trámite.
   * 
   * @async_operation
   * Utiliza observable con suscripción reactiva para obtener datos asíncronos
   * del servicio subfabricanteDatosService.getDatos().
   * 
   * @data_validation
   * Verifica que la respuesta del servicio sea válida (no null/undefined)
   * antes de procesarla y almacenarla en el store.
   * 
   * @store_update
   * Los datos obtenidos se almacenan en el store mediante setInfoRegistro()
   * para que estén disponibles para otros componentes del trámite.
   * 
   * @subscription_management
   * Utiliza takeUntil(destroyNotifier$) para cancelación automática
   * de la suscripción al destruir el componente.
   * 
   * @error_handling
   * En caso de error del servicio, la suscripción se completa sin
   * actualizar el store, manteniendo el estado anterior.
   */
  obtenerDatosDeRegistro(): void {
    this.subfabricanteDatosService
      .getDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if (response) {
          this.store.setInfoRegistro(response);
        }
      });
  }

 

  /**
   * @method inicializarFormularioInfoRegistro
   * @description
   * Crea e inicializa el formulario reactivo para la información de registro
   * del trámite. Este formulario contiene campos de solo lectura que muestran
   * datos del sistema no editables por el usuario.
   * 
   * @form_structure
   * - **modalidad**: Tipo de modalidad del trámite (disabled)
   * - **folio**: Número de folio oficial asignado (disabled)
   * - **ano**: Año de registro del trámite (disabled)
   * 
   * @form_configuration
   * Todos los campos se inicializan:
   * - Con valor vacío por defecto
   * - En estado disabled para solo lectura
   * - Sin validaciones ya que son informativos
   * 
   * @purpose
   * Proporcionar visualización estructurada de información del trámite
   * que proviene del sistema y no puede ser modificada por el usuario.
   * 
   * @reactive_forms
   * Utiliza FormBuilder de Angular para crear FormGroup con controles
   * deshabilitados, manteniendo estructura de formulario reactivo.
   */
  inicializarFormularioInfoRegistro(): void {
    this.formularioInfoRegistro = this.fb.group({
      modalidad: [{ value: '', disabled: true }],
      folio: [{ value: '', disabled: true }],
      ano: [{ value: '', disabled: true }],
    });
  }
  /**
   * @method guardarDatosFormulario
   * @description
   * Gestiona el estado de los formularios basado en el modo de operación del sistema.
   * Configura si los formularios deben estar en modo editable o solo lectura,
   * y actualiza los controles y flags correspondientes.
   * 
   * @state_management
   * - **Modo solo lectura**: Deshabilita formulario y activa flag de deshabilitación
   * - **Modo editable**: Habilita formulario y permite interacción completa
   * 
   * @form_initialization
   * Siempre reinicializa ambos formularios para garantizar estado limpio:
   * - formularioInfoRegistro: Datos de registro (siempre disabled)
   * - formularioDatosSubcontratista: Datos editables del subcontratista
   * 
   * @conditional_behavior
   * ```typescript
   * if (esFormularioSoloLectura) {
   *   // Modo consulta: deshabilitar interacción
   *   campoDeshabilitar = true
   *   formulario.disable()
   * } else {
   *   // Modo edición: permitir interacción
   *   campoDeshabilitar = false
   *   formulario.enable()
   * }
   * ```
   * 
   * @side_effects
   * - Modifica estado de habilitación de controles de formulario
   * - Actualiza flags de UI para elementos dependientes
   * - Reinicia validaciones y estado de formularios
   */
  guardarDatosFormulario(): void {
    this.inicializarFormularioInfoRegistro();
    this.inicializarFormularioDatosSubcontratista(); 
    if (this.esFormularioSoloLectura) {
      this.campoDeshabilitar=true;
      this.formularioDatosSubcontratista.disable();
    } else{
      this.campoDeshabilitar=false;
      this.formularioDatosSubcontratista.enable();
    } }

   /**
   * @method inicializarEstadoFormulario
   * @description
   * Método coordinador que evalúa el estado actual del sistema y decide
   * qué estrategia de inicialización de formularios aplicar. Actúa como
   * punto de entrada principal para configuración de formularios.
   * 
   * @decision_logic
   * - **Solo lectura**: Ejecuta guardarDatosFormulario() para configuración completa
   * - **Modo normal**: Inicializa formularios individuales sin restricciones
   * 
   * @delegation_pattern
   * No realiza inicialización directa, sino que delega a métodos especializados:
   * - guardarDatosFormulario(): Para modo solo lectura
   * - inicializarFormularioInfoRegistro(): Para formulario de registro
   * - inicializarFormularioDatosSubcontratista(): Para formulario de datos
   * 
   * @usage_context
   * Se llama desde:
   * - ngOnInit(): Inicialización del componente
   * - Constructor: Respuesta a cambios de estado de solo lectura
   * - Eventos de cambio de modo de operación
   * 
   * @purpose
   * Centralizar la lógica de decisión para inicialización de formularios
   * y garantizar configuración consistente en todos los escenarios.
   */
   inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormularioInfoRegistro();
    this.inicializarFormularioDatosSubcontratista(); 
    }  

  }

  /**
   * @method inicializarFormularioDatosSubcontratista
   * @description
   * Crea e inicializa el formulario reactivo principal para captura de datos
   * del subcontratista. Este formulario contiene los campos editables que
   * el usuario debe completar para realizar búsquedas de subfabricantes.
   * 
   * @form_structure
   * - **rfc**: RFC de la empresa submanufacturera (required)
   * - **estado**: Estado de la federación donde opera (required)
   * 
   * @validation_rules
   * Ambos campos son obligatorios (Validators.required) ya que son
   * parámetros esenciales para la búsqueda en el sistema gubernamental.
   * 
   * @initial_state
   * - Todos los campos inician con valores vacíos
   * - Validaciones activas desde la creación
   * - Estado pristine y untouched para evitar errores iniciales
   * 
   * @form_integration
   * El formulario se integra automáticamente con:
   * - Store del trámite para persistencia de datos
   * - Validaciones en tiempo real
   * - Catálogos de estados para selección
   * 
   * @reactive_behavior
   * Los cambios en el formulario se sincronizan automáticamente
   * con el store global para mantener consistencia de estado.
   */
  inicializarFormularioDatosSubcontratista(): void {
    this.formularioDatosSubcontratista = this.fb.group({
      rfc: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  /**
   * @method obtenerListaEstado
   * @description
   * Carga el catálogo oficial de estados de la República Mexicana desde
   * el servicio gubernamental y lo almacena localmente para uso en el
   * componente de selección de estados.
   * 
   * @param {string} tramite - Identificador del trámite para obtener catálogo específico
   * 
   * @async_operation
   * Utiliza suscripción a observable del servicio catalogoService.estadosCatalogo()
   * para obtener datos asíncronos del servidor gubernamental.
   * 
   * @data_processing
   * 1. Llama al servicio con el ID del trámite específico
   * 2. Extrae los datos del response como array de Catalogo
   * 3. Valida que la respuesta sea válida
   * 4. Almacena en propiedad local estadoCatalogo
   * 
   * @subscription_management
   * - Añade la suscripción al contenedor principal para limpieza manual
   * - Utiliza takeUntil() para cancelación automática en destrucción
   * 
   * @error_handling
   * En caso de error del servicio, mantiene el array vacío por defecto
   * y no afecta la funcionalidad del resto del componente.
   * 
   * @catalog_format
   * Los datos obtenidos siguen el formato estándar de catálogos
   * gubernamentales con id, nombre y descripción de cada estado.
   */
  obtenerListaEstado(tramite: string): void {
    this.subscription.add(
      this.catalogoService
      .estadosCatalogo(tramite)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
        
        if (response) {
          this.estadoCatalogo = DATOS;
        }
      })
    );
  }
  

  /**
   * @method obtenerSubfabricantesDisponibles
   * @description
   * Ejecuta la búsqueda de empresas subfabricantes disponibles en el sistema
   * gubernamental basado en los criterios ingresados por el usuario (RFC y estado).
   * Procesa la respuesta y actualiza el store con los resultados obtenidos.
   * 
   * @search_criteria
   * - **rfcEmpresaSubManufacturera**: RFC ingresado por el usuario
   * - **entidadFederativa**: Estado seleccionado del catálogo
   * - **idPrograma**: Identificador del programa (null para búsqueda general)
   * 
   * @api_integration
   * Utiliza el servicio subfabricanteDatosService.getSubfabricantesDisponibles()
   * que se conecta con los sistemas gubernamentales de registro de empresas.
   * 
   * @response_processing
   * 1. Valida que la respuesta sea un objeto válido
   * 2. Realiza copia profunda para evitar mutaciones
   * 3. Verifica que los datos sean un array válido
   * 4. Transforma la respuesta API al modelo interno
   * 5. Actualiza el store con los resultados
   * 
   * @data_transformation
   * Utiliza mapApiResponseToPlantasSubfabricante() para convertir
   * la estructura de datos de la API al modelo interno del componente.
   * 
   * @form_cleanup
   * Después de procesar la búsqueda, limpia el formulario:
   * - RFC: se vacía para nueva búsqueda
   * - Estado: se resetea a valor por defecto (-1)
   * 
   * @state_update
   * Los resultados se almacenan en el store mediante setPlantasBuscadas()
   * lo que dispara actualizaciones reactivas en toda la aplicación.
   * 
   * @error_resilience
   * En caso de respuesta inválida o error, no actualiza el estado
   * y mantiene los datos anteriores para evitar pérdida de información.
   */
  obtenerSubfabricantesDisponibles(): void {
     const PAYLOAD = {
        "rfcEmpresaSubManufacturera": this.formularioDatosSubcontratista.get('rfc')?.value,
        "entidadFederativa": this.formularioDatosSubcontratista.get('estado')?.value,
        "idPrograma": null
      }
    this.subfabricanteDatosService
      .getSubfabricantesDisponibles(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
       if(esValidObject(response)) {
                   const API_DATOS = doDeepCopy(response);
                  if(esValidArray(API_DATOS.datos)) {
                    const RESPONSE:SubfabricanteDireccionModelo[] = this.subfabricanteDatosService.mapApiResponseToPlantasSubfabricante(API_DATOS.datos);

                    this.formularioDatosSubcontratista.reset();
                    this.formularioDatosSubcontratista.patchValue({
                      rfc:'',
                      estado:'-1'});
                    this.store.setDatosContr(this.formularioDatosSubcontratista.value);
                    this.store.setPlantasBuscadas(RESPONSE);
                  } 
                }
      });
  }

  /**
   * @method obtenerRegistroSeleccionado
   * @description
   * Procesa la selección de registros de subfabricantes realizada por el usuario
   * en la tabla de resultados de búsqueda. Actualiza el estado interno del
   * componente y controla la visibilidad de elementos dependientes.
   * 
   * @param {SubfabricanteDireccionModelo[]} event - Array de registros seleccionados por el usuario
   * 
   * @selection_logic
   * - **Con selección**: Almacena registros seleccionados para procesamiento posterior
   * - **Sin selección**: Limpia datos y oculta elementos dependientes
   * 
   * @state_management
   * ```typescript
   * if (event.length > 0) {
   *   // Guardar selección para agregar plantas
   *   datosDelSubfabricanteSeleccionado = event
   * } else {
   *   // Limpiar selección y ocultar tabla de agregados
   *   mostrarTablaSubfabricantesSeleccionadas = false
   *   datosDelSubfabricanteSeleccionado = []
   * }
   * ```
   * 
   * @ui_behavior
   * - Actualiza visibilidad de tabla de plantas seleccionadas
   * - Controla disponibilidad de botones de acción
   * - Mantiene coherencia visual con la selección actual
   * 
   * @data_flow
   * Selección Tabla → Event Handler → Estado Local → UI Update
   * 
   * @validation_ready
   * Los datos seleccionados quedan listos para validación en
   * operaciones posteriores como agregar plantas.
   */
  obtenerRegistroSeleccionado(event: SubfabricanteDireccionModelo[]): void {
    if (event.length > 0) {
      this.datosDelSubfabricanteSeleccionado = event;
    } else {
      this.mostrarTablaSubfabricantesSeleccionadas = false;
      this.datosDelSubfabricanteSeleccionado = [];
    }
  }

  /**
   * @method realizarBusqueda
   * @description
   * Método principal que valida los datos del formulario y ejecuta la búsqueda
   * de subfabricantes disponibles. Implementa validaciones exhaustivas y
   * proporciona retroalimentación clara al usuario sobre errores de entrada.
   * 
   * @validation_flow
   * 1. **Extracción de datos**: Obtiene RFC y estado del formulario
   * 2. **Limpieza de datos**: Aplica trim() para eliminar espacios
   * 3. **Validación RFC**: Verifica que no esté vacío
   * 4. **Validación Estado**: Confirma que no sea valor por defecto (-1)
   * 5. **Ejecución**: Procede con búsqueda si pasa validaciones
   * 
   * @error_scenarios
   * - **RFC vacío**: "Debe introducir el RFC"
   * - **RFC sin estado**: "El RFC de la empresa submanufacturera no está registrado"
   * - **Estado no seleccionado**: "Debe introducir el RFC" (redirige a completar datos)
   * 
   * @validation_logic
   * ```typescript
   * const RFC_VALUE = formulario.rfc?.trim()
   * const ESTADO_VALUE = formulario.estado?.toString()?.trim()
   * 
   * if (RFC_VALUE && ESTADO_VALUE !== '' && ESTADO_VALUE !== '-1') {
   *   // Ejecutar búsqueda
   *   this.obtenerSubfabricantesDisponibles()
   * } else {
   *   // Mostrar error específico
   *   this.mostrarNotificacion(mensaje)
   * }
   * ```
   * 
   * @user_feedback
   * Utiliza sistema de notificaciones para guiar al usuario:
   * - Mensajes claros y específicos
   * - Instrucción sobre cómo corregir errores
   * - Notificaciones no bloqueantes con auto-cierre
   * 
   * @data_synchronization
   * Antes de la búsqueda, sincroniza los datos del formulario
   * con el store mediante setDatosContr() para mantener coherencia.
   * 
   * @performance
   * Evita búsquedas innecesarias mediante validación temprana
   * y solo ejecuta la consulta cuando los datos son válidos.
   */
  realizarBusqueda(): void {
  const RFC_VALUE = (this.formularioDatosSubcontratista.get('rfc')?.value ?? null).trim();
  const ESTADO_RAW = this.formularioDatosSubcontratista.get('estado')?.value ?? null;
if(RFC_VALUE && ESTADO_RAW) {
   const ESTADO_VALUE = (ESTADO_RAW ?? '').toString().trim();
  if (RFC_VALUE && ESTADO_VALUE !== '' && ESTADO_VALUE !== '-1') {
    this.store.setDatosContr(this.formularioDatosSubcontratista.value);
    this.obtenerSubfabricantesDisponibles();
  }
  else{
   if(!RFC_VALUE || RFC_VALUE.length === 0 ){
      this.mostrarNotificacion('Debe introducir el RFC');
  }
  else if(RFC_VALUE.length > 0 && ESTADO_RAW === '-1' ){
   this.mostrarNotificacion('El RFC de la empresa submanufacturera no está registrado');
   this.formularioDatosSubcontratista.patchValue({
          rfc: ''
        });
  }
  else {
      this.mostrarNotificacion('Debe introducir el RFC');
  }
  }
}
else{
  if(!RFC_VALUE || RFC_VALUE.trim().length === 0 ){
      this.mostrarNotificacion('Debe introducir el RFC');
  }
  else if(RFC_VALUE && ESTADO_RAW === "-1" ){
   this.mostrarNotificacion('El RFC de la empresa submanufacturera no está registrado');
  }
  else {
      this.mostrarNotificacion('Debe introducir el RFC');
  }
}
 
}
  
  /**
   * @method mostrarNotificacion
   * @private
   * @description
   * Método utilitario que configura y muestra notificaciones al usuario
   * de manera consistente en todo el componente. Centraliza la creación
   * de objetos de notificación con configuración estándar.
   * 
   * @param {string} mensaje - Texto del mensaje a mostrar al usuario
   * @param {boolean} cancelButton - Indica si se debe mostrar botón de cancelar (default: false)
   * 
   * @notification_configuration
   * - **tipoNotificacion**: 'alert' - Tipo de notificación de alerta
   * - **categoria**: 'warning' - Categoría visual de advertencia
   * - **modo**: 'action' - Modo que permite interacción del usuario
   * - **titulo**: '' - Sin título para simplicidad
   * - **cerrar**: false - No permite cierre manual
   * - **tiempoDeEspera**: 2000ms - Auto-cierre en 2 segundos
   * 
   * @button_configuration
   * - **txtBtnAceptar**: 'Aceptar' - Texto estándar del botón principal
   * - **txtBtnCancelar**: Condicional según parámetro cancelButton
   * 
   * @state_management
   * Resetea deleteMessageExportacion a false para limpiar estado
   * de mensajes de eliminación previos.
   * 
   * @usage_patterns
   * ```typescript
   * // Notificación simple
   * this.mostrarNotificacion('Error de validación')
   * 
   * // Notificación con cancelar
   * this.mostrarNotificacion('¿Está seguro?', true)
   * ```
   */
  private mostrarNotificacion(mensaje: string,cancelButton:boolean=false): void {
  
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: cancelButton ? 'Cancelar' : '',
    };
    this.deleteMessageExportacion=cancelButton;
  }

  /**
 * @method agregarPlantas
 * @description
 * Agrega plantas subfabricantes al trámite basado en la selección del usuario.
 * Mapea los datos seleccionados de subfabricantes disponibles a plantas 
 * manufactureras y actualiza el store correspondiente.
 * 
 * @business_logic
 * 1. **Validación**: Verifica que haya subfabricantes seleccionados
 * 2. **Mapeo**: Convierte datos de SubfabricanteDireccionModelo a PlantasDireccionModelo
 * 3. **Almacenamiento**: Guarda en store para persistencia
 * 4. **Limpieza**: Resetea selección temporal
 */
agregarPlantas(): void {
  if (this.datosDelSubfabricanteSeleccionado.length > 0) {
    try {
      const PLANTASMAPEADAS: PlantasDireccionModelo[] = this.datosDelSubfabricanteSeleccionado.map(
        subfabricante => this.mapSubfabricanteToPlanta(subfabricante)
      );

      this.store.addPlantas(PLANTASMAPEADAS);


    } catch (error) {
      console.error('Error al mapear datos de subfabricantes:', error);
      this.mostrarNotificacion('Error al procesar los datos seleccionados.');
    }
  } else {
    this.mostrarNotificacion('Selecciona al menos una planta donde se realizarán las operaciones IMMEX.');
  }
}

  /**
 * @method mapSubfabricanteToPlanta
 * @private
 * @description
 * Método utilitario que mapea un objeto SubfabricanteDireccionModelo
 * a PlantasDireccionModelo, asegurando la consistencia en la transformación
 * de datos entre diferentes estructuras del dominio.
 * 
 * @param {SubfabricanteDireccionModelo} subfabricante - Datos del subfabricante a mapear
 * @returns {PlantasDireccionModelo} Objeto mapeado con estructura de planta
 */
private mapSubfabricanteToPlanta(subfabricante: SubfabricanteDireccionModelo): PlantasDireccionModelo {
  return {
    rfc: subfabricante.rfc || '',
    razonSocial: subfabricante.razonSocial || '',
    domicilioFiscalSolicitante: subfabricante.domicilioFiscalSolicitante || '',
    idSubfabricante: subfabricante.idSubfabricante || '',
    
    calle: subfabricante.calle || '',
    numExterior: this.toNumber(subfabricante.numExterior),
    numInterior: this.toNumber(subfabricante.numInterior),
    codigoPostal: this.toNumber(subfabricante.codigoPostal),
    
    localidad: subfabricante.colonia || '', // Mapear colonia a localidad
    delegacionMunicipio: subfabricante.delegacionMunicipio || '',
    entidadFederativa: subfabricante.entidadFederativa || '',
    pais: subfabricante.pais || '',
    
  } as PlantasDireccionModelo;
}

/**
 * @method toNumber
 * @private
 * @description
 * Convierte un valor a número, manejando casos de null, undefined o strings vacíos.
 * 
 * @param {string | number | null | undefined} value - Valor a convertir
 * @returns {number} Número convertido o 0 si la conversión falla
 */
private toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  const NUM = Number(value);
  return isNaN(NUM) ? 0 : NUM;
}
    
  

  /**
   * @method datosDelSubfabricantePorEliminar
   * @description
   * Captura y almacena temporalmente los registros de plantas subfabricantes
   * que el usuario ha seleccionado para eliminación. Actúa como buffer
   * antes de la confirmación definitiva de la operación destructiva.
   * 
   * @param {PlantasDireccionModelo[]} event - Array de plantas seleccionadas para eliminación
   * 
   * @purpose
   * - Almacenar selección temporal para eliminación
   * - Permitir validación antes de operación destructiva
   * - Habilitar confirmación de usuario
   * - Facilitar cancelación de operación
   * 
   * @data_flow
   * Selección UI → Event Handler → Buffer Temporal → Confirmación → Eliminación
   * 
   * @state_management
   * Los datos se almacenan en listaDeSubfabricantesPorEliminar para
   * uso posterior en el proceso de confirmación de eliminación.
   * 
   * @safety_pattern
   * Implementa patrón de dos fases para operaciones destructivas:
   * 1. Selección y almacenamiento temporal
   * 2. Confirmación y ejecución definitiva
   */
  datosDelSubfabricantePorEliminar(
    event: PlantasDireccionModelo[]
  ): void {
    this.listaDeSubfabricantesPorEliminar = event;
  }

  

  /**
   * @method eliminarPlantas
   * @description
   * Inicia el proceso de eliminación de plantas subfabricantes seleccionadas.
   * Valida que haya elementos seleccionados y solicita confirmación del
   * usuario antes de proceder con la operación destructiva.
   * 
   * @validation_process
   * 1. **Conteo de selección**: Verifica cantidad de elementos a eliminar
   * 2. **Validación vacía**: Si no hay selección, muestra mensaje informativo
   * 3. **Confirmación**: Si hay selección, solicita confirmación del usuario
   * 
   * @user_confirmation
   * ```typescript
   * if (elementos === 0) {
   *   // Mostrar mensaje informativo
   *   mostrarNotificacion('Selecciona la planta que desea eliminar.')
   * } else {
   *   // Solicitar confirmación
   *   deleteMessageExportacion = true
   *   mostrarNotificacion('¿Está seguro...?', true)
   * }
   * ```
   * 
   * @confirmation_flow
   * - Activa flag deleteMessageExportacion para mostrar modal
   * - Muestra mensaje de confirmación con botones Aceptar/Cancelar
   * - Espera respuesta del usuario para proceder o cancelar
   * 
   * @safety_measures
   * - Validación obligatoria de selección
   * - Confirmación explícita del usuario
   * - Mensaje claro sobre la acción a realizar
   * - Posibilidad de cancelación
   * 
   * @error_prevention
   * Evita eliminaciones accidentales mediante:
   * - Validación de elementos seleccionados
   * - Mensajes informativos claros
   * - Proceso de confirmación obligatorio
   */
  eliminarPlantas(): void {
    const DATOS = this.listaDeSubfabricantesPorEliminar?.length || 0;

    if (DATOS === 0) { this.mostrarNotificacion('Selecciona la planta que desea eliminar.'); return; }
    
    this.deleteMessageExportacion = true;
    this.mostrarNotificacion('¿Está seguro de eliminar la(s) planta(s) seleccionada(s)?',true);
  }
  
    /**
   * @method esInvalido
   * @description
   * Método utilitario que evalúa si un control específico del formulario
   * se encuentra en estado inválido y debe mostrar mensajes de error.
   * Combina validación de estado con interacción del usuario.
   * 
   * @param {string} nombreControl - Nombre del control del formulario a evaluar
   * @returns {boolean} True si el control es inválido y ha sido tocado/modificado
   * 
   * @validation_logic
   * ```typescript
   * const control = formulario.get(nombreControl)
   * return control.invalid && (control.touched || control.dirty)
   * ```
   * 
   * @interaction_states
   * - **touched**: El usuario hizo foco en el campo
   * - **dirty**: El usuario modificó el valor del campo
   * - **invalid**: El campo no cumple las validaciones definidas
   * 
   * @purpose
   * - Determinar cuándo mostrar mensajes de error
   * - Evitar errores prematuros antes de interacción
   * - Proporcionar retroalimentación oportuna al usuario
   * - Mejorar experiencia de usuario en formularios
   * 
   * @usage_context
   * Se utiliza en templates para condicionar visualización:
   * ```html
   * <div *ngIf="esInvalido('rfc')" class="error-message">
   *   Este campo es obligatorio
   * </div>
   * ```
   * 
   * @error_prevention
   * Evita mostrar errores hasta que el usuario haya interactuado
   * con el campo, mejorando la experiencia de usuario.
   */
    esInvalido(nombreControl: string): boolean {
      const CONTROL = this.formularioDatosSubcontratista.get(nombreControl);
      return CONTROL
        ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
        : false;
    }
    /**
     * @method eliminarPedimentoDatoss
     * @description
     * Procesa la confirmación de eliminación de plantas subfabricantes.
     * Ejecuta la eliminación definitiva si el usuario confirma la acción
     * o cancela la operación si el usuario decide no proceder.
     * 
     * @param {boolean} event - Confirmación del usuario (true: confirmar, false: cancelar)
     * 
     * @conditional_execution
     * ```typescript
     * if (event) {
     *   // Usuario confirmó: ejecutar eliminación
     *   procesarEliminacion()
     *   actualizarStore()
     *   limpiarSeleccion()
     * }
     * // Siempre: ocultar modal de confirmación
     * deleteMessageExportacion = false
     * ```
     * 
     * @deletion_algorithm
     * 1. **Conteo**: Determina cantidad de elementos a eliminar
     * 2. **Copia**: Crea copia del array actual de plantas
     * 3. **Eliminación**: Remueve elementos desde el inicio
     * 4. **Actualización**: Actualiza array local y store
     * 5. **Limpieza**: Resetea lista de elementos por eliminar
     * 
     * @array_manipulation
     * Utiliza splice(0, cantidad) para eliminar elementos desde
     * el inicio del array, manteniendo orden de elementos restantes.
     * 
     * @state_synchronization
     * - Actualiza array local datosPlantasParaSerAgregados
     * - Sincroniza con store mediante setPlantas()
     * - Limpia selección temporal listaDeSubfabricantesPorEliminar
     * 
     * @ui_cleanup
     * Siempre oculta el modal de confirmación (deleteMessageExportacion = false)
     * independientemente de la decisión del usuario.
     * 
     * @data_integrity
     * Mantiene integridad de datos mediante:
     * - Operaciones atómicas de eliminación
     * - Sincronización inmediata con store
     * - Limpieza de estado temporal
     */
    eliminarPedimentoDatoss(event: boolean): void {
      if (event) {
    const DATOS = this.listaDeSubfabricantesPorEliminar?.length || 0;
    const DATOSRES = [...this.datosPlantasParaSerAgregados];
    DATOSRES.splice(0, DATOS);
    this.datosPlantasParaSerAgregados = DATOSRES;
    this.store.setPlantas(DATOSRES);
    this.listaDeSubfabricantesPorEliminar= [];
      }
      this.deleteMessageExportacion = false;
      this.nuevaNotificacion={} as Notificacion;
    }
    /**
     * Validates that both plant data arrays contain valid data for processing.
     * 
     * Checks if both `datosPlantasParaSerAgregados` and `datosTablaSubfabricantesDisponibles` 
     * are defined, are arrays, and contain at least one element each.
     * 
     * @returns {boolean} `true` if both arrays are valid and non-empty, `false` otherwise
     * 
     * @example
     * ```typescript
     * const isValid = this.validarCampos();
     * if (isValid) {
     *   // Proceed with processing the plant data
     * }
     * ```
     * 
     * @memberof EmpresasSubfabricanteComponent
     * @since 1.0.0
     */
    validarCampos(): boolean {
      if(this.datosPlantasParaSerAgregados && 
         Array.isArray(this.datosPlantasParaSerAgregados) && 
         this.datosPlantasParaSerAgregados.length > 0 &&
         this.datosTablaSubfabricantesDisponibles && 
         Array.isArray(this.datosTablaSubfabricantesDisponibles) && 
         this.datosTablaSubfabricantesDisponibles.length > 0) {
        return true;
      }

      return false;
    }
  /**
   * @method ngOnDestroy
   * @lifecycle OnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente
   * va a ser destruido. Realiza la limpieza completa de recursos para prevenir
   * memory leaks y garantizar una destrucción limpia del componente.
   * 
   * @cleanup_operations
   * 
   * **BehaviorSubject cleanup**:
   * - Emite false en mostrarTablaSubfabricantesDisponibles$
   * - Oculta tablas antes de destrucción
   * 
   * **Boolean flags cleanup**:
   * - Resetea mostrarTablaSubfabricantesSeleccionadas a false
   * - Limpia estado de visualización
   * 
   * **Observable cleanup**:
   * - Emite señal de destrucción en destroyNotifier$
   * - Cancela todas las suscripciones activas
   * - Completa el Subject para liberación de memoria
   * 
   * @subscription_management
   * ```typescript
   * // Todas las suscripciones con takeUntil(destroyNotifier$)
   * // se cancelan automáticamente al emitir la señal
   * destroyNotifier$.next()
   * destroyNotifier$.complete()
   * ```
   * 
   * @memory_management
   * - Cancela suscripciones activas
   * - Libera referencias a observables
   * - Resetea estados de visualización
   * - Previene memory leaks
   * 
   * @execution_order
   * 1. Ocultar tablas dinámicas
   * 2. Resetear flags de visualización
   * 3. Emitir señal de destrucción
   * 4. Completar observables
   * 
   * @pattern_compliance
   * Sigue el patrón estándar de Angular para limpieza de componentes
   * con observables y suscripciones reactivas.
   */
  ngOnDestroy(): void {
    this.mostrarTablaSubfabricantesDisponibles$.next(false);
    this.mostrarTablaSubfabricantesSeleccionadas = false;
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

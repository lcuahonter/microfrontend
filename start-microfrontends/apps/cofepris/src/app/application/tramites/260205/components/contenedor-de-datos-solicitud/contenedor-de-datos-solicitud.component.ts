import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
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
  Tramite260205State,
  Tramite260205Store,
} from '../../estados/stores/tramite260205.store';
import { distinctUntilChanged, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ID_PROCEDIMIENTO } from '../../constantes/materias-primas.enum';
import { Subject } from 'rxjs';
import { Tramite260205Query } from '../../estados/queries/tramite260205.query';
import { ViewChild } from '@angular/core';


/**
 * @component
 * 
 * Este componente representa el contenedor de datos de la solicitud para el trámite 260205.
 * Es un componente independiente que utiliza `CommonModule` y `DatosDeLaSolicitudComponent` como dependencias.
 * 
 * @selector `app-contenedor-de-datos-solicitud`
 * 
 * @templateUrl `./contenedor-de-datos-solicitud.component.html`
 * 
 * @styleUrl `./contenedor-de-datos-solicitud.component.scss`
 * 
 * Este componente tiene las siguientes responsabilidades:
 * - Gestionar el estado del trámite 260205.
 * - Configurar y manejar las tablas de opciones, SCIAN y mercancías.
 * - Determinar si el formulario está en modo solo lectura.
 * - Actualizar el estado del store `Tramite260205Store` con los datos seleccionados en las tablas.
 * - Evitar fugas de memoria mediante la destrucción de observables al destruir el componente.
 * 
 * @implements `OnInit`, `OnDestroy`
 * 
 * Métodos principales:
 * - `ngOnInit`: Inicializa el estado del trámite y configura las tablas con los datos correspondientes.
 * - `ngOnDestroy`: Libera recursos y notifica a los observables que el componente está siendo destruido.
 * - Métodos para manejar eventos de selección en las tablas (`opcionSeleccionado`, `scianSeleccionado`, `mercanciasSeleccionado`).
 * - Métodos para actualizar el estado del formulario y los datos seleccionados en el store (`datasolicituActualizar`, `datosDeTablaSeleccionados`).
 * 
 * Propiedades principales:
 * - `tramiteState`: Estado del trámite 260205.
 * - `opcionConfig`, `scianConfig`, `tablaMercanciasConfig`: Configuración de las tablas.
 * - `esFormularioSoloLectura`: Indica si el formulario está en modo solo lectura.
 * 
 * Constructor:
 * - Inicializa el estado del trámite y determina si el formulario es de solo lectura utilizando el estado de la sección de consulta.
 * 
 * Este componente es esencial para la gestión de datos y la interacción del usuario en el trámite 260205.
 */
@Component({
  selector: 'app-contenedor-de-datos-solicitud',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  templateUrl: './contenedor-de-datos-solicitud.component.html',
  styleUrl: './contenedor-de-datos-solicitud.component.scss',
})
export class ContenedorDeDatosSolicitudComponent implements OnInit, OnDestroy {

  /**
   * @private
   * Un sujeto utilizado como notificador para la destrucción de componentes.
   * 
   * Este `Subject<void>` actúa como un mecanismo para emitir un evento cuando el componente se destruye,
   * permitiendo la limpieza de suscripciones y otros recursos para evitar fugas de memoria.
   * 
   * Se utiliza comúnmente en combinación con operadores como `takeUntil` en observables para gestionar
   * la vida útil de las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
     * @property {string} idProcedimiento
     * @description
     * Identificador del procedimiento.
     */
    public readonly idProcedimiento = ID_PROCEDIMIENTO;
  

  /**
   * Representa el estado actual del trámite en el componente.
   * 
   * Esta propiedad almacena una instancia de `Tramite260205State`, que contiene 
   * toda la información relevante sobre el estado del trámite en curso. 
   * Es utilizada para gestionar y visualizar los datos relacionados con el trámite 
   * dentro del componente.
   * 
   * @type {Tramite260205State}
   */
  public tramiteState!: Tramite260205State;


  /**
   * Configuración de opciones para la tabla en el componente.
   * 
   * Esta propiedad define la configuración utilizada para manejar las opciones 
   * de la tabla dentro del componente. Incluye el tipo de selección de la tabla, 
   * la configuración específica de la tabla y los datos asociados.
   * 
   * Propiedades:
   * - `tipoSeleccionTabla`: Define el tipo de selección que se aplicará a la tabla. 
   *   Puede ser indefinido si no se especifica.
   * - `configuracionTabla`: Contiene la configuración predeterminada de la tabla, 
   *   basada en la constante `OPCION_TABLA`.
   * - `datos`: Es un arreglo que contiene los datos configurados para la tabla, 
   *   utilizando el tipo `TablaOpcionConfig`.
   */
  public opcionConfig = {
    tipoSeleccionTabla: undefined,
    configuracionTabla: OPCION_TABLA,
    datos: [] as TablaOpcionConfig[],
  };


  /**
   * Configuración para la tabla SCIAN utilizada en el componente.
   * 
   * Esta propiedad define la configuración de la tabla SCIAN, incluyendo el tipo de selección,
   * la configuración específica de la tabla y los datos que se mostrarán en ella.
   * 
   * Propiedades:
   * - `tipoSeleccionTabla`: Define el tipo de selección que se utilizará en la tabla. 
   *   En este caso, se utiliza la selección de tipo CHECKBOX.
   * - `configuracionTabla`: Contiene la configuración específica de la tabla SCIAN, 
   *   definida por la constante `SCIAN_TABLA`.
   * - `datos`: Representa los datos que se mostrarán en la tabla. Inicialmente, es un arreglo vacío 
   *   de tipo `TablaScianConfig[]`.
   */
  public scianConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: SCIAN_TABLA,
    datos: [] as TablaScianConfig[],
  };

/**
   * Lista de elementos que son obligatorios para completar el formulario.
   * Actualmente incluye solo el campo 'correoElectronico', pero se puede expandir
   * según los requisitos del sistema.
   */
   elementosRequeridos: string[] = ['correoElectronico','denominacionRazon', 'manifesto'];
  /**
   * Configuración de la tabla de mercancías utilizada en el componente.
   * 
   * Esta propiedad define la configuración y los datos necesarios para 
   * mostrar y gestionar una tabla de mercancías en el componente. 
   * Incluye el tipo de selección de la tabla, la configuración específica 
   * de la tabla y los datos que se mostrarán.
   * 
   * Propiedades:
   * - `tipoSeleccionTabla`: Define el tipo de selección que se puede realizar 
   *   en la tabla. En este caso, se utiliza la selección de tipo CHECKBOX 
   *   proporcionada por `TablaSeleccion`.
   * - `configuracionTabla`: Contiene la configuración específica de la tabla, 
   *   que se define en la constante `PRODUCTO_TABLA`.
   * - `datos`: Es un arreglo de objetos de tipo `TablaMercanciasDatos` que 
   *   representa los datos que se mostrarán en la tabla. Inicialmente, este 
   *   arreglo está vacío.
   * 
   * Uso:
   * Esta configuración se utiliza para inicializar y gestionar la tabla de 
   * mercancías en el componente, permitiendo la interacción del usuario con 
   * los datos mostrados.
   */
  public tablaMercanciasConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: PRODUCTO_TABLA,
    datos: [] as TablaMercanciasDatos[],
  };


  /**
   * Configuración de datos para la tabla SCIAN.
   * 
   * Esta propiedad almacena un arreglo de objetos de tipo `TablaScianConfig`,
   * que se utiliza para configurar y gestionar los datos relacionados con la
   * tabla SCIAN en el componente. La tabla SCIAN es una herramienta que permite
   * clasificar actividades económicas de acuerdo con el Sistema de Clasificación
   * Industrial de América del Norte (SCIAN).
   * 
   * Uso:
   * - Se inicializa como un arreglo vacío y se puede llenar con datos específicos
   *   según las necesidades del componente.
   * - Los datos configurados en esta propiedad son utilizados para mostrar y
   *   manipular información en la interfaz de usuario.
   * 
   * Ejemplo de estructura de `TablaScianConfig`:
   * ```typescript
   * {
   *   codigo: '123456',
   *   descripcion: 'Fabricación de productos metálicos',
   *   categoria: 'Industria manufacturera'
   * }
   * ```
   * 
   * @type {TablaScianConfig[]} Un arreglo de objetos que define la configuración
   * de la tabla SCIAN.
   */
  public scianConfigDatos: TablaScianConfig[] = [];


  /**
   * Representa la configuración de datos para la tabla de mercancías.
   * 
   * Esta propiedad almacena un arreglo de objetos del tipo `TablaMercanciasDatos`,
   * que contienen la información necesaria para mostrar y gestionar los datos
   * relacionados con las mercancías en la tabla correspondiente.
   * 
   * Uso:
   * - Se utiliza para inicializar y manipular los datos de la tabla de mercancías
   *   dentro del componente.
   * - Puede ser modificado dinámicamente según las necesidades del usuario o 
   *   los cambios en el estado de la aplicación.
   * 
   * Ejemplo:
   * ```typescript
   * this.tablaMercanciasConfigDatos = [
   *   { id: 1, nombre: 'Producto A', cantidad: 10 },
   *   { id: 2, nombre: 'Producto B', cantidad: 20 }
   * ];
   * ```
   * 
   * @type {TablaMercanciasDatos[]} Un arreglo de objetos que define los datos de la tabla.
   */
  public tablaMercanciasConfigDatos: TablaMercanciasDatos[] = [];


  /**
   * Propiedad que almacena una lista de configuraciones de opciones para una tabla.
   * 
   * Esta lista se utiliza para gestionar las opciones seleccionadas en el componente
   * de datos de solicitud. Cada elemento de la lista representa una configuración
   * específica que puede ser seleccionada por el usuario.
   * 
   * @type {TablaOpcionConfig[]} - Arreglo de configuraciones de opciones para la tabla.
   */
  public seleccionadoopcionDatos: TablaOpcionConfig[] = [];

  
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
   * Propiedad que almacena una lista de configuraciones de la tabla SCIAN seleccionadas.
   * 
   * Esta propiedad se utiliza para gestionar los datos seleccionados en la tabla SCIAN 
   * dentro del componente. Cada elemento de la lista representa una configuración específica 
   * de la tabla SCIAN, que puede incluir información como identificadores, nombres y otros 
   * atributos relevantes.
   * 
   * @type {TablaScianConfig[]} - Arreglo de objetos de tipo `TablaScianConfig`.
   * 
   * Ejemplo de uso:
   * ```typescript
   * this.seleccionadoScianDatos.push({
   *   id: 1,
   *   nombre: 'Sector Industrial',
   *   descripcion: 'Descripción del sector'
   * });
   * ```
   * 
   * @remarks
   * - Esta propiedad se inicializa como un arreglo vacío.
   * - Se puede modificar dinámicamente para reflejar los datos seleccionados por el usuario.
   * 
   * @see TablaScianConfig - Definición de la estructura de configuración de la tabla SCIAN.
   */
  public seleccionadoScianDatos: TablaScianConfig[] = [];


  /**
   * Una propiedad pública que almacena una lista de objetos de tipo `TablaMercanciasDatos`.
   * 
   * Esta propiedad se utiliza para gestionar los datos seleccionados en una tabla de mercancías.
   * Cada elemento en la lista representa un conjunto de datos relacionados con una mercancía específica.
   * 
   * @type {TablaMercanciasDatos[]}
   * @remarks
   * - La lista puede estar vacía si no se ha seleccionado ninguna mercancía.
   * - Los datos almacenados en esta propiedad son utilizados para realizar operaciones específicas
   *   como la visualización, edición o eliminación de mercancías seleccionadas.
   * 
   * @example
   * ```typescript
   * // Ejemplo de uso:
   * componente.seleccionadoTablaMercanciasDatos = [
   *   { id: 1, nombre: 'Producto A', cantidad: 10 },
   *   { id: 2, nombre: 'Producto B', cantidad: 5 }
   * ];
   * ```
   */
  public seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[] = [];

  /**
   * que indica si el formulario está en modo solo lectura.
   * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
   *
   * @type {boolean}
   */
  esFormularioSoloLectura!: boolean;


  /**
   * Constructor de la clase `ContenedorDeDatosSolicitudComponent`.
   * 
   * Este constructor inicializa las dependencias necesarias para el componente y configura
   * una suscripción al estado de consulta utilizando `consultaQuery.selectConsultaioState$`.
   * 
   * @param Tramite260205Query - Servicio para realizar consultas relacionadas con el trámite 260205.
   * @param Tramite260205Store - Almacén de estado para gestionar datos relacionados con el trámite 260205.
   * @param consultaQuery - Servicio para realizar consultas relacionadas con el estado de la solicitud.
   * 
   * La suscripción al estado de consulta verifica si el estado actual no está en modo de creación 
   * (`!seccionState.create`) y si el `procedureId` corresponde al trámite 260205. En caso de cumplir 
   * estas condiciones, se actualiza la propiedad `esFormularioSoloLectura` con el valor de 
   * `seccionState.readonly`, indicando si el formulario debe ser de solo lectura.
   */
  constructor(
    private Tramite260205Query: Tramite260205Query,
    private Tramite260205Store: Tramite260205Store,
    private consultaQuery: ConsultaioQuery,
    private cdRef: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
    )
    .subscribe((seccionState) => {
      if(!seccionState.create && seccionState.procedureId === '260205') {
        this.esFormularioSoloLectura = seccionState.readonly;
      } 
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al observable `selectTramiteState$` del servicio `Tramite260205Query`
   * para obtener el estado actual del trámite y actualizar las configuraciones de datos
   * correspondientes en el componente. Utiliza operadores de RxJS como `takeUntil` para
   * gestionar la suscripción y evitar fugas de memoria.
   * 
   * - `selectTramiteState$`: Observable que emite el estado actual del trámite.
   * - `takeUntil(this.destroyNotifier$)`: Operador que cancela la suscripción cuando el
   *   componente se destruye.
   * - `map`: Transforma el estado emitido por el observable para actualizar las propiedades
   *   locales del componente.
   * 
   * Actualizaciones realizadas:
   * - `this.tramiteState`: Se asigna el estado actual del trámite.
   * - `this.opcionConfig.datos`: Se actualiza con los datos de configuración de opciones
   *   del estado del trámite.
   * - `this.scianConfig.datos`: Se actualiza con los datos de configuración de SCIAN
   *   del estado del trámite.
   * - `this.tablaMercanciasConfig.datos`: Se actualiza con los datos de configuración
   *   de la tabla de mercancías del estado del trámite.
   * 
   * @returns void
   */
  ngOnInit(): void {
    this.Tramite260205Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),        
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.opcionConfig.datos = this.tramiteState.opcionConfigDatos;
          this.scianConfig.datos = this.tramiteState.scianConfigDatos;
          this.tablaMercanciasConfig.datos =
            JSON.parse(JSON.stringify(seccionState.tablaMercanciasConfigDatos));
        })
      )
      .subscribe();
  }

  /**
   * Maneja el evento cuando se selecciona una opción en la tabla.
   *
   * @param event - Un arreglo de configuraciones de opciones de la tabla (`TablaOpcionConfig[]`)
   *                que representa las opciones seleccionadas.
   *
   * Actualiza la configuración de datos en el store `Tramite260205Store`
   * con las opciones seleccionadas.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.Tramite260205Store.updateOpcionConfigDatos(event);
  }

  /**
   * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
   *
   * @param event - Arreglo de configuraciones seleccionadas de la tabla SCIAN.
   *
   * Este método actualiza los datos de configuración SCIAN en el estado del trámite 260204
   * utilizando el evento proporcionado.
   */
  scianSeleccionado(event: TablaScianConfig[]): void {
    this.Tramite260205Store.updateScianConfigDatos(event);
  }

  /**
   * Maneja el evento de selección de mercancías en la tabla.
   *
   * @param event - Arreglo de objetos de tipo `TablaMercanciasDatos` que contiene
   *                los datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.zone.run(() => {
    this.Tramite260205Store.updateTablaMercanciasConfigDatos([...event]);
    this.cdRef.markForCheck();
    });
  }

  /**
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param event - El nuevo estado del formulario de datos de la solicitud de tipo `DatosSolicitudFormState`.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.Tramite260205Store.updateDatosSolicitudFormState(event);
  }

  /**
   * Actualiza el estado de la tienda `Tramite260205Store` con los datos seleccionados
   * provenientes del evento de la tabla.
   *
   * @param event - Objeto que contiene las opciones seleccionadas, los datos SCIAN seleccionados
   * y las mercancías seleccionadas de la tabla.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.Tramite260205Store.update((state) => ({
      ...state,
      seleccionadoopcionDatos: event.opcionSeleccionados,
      seleccionadoScianDatos: event.scianSeleccionados,
      seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
      opcionesColapsableState: event.opcionesColapsableState,
    }));
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

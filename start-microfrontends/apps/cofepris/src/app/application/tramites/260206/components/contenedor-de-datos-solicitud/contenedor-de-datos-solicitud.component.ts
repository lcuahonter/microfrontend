import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatosDeTablaSeleccionados, DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig, TablaSeleccion } from '../../../../shared/models/datos-solicitud.model';
import { OPCION_TABLA, PRODUCTO_TABLA, SCIAN_TABLA } from '../../../../shared/constantes/datos-solicitud.enum';
import { SeccionLibQuery, SeccionLibState, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Tramite260206State, Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { distinctUntilChanged, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DATOS_ELEMENTOS_REQUERIDOS } from '../../constantes/maquila-materias-primas.enum';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { Subject } from 'rxjs';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-contenedor-de-datos-solicitud',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  templateUrl: './contenedor-de-datos-solicitud.component.html',
  styleUrl: './contenedor-de-datos-solicitud.component.scss',
})
/**
 * Componente Angular que gestiona la lógica y el estado relacionado con los datos de la solicitud
 * en el trámite 260206. Este componente interactúa con el estado global de la aplicación a través
 * de `Tramite260206Store` y `SeccionLibStore`, y maneja eventos relacionados con la selección de datos
 * en tablas y la validación de formularios.
 * 
 * @implements {OnInit} - Implementa el ciclo de vida `OnInit` para inicializar el estado del componente.
 * @implements {OnDestroy} - Implementa el ciclo de vida `OnDestroy` para limpiar recursos al destruir el componente.
 * 
 * @class
 */
export class ContenedorDeDatosSolicitudComponent implements OnInit, OnDestroy{
  /**
   * @private
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo la limpieza de suscripciones
   * y otros recursos para evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @public
   * @type {Tramite260206State}
   * @description Representa el estado actual del trámite 260206.
   */
  public tramiteState!: Tramite260206State;

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
   * Identificador único del procedimiento asociado a este componente.
   * Este valor es de solo lectura y se utiliza para referenciar el procedimiento específico.
   */
  public readonly idProcedimiento:number = 260206;
  /**
   * Configuración de opciones para la tabla.
   * 
   * @property {string | undefined} tipoSeleccionTabla - Define el tipo de selección en la tabla. Puede ser indefinido.
   * @property {any} configuracionTabla - Configuración específica de la tabla, basada en la constante OPCION_TABLA.
   * @property {TablaOpcionConfig[]} datos - Arreglo de datos que contiene la configuración de las opciones de la tabla.
   */
  public opcionConfig = {
    tipoSeleccionTabla: undefined,
    configuracionTabla: OPCION_TABLA,
    datos: [] as TablaOpcionConfig[],
  }
  /**
   * Configuración para la tabla SCIAN en el componente.
   * 
   * @property {TablaSeleccion} tipoSeleccionTabla - Define el tipo de selección en la tabla (por ejemplo, CHECKBOX).
   * @property {any} configuracionTabla - Configuración específica de la tabla SCIAN.
   * @property {TablaScianConfig[]} datos - Arreglo que contiene los datos de configuración para la tabla SCIAN.
   */
  public scianConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: SCIAN_TABLA,
    datos: [] as TablaScianConfig[],
  }
  /**
   * Configuración para la tabla de mercancías.
   * 
   * @property {TablaSeleccion} tipoSeleccionTabla - Define el tipo de selección en la tabla, en este caso, un checkbox.
   * @property {any} configuracionTabla - Configuración específica de la tabla, basada en la constante `PRODUCTO_TABLA`.
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
   * que se utiliza para gestionar y mostrar datos relacionados con el SCIAN 
   * (Sistema de Clasificación Industrial de América del Norte).
   */
  public scianConfigDatos: TablaScianConfig[] = [];
  /**
   * Configuración de datos para la tabla de mercancías.
   * 
   * Esta propiedad almacena un arreglo de objetos de tipo `TablaMercanciasDatos`,
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
   * Arreglo que almacena la configuración de la tabla SCIAN seleccionada.
   * 
   * Este arreglo se utiliza para gestionar los datos relacionados con la selección
   * de elementos en la tabla SCIAN dentro del componente.
   */
  public seleccionadoScianDatos: TablaScianConfig[] = [];
  /**
   * Arreglo que almacena los datos seleccionados de la tabla de mercancías.
   * 
   * Este arreglo se utiliza para gestionar y manipular los datos seleccionados
   * en la tabla de mercancías dentro del componente.
   */
  public seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[] = [];
  
  /* @property {SeccionLibState} seccion
  * @description Representa el estado de la sección en el componente. 
  * Se utiliza para manejar y almacenar datos relacionados con la sección específica.
  */
  private seccion!: SeccionLibState;

  /**
   * Lista de elementos requeridos utilizados en el componente.
   * 
   * Esta propiedad contiene los datos necesarios para representar
   * los elementos requeridos en la solicitud. Los datos son obtenidos
   * desde la constante `DATOS_ELEMENTOS_REQUERIDOS`.
   */
  public elementosRequeridos = DATOS_ELEMENTOS_REQUERIDOS;

  /**
   * que indica si el formulario está en modo solo lectura.
   * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
   *
   * @type {boolean}
   */
  esFormularioSoloLectura!: boolean;

  /**
   * Constructor de la clase que inyecta dependencias relacionadas con el trámite 260206 y el estado de secciones.
   *
   * @param {Tramite260206Query} tramite260206Query - Consulta del estado del trámite 260206.
   * @param {Tramite260206Store} tramite260206Store - Almacén del estado del trámite 260206.
   * @param {SeccionLibStore} seccionStore - Almacén del estado de la sección.
   * @param {SeccionLibQuery} seccionQuery - Consulta del estado de la sección.
   * @param {ConsultaioQuery} consultaQuery - Consulta del estado general del formulario.
   */
  constructor(private tramite260206Query: Tramite260206Query,
    private tramite260206Store: Tramite260206Store,
    private seccionStore: SeccionLibStore, private seccionQuery: SeccionLibQuery,
    private consultaQuery: ConsultaioQuery
    
  ) {
    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
    )
    .subscribe((seccionState) => {
      if(!seccionState.create && seccionState.procedureId === '260206') {
        this.esFormularioSoloLectura = seccionState.readonly;
      } 
    });
   }

  /**
   * Inicializa el componente suscribiéndose a los estados del trámite y de la sección.
   * 
   * - Actualiza las configuraciones locales (`opcionConfig`, `scianConfig`, `tablaMercanciasConfig`) a partir del estado del trámite.
   * - Asigna el estado actual de la sección a la propiedad local `seccion`.
   * 
   * Las suscripciones se cancelan automáticamente al destruir el componente.
   */
  ngOnInit(): void {
    this.tramite260206Query.selectTramiteState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),      
      map((seccionState) => {
        this.tramiteState = seccionState;
        this.opcionConfig.datos = this.tramiteState.opcionConfigDatos;
        this.scianConfig.datos = this.tramiteState.scianConfigDatos;
        this.tablaMercanciasConfig.datos = JSON.parse(JSON.stringify(this.tramiteState.tablaMercanciasConfigDatos));
      })
    ).subscribe();

    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
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
   * Actualiza la configuración de datos en el store `tramite260206Store` 
   * con las opciones seleccionadas.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.tramite260206Store.updateOpcionConfigDatos(event);
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
    this.tramite260206Store.updateScianConfigDatos(event);    
  }

  /**
   * Maneja el evento de selección de mercancías en la tabla.
   * 
   * @param event - Arreglo de objetos de tipo `TablaMercanciasDatos` que contiene 
   *                los datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.tramite260206Store.updateTablaMercanciasConfigDatos(event);
  }


  /**
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param event - El nuevo estado del formulario de datos de la solicitud de tipo `DatosSolicitudFormState`.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260206Store.updateDatosSolicitudFormState(event);
   
  }

  /**
   * Verifica si el formulario es válido.
   * 
   * Recorre todos los controles del formulario y verifica si alguno de ellos
   * está habilitado e inválido. Si encuentra un control que cumple con estas
   * condiciones, retorna `false`. Si todos los controles habilitados son válidos,
   * retorna `true`.
   * 
   * @returns {boolean} `true` si todos los controles habilitados son válidos, 
   *                    `false` si al menos uno de los controles habilitados es inválido.
   */
  esFormValido(): boolean {
    if (this.tramiteState.datosSolicitudFormState.rfcSanitario) {
      return true;
    }
    return false;
  }

  /**
   * Actualiza el estado de la tienda `tramite260206Store` con los datos seleccionados
   * provenientes del evento de la tabla.
   *
   * @param event - Objeto que contiene las opciones seleccionadas, los datos SCIAN seleccionados
   * y las mercancías seleccionadas de la tabla.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260206Store.update((state) => ({
      ...state,
      seleccionadoopcionDatos: event.opcionSeleccionados,
      seleccionadoScianDatos: event.scianSeleccionados,
      seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
      opcionesColapsableState: event.opcionesColapsableState
    }))
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

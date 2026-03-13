/**
 * @fileoverview
 * El `ContenedorDeDatosSolicitudComponent` es un componente de Angular diseñado para gestionar y mostrar los datos de la solicitud
 * en el flujo del trámite 260208. Este componente permite la configuración y selección de datos en tablas como opciones, SCIAN y mercancías.
 * También interactúa con el store `Tramite260208Store` para actualizar el estado del trámite.
 *
 * @module ContenedorDeDatosSolicitudComponent
 * @description
 * Este componente actúa como un contenedor para gestionar y actualizar los datos de la solicitud, incluyendo las tablas de opciones,
 * SCIAN y mercancías, en el flujo del trámite 260208.
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  PRODUCTO_TABLA_218,
  SCIAN_TABLA,
} from '../../../../shared/constantes/datos-solicitud.enum';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite260208State,
  Tramite260208Store,
} from '../../estados/tramite260208Store.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ID_PROCEDIMIENTO } from '../../constants/pasos.enum';
import { Tramite260208Query } from '../../estados/tramite260208Query.query';

/**
 * @component
 * @name ContenedorDeDatosSolicitudComponent
 * @description
 * Componente que gestiona y muestra los datos de la solicitud en el flujo del trámite 260208.
 * Permite la configuración y selección de datos en tablas como opciones, SCIAN y mercancías.
 * También interactúa con el store `Tramite260208Store` para actualizar el estado del trámite.
 *
 * @selector app-contenedor-de-datos-solicitud
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./contenedor-de-datos-solicitud.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./contenedor-de-datos-solicitud.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - DatosDeLaSolicitudComponent: Componente compartido para gestionar los datos de la solicitud.
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
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Sujeto utilizado para manejar la destrucción de observables y evitar fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Tramite260208State} tramiteState
   * @description
   * Estado actual del trámite 260208.
   */
  public tramiteState!: Tramite260208State;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description
   * Indica si el formulario está en modo solo lectura. Cuando es `true`, los campos no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @property {number} idProcedimiento
   * @description
   * Identificador del procedimiento actual.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * @property {object} opcionConfig
   * @description
   * Configuración de la tabla de opciones seleccionables por el usuario.
   */
  public opcionConfig = {
    tipoSeleccionTabla: undefined,
    configuracionTabla: OPCION_TABLA,
    datos: [] as TablaOpcionConfig[],
  };

  /**
   * @property {object} scianConfig
   * @description
   * Configuración de la tabla SCIAN (código de actividades económicas).
   */
  public scianConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: SCIAN_TABLA,
    datos: [] as TablaScianConfig[],
  };

  /**
   * @property {object} tablaMercanciasConfig
   * @description
   * Configuración de la tabla de mercancías (productos).
   */
  public tablaMercanciasConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: PRODUCTO_TABLA_218,
    datos: [] as TablaMercanciasDatos[],
  };

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
   * @constructor
   * @description
   * Constructor que inyecta las dependencias necesarias para manejar el estado del trámite y los datos de usuario.
   *
   * @param {Tramite260208Query} tramite260208Query - Servicio de consulta para obtener el estado del trámite 260208.
   * @param {Tramite260208Store} tramite260208Store - Store para manejar el estado del trámite 260208.
   * @param {ConsultaioQuery} consultaQuery - Servicio de consulta para obtener datos de usuario.
   */
  constructor(
    private tramite260208Query: Tramite260208Query,
    private tramite260208Store: Tramite260208Store,
    private consultaQuery: ConsultaioQuery
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
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene el estado del trámite 260208 y actualiza las configuraciones de las tablas.
   */
  ngOnInit(): void {
    this.tramite260208Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.opcionConfig.datos = this.tramiteState.opcionConfigDatos;
          this.scianConfig.datos = this.tramiteState.scianConfigDatos;
          this.tablaMercanciasConfig.datos = JSON.parse(
            JSON.stringify(this.tramiteState.tablaMercanciasConfigDatos)
          );
        })
      )
      .subscribe();
  }

  /**
   * @method opcionSeleccionado
   * @description
   * Maneja el evento cuando se selecciona una opción en la tabla.
   *
   * @param {TablaOpcionConfig[]} event - Opciones seleccionadas en la tabla.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.tramite260208Store.updateOpcionConfigDatos(event);
  }

  /**
   * @method scianSeleccionado
   * @description
   * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
   *
   * @param {TablaScianConfig[]} event - Elementos seleccionados en la tabla SCIAN.
   */
  scianSeleccionado(event: TablaScianConfig[]): void {
    this.tramite260208Store.updateScianConfigDatos(event);
  }

  /**
   * @method mercanciasSeleccionado
   * @description
   * Maneja el evento cuando se seleccionan mercancías en la tabla de mercancías.
   *
   * @param {TablaMercanciasDatos[]} event - Mercancías seleccionadas en la tabla.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.tramite260208Store.updateTablaMercanciasConfigDatos(event);
  }

  /**
   * @method datasolicituActualizar
   * @description
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260208Store.updateDatosSolicitudFormState(event);
  }

  /**
   * @method datosDeTablaSeleccionados
   * @description
   * Actualiza el estado del store con los datos seleccionados de las tablas.
   *
   * @param {DatosDeTablaSeleccionados} event - Datos seleccionados de las tablas.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260208Store.update((state) => ({
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
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta antes de destruir el componente.
   * Emite un valor para notificar a los observables que deben finalizar.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

/**
 * @fileoverview
 * El `ContenedorDeDatosSolicitudComponent` es un componente de Angular diseñado para gestionar la configuración y los datos relacionados con la solicitud del trámite 260101.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260101Store` y la consulta `Tramite260101Query`.
 *
 * @module ContenedorDeDatosSolicitudComponent
 * @description
 * Este componente actúa como un contenedor para gestionar las tablas de opciones, SCIAN y mercancías, y permite la actualización de datos seleccionados en dichas tablas.
 * También maneja el estado del formulario de datos de la solicitud.
 */

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Observable, map, takeUntil } from 'rxjs';
import {
  Tramite260101State,
  Tramite260101Store,
} from '../../estados/tramite260101Store.store';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { ImportacionProductosService } from '../../services/importacion-productos.service';
import { Subject } from 'rxjs';
import { TablaAcciones } from '@libs/shared/data-access-user/src';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';

/**
 * @component
 * @name ContenedorDeDatosSolicitudComponent
 * @description
 * Componente contenedor que gestiona la configuración y los datos relacionados con la solicitud.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260101Store` y la consulta `Tramite260101Query`.
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
   * @property {boolean} formularioDeshabilitado
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * Observable utilizado para notificar y cancelar suscripciones activas al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Tramite260101State} tramiteState
   * Estado actual del trámite, obtenido del store `Tramite260101Store`.
   */
  public tramiteState!: Tramite260101State;

  /**
   * @property {object} opcionConfig
   * Configuración de la tabla de opciones.
   */
  public opcionConfig = {
    tipoSeleccionTabla: undefined,
    configuracionTabla: OPCION_TABLA,
    datos: [] as TablaOpcionConfig[],
  };

  /**
   * @property {object} scianConfig
   * Configuración de la tabla SCIAN.
   */
  public scianConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: SCIAN_TABLA,
    datos: [] as TablaScianConfig[],
  };

  /**
   * @property {object} tablaMercanciasConfig
   * Configuración de la tabla de mercancías.
   */
  public tablaMercanciasConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: PRODUCTO_TABLA,
    datos: [] as TablaMercanciasDatos[],
  };

  /**
   * @property {TablaScianConfig[]} scianConfigDatos
   * Datos seleccionados de la tabla SCIAN.
   */
  public scianConfigDatos: TablaScianConfig[] = [];

  /**
   * @property {TablaMercanciasDatos[]} tablaMercanciasConfigDatos
   * Datos seleccionados de la tabla de mercancías.
   */
  public tablaMercanciasConfigDatos: TablaMercanciasDatos[] = [];

  /**
   * @property {TablaOpcionConfig[]} seleccionadoopcionDatos
   * Opciones seleccionadas en la tabla de opciones.
   */
  public seleccionadoopcionDatos: TablaOpcionConfig[] = [];

  /**
   * @property {TablaScianConfig[]} seleccionadoScianDatos
   * Datos seleccionados en la tabla SCIAN.
   */
  public seleccionadoScianDatos: TablaScianConfig[] = [];

  /**
   * @property {TablaMercanciasDatos[]} seleccionadoTablaMercanciasDatos
   * Datos seleccionados en la tabla de mercancías.
   */
  public seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[] = [];

  /**
   * @property {number} idProcedimiento
   * Identificador único del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Lista de elementos que son obligatorios para completar el formulario.
   * Actualmente incluye solo el campo 'correoElectronico', pero se puede expandir
   * según los requisitos del sistema.
   */
  elementosRequeridos: string[] = [
    'correoElectronico',
    'denominacionRazon',
    'scian',
    'manifiestosCasillaDeVerificacion',
    'manifesto',
  ];

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
   * Lista de acciones disponibles en la tabla.
   *
   * Se inicializa con la acción `VER` por defecto.
   * Puede configurarse para habilitar diferentes acciones según el contexto.
   *
   * @type {TablaAcciones[]}
   */
  tablaAcciones: TablaAcciones[] = [TablaAcciones.VER];

  /**
   * Valor seleccionado de la tabla de opciones.
   *
   * Contiene la fila (`row`) y la columna (`column`) relacionadas
   * con la acción ejecutada en la tabla.
   *
   * @type {{ row: TablaOpcionConfig; column: string }}
   */
  solitudValor: { row: TablaOpcionConfig; column: string } = {} as {
    row: TablaOpcionConfig;
    column: string;
  };

  /**
   * @constructor
   * Constructor que inyecta las dependencias `Tramite260101Query` y `Tramite260101Store`.
   *
   * @param {Tramite260101Query} tramite260101Query - Consulta para obtener el estado del trámite.
   * @param {Tramite260101Store} tramite260101Store - Store que administra el estado del trámite.
   * @param {ImportacionProductosService} importacionProductosService - Servicio para operaciones relacionadas con productos de importación.
   */
  constructor(
    private tramite260101Query: Tramite260101Query,
    private tramite260101Store: Tramite260101Store,
    private importacionProductosService: ImportacionProductosService
  ) {}

  /**
   * @method ngOnInit
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado del trámite y actualiza las configuraciones de las tablas.
   */
  ngOnInit(): void {
    this.tramite260101Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.opcionConfig.datos = this.tramiteState.opcionConfigDatos;
          this.scianConfig.datos = this.tramiteState.scianConfigDatos;
          this.tablaMercanciasConfig.datos =
            this.tramiteState.tablaMercanciasConfigDatos;
        })
      )
      .subscribe();
  }

  /**
   * @method opcionSeleccionado
   * Maneja el evento cuando se selecciona una opción en la tabla.
   *
   * @param {TablaOpcionConfig[]} event - Opciones seleccionadas en la tabla.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.tramite260101Store.updateOpcionConfigDatos(event);
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
   * @method scianSeleccionado
   * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
   *
   * @param {TablaScianConfig[]} event - Datos seleccionados en la tabla SCIAN.
   */
  scianSeleccionado(event: TablaScianConfig[]): void {
    this.tramite260101Store.updateScianConfigDatos(event);
  }

  /**
   * @method mercanciasSeleccionado
   * Maneja el evento de selección de mercancías en la tabla.
   *
   * @param {TablaMercanciasDatos[]} event - Datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.tramite260101Store.updateTablaMercanciasConfigDatos(event);
  }

  /**
   * @method datasolicituActualizar
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260101Store.updateDatosSolicitudFormState(event);
  }

  /**
   * @method datosDeTablaSeleccionados
   * Actualiza el estado del store con los datos seleccionados de las tablas.
   *
   * @param {DatosDeTablaSeleccionados} event - Datos seleccionados de las tablas.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260101Store.update((state) => ({
      ...state,
      seleccionadoopcionDatos: event.opcionSeleccionados,
      seleccionadoScianDatos: event.scianSeleccionados,
      seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
      opcionesColapsableState: event.opcionesColapsableState,
    }));
  }

  /**
   * Maneja las acciones seleccionadas en la tabla de opciones.
   *
   * Asigna el valor del evento recibido a la propiedad `solitudValor`.
   * Si la acción seleccionada corresponde a **VER**, se realiza la llamada
   * a la API para obtener los datos del registro de toma de muestras de mercancías.
   *
   * Una vez recibida la respuesta, se actualiza el formulario con los datos obtenidos.
   *
   * @param event - Objeto que contiene la fila (`row`) y la columna (`column`) seleccionadas en la tabla.
   *
   * @example
   * accionesSolitudValor({ row: filaSeleccionada, column: TablaAcciones.VER });
   */
  accionesSolitudValor(event: {
    row: TablaOpcionConfig;
    column: string;
  }): void {
    this.solitudValor = event;
    if (this.solitudValor.column === TablaAcciones.VER) {
      // Actualice los datos al hacer clic en "Ver detalles". Después de la llamada a la API, complete los datos previamente.
      this.getRegistroTomaMuestrasMercanciasData()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if (resp) {
            this.actualizarEstadoFormulario(resp);
          }
        });
    }
  }

  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260101State> {
    return this.importacionProductosService.getRegistroTomaMuestrasMercanciasData();
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param DATOS - Estado de la solicitud `Tramite260101State` con la información
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Tramite260101State): void {
    this.tramite260101Store.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }

  /**
   * @method ngOnDestroy
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera recursos y cancela suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

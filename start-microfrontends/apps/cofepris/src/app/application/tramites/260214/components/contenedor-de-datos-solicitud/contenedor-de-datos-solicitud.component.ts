/**
 * @fileoverview
 * El `ContenedorDeDatosSolicitudComponent` es un componente de Angular diseñado para gestionar la configuración y los datos relacionados con la solicitud del trámite 260214.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260214Store` y la consulta `Tramite260214Query`.
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
import {
  Tramite260214State,
  Tramite260214Store,
} from '../../estados/tramite260214Store.store';
import { map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { Subject } from 'rxjs';
import { Tramite260214Query } from '../../estados/tramite260214Query.query';

/**
 * @component
 * @name ContenedorDeDatosSolicitudComponent
 * @description
 * Componente contenedor que gestiona la configuración y los datos relacionados con la solicitud.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260214Store` y la consulta `Tramite260214Query`.
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
   * @property {Tramite260214State} tramiteState
   * Estado actual del trámite, obtenido del store `Tramite260214Store`.
   */
  public tramiteState!: Tramite260214State;

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
  elementosRequeridos: string[] = ['correoElectronico','denominacionRazon','scian','manifiestosCasillaDeVerificacion','manifesto'];

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
   * Constructor que inyecta las dependencias `Tramite260214Query` y `Tramite260214Store`.
   *
   * @param {Tramite260214Query} tramite260214Query - Consulta para obtener el estado del trámite.
   * @param {Tramite260214Store} tramite260214Store - Store que administra el estado del trámite.
   */
  constructor(
    private tramite260214Query: Tramite260214Query,
    private tramite260214Store: Tramite260214Store
  ) { }

  /**
   * @method ngOnInit
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado del trámite y actualiza las configuraciones de las tablas.
   */
  ngOnInit(): void {
    this.tramite260214Query.selectTramiteState$
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
    this.tramite260214Store.updateOpcionConfigDatos(event);
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
    this.tramite260214Store.updateScianConfigDatos(event);
  }

  /**
   * @method mercanciasSeleccionado
   * Maneja el evento de selección de mercancías en la tabla.
   *
   * @param {TablaMercanciasDatos[]} event - Datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.tramite260214Store.updateTablaMercanciasConfigDatos(event);
  }

  /**
   * @method datasolicituActualizar
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260214Store.updateDatosSolicitudFormState(event);
  }

  /**
   * @method datosDeTablaSeleccionados
   * Actualiza el estado del store con los datos seleccionados de las tablas.
   *
   * @param {DatosDeTablaSeleccionados} event - Datos seleccionados de las tablas.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260214Store.update((state) => ({
      ...state,
      seleccionadoopcionDatos: event.opcionSeleccionados,
      seleccionadoScianDatos: event.scianSeleccionados,
      seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
      opcionesColapsableState: event.opcionesColapsableState,
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

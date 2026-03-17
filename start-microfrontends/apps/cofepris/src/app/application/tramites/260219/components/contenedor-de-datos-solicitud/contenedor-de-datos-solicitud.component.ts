import { Component, OnDestroy, OnInit } from '@angular/core';
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
  Tramite260219State,
  Tramite260219Store,
} from '../../estados/tramite260219Store.store';
import { map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ELEMENTOS_REQUERIDOS } from '../../constants/remedios-herbolarios.enum';
import { ID_PROCEDIMIENTO } from '../../constants/remedios-herbolarios.enum';
import { Subject } from 'rxjs';
import { Tramite260219Query } from '../../estados/tramite260219Query.query';

/**
 * @component
 * @name ContenedorDeDatosSolicitudComponent
 * @description
 * Componente que actúa como contenedor para manejar los datos de la solicitud del trámite 260219.
 * Permite la selección y actualización de datos relacionados con opciones, SCIAN y mercancías.
 *
 * @selector app-contenedor-de-datos-solicitud
 * @standalone true
 * @imports
 * - CommonModule
 * - DatosDeLaSolicitudComponent
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
   * Observable utilizado para notificar la destrucción del componente y liberar recursos.
   */
  private destroyNotifier$: Subject<void> = new Subject();

   /**
   * que indica si el formulario está en modo solo lectura.
   * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
   *
   * @type {boolean}
   */
   esFormularioSoloLectura!: boolean;

  /**
   * @property {Tramite260219State} tramiteState
   * @description
   * Estado actual del trámite 260219.
   */
  public tramiteState!: Tramite260219State;

  /**
   * @property {object} opcionConfig
   * @description
   * Configuración de la tabla de opciones.
   */
  public opcionConfig = {
    tipoSeleccionTabla: undefined,
    configuracionTabla: OPCION_TABLA,
    datos: [] as TablaOpcionConfig[],
  };

  /**
   * @property {object} scianConfig
   * @description
   * Configuración de la tabla SCIAN.
   */
  public scianConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: SCIAN_TABLA,
    datos: [] as TablaScianConfig[],
  };

  /**
   * @property {object} tablaMercanciasConfig
   * @description
   * Configuración de la tabla de mercancías.
   */
  public tablaMercanciasConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: PRODUCTO_TABLA,
    datos: [] as TablaMercanciasDatos[],
  };

  /**
   * @property {TablaScianConfig[]} scianConfigDatos
   * @description
   * Datos seleccionados de la tabla SCIAN.
   */
  public scianConfigDatos: TablaScianConfig[] = [];

  /**
   * @property {TablaMercanciasDatos[]} tablaMercanciasConfigDatos
   * @description
   * Datos seleccionados de la tabla de mercancías.
   */
  public tablaMercanciasConfigDatos: TablaMercanciasDatos[] = [];

  /**
   * @property {TablaOpcionConfig[]} seleccionadoopcionDatos
   * @description
   * Opciones seleccionadas en la tabla de opciones.
   */
  public seleccionadoopcionDatos: TablaOpcionConfig[] = [];

  /**
   * @property {TablaScianConfig[]} seleccionadoScianDatos
   * @description
   * Datos seleccionados en la tabla SCIAN.
   */
  public seleccionadoScianDatos: TablaScianConfig[] = [];

  /**
   * @property {TablaMercanciasDatos[]} seleccionadoTablaMercanciasDatos
   * @description
   * Datos seleccionados en la tabla de mercancías.
   */
  public seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[] = [];

  /**
   * @property {string} idProcedimiento
   * @description
   * Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

    /**
   * @property {string[]} elementosRequeridos
   * @description
   * Lista de elementos requeridos para completar el formulario o proceso.
   */
    public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS;

  /**
   * @constructor
   * @description
   * Inicializa el componente con las dependencias necesarias.
   * @param {Tramite260219Query} tramite260219Query - Consulta para acceder al estado del trámite.
   * @param {Tramite260219Store} tramite260219Store - Tienda para actualizar el estado del trámite.
   */
  constructor(
    private tramite260219Query: Tramite260219Query,
    private tramite260219Store: Tramite260219Store,
    private consultaQuery: ConsultaioQuery
  ) {
        // No se necesita lógica de inicialización adicional.
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado del trámite y actualiza las configuraciones de las tablas.
   */
  ngOnInit(): void {
    this.tramite260219Query.selectTramiteState$
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
      this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
      )
      .subscribe((seccionState) => {
        if(!seccionState.create && seccionState.procedureId === '260219') {
          this.esFormularioSoloLectura = seccionState.readonly;
        } 
      });
  }

  /**
   * Maneja el evento cuando se selecciona una opción en la tabla.
   * @param event - Un arreglo de configuraciones de opciones de la tabla (`TablaOpcionConfig[]`)
   *                que representa las opciones seleccionadas.
   * Actualiza la configuración de datos en el store `tramite260219Store`
   * con las opciones seleccionadas.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.tramite260219Store.updateOpcionConfigDatos(event);
  }

  /**
   * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
   * @param event - Arreglo de configuraciones seleccionadas de la tabla SCIAN.
   * Este método actualiza los datos de configuración SCIAN en el estado del trámite 260219
   * utilizando el evento proporcionado.
   */
  scianSeleccionado(event: TablaScianConfig[]): void {
    this.tramite260219Store.updateScianConfigDatos(event);
  }

  /**
   * @method mercanciasSeleccionado
   * @description
   * Maneja el evento de selección de mercancías en la tabla.
   *
   * @param {TablaMercanciasDatos[]} event - Datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.tramite260219Store.updateTablaMercanciasConfigDatos(event);
  }

  /**
   * @method datasolicituActualizar
   * @description
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260219Store.updateDatosSolicitudFormState(event);
  }

  /**
   * @method datosDeTablaSeleccionados
   * @description
   * Actualiza el estado del store con los datos seleccionados de las tablas.
   *
   * @param {DatosDeTablaSeleccionados} event - Datos seleccionados de las tablas.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260219Store.update((state) => ({
      ...state,
      seleccionadoopcionDatos: event.opcionSeleccionados,
      seleccionadoScianDatos: event.scianSeleccionados,
      seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
      opcionesColapsableState: event.opcionesColapsableState,
    }));
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se llama antes de destruir el componente.
   * Libera recursos y completa el observable `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatosDeTablaSeleccionados,
  DatosSolicitudFormState,
  TablaMercanciasDatos,
  TablaOpcionConfig,
  TablaScianConfig,
  TablaSeleccion,
} from '../../../../shared/models/shared2606/datos-solicitud.model';
import {
  OPCION_TABLA,
  PRODUCTO_TABLA,
  SCIAN_TABLA,
} from '../../../../shared/constantes/shared2606/datos-solicitud.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite260603State, Tramite260603Store } from '../../estados/tramite260603Store.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/shared2606/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ID_PROCEDIMIENTO } from '../../constantes/aviso-de-importacion.enum';
import { Tramite260603Query } from '../../estados/tramite260603Query.query';

/**
 * @component DatosSolicitudComponent
 * @description
 * Componente encargado de gestionar y mostrar los datos de la solicitud
 * para el trámite 260603, incluyendo la configuración y selección de tablas
 * relacionadas con opciones, SCIAN y mercancías.
 */
@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    DatosDeLaSolicitudComponent
  ],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.scss',
})
/**
 * @Component DatosSolicitudComponent
 * @description
 * Componente encargado de gestionar y mostrar los datos de la solicitud
 * para el trámite 260603, incluyendo la configuración y selección de tablas
 * relacionadas con opciones, SCIAN y mercancías.
 */
export class DatosSolicitudComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario está deshabilitado. Por defecto es `false`.
   */
  @Input()
  formularioDeshabilitado: boolean = false;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Por defecto es `false`.
   */
  public esFormularioSoloLectura: boolean = false;
  
  /**
   * Campos requeridos:
   * - denominacionRazon → Denominación o razón social
   * - rfcSanitario, correoElectronico → RFC sanitario y correo electrónico
   */
  denominacionRazon: string =
    'scian,denominacionRazon,correoElectronico,localidad,colonia';

  /**
   * @property {Tramite260603State} tramite260603State
   * @description
   * Estado actual del trámite 260603.
   */
  public tramite260603State!: Tramite260603State;

  /**
   * @property {object} opcionConfig
   * @description
   * Configuración de la tabla de opciones.
   */
  public opcionConfig = {
    /**
     * @property {undefined} tipoSeleccionTabla
     * @description
     * Tipo de selección de la tabla (no definido en este caso).
     */
    tipoSeleccionTabla: undefined,
    /**
     * @property {object} configuracionTabla
     * @description
     * Configuración de la tabla de opciones.
     */
    configuracionTabla: OPCION_TABLA,
    /**
     * @property {TablaOpcionConfig[]} datos
     * @description
     * Datos de la tabla de opciones.
     */
    datos: [] as TablaOpcionConfig[],
  };

  /**
   * @property {object} scianConfig
   * @description
   * Configuración de la tabla SCIAN.
   */
  public scianConfig = {
    /**
     * @property {TablaSeleccion} tipoSeleccionTabla
     * @description
     * Tipo de selección de la tabla (checkbox en este caso).
     */
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    /**
     * @property {object} configuracionTabla
     * @description
     * Configuración de la tabla SCIAN.
     */
    configuracionTabla: SCIAN_TABLA,
    /**
     * @property {TablaScianConfig[]} datos
     * @description
     * Datos de la tabla SCIAN.
     */
    datos: [] as TablaScianConfig[],
  };

  /**
   * @property {object} tablaMercanciasConfig
   * @description
   * Configuración de la tabla de mercancías.
   */
  public tablaMercanciasConfig = {
    /**
     * @property {TablaSeleccion} tipoSeleccionTabla
     * @description
     * Tipo de selección de la tabla (checkbox en este caso).
     */
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    /**
     * @property {object} configuracionTabla
     * @description
     * Configuración de la tabla de mercancías.
     */
    configuracionTabla: PRODUCTO_TABLA,
    /**
     * @property {TablaMercanciasDatos[]} datos
     * @description
     * Datos de la tabla de mercancías.
     */
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
   * @property {DatosDeLaSolicitudComponent} datosDeLaSolicitudComponent
   * @description
   * Referencia al componente hijo que maneja los datos de la solicitud.
   */
  @ViewChild(DatosDeLaSolicitudComponent)
  datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Observable utilizado para notificar la destrucción del componente y liberar recursos.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Inicializa el componente con las dependencias necesarias.
   *
   * @param {Tramite260603Query} tramite260603Query - Consulta para acceder al estado del trámite.
   * @param {Tramite260603Store} tramite260603Store - Tienda para actualizar el estado del trámite.
   * @param {ConsultaioQuery} consultaQuery - Consulta para acceder al estado de la sección de consultaio.
   */
  constructor(
    private tramite260603Query: Tramite260603Query,
    private tramite260603Store: Tramite260603Store,
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
   * Suscribe al estado del trámite y actualiza las configuraciones de las tablas.
   */
  ngOnInit(): void {
    this.tramite260603Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramite260603State = seccionState;
          this.opcionConfig.datos = this.tramite260603State.opcionConfigDatos;
          this.scianConfig.datos = this.tramite260603State.scianConfigDatos;
          this.tablaMercanciasConfig.datos = JSON.parse(
            JSON.stringify(this.tramite260603State.tablaMercanciasConfigDatos)
          );
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
   * Actualiza la configuración de datos en el store `tramite260603Store`
   * con las opciones seleccionadas.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.tramite260603Store.updateOpcionConfigDatos(event);
  }

  /**
   * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
   *
   * @param event - Arreglo de configuraciones seleccionadas de la tabla SCIAN.
   *
   * Este método actualiza los datos de configuración SCIAN en el estado del trámite 260603
   * utilizando el evento proporcionado.
   */
  scianSeleccionado(event: TablaScianConfig[]): void {
    this.tramite260603Store.updateScianConfigDatos(event);
  }

  /**
   * @method mercanciasSeleccionado
   * @description
   * Maneja el evento de selección de mercancías en la tabla.
   *
   * @param {TablaMercanciasDatos[]} event - Datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.seleccionadoTablaMercanciasDatos = event;
    this.tramite260603Store.updateTablaMercanciasConfigDatos(event);
  }

  /**
   * @method datasolicituActualizar
   * @description
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260603Store.updateDatosSolicitudFormState(event);
  }

  /**
   * @method datosDeTablaSeleccionados
   * @description
   * Actualiza el estado del store con los datos seleccionados de las tablas.
   *
   * @param {DatosDeTablaSeleccionados} event - Datos seleccionados de las tablas.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260603Store.update((state) => ({
      ...state,
      seleccionadoopcionDatos: event.opcionSeleccionados,
      seleccionadoScianDatos: event.scianSeleccionados,
      seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
      opcionesColapsableState: event.opcionesColapsableState,
    }));
  }

  /**
   * @method validarFormularioDatos
   * @description Valida el formulario de datos de la solicitud.
   * @returns {boolean} Indica si el formulario es válido.
   */
  validarContenedor(): boolean {
    return (
      this.datosDeLaSolicitudComponent?.formularioSolicitudValidacion() ?? false
    );
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

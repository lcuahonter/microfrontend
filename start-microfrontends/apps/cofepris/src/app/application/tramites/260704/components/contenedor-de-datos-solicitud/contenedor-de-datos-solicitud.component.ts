import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatosDeTablaSeleccionados,
  DatosSolicitudFormState,
  TablaMercanciasDatos,
  TablaOpcionConfig,
  TablaScianConfig,
  TablaSeleccion,
} from '../../../../shared/components/shared2607/models/datos-solicitud.model';
import {
  OPCION_TABLA,
  PRODUCTO_TABLA,
  SCIAN_TABLA,
} from '../../../../shared/constantes/datos-solicitud.enum';
import {
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
} from '@libs/shared/data-access-user/src';
import {
  Tramite260704State,
  Tramite260704Store,
} from '../../estados copy/stores/tramite260704Store.store';
import { map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DATOS_MERCANCIA_CLAVE_TABLA } from '../../../../shared/components/shared2607/constents/datos-solicitud.enum';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/shared2607/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { ELEMENTOS_REQUERIDOS } from '../../constantes/consumo-personal.enum';
import { Subject } from 'rxjs';
import { TablaMercanciaClaveConfig } from '../../../../shared/components/shared2607/models/datos-solicitud.model';
import { Tramite260704Query } from '../../estados copy/queries/tramite260704Query.query'

/**
 * @component ContenedorDeDatosSolicitudComponent
 * @description Componente contenedor para el trámite 260102, encargado
 * de gestionar la lógica y presentación de datos relacionados con la
 * solicitud. Integra `DatosDeLaSolicitudComponent` para mostrar/editar
 * información específica, y sincroniza el estado global mediante
 * `Tramite260704Store`.
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
   * @property destroyNotifier$
   * @description Subject utilizado para cancelar observables de manera ordenada
   * cuando el componente se destruye, evitando fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property tramiteState
   * @description Almacena el estado global del trámite 260102, obtenido desde
   * `Tramite260704Query`.
   * @type {Tramite260704State}
   */
  public tramiteState!: Tramite260704State;

  /**
   * @property idProcedimiento
   * @description Identificador numérico del trámite o procedimiento en curso.
   * @type {number}
   * @readonly
   */
  public readonly idProcedimiento: number = 260704;

  /**
   * @property opcionConfig
   * @description Objeto de configuración para la tabla de opciones.
   */
  public opcionConfig = {
    tipoSeleccionTabla: undefined,
    configuracionTabla: OPCION_TABLA,
    datos: [] as TablaOpcionConfig[],
  };

  /**
   * @property scianConfig
   * @description Objeto de configuración para la tabla SCIAN (clasificación económica).
   */
  public scianConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: SCIAN_TABLA,
    datos: [] as TablaScianConfig[],
  };

  /**
   * @property tablaMercanciasConfig
   * @description Objeto de configuración para la tabla de mercancías.
   */
  public tablaMercanciasConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: PRODUCTO_TABLA,
    datos: [] as TablaMercanciasDatos[],
  };

  public tablaMercanciaClaveConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: DATOS_MERCANCIA_CLAVE_TABLA,
    datos: [] as TablaMercanciaClaveConfig[],
  };

  /**
   * @property scianConfigDatos
   * @description Lista de datos SCIAN utilizados para la configuración y selección.
   * @type {TablaScianConfig[]}
   */
  public scianConfigDatos: TablaScianConfig[] = [];

  /**
   * @property tablaMercanciasConfigDatos
   * @description Lista de datos de mercancías utilizados para configurar
   * la tabla correspondiente.
   * @type {TablaMercanciasDatos[]}
   */
  public tablaMercanciasConfigDatos: TablaMercanciasDatos[] = [];

  public tablaMercanciaClaveConfigDatos: TablaMercanciaClaveConfig[] = [];

  /**
   * @property seleccionadoopcionDatos
   * @description Opciones seleccionadas por el usuario en la tabla de opciones.
   * @type {TablaOpcionConfig[]}
   */
  public seleccionadoopcionDatos: TablaOpcionConfig[] = [];

  /**
   * @property seleccionadoScianDatos
   * @description Datos SCIAN seleccionados en la tabla asociada.
   * @type {TablaScianConfig[]}
   */
  public seleccionadoScianDatos: TablaScianConfig[] = [];

  /**
   * @property seleccionadoTablaMercanciasDatos
   * @description Datos de mercancías seleccionados en la tabla asociada.
   * @type {TablaMercanciasDatos[]}
   */
  public seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[] = [];

  /**
   * @property seccion
   * @description Estado interno de la sección (lib) obtenido desde `SeccionLibQuery`.
   * @type {SeccionLibState}
   * @private
   */
  private seccion!: SeccionLibState;
    /**
     * @property {string[]} elementosRequeridos
     * @description
     * Lista de elementos requeridos para el trámite.
     */
    public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS;
  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  public esFormularioSoloLectura: boolean = false;

  elementosAnadidos = ['regimenLaMercancia', 'domicilio-aduana'];

  @ViewChild(DatosDeLaSolicitudComponent)
  datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;
  /**
   * @constructor
   * @description Inyecta servicios para obtener y actualizar el estado del trámite
   * (`Tramite260704Query` y `Tramite260704Store`), así como para gestionar la sección
   * (`SeccionLibStore` y `SeccionLibQuery`).
   *
   * @param {Tramite260704Query} tramite260704Query - Servicio que consulta el estado del trámite 260102.
   * @param {Tramite260704Store} tramite260704Store - Store que administra la lógica y manipulación del estado 260102.
   * @param {SeccionLibStore} seccionStore - Store para administrar el estado de la sección.
   * @param {SeccionLibQuery} seccionQuery - Query para consultar el estado de la sección.
   * @param {ConsultaioQuery} consultaQuery - Query para consultar el estado de la consulta.
   */
  constructor(
    private tramite260704Query: Tramite260704Query,
    private tramite260704Store: Tramite260704Store,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * @method ngOnInit
   * @description Hook de ciclo de vida de Angular que se ejecuta al inicializar
   * el componente. Suscribe a `Tramite260704Query` para obtener y reaccionar a
   * cambios del estado del trámite, así como a `SeccionLibQuery` para monitorear
   * cambios en la sección.
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite260704Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.opcionConfig.datos = this.tramiteState.opcionConfigDatos;
          this.scianConfig.datos = this.tramiteState.scianConfigDatos;
          this.tablaMercanciasConfig.datos =
            this.tramiteState.tablaMercanciasConfigDatos;
          this.tablaMercanciaClaveConfig.datos = this.tramiteState.tablaMercanciaClaveConfigDatos;
        })
      )
      .subscribe();

    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

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
   * Maneja el evento cuando se selecciona una opción en la tabla.
   *
   * @param event - Un arreglo de configuraciones de opciones de la tabla (`TablaOpcionConfig[]`)
   *                que representa las opciones seleccionadas.
   *
   * Actualiza la configuración de datos en el store `tramite260704Store`
   * con las opciones seleccionadas.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.tramite260704Store.updateOpcionConfigDatos(event);
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
    this.tramite260704Store.updateScianConfigDatos(event);
  }

  /**
   * Maneja el evento de selección de mercancías en la tabla.
   *
   * @param event - Arreglo de objetos de tipo `TablaMercanciasDatos` que contiene
   *                los datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.tramite260704Store.updateTablaMercanciasConfigDatos(event);
  }

  claveSeleccionada(event: TablaMercanciaClaveConfig[]): void {
    this.tramite260704Store.updateTablaMercanciaClaveConfigDatos(event);
  }

  /**
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param event - El nuevo estado del formulario de datos de la solicitud de tipo `DatosSolicitudFormState`.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260704Store.updateDatosSolicitudFormState(event);
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
   * Actualiza el estado de la tienda `tramite260704Store` con los datos seleccionados
   * provenientes del evento de la tabla.
   *
   * @param event - Objeto que contiene las opciones seleccionadas, los datos SCIAN seleccionados
   * y las mercancías seleccionadas de la tabla.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260704Store.update((state) => ({
      ...state,
      seleccionadoopcionDatos: event.opcionSeleccionados,
      seleccionadoScianDatos: event.scianSeleccionados,
      seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
      opcionesColapsableState: event.opcionesColapsableState,
    }));
  }

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

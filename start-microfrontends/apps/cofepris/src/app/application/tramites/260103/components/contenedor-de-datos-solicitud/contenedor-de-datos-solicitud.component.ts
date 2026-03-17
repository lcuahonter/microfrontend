import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatosDeTablaSeleccionados,
  DatosSolicitudFormState,
  TablaOpcionConfig,
  TablaScianConfig,
  TablaSeleccion,
} from '../../../../shared/models/datos-solicitud.model';
import {
  ELEMENTOS_ANADIDOS,
  ELEMENTOS_REQUERIDOS,
  ID_PROCEDIMIENTO,
  PRODUCTO_TABLA_IMPORTACION,
} from '../../constants/importacion-retorno-sanitario.enum';

import { DATOS_MERCANCIA_CLAVE_TABLA, OPCION_TABLA, SCIAN_TABLA } from '../../../../shared/components/shared26010/constents/datos-solicitud.enum';
import {
  Tramite260103State,
  Tramite260103Store,
} from '../../estados/tramite260103Store.store';
import { map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/shared26010/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { Subject } from 'rxjs';
import { TablaMercanciaClaveConfig } from '../../../../shared/components/shared26010/models/datos-solicitud.model';
import {TablaMercanciasImportacion} from '../../models/importicon-retorno.model';
import { Tramite260103Query } from '../../estados/tramite260103Query.query';



/**
 * @component
 * @name ContenedorDeDatosSolicitudComponent
 * @description
 * Componente que actúa como contenedor para manejar los datos de la solicitud del trámite 260103.
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
    public tablaMercanciaClaveConfig = {
      tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
      configuracionTabla: DATOS_MERCANCIA_CLAVE_TABLA,
      datos: [] as TablaMercanciaClaveConfig[],
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
    @ViewChild(DatosDeLaSolicitudComponent) datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;
  
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
   * @property {Tramite260103State} tramiteState
   * @description
   * Estado actual del trámite 260103.
   */
  public tramiteState!: Tramite260103State;

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
    configuracionTabla: PRODUCTO_TABLA_IMPORTACION,
    datos: [] as TablaMercanciasImportacion[],
  };

  /**
   * @property {TablaScianConfig[]} scianConfigDatos
   * @description
   * Datos seleccionados de la tabla SCIAN.
   */
  public scianConfigDatos: TablaScianConfig[] = [];

  /**
   * @property {TablaMercanciasImportacion[]} tablaMercanciasConfigDatos
   * @description
   * Datos seleccionados de la tabla de mercancías.
   */
  public tablaMercanciasConfigDatos: TablaMercanciasImportacion[] = [];

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
   * @property {TablaMercanciasImportacion[]} seleccionadoTablaMercanciasImportacion
   * @description
   * Datos seleccionados en la tabla de mercancías.
   */
  public seleccionadoTablaMercanciasImportacion: TablaMercanciasImportacion[] = [];

  /**
   * @property {string} idProcedimiento
   * @description
   * Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @property {string[]} elementosRequeridos
   * @description
   * Lista de elementos requeridos para el trámite.
   */
  public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS;

    /**
   * @property {string[]} elementosAnadidos
   * @description
   * Lista de elementos adicionales que pueden ser incluidos en el formulario o proceso.
   */
    public readonly elementosAnadidos = ELEMENTOS_ANADIDOS;

  /**
   * @constructor
   * @description
   * Inicializa el componente con las dependencias necesarias.
   *
   * @param {Tramite260103Query} tramite260103Query - Consulta para acceder al estado del trámite.
   * @param {Tramite260103Store} tramite260103Store - Tienda para actualizar el estado del trámite.
   */
  constructor(
    private tramite260103Query: Tramite260103Query,
    private tramite260103Store: Tramite260103Store,
    private consultaQuery: ConsultaioQuery
  ) {
    //Constructor necesario para inyectar las dependencias
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado del trámite y actualiza las configuraciones de las tablas.
   */
  ngOnInit(): void {
    this.tramite260103Query.selectTramiteState$
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
        if(!seccionState.create && seccionState.procedureId === '260103') {
          this.esFormularioSoloLectura = seccionState.readonly;
        } 
      });
  }

  /**
   * Maneja el evento cuando se selecciona una opción en la tabla.
   *
   * @param event - Un arreglo de configuraciones de opciones de la tabla (`TablaOpcionConfig[]`)
   *                que representa las opciones seleccionadas.
   *
   * Actualiza la configuración de datos en el store `tramite260103Store`
   * con las opciones seleccionadas.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.tramite260103Store.updateOpcionConfigDatos(event);
  }

  /**
   * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
   *
   * @param event - Arreglo de configuraciones seleccionadas de la tabla SCIAN.
   *
   * Este método actualiza los datos de configuración SCIAN en el estado del trámite 260103
   * utilizando el evento proporcionado.
   */
  scianSeleccionado(event: TablaScianConfig[]): void {
    this.tramite260103Store.updateScianConfigDatos(event);
  }

  /**
   * @method mercanciasSeleccionado
   * @description
   * Maneja el evento de selección de mercancías en la tabla.
   *
   * @param {TablaMercanciasImportacion[]} event - Datos seleccionados en la tabla de mercancías.
   */
  mercanciasSeleccionado(event: TablaMercanciasImportacion[]): void {
    this.tramite260103Store.updateTablaMercanciasConfigDatos(event);
  }

  /**
   * @method datasolicituActualizar
   * @description
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260103Store.updateDatosSolicitudFormState(event);
  }

  /**
   * @method datosDeTablaSeleccionados
   * @description
   * Actualiza el estado del store con los datos seleccionados de las tablas.
   *
   * @param {DatosDeTablaSeleccionados} event - Datos seleccionados de las tablas.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260103Store.update((state) => ({
      ...state,
      seleccionadoopcionDatos: event.opcionSeleccionados,
      seleccionadoScianDatos: event.scianSeleccionados,
      seleccionadoTablaMercanciasImportacion: event.mercanciasSeleccionados,
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

  claveSeleccionada(event: TablaMercanciaClaveConfig[]): void {
    this.tramite260103Store.updateTablaMercanciaClaveConfigDatos(event);
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

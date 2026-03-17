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
import { DatosProcedureQuery } from '../../estados/tramites261103.query';

import { DatosProcedureState, DatosProcedureStore } from '../../estados/tramites261103.store';

import { distinctUntilChanged, map, takeUntil } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CommonModule } from '@angular/common';

import { ConsultaioQuery ,RegistroSolicitudService } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { Subject } from 'rxjs';

import { ID_PROCEDIMIENTO } from '../../enum/mercancias.enum';
import { ModificacionPermisoImportacionMedicamentosComponent } from '../modificacion-permiso-importacion-medicamentos/modificacion-permiso-importacion-medicamentos';

import { GuardarAdapter_261103 } from '../../adapters/guardar-payload.adapter';


/**
 * @component
 * @name ContenedorDeDatosSolicitudComponent
 * @description
 * Componente que actúa como contenedor para manejar los datos de la solicitud del trámite 261103.
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
  imports: [CommonModule, DatosDeLaSolicitudComponent,ModificacionPermisoImportacionMedicamentosComponent],
  templateUrl: './contenedor-de-datos-solicitud.component.html',
  styleUrl: './contenedor-de-datos-solicitud.component.scss',
  providers: [RegistroSolicitudService],
})
export class ContenedorDeDatosSolicitudComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario está deshabilitado. Por defecto es `false`.
   */
  @Input()
  formularioDeshabilitado: boolean = false;
     /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
   public esFormularioSoloLectura: boolean = false;
   /* Campos requeridos:
   - denominacionRazon → Denominación o razón social
   - rfcSanitario, correoElectronico → RFC sanitario y correo electrónico */
   denominacionRazon: string = 'scian,denominacionRazon,rfcSanitario,correoElectronico';
  
   /**
   *
   *
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Observable utilizado para notificar la destrucción del componente y liberar recursos.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Tramite261103State} tramiteState
   * @description
   * Estado actual del trámite 261103.
   */
  public tramiteState!: DatosProcedureState;

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

  @ViewChild('datosDeLaSolicitud') datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

  /**
   * @constructor
   * @description
   * Inicializa el componente con las dependencias necesarias.
   *
   * @param {Tramite261103Query} tramite261103Query - Consulta para acceder al estado del trámite.
   * @param {Tramite261103Store} tramite261103Store - Tienda para actualizar el estado del trámite.
   */
  constructor(
    private tramite261103Query: DatosProcedureQuery,
    private tramite261103Store: DatosProcedureStore,private consultaQuery: ConsultaioQuery,
     private registroSolicitudService: RegistroSolicitudService,
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
    // this.cargarTablaOpcionConfigSolicitud();
    this.tramite261103Query.selectTramite261103$
      .pipe(
        takeUntil(this.destroyNotifier$),
        distinctUntilChanged((prev, curr) => {
          // Solo activa actualizaciones cuando los arreglos de datos principales realmente cambien
          // Verifica si opcionConfigDatos, scianConfigDatos, o tablaMercanciasConfigDatos han cambiado
          const PREV_OPCION = JSON.stringify(prev.opcionConfigDatos || []);
          const CURR_OPCION = JSON.stringify(curr.opcionConfigDatos || []);
          const PREV_SCIAN = JSON.stringify(prev.scianConfigDatos || []);
          const CURR_SCIAN = JSON.stringify(curr.scianConfigDatos || []);
          const PREV_MERCANCIAS = JSON.stringify(prev.tablaMercanciasConfigDatos || []);
          const CURR_MERCANCIAS = JSON.stringify(curr.tablaMercanciasConfigDatos || []);

          return PREV_OPCION === CURR_OPCION && 
                 PREV_SCIAN === CURR_SCIAN && 
                 PREV_MERCANCIAS === CURR_MERCANCIAS;
        }),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.opcionConfig.datos = this.tramiteState.opcionConfigDatos;
          this.scianConfig.datos = this.tramiteState.scianConfigDatos;
          this.tablaMercanciasConfig.datos =
            JSON.parse(JSON.stringify(this.tramiteState.tablaMercanciasConfigDatos));
        })
      )
      .subscribe();
  }
enIdSolicitudPrellenado($event:number): void {
    const SOLICITUDE_ID = $event;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registroSolicitudService.parcheOpcionesPrellenadas(261103, SOLICITUDE_ID).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_261103.patchToStore(res.datos, this.tramite261103Store);
      }
    });
  }
  /**
   * Maneja el evento cuando se selecciona una opción en la tabla.
   *
   * @param event - Un arreglo de configuraciones de opciones de la tabla (`TablaOpcionConfig[]`)
   *                que representa las opciones seleccionadas.
   *
   * Actualiza la configuración de datos en el store `tramite261103Store`
   * con las opciones seleccionadas.
   */
  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.seleccionadoopcionDatos = event;
    this.tramite261103Store.updateOpcionConfigDatos(event);
  }

  /**
   * Maneja el evento cuando se selecciona un elemento en la tabla SCIAN.
   *
   * @param event - Arreglo de configuraciones seleccionadas de la tabla SCIAN.
   *
   * Este método actualiza los datos de configuración SCIAN en el estado del trámite 261103
   * utilizando el evento proporcionado.
   */
  scianSeleccionado(event: TablaScianConfig[]): void {
    this.seleccionadoScianDatos = event;
    this.tramite261103Store.updateScianConfigDatos(event);
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
    this.tramite261103Store.updateTablaMercanciasConfigDatos(event);
  }

  /**
   * @method datasolicituActualizar
   * @description
   * Actualiza el estado del formulario de datos de la solicitud en el store.
   *
   * @param {DatosSolicitudFormState} event - Nuevo estado del formulario.
   */
  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite261103Store.updateDatosSolicitudFormState(event);
  }

  /**
   * @method datosDeTablaSeleccionados
   * @description
   * Actualiza el estado del store con los datos seleccionados de las tablas.
   *
   * @param {DatosDeTablaSeleccionados} event - Datos seleccionados de las tablas.
   */
  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
   this.seleccionadoopcionDatos = event.opcionSeleccionados;
    this.seleccionadoScianDatos = event.scianSeleccionados;
    this.seleccionadoTablaMercanciasDatos = event.mercanciasSeleccionados;

    // Solo actualizar el store si hay cambios reales para evitar activar la suscripción
    const CURRENT_STATE = this.tramiteState;
    const HAS_CHANGES = 
      JSON.stringify(CURRENT_STATE?.seleccionadoopcionDatos || []) !== JSON.stringify(event.opcionSeleccionados) ||
      JSON.stringify(CURRENT_STATE?.seleccionadoScianDatos || []) !== JSON.stringify(event.scianSeleccionados) ||
      JSON.stringify(CURRENT_STATE?.seleccionadoTablaMercanciasDatos || []) !== JSON.stringify(event.mercanciasSeleccionados) 
    if (HAS_CHANGES) {
      this.tramite261103Store.update((state) => ({
        ...state,
        seleccionadoopcionDatos: event.opcionSeleccionados,
        seleccionadoScianDatos: event.scianSeleccionados,
        seleccionadoTablaMercanciasDatos: event.mercanciasSeleccionados,
      }));
    }
  }

  validarFormularioDatos(): boolean {
    return (
      this.datosDeLaSolicitudComponent?.formularioSolicitudValidacion() ?? false
    );
  }

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

import { AlertComponent, ConfiguracionColumna, RegistroSolicitudService, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { AvisoSanitarioState, Tramite260601Store } from '../../../../estados/tramites/tramite260601.store';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosDeTablaSeleccionados, DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig, TablaSeleccion } from '../../../../shared/models/shared2606/datos-solicitud.model';
import { OPCION_TABLA, PRODUCTO_TABLA_301 } from '../../../../shared/constantes/shared2606/datos-solicitud.enum';
import { SOLICITUD_HEADER, SOLICITUD_TABLA_CONFIGURACION, TEXTOS_SOLICITUD } from '../../constantes/aviso-enum';
import { Solicitud, SolicitudTable } from '../../models/aviso-model';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisoSanitarioService } from '../../services/aviso-sanitario.service';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/shared2606/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { SCIAN_TABLA } from '../../../../shared/constantes/datos-solicitud.enum';
import { Tramite260601Query } from '../../../../estados/queries/tramite260601.query';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';


/**
 * Componente para gestionar el datos de la solicitud.
 */
@Component({
  selector: 'app-plantallas-datos-de-la-solicitud',
  standalone: true,
  imports: [CommonModule, AlertComponent, DatosDeLaSolicitudComponent, TablaDinamicaComponent],
  templateUrl: './plantallas-datos-de-la-solicitud.component.html',
  styleUrl: './plantallas-datos-de-la-solicitud.component.css',
})
export class PlantallasDatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Obtiene los datos de enumeración y establece valores de TEXTOS
   */
  TEXTOS = TEXTOS_SOLICITUD;
  /**
   * Controla la visibilidad del panel plegable.
   * El valor predeterminado está establecido en verdadero (ampliado)
   */
  colapsable: boolean = true;
  /**
   * Recibe datos del encabezado de la tabla como propiedad de entrada
   */
  tablaHeadData = SOLICITUD_HEADER.encabezadoSolicitud;
  /**
   * Recibe la lista de solicitudes como datos de fila de la tabla.
   */
  @Input() tablaFilaDatos: Solicitud[] = [];

  /**
   * @property {ConfiguracionColumna<SolicitudTable>[]} configuracionTabla
   * @description
   * Configuración de las columnas para la tabla de solicitudes.
   * Define la estructura y comportamiento de cada columna en la tabla dinámica.
   */
  configuracionTabla: ConfiguracionColumna<SolicitudTable>[] = SOLICITUD_TABLA_CONFIGURACION;

  /**
   * @property {TablaSeleccion} tipoSeleccionTabla
   * @description
   * Define el tipo de selección que se aplicará en la tabla dinámica.
   * UNDEFINED indica que no hay un comportamiento de selección específico configurado.
   */
  tipoSeleccionTabla: TablaSeleccion = TablaSeleccion.UNDEFINED;

  /**
   * @property {SolicitudTable[]} solicitudDatos
   * @description
   * Arreglo que almacena los datos de las solicitudes que se mostrarán en la tabla dinámica.
   * Se obtienen desde el servicio y se actualizan en el store.
   */
  solicitudDatos: SolicitudTable[] = [];

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Subject utilizado para notificar la destrucción del componente y cancelar todas las suscripciones activas
   * cuando el componente se destruye, evitando fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

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

  public tablaMercanciasConfig = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: PRODUCTO_TABLA_301,
    datos: [] as TablaMercanciasDatos[],
  };

  public opcionConfig = {
    tipoSeleccionTabla: undefined,
    configuracionTabla: OPCION_TABLA,
    datos: [] as TablaOpcionConfig[],
  };

  public seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[] = [];

  public esFormularioSoloLectura: boolean = false;

  denominacionRazon: string = 'scian,denominacionRazon,localidad,colonia';

  public tramiteState!: AvisoSanitarioState;

  @ViewChild('datosDeLaSolicitudComponent')
  datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;
  
  /**
   * Alterna el panel plegable (expandir/contraer)
   */
  mostrarColapsable(): void {
    this.colapsable = !this.colapsable;
  }
    /**
   * @constructor
   * @param {AvisoSanitarioService} avisoSanitarioService - Servicio para obtener datos del aviso sanitario.
   * @param {Tramite260601Store} tramite260601Store - Store para gestionar el estado del trámite 260601.
   */
  constructor(
    private avisoSanitarioService: AvisoSanitarioService,
    private tramite260601Store: Tramite260601Store,
    private tramite260601Query: Tramite260601Query,
    private registroSolicitudService: RegistroSolicitudService,
  ){

  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta después de que Angular inicializa las propiedades del componente.
   * Inicia la obtención de datos de solicitudes.
   */
  ngOnInit(): void {
    this.cargarTablaOpcionConfigSolicitud();
    this.obtenerDatos();
    this.tramite260601Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
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

  cargarTablaOpcionConfigSolicitud(): void {    
    this.registroSolicitudService.cargarOpcionesPrellenadoSolicitud(260601, 'AAL0409235E6').subscribe((res:BaseResponse<unknown>) => {
      const DATOS = res.datos as TablaOpcionConfig[];
      
      // Procesar los datos para manejar valores nulos en el proveedor
      const DATOS_PROCESADOS = DATOS.map(item => ({
        ...item,
        proveedor: item.proveedor && item.proveedor.trim() !== '' ? item.proveedor : 'N/A'
      }));
      
      this.opcionConfig.datos = DATOS_PROCESADOS;
      this.opcionSeleccionado(DATOS_PROCESADOS);
    });
  }

  /**
   * @method obtenerDatos
   * @description
   * Obtiene los datos de solicitudes desde el servicio y actualiza tanto el store como la propiedad local.
   * Utiliza el operador takeUntil para cancelar la suscripción cuando el componente se destruye.
   */
  obtenerDatos(): void {
      this.avisoSanitarioService.obtenerSolicitudDatos()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((result: SolicitudTable[]) => {
          this.tramite260601Store.setSolicitudTabla(result);
          this.solicitudDatos = result;
        });
      
    }

    datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramite260601Store.updateDatosSolicitudFormState(event);
  }

  opcionSeleccionado(event: TablaOpcionConfig[]): void {
    this.tramite260601Store.updateOpcionConfigDatos(event);
  }

  scianSeleccionado(event: TablaScianConfig[]): void {
    this.tramite260601Store.updateScianConfigDatos(event);
  }

  mercanciasSeleccionado(event: TablaMercanciasDatos[]): void {
    this.seleccionadoTablaMercanciasDatos = event;
    this.tramite260601Store.updateTablaMercanciasConfigDatos(event);
  }

  datosDeTablaSeleccionados(event: DatosDeTablaSeleccionados): void {
    this.tramite260601Store.update((state) => ({
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
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta justo antes de que Angular destruya el componente.
   * Completa el subject destroyNotifier$ para evitar fugas de memoria al cancelar todas las suscripciones asociadas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}

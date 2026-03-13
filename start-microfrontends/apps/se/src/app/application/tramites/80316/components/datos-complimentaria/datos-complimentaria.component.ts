import {
  CONFIGURACION_ACCIONISTAS,
  CONFIGURACION_EMPRESAS,
  CONFIGURACION_FEDERETARIOS,
  CONFIGURACION_OPERACIONES,
  CONFIGURACION_PLANTAS,
  CONFIGURACION_SERVICIOS,
} from '../../constantes/modificacion.enum';
import { Complimentaria, Empresas, Federetarios, Operacions, Plantas, Servicios } from '../../models/datos-tramite.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfiguracionColumna,
  ConsultaioQuery,
  ConsultaioState,
  TablaDinamicaComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Subject, filter, map, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosCertificacionComponent } from '../datos-certificacion/datos-certificacion.component';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80316Query } from '../../estados/tramite80316.query';
import { Tramite80316Store ,Solicitud80316State } from '../../estados/tramite80316.store';
/**
 * Componente `DatosComplimentariaComponent` utilizado para gestionar y mostrar los datos relacionados con la información complementaria.
 * Este componente es independiente (standalone) y utiliza varios módulos y servicios relacionados.
 */
@Component({
  selector: 'app-datos-complimentaria',
  templateUrl: './datos-complimentaria.component.html',
  styleUrl: './datos-complimentaria.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    DatosCertificacionComponent,
    TablaDinamicaComponent,
    CommonModule
  ],
  providers: [SolicitudService, ToastrService],
})
export class DatosComplimentariaComponent implements OnInit, OnDestroy {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto ayuda a prevenir fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de las columnas de la tabla para los accionistas (Complimentaria).
   * @type {ConfiguracionColumna<Complimentaria>[]}
   */
  configuracionTabla: ConfiguracionColumna<Complimentaria>[] =
    CONFIGURACION_ACCIONISTAS;

  /**
   * Configuración de las columnas de la tabla para los federetarios.
   * @type {ConfiguracionColumna<Federetarios>[]}
   */
  configuracionFederetios: ConfiguracionColumna<Federetarios>[] =
    CONFIGURACION_FEDERETARIOS;

  /**
   * Configuración de las columnas de la tabla para las operaciones.
   * @type {ConfiguracionColumna<Operacions>[]}
   */
  configuracionOperacion: ConfiguracionColumna<Operacions>[] =
    CONFIGURACION_OPERACIONES;

  /**
   * Configuración de las columnas de la tabla para las empresas.
   * @type {ConfiguracionColumna<Empresas>[]}
   */
  configuracionEmpresas: ConfiguracionColumna<Empresas>[] =
    CONFIGURACION_EMPRESAS;

  /**
   * Configuración de las columnas de la tabla para las plantas.
   * @type {ConfiguracionColumna<Plantas>[]}
   */
  configuracionPlantas: ConfiguracionColumna<Plantas>[] = CONFIGURACION_PLANTAS;

  /**
   * Configuración de las columnas de la tabla para los servicios.
   * @type {ConfiguracionColumna<Servicios>[]}
   */
  configuracionServicios: ConfiguracionColumna<Servicios>[] =
    CONFIGURACION_SERVICIOS;

  /**
   * Datos de los federetarios obtenidos desde el servicio.
   * @type {Federetarios[]}
   */
  datosFederetarios: Federetarios[] = [];

  /**
   * Datos de las operaciones obtenidos desde el servicio.
   * @type {Operacions[]}
   */
  datosOperacions: Operacions[] = [];

  /**
   * Datos de las empresas obtenidos desde el servicio.
   * @type {Empresas[]}
   */
  datosEmpresas: Empresas[] = [];

  /**
   * Datos de las plantas obtenidos desde el servicio.
   * @type {Plantas[]}
   */
  datosPlantas: Plantas[] = [];

  /**
   * Datos de los servicios obtenidos desde el servicio.
   * @type {Servicios[]}
   */
  datosServicios: Servicios[] = [];

  /**
   * Datos de la información complementaria obtenidos desde el servicio.
   * @type {Complimentaria[]}
   */
  datosComplimentaria: Complimentaria[] = [];

  /**
   * Buscar ID de la solicitud
   * @type {string[]}
   */
  buscarIdSolicitud!: string[];
  /**
   * Datos de consulta obtenidos desde el servicio.
   * @type {ConsultaioState}
   */
  consultaDatos!: ConsultaioState;

  /**
   * Estado de la solicitud del trámite 80316.
   * @property {Solicitud80316State} solicitudState
   */
  public solicitudState!: Solicitud80316State;

  /**
   * Constructor del componente `DatosComplimentariaComponent`.
   * Inicializa los servicios necesarios y carga los datos de información complementaria, federetarios, operaciones, empresas, plantas y servicios.
   * 
   * @param {SolicitudService} solicitudService - Servicio para gestionar las solicitudes.
   * @param {ToastrService} toastr - Servicio para mostrar notificaciones al usuario.
   */
  constructor(
    private solicitudService: SolicitudService,
    private toastr: ToastrService,
    private tramite80316Store: Tramite80316Store,
    private tramite80316Query: Tramite80316Query,
    private consultaioQuery: ConsultaioQuery
  ) {

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();
 
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se llama a los métodos para cargar los datos necesarios.
   */

    ngOnInit(): void {
       this.tramite80316Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        filter((solicitud) => Boolean(solicitud?.buscarIdSolicitud?.length)),
        take(1)
      )
      .subscribe((solicitud) => {
        this.buscarIdSolicitud = solicitud?.buscarIdSolicitud || [];
          this.solicitudState = solicitud;
        if (this.buscarIdSolicitud.length > 0) {
            this.obtenerFederetarios(); // Carga los federetarios.
            this.obtenerOperacions(); // Carga las operaciones.
            this.obtenerComplimentaria(); // Carga los datos de información complementaria.
            this.obtenerEmpresas(); // Carga las empresas.
            this.obtenerPlantas(); // Carga las plantas.
            this.obtenerServicios(); // Carga los servicios.
          
        }
      });
       if (this.consultaDatos.update) {
            this.datosEmpresas = this.solicitudState?.empresas ?? [];
          }
    }
  /**
   * Método que obtiene los datos de información complementaria desde el servicio.
   * Asigna los datos obtenidos a la variable `datosComplimentaria`.
   */
  obtenerComplimentaria(): void {
    this.solicitudService
      .obtenerLosSocio(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.datosComplimentaria =
          response.datos?.map((item: Complimentaria) => ({
            original: item,
            rfc: item.rfc,
            nombre: item.nombre,
            apellidoPaterno: item.apellidoPrimer,
            apellidoMaterno: item.apellidoSegundo,
          })) || [];
        this.tramite80316Store.setSociosAccionistas(this.datosComplimentaria);
      });
  }

  /**
 * Método que obtiene los datos de federetarios desde el servicio.
 * Asigna los datos obtenidos a la variable `datosFederetarios`.
 * @return {void}
 */
  obtenerFederetarios(): void {
    this.solicitudService
      .obtenerFederetarios(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosFederetarios =
          data.datos?.map((item) => ({
            original: item,
            nombreNotario: item.nombreNotario,
            apellidoPaterno: item.apellidoPaterno,
            apellidoMaterno: item.apellidoMaterno,
            numeroActa: item.numeroActa,
          })) || [];
        this.tramite80316Store.setNotarios(this.datosFederetarios);
      });
  }

  /**
   * Método que obtiene los datos de operaciones desde el servicio.
   * Asigna los datos obtenidos a la variable `datosOperacions`.
   */
  obtenerOperacions(): void {
    this.solicitudService
      .obtenerOperacion(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosOperacions =
          data.datos?.map((item) => ({
            original: item,
            calle: item.calle,
            numeroExterior: item.numeroExterior,
            numeroInterior: item.numeroInterior,
            codigoPostal: item.codigoPostal,
            localidad: item.localidad,
            colonia: item.colonia,
          })) || [];
        this.tramite80316Store.setOperaciones(this.datosOperacions);
      });
  }

  /**
   * Método que obtiene los datos de empresas desde el servicio.
   * Asigna los datos obtenidos a la variable `datosEmpresas`.
   */
  obtenerEmpresas(): void {
    this.solicitudService
      .obtenerEmpresas(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosEmpresas =
          data.datos?.map((item) => ({
            original: item, //empresa.original.idEmpresa;
            rfc: item.rfc,
            razonSocial: item.razonSocial,
            calle: item.calle,
            numeroExterior: item.numeroExterior,
            numeroInterior: item.numeroInterior,
            codigoPostal: item.codigoPostal,
            colonia: item.colonia,
            delegacionMunicipio: item.delegacionMunicipio,
            entidadFederativa: item.entidadFederativa,
            pais: item.pais,
            telefono: item.telefono,
            estatus: item.estatus,
          })) || [];
        this.tramite80316Store.setEmpresas(this.datosEmpresas);
      });
  }

  /**
   * Método que obtiene los datos de plantas desde el servicio.
   * Asigna los datos obtenidos a la variable `datosPlantas`.
   */
  obtenerPlantas(): void {
    this.solicitudService
      .obtenerPlantas(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosPlantas =
          data.datos?.map((item) => ({
            original: item,
            calle: item.calle,
            numeroExterior: item.numeroExterior,
            numeroInterior: item.numeroInterior,
            codigoPostal: item.codigoPostal,
            colonia: item.colonia,
            delegacionMunicipio: item.delegacionMunicipio,
          })) || [];
        this.tramite80316Store.setPlantas(this.datosPlantas);
      });
  }

  /**
   * Método que obtiene los datos de servicios desde el servicio.
   * Asigna los datos obtenidos a la variable `datosServicios`.
   */
  obtenerServicios(): void {
    this.solicitudService
      .obtenerServicios(this.buscarIdSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((servicio) => {
        this.datosServicios =
          servicio.datos?.map((item) => ({
            original: item,
            descripcion: item.descripcion,
            tipoServicio: item.tipoServicio,
            testado: item.testado,
            estatus: item.estatus,

          })) || [];
        this.tramite80316Store.setServicios(this.datosServicios);
      });
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.unsubscribe();
  }
}

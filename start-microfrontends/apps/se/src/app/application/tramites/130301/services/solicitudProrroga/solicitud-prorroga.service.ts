import {
  ApiResponse,
  Catalogo,
  CatalogoServices,
  JSONResponse
} from '@libs/shared/data-access-user/src';
import {
  DatosFolioPermiso,
  PartidasInfo,
  ProrrogasInfo,
  ValidacionFolioPermisoResponse
} from '@libs/shared/data-access-user/src/core/models/130301/solicitud-prorroga.model';
import { Observable, map } from 'rxjs';
import {
  Solicitud130301State,
  Tramite130301Store,
} from '../../../../estados/tramites/tramite130301.store';
import { API_GET_EVALUAR_INICIAR } from '../../../../core/server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { EvaluacionOpcionResponse } from '../../../../core/models/evaluar/response/evaluar-estado-evaluacion-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130301 } from '../../servers/api-route';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';

/**
 * Servicio para gestionar las solicitudes relacionadas con el trámite de prórrogas.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Clase que representa el servicio de solicitud de prórroga.
 */
export class SolicitudProrrogaService {

  /**
   * URL del servidor donde se encuentra la API.
   */
  private readonly host: string;

  constructor(
    private http: HttpClient,
    private tramite130301Query: Tramite130301Query,
    private tramite130301Store: Tramite130301Store,
    private catalogoServices: CatalogoServices
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }
  /**
     * Ejemplo de uso (como en 130104):
     * this.solicitudProrrogaService.getEvaluacionTramite130301(folioTramite)
     *   .subscribe(response => { ... });
     */
  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a recursos externos.
   * @param tramite130301Query Query para acceder al estado del trámite 130301.
   * @param tramite130301Store Store para actualizar el estado del trámite 130301.
   */
  // constructor(
  //   private http: HttpClient,
  //   private tramite130301Query: Tramite130301Query,
  //   private tramite130301Store: Tramite130301Store,
  //  private catalogoServices: CatalogoServices
  // ) {}

  /**
   * @property getAllState
   * @description
   * Obtiene todos los datos del estado almacenado en el store.
   *
   * @returns Observable<Solicitud130301State> Observable con todos los datos del estado.
   */
  getAllState(): Observable<Solicitud130301State> {
    return this.tramite130301Query.selectSolicitud$;
  }

  /**
   * Carga los datos de perfil utilizando el folio de permiso y RFC del solicitante.
   *
   * @param payload Objeto que contiene el folio de permiso y RFC.
   * @returns Observable con la respuesta de la API.
   */
  cargarDatosPerfil(payload: {
    folioPermiso: string;
    rfc: string;
  }): Observable<ValidacionFolioPermisoResponse> {
    return this.http.post<ValidacionFolioPermisoResponse>(PROC_130301.CARGAR_DATOS_PREFIL, payload);
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param body - Objeto con los datos a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  guardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130301.GUARDAR, body);
  }

  /**
   * Actualiza los datos del perfil en el store.
   * @param datos - Datos del perfil a actualizar.
   */
  actualizarDatosPerfil(datos: DatosFolioPermiso): void {
    this.tramite130301Store.setEstatusSolicitud(datos?.estatdoSolicitud);
    this.tramite130301Store.setPartidasIdSolicitud(datos?.idSolicitud);
    this.tramite130301Store.setNumeroFolioTramiteOriginal(datos?.numeroFolio);
    this.tramite130301Store.setSolicitudOpcion(
      datos?.solicitud?.tipoSolicitudPexim
    );
    this.tramite130301Store.setRegimen(datos?.solicitud?.datoTramite?.regimen);
    this.tramite130301Store.setClasificacionDelRegimen(
      datos?.solicitud?.datoTramite?.clasificacionRegimen
    );
    this.tramite130301Store.setProductoOpcion(
      datos?.tramite?.solicitud?.mercancia?.condicionMercancia
    );
    this.tramite130301Store.setDescripcionMercancia(
      datos?.tramite?.solicitud?.mercancia?.descripcion
    );
    this.tramite130301Store.setFraccionArancelaria(
      datos?.solicitud?.fraccionArancelaria
    );
    this.tramite130301Store.setUmt(
      datos?.tramite?.solicitud?.mercancia?.unidadMedidaTarifaria
    );
    this.tramite130301Store.setCantidad(
      datos?.tramite?.solicitud?.mercancia?.unidadesAutorizadas
    );
    this.tramite130301Store.setValorFactura(
      datos?.tramite?.solicitud?.mercancia?.importeFacturaAutorizadoUSD
    );
    this.tramite130301Store.setPais(datos?.paises);
    this.tramite130301Store.setUsoEspecifico(datos?.usoEspecifico);
    this.tramite130301Store.setJustificacionImportacionExportacion(
      datos?.justificacionImportacionExportacion
    );
    this.tramite130301Store.setObservaciones(datos?.observaciones);
    this.tramite130301Store.setRepresentacionFederal(
      datos?.solicitud?.representacionFederal
    );

    this.tramite130301Store.setCertificadoKimberleyForma({
      certificadosEmitidos:
        datos?.tramite?.solicitud?.certificadoKimberly?.certificadosEmitidos,
      numeroCertificadokimberley:
        datos?.tramite?.solicitud?.certificadoKimberly
          ?.idCertificadoKimberlyImportacion,
      nombreIngles:
        datos?.tramite?.solicitud?.certificadoKimberly?.nombrePaisOrigenIngles,
      nombreExportador:
        datos?.tramite?.solicitud?.certificadoKimberly?.nombreExportador,
      direccionExportador:
        datos?.tramite?.solicitud?.certificadoKimberly?.direccionExportador,
      nombreImportador:
        datos?.tramite?.solicitud?.certificadoKimberly?.nombreImportador,
      direccionImportador:
        datos?.tramite?.solicitud?.certificadoKimberly?.direccionImportador,
      numeroEnLetra:
        datos?.tramite?.solicitud?.certificadoKimberly?.descripcionNumeroRemesa,
      numeroEnLetraIngles:
        datos?.tramite?.solicitud?.certificadoKimberly
          ?.descripcionNumeroRemesaIngles,
      numeroFactura:
        datos?.tramite?.solicitud?.certificadoKimberly?.numeroFacturaRemesa,
      cantidadQuilates:
        datos?.tramite?.solicitud?.certificadoKimberly?.numeroKilates,
      valorDiamantes:
        datos?.tramite?.solicitud?.certificadoKimberly?.valorDiamantes,
      paisEmisorCertificado:
        datos?.tramite?.solicitud?.certificadoKimberly
          ?.certificadoKimberlyPKPais,
      mixed: datos?.tramite?.solicitud?.certificadoKimberly?.origen,
      paisDeOrigen: datos?.tramite?.solicitud?.certificadoKimberly?.claveOrigen,
    });

    this.tramite130301Store.setCantidadProrroga(
      datos?.tramite?.solicitud?.prorroga?.cantidadLibreMercancia
    );
    this.tramite130301Store.setFechaInicioProrroga(datos?.fechaInicioProrroga);
    this.tramite130301Store.setFechaFinProrroga(datos?.fechaFinProrroga);
  }

  /**
   * Obtiene los datos de la tabla de prórrogas utilizando el folio de resolución.
   * @param folioResolucion - Folio de resolución para filtrar los datos.
   * @returns Observable con los datos de la tabla de prórrogas.
   */
  obtenerProrrogaTablaDatos(
    folioResolucion: string
  ): Observable<ApiResponse<ProrrogasInfo>> {
    return this.http.get<ApiResponse<ProrrogasInfo>>(
      `${PROC_130301.MOSTRAR_PRORROGA}${folioResolucion}`
    );
  }

  /**
   * Obtiene los datos de la tabla de partidas utilizando el ID de la solicitud.
   * @param idSolicitud - ID de la solicitud para filtrar los datos.
   * @returns Observable con los datos de la tabla de partidas.
   */
  obtenerPartidasTablaDatos(
    idSolicitud: string
  ): Observable<ApiResponse<PartidasInfo>> {
    return this.http.get<ApiResponse<PartidasInfo>>(
      `${PROC_130301.MOSTAR_PARTIDAS}${idSolicitud}`
    );
  }

  /**
   * Obtiene la lista de estados desde el catálogo.
   * @returns Observable con la respuesta del catálogo de estados.
   */
  obtenerEstadoList(): Observable<Catalogo[]> {
    // Use catalogoServices with '130301' for consistency
    return this.catalogoServices.todosPaisesSeleccionados('130301')
      .pipe(map(res => res?.datos ?? []));
  }
    /**
     * Obtiene la lista de entidades federativas desde el catálogo.
     * @returns Observable con la respuesta del catálogo de entidades federativas.
     */
    obtenerEntidadFederativaList(): Observable<Catalogo[]> {
      return this.catalogoServices.entidadesFederativasCatalogo('130301')
        .pipe(map(res => res?.datos ?? []));
    }

    /**
     * Obtiene la lista de representaciones federales desde el catálogo.
     * @param cveEntidad Clave de la entidad federativa
     * @returns Observable con la respuesta del catálogo de representaciones federales.
     */
    obtenerRepresentacionFederalList(cveEntidad: string): Observable<Catalogo[]> {
      return this.catalogoServices.representacionFederalCatalogo('130301', cveEntidad)
        .pipe(map(res => res?.datos ?? []));
    }

    /**
     * Obtiene el catálogo de unidades de medida tarifaria asociado a un identificador y fracción arancelaria.
     * @param fraccionId Identificador de la fracción arancelaria
     * @returns Observable con un arreglo de unidades de medida tarifaria (o vacío si no hay datos)
     */
    obtenerUMTList(fraccionId: string): Observable<Catalogo[]> {
      return this.catalogoServices.unidadesMedidaTarifariaCatalogo('130301', fraccionId)
        .pipe(map(res => res?.datos ?? []));
    }

    /**
     * Obtiene el catálogo de fracciones arancelarias asociado a este trámite.
     * @returns Observable con un arreglo de fracciones arancelarias (o vacío si no hay datos)
     */
    obtenerFraccionCatalogoList(): Observable<Catalogo[]> {
      return this.catalogoServices.fraccionesArancelariasCatalogo('130301', 'TITPEX.130301')
        .pipe(map(res => res?.datos ?? []));
    }
   /**
    * Obtiene los datos de la solicitud.
    * @returns Observable con los datos de la solicitud.
    */
    getDatosDeLaSolicitud(solicitud_id: string): Observable<JSONResponse> {
      const ENDPOINT = PROC_130301.MOSTAR + solicitud_id;
      return this.http.get<JSONResponse>(ENDPOINT);
    }
     /**
       * Obtiene el catálogo de clasificaciones de régimen asociado a un trámite.
       * @param tramitesID Identificador del trámite
       * @returns Observable con un arreglo de clasificaciones de régimen (o vacío si no hay datos)
       */
      getClasificacionRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
        const PAYLOAD_DATOS = { tramite: 'TITPEX.130301', id: tramitesID };
        return this.catalogoServices.clasificacionRegimenCatalogo('130301', PAYLOAD_DATOS)
          .pipe(
            map(res => res?.datos ?? [])
          );
      }
    /**
     * Consulta la evaluación del trámite 130301.
     * @param folioTramite Folio del trámite.
     * @returns Observable con la respuesta del servidor.
     */
    getEvaluacionTramite130301(folioTramite: string): Observable<BaseResponse<EvaluacionOpcionResponse>> {
      const TRAMITE = 130301;
      const ENDPOINT = `${this.host}${API_GET_EVALUAR_INICIAR(TRAMITE.toString(), folioTramite)}`;
      return this.http.get<BaseResponse<EvaluacionOpcionResponse>>(ENDPOINT);
    }

}

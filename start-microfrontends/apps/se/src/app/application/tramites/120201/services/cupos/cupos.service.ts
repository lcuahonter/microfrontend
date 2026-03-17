import { Cupos120201State, Tramite120201Store } from '../../../../estados/tramites/tramite120201.store';
import { HttpCoreService, JSONResponse, RespuestaCatalogos, formatearFechaDdMmYyyy, formatearFechaYyyyMmDd } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROC_120201 } from '../../servers/api-route';
import { RespuestaCuposTabla } from '../../models/cupos.model';
import { Tramite120201Query } from '../../../../estados/queries/tramite120201.query';

/**
 * Servicio para obtener los catálogos de la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Clase que representa el servicio de catálogos.
 * @class CuposService
 */
export class CuposService {

  /**
   * Constructor del servicio de catálogos.
   * @param http - Inyección del servicio HttpClient para realizar peticiones HTTP.
   * @description Este servicio se encarga de obtener los catálogos necesarios para el funcionamiento de la aplicación.
   */
  constructor(
    private http: HttpClient,
    private tramite120201Query: Tramite120201Query,
    private tramite120201Store: Tramite120201Store,
    private httpService: HttpCoreService
  ) {
    // Constructor vacío

  }

  /**
   * Método para obtener el catálogo de tratados.
   * @returns Observable<RespuestaCatalogos> - Observable que emite la respuesta del catálogo de tratados.
   * @description Método para obtener el catálogo de tratados.
   */
  getTratadoCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/120201/tratado-catalogo.json');
  }

  /**
   * Método para obtener el catálogo de régimen de clasificación.
   * @returns Observable<RespuestaCatalogos> - Observable que emite la respuesta del catálogo de régimen de clasificación.
   * @description Método para obtener el catálogo de régimen de clasificación.
   */
  getRegimenClasificacionCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/120201/regimen-clasificacion-catalogo.json');
  }

  /**
   * Método para obtener el catálogo de país de destino.
   * @returns Observable<RespuestaCatalogos> - Observable que emite la respuesta del catálogo de país de destino.
   * @description Método para obtener el catálogo de país de destino.
   */
  getPaisDestinoCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/120201/pais-destino-catalogo.json');
  }

  /**
   * Método para obtener el catálogo de país de origen.
   * @returns Observable<RespuestaCatalogos> - Observable que emite la respuesta del catálogo de país de origen.
   * @description Método para obtener el catálogo de país de origen.
   */
  getEstadoCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/120201/estado-catalogo.json');
  }

  /**
   * Método para obtener el catálogo de fracción arancelaria.
   * @returns Observable<RespuestaCatalogos> - Observable que emite la respuesta del catálogo de representación federal.
   * @description Método para obtener el catálogo de representación federal.
   */
  getRepresentacionFederalCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/120201/representacion-federal-catalogo.json');
  }

  /**
   * Método para obtener datos de solicitud de tabla de cupos.
   * @returns Observable<ResquestaCatalogos> - Observable que emite la resquesta del cupos.
   * @description Método para obtener el tablón de cupos.
   */
  obtenerTablaDatos(): Observable<RespuestaCuposTabla> {
    return this.http.get<RespuestaCuposTabla>('assets/json/120201/tabla-cupos.json');
  }

  /**
   * Método para obtener los datos de consulta de persona física.
   * @returns Observable<ExpedicionCertificadosAsignacion120202State> - Observable que emite el estado de la consulta de persona física.
   * @description Método para obtener los datos de consulta de persona física.
   */
  getConsultaPersonaFisicaDatos(): Observable<Cupos120201State> {
    return this.http.get<Cupos120201State>('assets/json/120201/consulta-persona-fisica.json');
  }

  /**
    * Obtiene todos los datos del estado almacenado en el store.
    * @returns {Observable<Cupos120201State>} Observable con todos los datos del estado.
    */
  getAllState(): Observable<Cupos120201State> {
    return this.tramite120201Query.selectSeccionState$;
  }

  /** Método para guardar los datos del formulario.
   * @param body - El cuerpo de la solicitud a guardar.
   * @returns Observable<Record<string, unknown>> - Observable que emite la respuesta de la solicitud de guardado.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_120201.GUARDAR, { body: body });
  }

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_120201.MOSTRAR(id));
  }

  /** Método para construir el objeto de solicitante.
 * @returns El objeto de solicitante construido.
 */
  buildSolicitante(): Record<string, unknown> {
    return {
      rfc: "AAL0409235E6",
      nombre: "ACEROS ALVARADO S.A. DE C.V.",
      actividad_economica: "Fabricación de productos de hierro y acero",
      correo_electronico: "contacto@acerosalvarado.com",
      domicilio: {
        pais: "México",
        codigo_postal: "06700",
        estado: "Ciudad de México",
        municipio_alcaldia: "Cuauhtémoc",
        localidad: "Centro",
        colonia: "Roma Norte",
        calle: "Av. Insurgentes Sur",
        numero_exterior: "123",
        numero_interior: "Piso 5, Oficina A",
        lada: "",
        telefono: "123456"
      }
    };
  }

  /** Método para construir el objeto de asignación.
   * @param item - El estado actual del trámite 120201.
   * @returns El objeto de asignación construido.
   */
  buildAsignacion(item: Cupos120201State): Record<string, unknown> {
    return {
      idAsignacion: item?.asignacionDatosForm?.idAsignacion ?? null,
      montoDisponible: item?.controlMontosAsignacionForm?.montoDisponible ?? null,

      impTotalAprobado: Number(item?.controlMontosAsignacionForm?.sumaAprobada) || null,
      impTotalExpedido: Number(item?.controlMontosAsignacionForm?.sumaExpedida) || null,

      numFolioAsignacion: item?.asignacionDatosForm?.numOficio ?? null,
      añoAutorizacion: item?.asignacionOficioNumeroForm?.cveAniosAutorizacion ?? null,
      numFolioAsignacionAux: item?.asignacionOficioNumeroForm?.numFolioAsignacionAux ?? null,

      fechaInicioVigencia: formatearFechaYyyyMmDd(item?.asignacionDatosForm?.fechaInicio ?? ''),
      fechaFinVigenciaAprobada: formatearFechaYyyyMmDd(item?.asignacionDatosForm?.fechaFinVigenciaAprobada ?? ''),

      mecanismoAsignacion: {
        ...this.buildMechanismoAsignacion(item)
      }
    };
  }

  /** Método para construir el objeto de mecanismo de asignación.
   * @param item - El estado actual del trámite 120201.
   * @returns El objeto de mecanismo de asignación construido.
   */
  buildMechanismoAsignacion(item: Cupos120201State): Record<string, unknown> {
    return {
      idMecanismoAsignacion: Number(item?.asignacionDatosForm?.idMecanismoAsignacion) || '',
      descClasificacionProducto: item?.cupoDescripcionForm?.descClasificacionProducto ?? null,
      nombreMecanismoAsignacion: item?.cupoDescripcionForm?.mecanismoAsignacion ?? "Asignación directa",
      regimen: item?.cupoDescripcionForm?.regimenAduanero ?? null,
      paisesCupo: Array.isArray(item?.cupoDescripcionForm?.paisesCupo)
        ? item.cupoDescripcionForm.paisesCupo.map(p => ({
          pais: {
            nombre: p ?? null
          }
        }))
        : [],
      nombreProducto: item?.cupoDescripcionForm?.descripcionProducto ?? null,
      fechaInicioVigencia: formatearFechaYyyyMmDd(item?.cupoDescripcionForm?.fechaInicioVigencia ?? ''),
      fechaFinVigencia: formatearFechaYyyyMmDd(item?.cupoDescripcionForm?.fechaFinVigencia ?? ''),
      unidadMedidaDescripcion: item?.cupoDescripcionForm?.unidadMedidaOficialCupo ?? null,
      nombreTratado: item?.cupoDescripcionForm?.tratado ?? null,
      observaciones: item?.cupoDescripcionForm?.observaciones ?? null,
      descripcionFundamento: item?.cupoDescripcionForm?.descripcionFundamento ?? null
    };
  }

  /** Método para construir el objeto de solicitud.
   * @param item - El estado actual del trámite 120201.
   * @returns El objeto de solicitud construido.
   */
  buildSolicitud(item: Cupos120201State): Record<string, unknown> {
    return {
      cveFraccion: Array.isArray(item?.cupoDescripcionForm?.fraccionesArancelarias)
        ? item?.cupoDescripcionForm?.fraccionesArancelarias[0]
        : item?.cupoDescripcionForm?.fraccionesArancelarias ?? null,

      cadenaMontos: (item?.cuerpoTabla ?? [])
        .map(exp => String(exp?.montoExpedir))
        .join(','),

      solicitante: this.buildSolicitante(),

      unidadAdministrativaRepresentacionFederal: {
        clave: item?.representacionFederalForm?.clave ?? null,
        nombre: item?.representacionFederalForm?.representacionFederal ?? null,
        entitadNombre: item?.representacionFederalForm?.estado ?? null
      },

      asignacion: this.buildAsignacion(item)
    };
  }


  /** Método para construir el array de expediciones.
   * @param item - El estado actual del trámite 120201.
   * @returns El array de expediciones construido.
   */
  buildExpediciones(item: Cupos120201State): Record<string, unknown>[] {
    return (item?.cuerpoTabla ?? []).map(exp => ({
      cantidad: exp?.montoExpedir ?? null,
      numeroFolioCertificado: item?.asignacionDatosForm?.numOficio ?? null,
      certificadoAprobado: item?.controlMontosAsignacionForm?.sumaAprobada ?? null,
      descripcionMercancia: item?.cupoDescripcionForm?.descripcionProducto ?? null
    }));
  }


  /** Método para construir el payload de la solicitud.
   * @param item - El estado actual del trámite 120201.
   * @returns El payload construido para la solicitud.
   */
  buildPayload(item: Cupos120201State): Record<string, unknown> {
    return {
      idSolicitud: item?.idSolicitud ?? null,
      totalExpedir: item?.distribucionSaldoForm?.totalExpedir ?? null,
      discriminatorValue: "120201",

      solicitud: this.buildSolicitud(item),
      expediciones: this.buildExpediciones(item)
    };

  }

  /** Normaliza la respuesta de la API para extraer los datos relevantes. */
 private normalizeResponse(
  response: Record<string, unknown>
): Record<string, unknown> | null {

  const DATA =
    response?.['asignacion']
      ? response
      : Array.isArray(response?.['datos'])
        ? response['datos'][0]
        : response?.['datos'] ?? response;

  if (!DATA?.['asignacion']) {
    return null;
  }

  return DATA;
}

/** Métodos privados para mapear los datos de la respuesta de la API al estado del store. */
  private mapRepresentacionFederal(data: Record<string, unknown>): Record<string, unknown> {
    return {
      estado:
        data?.['unidadAdministrativaRepresentacionFederal'] && typeof data['unidadAdministrativaRepresentacionFederal'] === 'object' && data['unidadAdministrativaRepresentacionFederal'] !== null && 'entitadNombre' in data['unidadAdministrativaRepresentacionFederal']
          ? (data['unidadAdministrativaRepresentacionFederal'] as { entitadNombre?: string })?.entitadNombre
          :
          null,
      representacionFederal:
        ((data?.['unidadAdministrativaRepresentacionFederal'] && typeof data['unidadAdministrativaRepresentacionFederal'] === 'object' && data['unidadAdministrativaRepresentacionFederal'] !== null && 'nombre' in data['unidadAdministrativaRepresentacionFederal'])
          ? (data?.['unidadAdministrativaRepresentacionFederal'] as { nombre?: string })?.nombre
          : null) ?? null
    };
  }

  /** Mapea los datos de asignación desde la respuesta de la API al formato del store. */
  private mapAsignacionDatos(asignacion: Record<string, unknown>): Record<string, unknown> {
    return {
      idAsignacion: asignacion?.['idAsignacion'] ?? null,
      numOficio: asignacion?.['numFolioAsignacion'] ?? null,
      fechaInicio: formatearFechaDdMmYyyy(
        typeof asignacion?.['fechaInicioVigencia'] === 'string' ? asignacion['fechaInicioVigencia'] : ''
      ),
      fechaFinVigenciaAprobada: formatearFechaDdMmYyyy(
        asignacion?.['fechaFinVigenciaAprobada'] === 'string' ? asignacion['fechaFinVigenciaAprobada'] : ''
      )
    };
  }

  /** Mapea los datos de asignación de oficio desde la respuesta de la API al formato del store. */
  private mapAsignacionOficio(asignacion: Record<string, unknown>): Record<string, unknown> {
    return {
      cveAniosAutorizacion:
        asignacion?.['añoAutorizacion'] ??
        asignacion?.['anioAutorizacion'] ??
        null,
      numFolioAsignacionAux:
        asignacion?.['numFolioAsignacionAux'] ?? null
    };
  }

  /** Mapea los datos de control de montos desde la respuesta de la API al formato del store. */
  private mapControlMontos(asignacion: Record<string, unknown>): Record<string, unknown> {
    return {
      sumaAprobada: asignacion?.['impTotalAprobado'] ?? null,
      sumaExpedida: asignacion?.['impTotalExpedido'] ?? null,
      montoDisponible: asignacion?.['montoDisponible'] ?? null
    };
  }

  /** Mapea los datos de descripción del cupo desde la respuesta de la API al formato del store. */
  private mapCupoDescripcion(mecanismo: Record<string, unknown>): Record<string, unknown> {
    return {
      regimenAduanero: mecanismo?.['regimen'] ?? null,
      descripcionProducto: mecanismo?.['nombreProducto'] ?? null,
      clasificaionSubproducto: undefined,
      descClasificacionProducto:
        mecanismo?.['descClasificacionProducto'] ?? null,

      unidadMedidaOficialCupo:
        mecanismo?.['unidadMedidaDescripcion'] ?? null,
      mecanismoAsignacion:
        mecanismo?.['nombreMecanismoAsignacion'] ?? null,
      tratado: mecanismo?.['nombreTratado'] ?? null,

      fechaInicioVigencia: formatearFechaDdMmYyyy(
        typeof mecanismo?.['fechaInicioVigencia'] === 'string' ? mecanismo['fechaInicioVigencia'] : ''
      ),
      fechaFinVigencia: formatearFechaDdMmYyyy(
        typeof mecanismo?.['fechaFinVigencia'] === 'string' ? mecanismo['fechaFinVigencia'] : ''
      ),

      paisesCupo:
        Array.isArray(mecanismo?.['paisesCupo'])
          ? mecanismo['paisesCupo'].map(
            (p: { pais?: { nombre?: string } }) => p?.pais?.nombre
          )
          : [],

      observaciones: mecanismo?.['observaciones'] ?? null,
      descripcionFundamento:
        mecanismo?.['descripcionFundamento'] ?? null
    };
  }

  /** Mapea los datos de distribución de saldo desde la respuesta de la API al formato del store. */
  private mapDistribucionSaldo(asignacion: Record<string, unknown>, data: Record<string, unknown>): Record<string, unknown> {
    return {
      montoDisponibleAsignacion: asignacion?.['montoDisponible'] ?? null,
      montoDisponible: asignacion?.['montoDisponible'] ?? null,
      totalExpedir: data?.['totalExpedir'] ?? null
    };
  }

  /** Método para revertir el payload de la respuesta de la API al estado del store. */
  reversePayload(response: Record<string, unknown>): Partial<Cupos120201State> {
    const DATA = this.normalizeResponse(response);
    if (!DATA) { return {}; }

    const ASIGNACION_VALUES = DATA?.['asignacion'];
    const MECANISMO = (ASIGNACION_VALUES as Record<string, unknown>)?.['mecanismoAsignacion'];

    return {
      idSolicitud: typeof DATA?.['idSolicitud'] === 'number' ? DATA['idSolicitud'] : null,
      representacionFederalForm:
        this.mapRepresentacionFederal(DATA as Record<string, unknown>),

      asignacionDatosForm:
        this.mapAsignacionDatos(ASIGNACION_VALUES as Record<string, unknown>),

      asignacionOficioNumeroForm:
        this.mapAsignacionOficio(ASIGNACION_VALUES as Record<string, unknown>),

      controlMontosAsignacionForm:
        this.mapControlMontos(ASIGNACION_VALUES as Record<string, unknown>),
  cupoDescripcionForm: {
    descClasificacionProducto:
      typeof (MECANISMO as Record<string, unknown>)['descClasificacionProducto'] === 'string'
        ? (MECANISMO as Record<string, unknown>)['descClasificacionProducto'] as string
        : null,
  fraccionesArancelarias: Array.isArray(DATA?.['fraccionArancelaria'])
    ? DATA['fraccionArancelaria'].join(',')
    : typeof DATA?.['fraccionArancelaria'] === 'string'
      ? DATA['fraccionArancelaria']
      : '',
    ...this.mapCupoDescripcion(MECANISMO as Record<string, unknown>)
  },

      distribucionSaldoForm:
        this.mapDistribucionSaldo(ASIGNACION_VALUES as Record<string, unknown>, DATA as Record<string, unknown>),
      cuerpoTabla: Array.isArray(DATA?.['expediciones'])
        ? DATA['expediciones'].map((e: Record<string, unknown>) => {
          return ({
            montoExpedir: Number(e?.['cantidad'] ?? e?.['montoExpedir'] ?? 0)
          });
        })
        : [],
      mostrarDetalle: true
    };
  }

}

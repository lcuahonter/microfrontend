import { ExpedicionCertificadosAsignacion120202State, Tramite120202Store } from '../../../../estados/tramites/tramite120202.store';
import { HttpCoreService, JSONResponse, formatearFechaDdMmYyyy, formatearFechaYyyyMmDd, } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROC_120202 } from '../../servers/api-routes';
import { Tramite120202Query } from '../../../../estados/queries/tramite120202.query';

/**
 * Servicio para la gestión de la asignación de expedición de certificados.
 * @description Este servicio se encarga de realizar las peticiones HTTP necesarias para obtener los catálogos y datos relacionados con la asignación de expedición de certificados.
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para la gestión de la asignación de expedición de certificados.
 * @description Este servicio se encarga de realizar las peticiones HTTP necesarias para obtener los catálogos y datos relacionados con la asignación de expedición de certificados.
 */
export class ExpedicionCertificadosAsignacionService {

  /**
   * Constructor del servicio de catálogos.
   * @param http - Inyección del servicio HttpClient para realizar peticiones HTTP.
   * @description Este servicio se encarga de obtener los catálogos necesarios para el funcionamiento de la aplicación.
   */
  constructor(
    private tramite120202Store: Tramite120202Store,
    private http: HttpClient,
    public httpService: HttpCoreService,
    private tramite120202Query: Tramite120202Query
  ) {
    // Constructor vacío

  }

  /**
    * Obtiene todos los datos del estado almacenado en el store.
    * @returns {Observable<ExpedicionCertificadosAsignacion120202State>} Observable con todos los datos del estado.
    */
  getAllState(): Observable<ExpedicionCertificadosAsignacion120202State> {
    return this.tramite120202Query.selectSeccionState$;
  }

  /** Método para guardar los datos del formulario.
   * @param body - El cuerpo de la solicitud a guardar.
   * @returns Observable<Record<string, unknown>> - Observable que emite la respuesta de la solicitud de guardado.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_120202.GUARDAR, { body: body });
  }

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_120202.MOSTRAR(id));
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
   * @param item - El estado actual del trámite 120202.
   * @returns El objeto de asignación construido.
   */
  buildAsignacion(item: ExpedicionCertificadosAsignacion120202State): Record<string, unknown> {
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
   * @param item - El estado actual del trámite 120202.
   * @returns El objeto de mecanismo de asignación construido.
   */
  buildMechanismoAsignacion(item: ExpedicionCertificadosAsignacion120202State): Record<string, unknown> {
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
   * @param item - El estado actual del trámite 120202.
   * @returns El objeto de solicitud construido.
   */
  buildSolicitud(item: ExpedicionCertificadosAsignacion120202State): Record<string, unknown> {
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
   * @param item - El estado actual del trámite 120202.
   * @returns El array de expediciones construido.
   */
  buildExpediciones(item: ExpedicionCertificadosAsignacion120202State): Record<string, unknown>[] {
    return (item?.cuerpoTabla ?? []).map(exp => ({
      cantidad: exp?.montoExpedir ?? null,
      numeroFolioCertificado: item?.asignacionDatosForm?.numOficio ?? null,
      certificadoAprobado: item?.controlMontosAsignacionForm?.sumaAprobada ?? null,
      descripcionMercancia: item?.cupoDescripcionForm?.descripcionProducto ?? null
    }));
  }


  /** Método para construir el payload de la solicitud.
   * @param item - El estado actual del trámite 120202.
   * @returns El payload construido para la solicitud.
   */
  buildPayload(item: ExpedicionCertificadosAsignacion120202State): Record<string, unknown> {
    return {
      idSolicitud: item?.idSolicitud ?? null,
      cveRolCapturista: "PersonaMoral",
      totalExpedir: item?.distribucionSaldoForm?.totalExpedir ?? null,
      discriminatorValue: "120202",

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
  reversePayload(response: Record<string, unknown>): Partial<ExpedicionCertificadosAsignacion120202State> {
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

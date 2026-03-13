import { CATALOGO_ENTIDADES_FEDERATIVAS, CATALOGO_REPRESENTACION_FEDERAL, COMUN_URL, Catalogo, JSONResponse, convertirFechaDdMmYyyyAMoment, formatDateToDDMMYYYY } from '@libs/shared/data-access-user/src';
import { LicitacionResponse, ParticipantesData } from '../models/solicitud.model';
import { Solicitud120501State, Tramite120501Store } from '../estados/tramites/tramite120501.store';
import { catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LicitacionesDisponibles } from '@libs/shared/data-access-user/src/tramites/constantes/120501/licitaciones-disponibles-table-data.enum';
import { Observable } from 'rxjs/internal/Observable';
import { PROC_120501 } from '../servers/api-route';
import { Tramite120501Query } from '../estados/queries/tramite120501.query';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con las licitaciones disponibles,
 * incluyendo la obtención de catálogos, detalles de licitación, adquirientes y el manejo del estado
 * del formulario para el trámite 120501.
 *
 * Proporciona métodos para consumir archivos JSON locales que simulan respuestas de un backend,
 * así como para actualizar el estado global del formulario a través del store correspondiente.
 */
@Injectable({
  providedIn: 'root'
})
export class LicitacionesDisponiblesService {

  /**
   * URL base del host para todas las consultas de catálogos.
   *
   * Esta propiedad almacena la URL base configurada desde las variables de entorno
   * y se utiliza como prefijo para construir todos los endpoints de los catálogos.
   *
   * @type {string}
   * @readonly
   * @since 1.0.0
   */
  host: string;

  /**
   * Constructor del servicio.
   * Servicio HttpClient para realizar peticiones HTTP.
   * Store para gestionar el estado del trámite 120501.
   */
  constructor(private http: HttpClient, private tramite120501Store: Tramite120501Store, private tramiteQuery: Tramite120501Query) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Obtiene el listado de licitaciones disponibles.
   */
  getData(): Observable<LicitacionesDisponibles[]> {
    return this.http.get<LicitacionesDisponibles[]>('assets/json/120501/licitaciones-disponibles.json');
  }

  /*
    * Obtiene el catálogo de entidades federativas.
    * @param {string} tramite - El ID del trámite.
    * @returns {Observable<BaseResponse<Catalogo[]>>}
    */
  entidadesFederativasCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ENTIDADES_FEDERATIVAS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de representación federal.
   * @param {string} tramite - El ID del trámite.
   * @param {string} cveEntidad - La clave de la entidad.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  representacionFederalCatalogo(tramite: string, cveEntidad: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_REPRESENTACION_FEDERAL(tramite, cveEntidad)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
    * Obtiene todos los datos del estado almacenado en el store.
    * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
    */
  getAllState(): Observable<Solicitud120501State> {
    return this.tramiteQuery.selectSolicitud$;
  }
  /**
   *  Obtiene las licitaciones disponibles para un RFC específico.
   * @param RFC  - El RFC del participante.
   * @returns  Observable con los datos de las licitaciones disponibles.
   */
  getLicitacionesDisponiblesData(RFC: string): Observable<JSONResponse> {
    const ENDPOINT = `${PROC_120501.PREFILLED}/` + RFC;
    return this.http.get<JSONResponse>(ENDPOINT);
  }

  /**
   *  Obtiene los datos asociados a un RFC y una licitación específica.
   * @param RFC  - El RFC del participante.
   * @param idLicitacion  - El ID de la licitación.
   * @returns  Observable con los datos del participante.
   */
  fetchRFCData(RFC: string, idLicitacion: number): Observable<JSONResponse> {
    const ENDPOINT = `${PROC_120501.FETCH_RFC}/` + RFC + '/' + idLicitacion;
    return this.http.get<JSONResponse>(ENDPOINT)
      .pipe(map((response) => {
        if (!response.datos) {
          throw new Error('No se encontraron datos en la respuesta');
        }
        return response;
      }),
        catchError(() => {
          const ERROR = new Error(
            `Ocurrió un error al devolver la información ${ENDPOINT} `
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   *  Obtiene las licitaciones para el formulario basado en los datos proporcionados.
   * @param body  - Objeto que contiene los datos necesarios para la consulta.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  getLicitacionesFormData(body: Record<string, unknown>): Observable<JSONResponse> {
    const ENDPOINT = `${PROC_120501.BUSCAR}`;
    return this.http.post<JSONResponse>(ENDPOINT, body)
  }

  /**
      * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
      *
      * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
      * @returns Observable con la respuesta de la solicitud POST.
      */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_120501.GUARDAR, body);
  }

  /**
   * Obtiene los datos para mostrar una solicitud específica.
   * @param solicitudId - El ID de la solicitud.
   * @returns Observable con los datos de la solicitud.
   */
  getMostrarDatos(solicitudId: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(PROC_120501.MOSTRAR + "/" + solicitudId);
  }

  /**
   * Obtiene los datos vigentes de licitaciones para el formulario principal.
   */
  getLicitationesVigentesData(): Observable<Solicitud120501State> {
    return this.http.get<Solicitud120501State>('assets/json/120501/solicitar-transferencia-cupos.json');
  }

  /**
   * Actualiza el estado global del formulario en el store con los datos proporcionados.
   */
  actualizarEstadoFormulario(response: Record<string, unknown>): void {
    const ENTIDAD = response['entidadFederativa'] as unknown as Record<string, unknown[]>;
    const ENTIDAD_CLAVE = ENTIDAD['entidad'] as unknown as Record<string, unknown[]>;
    this.tramite120501Store.actualizarEstado({ entidadFederativa: ENTIDAD_CLAVE['clave'] as unknown as string });

    const REPRESENTACION_CLAVE = response['unidadAdministrativaRepresentacionFederal'] as unknown as Record<string, unknown[]>;
    this.tramite120501Store.actualizarEstado({ representacionFederal: REPRESENTACION_CLAVE['clave'] as unknown as string });

    const FRACCION_ARANCELARIA = (response['fraccionArancelaria'] as unknown as string[]).toString();
    this.tramite120501Store.actualizarEstado({ fraccionArancelaria: FRACCION_ARANCELARIA });

    const LICITACION = response['licitacion'] as unknown as Record<string, unknown[]>;
    this.tramite120501Store.actualizarEstado({ unidadTarifaria: LICITACION['unidadMedidaTarifaria'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ numeraDelicitacion: LICITACION['numeroLicitacion'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ fechaDelEventoDelicitacion: LICITACION['fechaLimiteCalificacion'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ bloqueComercial: LICITACION['bloqueComercial'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ descripcionDelProducto: LICITACION['producto'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ fechaDefindeVigenciadelCupo: convertirFechaDdMmYyyyAMoment(formatDateToDDMMYYYY(LICITACION['fechaFinVigencia'] as unknown as string)) });
    this.tramite120501Store.actualizarEstado({ fechaDeiniciodeVigenciadelCupo: convertirFechaDdMmYyyyAMoment(formatDateToDDMMYYYY(LICITACION['fechaInicioVigencia'] as unknown as string)) });
    this.tramite120501Store.actualizarEstado({ regimenAduanero: LICITACION['anio'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ obserVaciones: LICITACION['anio'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ paises: LICITACION['paises'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ montoadJudicado: LICITACION['montoTransferir'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ montoDisponible: LICITACION['montoRecibir'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ montoRecibir: LICITACION['montoRecibir'] as unknown as string });
    this.tramite120501Store.actualizarEstado({ montoMaximo: LICITACION['maximoTransferir'] as unknown as string });

    const SOLICITUD = response['solicitud'] as unknown as Record<string, unknown[]>;
    this.tramite120501Store.actualizarEstado({ idAsignacion: SOLICITUD['idAsignacion'] as unknown as number });

    const PARTICIPANTE = SOLICITUD['participante'] as unknown as Record<string, unknown[]>;
    this.tramite120501Store.actualizarEstado({ rfc: PARTICIPANTE['rfc'] as unknown as string });

    const LICITACIONES_DISPONIBLES: LicitacionResponse = {
      idAsignacion: SOLICITUD['idAsignacion'] as unknown as number,
      numeroLicitacion: LICITACION['numeroLicitacion'] as unknown as string,
      montoAdjudicado: Number(LICITACION['montoTransferir'] as unknown as string),
      fechaInicioVigencia: convertirFechaDdMmYyyyAMoment(formatDateToDDMMYYYY(LICITACION['fechaFinVigencia'] as unknown as string)),
      fechaFinVigenciaAprobada: convertirFechaDdMmYyyyAMoment(formatDateToDDMMYYYY(LICITACION['fechaInicioVigencia'] as unknown as string)),
      nombreProducto: LICITACION['producto'] as unknown as string,
      fechaConcurso: LICITACION['fechaConcurso'] as unknown as string,
    }

    this.tramite120501Store.actualizarEstado({ licitacionTablaDatos: [LICITACIONES_DISPONIBLES] });
  }



  /**
   *  Genera el payload para guardar la solicitud basado en el estado actual del formulario.
   * @param item  - Estado actual del formulario.
   * @returns 
   */
  getGuardarPayload(item: Solicitud120501State): Record<string, unknown> {
    return {
      "entidadFederativa": {
        "entidad": {
          "clave": item.entidadFederativa
        }
      },
      "idSolicitud": item.idSolicitud === 0 ? null : item.idSolicitud,
      "unidadAdministrativaRepresentacionFederal": {
        "clave": item.representacionFederal
      },
      "licitacion": {
        "idLicitacion": item.licitacionesDatos?.licitacionPublica?.idLicitacion || 0,
        "anio": item.licitacionesDatos?.licitacionPublica?.anio,
        "cantidadMaxima": item.licitacionesDatos?.licitacionPublica?.cantidadMaxima,
        "fechaLimiteCalificacion": item.licitacionesDatos?.licitacionPublica?.fechaLimiteCalificacion,
        "fechaConcurso": item.licitacionesDatos?.licitacionPublica?.fechaConcurso,
        "fechaInicioVigencia": item.licitacionesDatos?.licitacionPublica?.fechaInicioVigencia,
        "fechaFinVigencia": item.licitacionesDatos?.licitacionPublica?.fechaFinVigencia,
        "fundamento": item.licitacionesDatos?.licitacionPublica?.fundamento,
        "ideTipoConstancia": item.licitacionesDatos?.licitacionPublica?.ideTipoConstancia,
        "ideTipoLicitacion": item.licitacionesDatos?.licitacionPublica?.ideTipoLicitacion,
        "numeroLicitacion": item.licitacionesDatos?.licitacionPublica?.numeroLicitacion,
        "idMecanismoAsignacion": item.licitacionesDatos?.licitacionPublica?.idMecanismoAsignacion,
        "producto": item.licitacionesDatos?.licitacionPublica?.producto,
        "unidadMedidaTarifaria": item.licitacionesDatos?.licitacionPublica?.unidadMedidaTarifaria,
        "bloqueComercial": item.licitacionesDatos?.licitacionPublica?.bloqueComercial,
        "paises": item.licitacionesDatos?.licitacionPublica?.paises
      },
      "fraccionArancelaria": item.licitacionesDatos.fraccionArancelaria,
      "solicitud": {
        "participante": {
          "rfc": item.rfc
        },
        "solicitante": {
          "rfc": item.rfc,
          "nombre": "ACEROS ALVARADO S.A. DE C.V.",
          "actividad_economica": "Fabricación de productos de hierro y acero",
          "correo_electronico": "contacto@acerosalvarado.com",
          "certificado_serial_number": "SN123456789",
          "domicilio": {
            "pais": "México",
            "codigo_postal": "06700",
            "estado": "Ciudad de México",
            "municipio_alcaldia": "Cuauhtémoc",
            "localidad": "Centro",
            "colonia": "Roma Norte",
            "calle": "Av. Insurgentes Sur",
            "numero_exterior": "123",
            "numero_interior": "Piso 5, Oficina A",
            "lada": "55",
            "telefono": "123456",
            "entidad_federativa": {
              "cveEntidad": "BCS",
              "nombre": "Ciudad de México",
              "codEntidadIdc": "CDMX",
              "cvePais": "MEX",
              "fechaCaptura": "2025-06-09",
              "fechaInicioVigencia": "2025-06-01",
              "fechaFinVigencia": "2025-12-31",
              "activo": true,
              "pais": "México",
              "claveEnIDC": "CDMX09"
            }
          }
        },
        "maximoTransferir": item.licitacionesDatos?.maximoTransferir,
        "montoTransferir": item.licitacionesDatos?.montoTransferir,
        "montoRecibir": item.montoRecibir,
        "idAsignacion": item.idAsignacion
      }
    }
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */

import { FRACCION_DESCRIPCION, RFC_BUSCAR_REPRESENTANTE_LEGAL, UNIDAD_MEDIDA } from '../../../shared/servers/api-route';
import { Observable, combineLatest, map } from 'rxjs';
import { AvisocalidadQuery } from '../../../shared/estados/queries/aviso-calidad.query';
import { DatosDomicilioLegalQuery } from '../../../shared/estados/queries/datos-domicilio-legal.query';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { TercerosFabricanteQuery } from '../../../shared/estados/queries/terceros-fabricante.query';

import { TramitePagoBancoQuery } from '../../../shared/estados/queries/pago-banco.query';

import { AvisocalidadStore, SolicitudState } from '../../../shared/estados/stores/aviso-calidad.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../shared/estados/stores/datos-domicilio-legal.store';
import { SolicitudPagoBancoState, TramitePagoBancoStore } from '../../../shared/estados/stores/pago-banco.store';


/**
 * @description
 * Servicio compartido registrado en el inyector raíz de Angular.
 * Proporciona una instancia única (singleton) accesible en toda la aplicación.
 * Ideal para lógica reutilizable, gestión de estado o comunicación entre componentes.
 */

@Injectable({
  providedIn: 'root'
})

export class Shared260514Service {

  /**
 * @description
 * Constructor del servicio `Shared260514Service`.
 * Se ejecuta al momento de crear la instancia del servicio.
 * Ideal para inicializar propiedades, configurar dependencias o preparar el estado interno.
 */
  constructor(
    private datosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private tercerosFabricanteQuery: TercerosFabricanteQuery,
    private solicitudPagoBancoQuery: TramitePagoBancoQuery,
    private avisocalidadQuery: AvisocalidadQuery,
    private _http: HttpClient
  ) {
    // Initialization logic
  }

  /**
   * @description
   * Merges all state objects into one, removing duplicate keys.
   * If duplicates exist, keeps only the meaningful (non-empty) value.
   * @returns {Observable<Record<string, unknown>>} Observable with the merged state.
   */
  getAllState(): Observable<Record<string, unknown>> {
    return combineLatest([
      this.datosDomicilioLegalQuery.allStoreData$,
      this.tercerosFabricanteQuery.allStoreData$,
      this.solicitudPagoBancoQuery.allStoreData$,
      this.avisocalidadQuery.allStoreData$
    ]).pipe(
      map(([datosDomicilioLegal, tercerosFabricante, solicitudPagoBanco, avisocalidad]) =>
        Shared260514Service.mergeStates(
          datosDomicilioLegal as unknown as Record<string, unknown>,
          tercerosFabricante as unknown as Record<string, unknown>,
          solicitudPagoBanco as unknown as Record<string, unknown>,
          avisocalidad as unknown as Record<string, unknown>
        )
      )
    );
  }

  /**
   * @description
   * Utility function to merge multiple state objects.
   * Removes duplicate keys and retains only meaningful values.
   * @param {...Record<string, any>} states - List of state objects to merge.
   * @returns {Record<string, unknown>} Merged state object.
   */
  private static mergeStates(...states: Record<string, unknown>[]): Record<string, unknown> {
    const RESULT: Record<string, unknown> = {};

    for (const STATE of states) {
      for (const [KEY, VALUE] of Object.entries(STATE)) {
        const EXISTING = RESULT[KEY];

        const IS_MEANINGFUL = VALUE !== null && VALUE !== undefined &&
          !(typeof VALUE === 'string' && VALUE.trim() === '') &&
          !(Array.isArray(VALUE) && VALUE.length === 0);

        if (!EXISTING || IS_MEANINGFUL) {
          RESULT[KEY] = VALUE;
        }
      }
    }

    return RESULT;
  }

  /**
 * Construye el objeto de carga útil (payload) que representa la solicitud completa
 * para el trámite correspondiente, integrando los datos del solicitante, establecimiento,
 * mercancías, representante legal, terceros involucrados y el pago de derechos.
 *
 * @param data - Objeto que contiene todos los datos fuente necesarios para construir la solicitud.
 *               Se espera que incluya información sobre el establecimiento, SCIAN, mercancías,
 *               representante legal, y tablas de terceros como proveedor, formulador y fabricante.
 * @param discriminatorValue - Valor numérico que identifica el tipo de solicitud o trámite.
 *
 * @returns Un objeto `Record<string, unknown>` que representa la estructura completa de la solicitud,
 *          listo para ser enviado o procesado por el sistema.
 */
  // eslint-disable-next-line class-methods-use-this
  buildPayload(data: Record<string, unknown>, discriminatorValue: number): Record<string, unknown> {
    const ESTABLECIMIENTO = Shared260514Service.buildEstablecimiento(data);
    const SOLICITUD = Shared260514Service.buildSolicitud(data, discriminatorValue);
    const DATOS_SCIAN = Shared260514Service.buildDatosScian(data);
    const MERCANCIAS = Shared260514Service.buildMercancias(data);
    const REPRESENTANTE_LEGAL = Shared260514Service.buildRepresentanteLegal(data);
    const PAGO_DERECHOS = Shared260514Service.buildPagoDerechos(data);

    

    return {
      "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "ACEROS ALVARADO S.A. DE C.V.",
        "actividadEconomica": "Fabricación de productos de hierro y acero",
        "correoElectronico": "contacto@acerosalvarado.com",
        "domicilio": {
          "pais": "México",
          "codigoPostal": "06700",
          "estado": "Ciudad de México",
          "municipioAlcaldia": "Cuauhtémoc",
          "localidad": "Centro",
          "colonia": "Roma Norte",
          "calle": "Av. Insurgentes Sur",
          "numeroExterior": "123",
          "numeroInterior": "Piso 5, Oficina A",
          "lada": "",
          "telefono": "123456"
        }
      },
      "solicitud": SOLICITUD,
      "establecimiento": ESTABLECIMIENTO,
      "datosSCIAN": DATOS_SCIAN,
      "mercancias": MERCANCIAS,
      "representanteLegal": REPRESENTANTE_LEGAL,
      "pagoDeDerechos": PAGO_DERECHOS
    };
  }

  static buildSolicitud(
  data: Record<string, unknown>,
  discriminatorValue: number
): Record<string, unknown> {
  return {
    discriminatorValue, 
    declaracionesSeleccionadas: Boolean(data['mensaje'] ?? false),
    regimen: "",
    aduanaAIFA: "",
    informacionConfidencial:
      typeof data['cumplimiento'] === 'string'
        ? data['cumplimiento'].toLowerCase() === 'si'
        : Boolean(data['cumplimiento'] ?? false)
  };
}


  /**
 * Construye el objeto que representa los datos del establecimiento, incluyendo
 * información del responsable sanitario, razón social, correo y domicilio.
 *
 * @param data - Objeto con los datos fuente del formulario o entrada del usuario.
 *               Se espera que contenga claves como `rfcDel`, `denominacionRazonSocial`,
 *               `correoElectronico`, `codigoPostal`, `estado`, `muncipio`, `localidad`,
 *               `colonia`, `calle`, `lada` y `telefono`.
 *
 * @returns Un objeto `Record<string, unknown>` con la estructura del establecimiento,
 *          listo para integrarse en el payload de la solicitud.
 */
  static buildEstablecimiento(data: Record<string, unknown>): Record<string, unknown> {
    
    return {
      "rfcResponsableSanitario": data['rfcDel'] || "",
      "razonSocial": data['denominacionRazonSocial'] || "",
      "correoElectronico": data['correoElectronico'] || "",
      "domicilio": {
      "codigoPostal": data['codigoPostal'] || "",
      "entidadFederativa": {
        "clave": data['estado'] || ""
      },
      "descripcionMunicipio": data['muncipio'] || "",
      "informacionExtra": data['localidad'] || "",
      "descripcionColonia": data['colonia'] || "",
      "calle":  data['calle'] || "",
      "lada": data['lada'] || "",
      "telefono": data['telefono'] || "",
      },
      "original": "",
      "avisoFuncionamiento": data['avisoCheckbox'] || false,
      "numeroLicencia": data['licenciaSanitaria'] || "",
      "aduanas": Array.isArray(data['aduanasDeEntradaObj'])
      ? data['aduanasDeEntradaObj'].map((a: { clave?: string }) => a?.clave || "")
      : [],
    }
  }

  /**
 * Construye el objeto que representa los datos del establecimiento, incluyendo
 * información del responsable sanitario, razón social, correo y domicilio.
 *
 * @param data - Objeto con los datos fuente del formulario o entrada del usuario.
 *               Se espera que contenga claves como `rfcDel`, `denominacionRazonSocial`,
 *               `correoElectronico`, `codigoPostal`, `estado`, `muncipio`, `localidad`,
 *               `colonia`, `calle`, `lada` y `telefono`.
 *
 * @returns Un objeto `Record<string, unknown>` con la estructura del establecimiento,
 *          listo para integrarse en el payload de la solicitud.
 */
  static buildDatosScian(data: Record<string, unknown>): {cveScian: string, descripcion: string, selected: boolean}[] {

    const NICOTABLA = data['nicoTabla'] as Array<{ [key: string]: unknown }> | undefined;
    if (!Array.isArray(NICOTABLA)) {
      return [];
    }

    return NICOTABLA.map(item => ({
      "cveScian": String(item['clave_Scian'] ?? ""),
      "descripcion": String(item['descripcion_Scian'] ?? ""),
      "selected": true
    }));
  }

  /**
 * Construye un arreglo de objetos que representan las mercancías incluidas en la solicitud,
 * a partir de los datos proporcionados en la tabla `mercanciaTabla`.
 *
 * @param data - Objeto fuente que contiene la clave `mercanciaTabla`, la cual debe ser un arreglo
 *               de objetos con información detallada de cada mercancía, como estado físico,
 *               fracción arancelaria, unidad de medida, país de origen, uso específico, etc.
 *
 * @returns Un arreglo de objetos `Record<string, unknown>` que representan cada mercancía
 *          con su estructura completa, listo para integrarse en el payload de la solicitud.
 *          Si no se proporciona una tabla válida, se retorna un arreglo vacío.
 */
  static buildMercancias(data: Record<string, unknown>): Record<string, unknown>[] {
    const MERCANCIA_TABLA = data['mercanciaTabla'] as Array<{ [key: string]: unknown }> | undefined;
    if (!Array.isArray(MERCANCIA_TABLA)) {
      return [];
    }

    return MERCANCIA_TABLA.map(item => ({
        
      "objetoImportacionEnum": item['objetoImportacion'] as string || "",
      "objetoImportacionDesc": "Descripción (opcional, desde catálogo)",
      "descOtroObjetoImportacion": item['objetoImportacionOtro'] as string || "",
      "clasificacionToxicologica": {
             "idClasificacionToxicologicaTipoTramite": item['clasificacionToxicologica'] as string || "",
             "clasificacionToxicologica": ""
            },
     "numeroCAS": "34121",
     "porcentajeConcentracion": item['porcentajeConcentracion'] as string || "",
     "nombreComercial": item['nombreComercial'] as string || "",
     "nombreComun": item['nombreComun'] as string || "",
     "nombreCientifico": item['nombreCientifico'] as string || "",
      "idEstadoFisico": item['estadoFisico'] as string || "",  
      "idMercancia": "1",
      "idClasificacionProducto": "325",
      "nombreClasificacionProducto": "Fab. sustancias químicas básicas",
      "ideSubClasificacionProducto": "32541",
      "nombreSubClasificacionProducto": "Fab. productos farmacéuticos",
      "descDenominacionEspecifica": "Medicamentos para uso humano",
      "descDenominacionDistintiva": "Paracetamol Tabletas 500mg",
      "descripcionMercancia": "Acetaminophen",
      "formaFarmaceuticaDescripcionOtros": "Tableta",
      "estadoFisicoDescripcionOtros": item['estadoFisicoOtro'] as string || "",
      "fraccionArancelaria": {
          "clave": item['fraccionArancelaria'] as string || "",
          "descripcion": item['descripcionFraccion'] as string || ""
      },
      "unidadMedidaComercial": {
          "descripcion": item['UMC'] as string || ""
      },
      "cantidadUMCConComas": item['cantidadUmc'] as string || "",
      "unidadMedidaTarifa": {
          "descripcion": item['UMT'] as string || ""
      },
      "cantidadUMTConComas": item['cantidadUmt'] as string || "",
      "presentacion": "Frasco x 100 tabletas",
      "registroSanitarioConComas": item['numeroRegistroSanitario'] as string || "",
      "nombreCortoPaisOrigen": Array.isArray(item['paisDeOriginDatosObj'])
      ? item['paisDeOriginDatosObj'].map((a: { clave?: string }) => a?.clave || "")
      : [],
      "nombreCortoPaisProcedencia": Array.isArray(item['paisDeProcedenciaDatosObj'])
      ? item['paisDeProcedenciaDatosObj'].map((a: { clave?: string }) => a?.clave || "")
      : [],
      "tipoProductoDescripcionOtros": "Analgésico",
      "nombreCortoUsoEspecifico": item['usoEspecifico'] as string || "",
      "fechaCaducidadStr": "31/12/2026"
    }));
  }

/**
 * Construye el objeto que representa los datos del representante legal de la solicitud,
 * incluyendo su RFC, nombre completo y campos auxiliares.
 *
 * @param data - Objeto fuente que contiene las claves necesarias para identificar al representante legal.
 *               Se esperan las propiedades `rfc`, `nombre`, `apellidoPaterno` y `apellidoMaterno`.
 *
 * @returns Un objeto `Record<string, unknown>` con la estructura del representante legal,
 *          listo para integrarse en el payload de la solicitud.
 */
  static buildRepresentanteLegal(data: Record<string, unknown>): Record<string, unknown> {
    return {
      "rfc": data['rfc'] || '',
      "resultadoIDC": "",
      "nombre": data['nombre'] || '',
      "apellidoPaterno": data['apellidoPaterno'] || '',
      "apellidoMaterno": data['apellidoMaterno'] || ''
    };
  }

  /**
 * Construye un arreglo de objetos que representan a terceros involucrados en la solicitud,
 * como proveedores, fabricantes o formuladores, a partir de los datos tabulares proporcionados.
 *
 * @param data - Arreglo de objetos que contienen la propiedad `tbodyData`, la cual debe ser
 *               un arreglo con los datos de cada tercero. Cada posición del arreglo representa
 *               un campo específico como denominación, RFC, CURP, teléfono, correo, domicilio, etc.
 *
 * @returns Un arreglo de objetos `Record<string, unknown>` que representan a cada tercero con
 *          su información estructurada, listo para integrarse en el payload de la solicitud.
 *          Si no se encuentran datos válidos, se retorna un arreglo vacío.
 */
  static buildTercerosTablaDatos(data: Array<{ tbodyData?: Array<unknown> }>): Record<string, unknown>[] {
    return data
      .filter(row => Array.isArray(row.tbodyData))
      .map(row => {
        const ITEM = row.tbodyData as Array<unknown>;

        return {
          idPersonaSolicitud: "1",
          ideTipoTercero: "TIPERS.FAB",
          personaMoral: "1",
          booleanExtranjero: "0",
          booleanFisicaNoContribuyente: "0",
          denominacion: ITEM[0],
          razonSocial: ITEM[0],
          rfc: ITEM[1],
          curp: ITEM[2],
          nombre: ITEM[0],
          apellidoPaterno: "",
          apellidoMaterno: "",
          telefono: ITEM[3],
          correoElectronico: ITEM[4] || "",
          actividadProductiva: "MANUFACTURA",
          actividadProductivaDesc: "Fabricación de productos farmacéuticos",
          descripcionGiro: "Laboratorio farmacéutico",
          numeroRegistro: "REG-001-2024",
          domicilio: {
            calle: ITEM[5],
            numeroExterior: ITEM[6],
            numeroInterior: ITEM[7],
            pais: { clave: ITEM[8], nombre: "" },
            colonia: { clave: ITEM[9], nombre: "" },
            delegacionMunicipio: { clave: ITEM[10], nombre: "" },
            localidad: { clave: ITEM[11], nombre: "" },
            entidadFederativa: { clave: ITEM[12], nombre: "" },
            informacionExtra: ITEM[13],
            codigoPostal: ITEM[14],
            descripcionColonia: "Industrial Norte"
          },
          idSolicitud: "12345"
        }
    });
  }

  /**
 * Construye el objeto que representa los datos del pago de derechos asociado a la solicitud,
 * incluyendo claves de referencia, información bancaria y monto pagado.
 *
 * @param data - Objeto fuente que contiene las claves necesarias para identificar el pago.
 *               Se esperan propiedades como `claveDeReferencia`, `cadenaDependencia`, `banco`,
 *               `llaveDePago`, `fechaPago` e `importePago`.
 *
 * @returns Un objeto `Record<string, unknown>` con la estructura del pago de derechos,
 *          listo para integrarse en el payload de la solicitud.
 */
  static buildPagoDerechos(data: Record<string, unknown>): Record<string, unknown> {
    return {
      "claveDeReferencia": data['claveDeReferencia'] || "",
        "cadenaPagoDependencia": data['cadenaDependencia'] || "",
        "banco": {
            "clave": data['banco'],
            "descripcion": ""
        },
        "llaveDePago": data['llaveDePago'] || "",
        "fecPago": data['fechaPago'] || "",
        "impPago": data['importePago'] || ""
    }
  }

  /**
   * Realiza una solicitud HTTP POST para obtener información del representante legal
   * basado en el cuerpo proporcionado y el identificador del procedimiento.
   */
  getRepresentanteLegala(body: Record<string, unknown>, idProcedimiento: string): Observable<JSONResponse> {
    return this._http.post<JSONResponse>(RFC_BUSCAR_REPRESENTANTE_LEGAL(idProcedimiento), body).pipe(
      map((response) => response)
    );
  }

  /**
   * Realiza una solicitud HTTP GET para obtener la descripción de una fracción arancelaria
   * basada en la clave y el identificador del tipo de trámite.
   */
  getFraccionDescripcion(clave: string, idTipoTramite: string): Observable<JSONResponse> {
    return this._http.get<JSONResponse>(FRACCION_DESCRIPCION(clave, idTipoTramite)).pipe(
      map((response) => response)
    );
  }

  /**
   * Realiza una solicitud HTTP GET para obtener la unidad de medida
   * basada en la clave de fracción y el identificador del tipo de trámite.
   */
  getUnidad(cveFraccion: string, idTipoTramite: string): Observable<JSONResponse> {
    return this._http.get<JSONResponse>(UNIDAD_MEDIDA(cveFraccion, idTipoTramite)).pipe(
      map((response) => response)
    );
  }


      static fromApiResponseToEstablecimientoDatos(response: unknown): Partial<SolicitudState> {
            if (!response || typeof response !== 'object') {
                return {};
            }
            const RESP = response as any;
            const DATOS_ESTABLECIMIENTO_FORM_STATE = {
  
              rfcDel: RESP.establecimiento?.rfcResponsableSanitario ?? '',
              denominacionRazonSocial: RESP.establecimiento?.razonSocial ?? '',
              correoElectronico: RESP.establecimiento?.correoElectronico ?? '',
            }
            return DATOS_ESTABLECIMIENTO_FORM_STATE;
          }
  
  
          static fromApiResponseToPago(response: unknown): Partial<SolicitudPagoBancoState> {
            if (!response || typeof response !== 'object') {
                return {};
            }
            const RESP = response as any;
              const DATOS_PAGO_FORM_STATE = {
              claveDeReferencia: RESP.pagoDeDerechos?.claveDeReferencia ?? '',
              cadenaDependencia: RESP.pagoDeDerechos?.cadenaPagoDependencia ?? '',
              banco: RESP.pagoDeDerechos?.banco?.clave ?? '',
              bancoObject: RESP.pagoDeDerechos?.banco
                ? { id: RESP.pagoDeDerechos.banco.id ?? '', clave: RESP.pagoDeDerechos.banco.clave ?? '', descripcion: RESP.pagoDeDerechos.banco.descripcion ?? '' }
                : undefined,
              llaveDePago: RESP.pagoDeDerechos?.llaveDePago ?? '',
              fechaPago: RESP.pagoDeDerechos?.fecPago ?? '',
              importePago: RESP.pagoDeDerechos?.impPago ?? '',
              };
            return DATOS_PAGO_FORM_STATE;
          }
  
  
            static fromApiResponseToSolicitudDatos(response: unknown): Partial<DatosDomicilioLegalState> {
              if (!response || typeof response !== 'object') {
                  return {};
              }
              const RESP = response as any;
              const DATOS_SOLICITANTE_FORM_STATE = {
                codigoPostal: RESP.establecimiento?.domicilio?.codigoPostal ?? '',
                estado: RESP.establecimiento?.domicilio?.entidadFederativa?.clave ?? '',
                muncipio: RESP.establecimiento?.domicilio?.descripcionMunicipio ?? '',
                localidad: RESP.establecimiento?.domicilio?.informacionExtra ?? '',
                colonia: RESP.establecimiento?.domicilio?.descripcionColonia ?? '',
                calle: RESP.establecimiento?.domicilio?.calle ?? '',
                lada: RESP.establecimiento?.domicilio?.lada ?? '',
                telefono: RESP.establecimiento?.domicilio?.telefono ?? '',
                avisoCheckbox: RESP.establecimiento?.avisoFuncionamiento ?? false,
                licenciaSanitaria: RESP.establecimiento?.numeroLicencia ?? '',
                aduanaId: Array.isArray(RESP.establecimiento?.aduanas)? RESP.establecimiento.aduanas: [],
                aduanasDeEntrada: Array.isArray(RESP.establecimiento?.aduanas) ? RESP.establecimiento.aduanas : [],
                aduanasDeEntradaObj: Array.isArray(RESP.establecimiento?.aduanas)
                  ? RESP.establecimiento.aduanas.map((clave: string) => ({
                    clave,
                    descripcion: ''
                  }))
                  : [],
                // Datos SCIAN
                nicoTabla: Array.isArray(RESP.datosSCIAN)
                ? RESP.datosSCIAN.map((item: any) => ({
                  clave_Scian: item.cveScian ?? '',
                  descripcion_Scian: item.descripcion ?? '',
                  selected: item.selected ?? true
                }))
                : [],
  
                // Datos del representante legal
                rfc: RESP.representanteLegal?.rfc ?? '',
                nombre: RESP.representanteLegal?.nombre ?? '',
                apellidoPaterno: RESP.representanteLegal?.apellidoPaterno ?? '',
                apellidoMaterno: RESP.representanteLegal?.apellidoMaterno ?? '',
  
                // Otros campos
                regimen: RESP.solicitud?.regimen ?? '',
                mensaje: RESP.solicitud?.declaracionesSeleccionadas ?? false,
                cumplimiento: RESP.solicitud?.informacionConfidencial === true ? 'Si' : 'No',
  
                // Mercancías
                mercanciaTabla: Array.isArray(RESP.mercancias)
                  ? RESP.mercancias.map((item: any) => ({
                    idMercancia: item.idMercancia ?? '',
                    objetoImportacion: item.objetoImportacionEnum ?? '',
                    objetoImportacionClave: item.objetoImportacionEnum ?? '',
                    objetoImportacionOtro: item.descOtroObjetoImportacion ?? '',
                    clasificacionToxicologica:
                      item.clasificacionToxicologica?.clasificacionToxicologica ?? '',
                    clasificacionToxicologicaClave:
                      item.clasificacionToxicologica?.idClasificacionToxicologicaTipoTramite ?? '',
                    nombreComercial: item.nombreComercial ?? '',
                    nombreComun: item.nombreComun ?? '',
                    nombreCientifico: item.nombreCientifico ?? '',
                    porcentajeConcentracion: item.porcentajeConcentracion ?? '',
                    estadoFisico: item.idEstadoFisico ?? '',
                    estadoFisicoClave: item.idEstadoFisico ?? '',
                    estadoFisicoOtro: item.estadoFisicoDescripcionOtros ?? '',
                    idClasificacionProducto: item.idClasificacionProducto ?? '',
                    nombreClasificacionProducto: item.nombreClasificacionProducto ?? '',
                    ideSubClasificacionProducto: item.ideSubClasificacionProducto ?? '',
                    nombreSubClasificacionProducto: item.nombreSubClasificacionProducto ?? '',
                    descDenominacionEspecifica: item.descDenominacionEspecifica ?? '',
                    descDenominacionDistintiva: item.descDenominacionDistintiva ?? '',
                    descripcionMercancia: item.descripcionMercancia ?? '',
                    formaFarmaceuticaDescripcionOtros: item.formaFarmaceuticaDescripcionOtros ?? '',
                    fraccionArancelaria: item.fraccionArancelaria?.clave ?? '',
                    descripcionFraccion: item.fraccionArancelaria?.descripcion ?? '',
                    umc: item.unidadMedidaComercial?.descripcion ?? '',
                    cantidadUmc: item.cantidadUMCConComas ?? '',
                    unidadMedidaTarifa: item.unidadMedidaTarifa?.descripcion ?? '',
                    cantidadUmt: item.cantidadUMTConComas ?? '',
                    numeroRegistroSanitario: item.registroSanitarioConComas ?? '',
                    numeroCas: item.numeroCAS ?? '',
                    paisDeOriginDatosObj: Array.isArray(item.nombreCortoPaisOrigen)
                      ? item.nombreCortoPaisOrigen.map((clave: string) => ({
                        clave,
                        descripcion: ''
                      }))
                      : [],

                    paisDeProcedenciaDatosObj: Array.isArray(item.nombreCortoPaisProcedencia)
                      ? item.nombreCortoPaisProcedencia.map((clave: string) => ({
                        clave,
                        descripcion: ''
                      }))
                      : [],
                    paisProcedenciaUltimoPuerto: item.nombreCortoPaisProcedencia ?? [],
                    usoEspecifico: item.nombreCortoUsoEspecifico ?? '',
                    tipoProductoDescripcionOtros:
                      item.tipoProductoDescripcionOtros ?? '',
                    fechaCaducidadStr: item.fechaCaducidadStr ?? ''
                  }))
                  : []
              }

            return DATOS_SOLICITANTE_FORM_STATE;
          }
    
        /**
         * Convenience method: map the API response and patch it directly into the provided store.
         * If the `store` argument is omitted, the method simply returns the mapped partial state.
         *
         * @param response API response
         * @param store Optional Tramite260513Store instance to apply the patch
         * @returns Partial<SolicitudState> (and patches the store when provided)
         */
   
  
         static patchToStoreEstable(response: any, store?: AvisocalidadStore): void {
                const PARTIAL = Shared260514Service.fromApiResponseToEstablecimientoDatos(response);
                if (store) {
                    // Akita's update accepts a partial or updater function
                    store.update((state) => ({ ...state, ...PARTIAL }));
                }
              
            }
  
            
         static patchToStoreSolicitud(response: any, store?: DatosDomicilioLegalStore): void {
                const PARTIAL = Shared260514Service.fromApiResponseToSolicitudDatos(response);
                if (store) {
                    // Akita's update accepts a partial or updater function
                    store.update((state) => ({ ...state, ...PARTIAL }));
                }
              
            }
  
               static patchToStorePago(response: any, store?: TramitePagoBancoStore): void {
                const PARTIAL = Shared260514Service.fromApiResponseToPago(response);
                if (store) {
                    // Akita's update accepts a partial or updater function
                    store.update((state) => ({ ...state, ...PARTIAL }));
                }
              
            }
  
         static patchresponseToStore(response: any, avisocalidadStore: AvisocalidadStore, solicitudStore: DatosDomicilioLegalStore, pagoStore: TramitePagoBancoStore): void {
                Shared260514Service.patchToStoreEstable(response, avisocalidadStore);
                Shared260514Service.patchToStoreSolicitud(response, solicitudStore);
                Shared260514Service.patchToStorePago(response, pagoStore);
            }
  
    }
  

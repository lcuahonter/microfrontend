import { API_OBTENER_FRACCIONES_ARANCELARIAS, API_OBTENER_UMT, Catalogo, JSONResponse } from '@ng-mf/data-access-user';
import { Observable, combineLatest, map } from 'rxjs';
import { API_BUSCAR_REPRESENTANTE } from '../../../core/server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GUARDAR_SOLICITUD } from '../../servers/api-route';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaCatalogos } from '../../models/datos-solicitud.model';
import { Tramite260302Query } from '../../../tramites/260302/estados/queries/tramite260302.query';

import { Tramites260301Query } from '../../../tramites/260301/estados/queries/tramites260301.query';

import { API_POST_PARCHE_PRELLENADAS} from '@libs/shared/data-access-user/src';
/**
 * Interface for RFC search payload to backend
 */
export interface RfcSearchPayload {
  rfcRepresentanteLegal: string;
}

/**
 * Interface for representative data
 */
export interface RepresentanteData {
  rfc: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombreORazonSocial?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatosSolicitudService {
  /**
   * @property {string} jsonUrl
   * Ruta relativa al archivo JSON que contiene los datos del domicilio.
   * Usado para cargar información desde el frontend (assets).
   * @private
   */
  private jsonUrl = 'assets/json/cofepris/domicilio.json';

  /**
   * URL base para las peticiones HTTP.
   * @type {string}
   */
  host!: string;

  constructor(private http: HttpClient,public httpServicios: HttpClient,private tramite260302Query: Tramite260302Query,private tramite260301Query: Tramites260301Query) {
      this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }
   /**
    * @description
    * Obtiene el estado completo combinando múltiples fuentes de estado.
    * @returns {Observable<Record<string, unknown>>} Observable que emite el estado combinado.
    */
     getAllState(): Observable<Record<string, unknown>> {
       return combineLatest([
         this.tramite260302Query.allStoreData$,
       ]).pipe(
         map(([tramite260302Query,]) =>
           DatosSolicitudService.mergeStates(
              tramite260302Query as unknown as Record<string, unknown>,
           )
         )
       );
     }

      getAllState230601(): Observable<Record<string, unknown>> {
       return combineLatest([
         this.tramite260301Query.allStoreData$,
       ]).pipe(
         map(([tramite260301Query,]) =>
           DatosSolicitudService.mergeStates(
              tramite260301Query as unknown as Record<string, unknown>,
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
   * Obtiene una respuesta desde una URL y asigna los datos a una variable.
   *
   * @param {string} variable - El nombre de la variable donde se almacenarán los datos de la respuesta.
   * @param {string} url - La URL desde la cual se obtendrá la respuesta.
   * @param {Object} self - El objeto que contiene la variable donde se almacenarán los datos de la respuesta.
   * @returns {void}
   * @author Muneez
   * @remarks
   * Si la variable y la URL son válidas, se realiza una solicitud HTTP GET a la URL especificada.
   * Si la respuesta tiene un código 200 y contiene datos, estos se asignan a la variable especificada.
   * Si la variable o la URL no son válidas, se asigna un arreglo vacío a la variable.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obtenerRespuestaPorUrl(self: any, variable: string, url: string): void {
    if (self && variable && url) {
      this.httpServicios
        .get<RespuestaCatalogos>(`assets/json${url}`)
        .subscribe((resp): void => {
          self[variable] = resp?.code === 200 && resp.data ? resp.data : [];
        });
    }
  }

  /**
   * @name obtenerListaPaises
   * @description Obtiene una lista de países desde un archivo JSON ubicado en la ruta especificada por `jsonUrl`.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de objetos de tipo `Catalogo` representando los países.
   */
  obtenerListaPaises(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ pais: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.pais));
  }

  /**
   * @name obtenerListaEstados
   * @description Obtiene una lista de estados desde un archivo JSON ubicado en la ruta especificada por `jsonUrl`.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de objetos de tipo `Catalogo` representando los estados.
   */
  obtenerListaEstados(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ estado: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.estado));
  }

  /**
   * @name getBancoDatos
   * @description Obtiene una lista de bancos desde un archivo JSON específico ubicado en `assets/json/cofepris/bancoDatos.json`.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de objetos de tipo `Catalogo` representando los bancos.
   */
  getBancoDatos(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ banco: Catalogo[] }>('assets/json/cofepris/bancoDatos.json')
      .pipe(map((res) => res.banco));
  }

  /**
   * @name obtenerListaMunicipios
   * @description Obtiene una lista de municipios desde un archivo JSON ubicado en la ruta especificada por `jsonUrl`.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de objetos de tipo `Catalogo` representando los municipios.
   */
  obtenerListaMunicipios(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ municipio: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.municipio));
  }

  /**
   * @name obtenerListaLocalidades
   * @description Obtiene una lista de localidades desde un archivo JSON ubicado en la ruta especificada por `jsonUrl`.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de objetos de tipo `Catalogo` representando las localidades.
   */
  obtenerListaLocalidades(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ localidad: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.localidad));
  }

  /**
   * @name obtenerListaCodigosPostales
   * @description Obtiene una lista de códigos postales desde un archivo JSON ubicado en la ruta especificada por `jsonUrl`.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de objetos de tipo `Catalogo` representando los códigos postales.
   */
  obtenerListaCodigosPostales(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ codigo_postal: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.codigo_postal));
  }

  /**
   * @name obtenerListaColonias
   * @description Obtiene una lista de colonias desde un archivo JSON ubicado en la ruta especificada por `jsonUrl`.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de objetos de tipo `Catalogo` representando las colonias.
   **/
  obtenerListaColonias(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ colonia: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.colonia));
  }

  /**
   * Busca un representante legal por RFC enviando payload al backend.
   * @param tramite Número del trámite 
   * @param PAYLOAD Datos de búsqueda del representante.
   * @returns Observable con la respuesta del servidor.
   */
  buscarRepresentantePorRfc(tramite: string, PAYLOAD: RfcSearchPayload):
    Observable<BaseResponse<RepresentanteData>> {
    const ENDPOINT = `${this.host}${API_BUSCAR_REPRESENTANTE(tramite)}`;
    return this.httpServicios.post<BaseResponse<RepresentanteData>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Obtiene la descripción de las fracciones arancelarias.
   * @param tramiteId ID del trámite.
   * @param clave Clave de la fracción arancelaria.
   * @returns Observable con la respuesta del servidor.
   */
  obtenerFraccionesArancelarias<T>(tramiteId: number, clave: string): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${API_OBTENER_FRACCIONES_ARANCELARIAS(tramiteId, clave)}`;
    return this.httpServicios.get<BaseResponse<T>>(ENDPOINT);
  }

  /**
   * Obtiene la unidad de medida por fracción arancelaria.
   * @param tramiteId ID del trámite.
   * @param cveFraccion Clave de la fracción arancelaria.
   * @returns Observable con la respuesta del servidor.
   */
  obtenerUMT<T>(tramiteId: number, cveFraccion: string): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${API_OBTENER_UMT(tramiteId, cveFraccion)}`;
    return this.httpServicios.get<BaseResponse<T>>(ENDPOINT);
  }
  /**
 * Construye el payload para la solicitud basado en los datos proporcionados y un valor discriminador.
 * @param data 
 * @param discriminatorValue - El valor discriminador para la solicitud.
 * @returns 
 */
   buildPayload(data: Record<string, unknown>, discriminatorValue: number): Record<string, unknown> {

    const ESTABLECIMIENTO = DatosSolicitudService.buildEstablecimiento(data);
    const DATOS_SCIAN = DatosSolicitudService.buildDatosScian(data);
    const MERCANCIAS = DatosSolicitudService.buildMercancias(data);
    const REPRESENTANTE_LEGAL = DatosSolicitudService.buildRepresentanteLegal(data);
    const FABRICANTE_TABLA = DatosSolicitudService.buildTercerosTablaDatos(data['fabricanteDatos'] as Record<string, unknown>);
     const DESTINATARIO_TABLA = DatosSolicitudService.buildTercerosTablaDatos(data['destinatarioDatos'] as Record<string, unknown>);
    const PAGO_DERECHOS = DatosSolicitudService.buildPagoDerechos(data);
    return {
       solicitante: {
        rfc: "AAL0409235E6",
        nombre: "ACEROS ALVARADO S.A. DE C.V.",
        actividadEconomica: "Fabricación de productos de hierro y acero",
        correoElectronico: "contacto@acerosalvarado.com",
        domicilio: {
            pais: "México",
            codigoPostal: "06700",
            estado: "Ciudad de México",
            municipioAlcaldia: "Cuauhtémoc",
            localidad: "Centro",
            colonia: "Roma Norte",
            calle: "Av. Insurgentes Sur",
            numeroExterior: "123",
            numeroInterior: "Piso 5, Oficina A",
            lada: "55",
            telefono: "123456"
        }
    },
    solicitud: {
        discriminatorValue: discriminatorValue,
        declaracionesSeleccionadas: true,
        regimen: "General",
        aduanaAIFA: "ALTAMIRA",
        aduanaAICM: "MEXICO",
        informacionConfidencial: true,
        tienePrioridad: false,
        tipoModalidad: null,
        numeroFolioTramiteOriginal: null,
        justificacion: null,
        observaciones: "Solicitud para importación de muestras médicas para uso personal"
    },
    establecimiento: ESTABLECIMIENTO,
    datosSCIAN: DATOS_SCIAN,
    mercancias: [
         {
            "idMercancia": "1",
            "idClasificacionProducto": "325",
            "nombreClasificacionProducto": "Fab. sustancias químicas básicas",
            "ideSubClasificacionProducto": "32541",
            "nombreSubClasificacionProducto": "Fab. productos farmacéuticos",
            "descDenominacionEspecifica": "Medicamentos para uso humano",
            "descDenominacionDistintiva": "Paracetamol Tabletas 500mg",
            "descripcionMercancia": "Acetaminophen",
            "formaFarmaceuticaDescripcionOtros": "Tableta",
            "estadoFisicoDescripcionOtros": "Sólido",
            "fraccionArancelaria": {
                "clave": "30049099",
                "descripcion": "Los demás medicamentos constituidos por productos mezclados"
            },
            "unidadMedidaComercial": {
                "descripcion": "Pieza"
            },
            "cantidadUMCConComas": "50,000",
            "unidadMedidaTarifa": {
                "descripcion": "Kilogramo"
            },
            "cantidadUMTConComas": "1,000.00",
            "presentacion": "Frasco x 100 tabletas",
            "registroSanitarioConComas": "COFEPRIS-REG-001-2024-SSA1",
            "nombreCortoPaisOrigen": "India",
            "nombreCortoPaisProcedencia": "India",
            "tipoProductoDescripcionOtros": "Analgésico",
            "nombreCortoUsoEspecifico": "Uso humano",
            "fechaCaducidadStr": "31/12/2026",
            "numeroLote": "LOT2025001",
            "fechaSalida": "15/01/2025",
            "descripcionManejoEspecial": "Mantener en lugar fresco y seco. Proteger de la luz directa.",
            "importeFacturaUSD": "25000.00"
        }
    ],
    "representanteLegal": REPRESENTANTE_LEGAL,
    "gridTerceros_TIPERS_FAB":FABRICANTE_TABLA,
    "gridTerceros_TIPERS_DES": DESTINATARIO_TABLA,
    "gridTerceros_TIPERS_PVD": [
    ],
    "gridTerceros_TIPERS_FAC": [

    ],
    "pagoDeDerechos": PAGO_DERECHOS
         };
  }

  // static buildEstablecimiento(data: Record<string, unknown>): Record<string, unknown> {
  //   return {
  //     "RFCResponsableSanitario": "XAXX010101000",
  //     "razonSocial": data['denominacion'] || "",
  //     "correoElectronico": data['correoElectronico'] || "",
  //     "domicilio": {
  //         "codigoPostal": data['codigopostal'] || "",
  //         "entidadFederativa": {
  //             "clave": data['estado'] || ""
  //         },
  //         "descripcionMunicipio": data['municipoyalcaldia'] || "",
  //         "informacionExtra": data['localidad'] || "",
  //         "descripcionColonia": data['colonia'] || "",
  //         "calle":  data['calle'] || "",
  //         "lada": data['lada'] || "",
  //         "telefono": data['telefono'] || "",
  //     },
  //     "original": "",
  //     "avisoFuncionamiento": true,
  //     "numeroLicencia": data['licenciaSanitaria'] || "",
  //     "aduanas": data['aduana'] || ""
  //   }
  // }
  static buildEstablecimiento(data: Record<string, unknown>): Record<string, unknown> {
  return {
    "RFCResponsableSanitario": "XAXX010101000",
    "razonSocial": data['denominacionRazon'] || "",
    "correoElectronico": data['correoElecronico'] || "",
    "domicilio": {
        "codigoPostal": data['codigoPostal'] || "",
        "entidadFederativa": {
            "clave": data['estado'] || ""
        },
        "descripcionMunicipio": data['municipio'] || "",
        "informacionExtra": data['localidad'] || "",
        "descripcionColonia": data['colonia'] || "",
        "calle":  data['calleYNumero'] || "",
        "lada": data['lada'] || "",
        "telefono": data['telefono'] || "",
    },
    "original": "",
    "avisoFuncionamiento": true,
    "numeroLicencia": data['licenciaSanitaria'] || "",
    "aduanas": data['aduana'] || ""
  }
}
  /**
 * Construye los datos del SCIAAN a partir de los datos proporcionados.
 * @param data 
 * @returns 
 */
   static buildDatosScian(data: Record<string, unknown>): {cveScian: string, descripcion: string, selected: boolean}[] {
    const NICOTABLA = data['nicoTabla'] as Array<{ [key: string]: unknown }> | undefined;
    if (!Array.isArray(NICOTABLA)) {
      return [];
    }

    return NICOTABLA.map(item => ({
      "cveScian": String(item['claveScian'] ?? ""),
      "descripcion": String(item['descripcionDelScian'] ?? ""),
      "selected": true
    }));
  }

  /**
   * Construye la lista de mercancías a partir de los datos proporcionados.
   * @param data 
   * @returns 
   */
static buildMercancias(data: Record<string, unknown>): Record<string, unknown>[] {
    const MERCANCIA_TABLA = data['mercanciaTabla'] as Array<{ [key: string]: unknown }> | undefined;
    if (!Array.isArray(MERCANCIA_TABLA)) {
      return [];
    }

    return MERCANCIA_TABLA.map(item => ({
   
          "idMercancia": "1",
            "idClasificacionProducto": item['clasificaionProductos'] as string || "",
            "nombreClasificacionProducto": "Fab. sustancias químicas básicas",
            "ideSubClasificacionProducto": "32541",
            "nombreSubClasificacionProducto": "Fab. productos farmacéuticos",
            "descDenominacionEspecifica": "Medicamentos para uso humano",
            "descDenominacionDistintiva": "Paracetamol Tabletas 500mg",
            "descripcionMercancia": "Acetaminophen",
            "formaFarmaceuticaDescripcionOtros": "Tableta",
            "estadoFisicoDescripcionOtros": "Sólido",
            "fraccionArancelaria": {
                "clave":item['fraccionArancelaria'] as string || "",
                "descripcion": "Los demás medicamentos constituidos por productos mezclados"
            },
            "unidadMedidaComercial": {
                "descripcion": item['umc'] as string || ""
            },
            "cantidadUMCConComas": item['cantidadUMC'] as string || "",
            "unidadMedidaTarifa": {
                "descripcion": item['umt'] as string || ""
            },
            "cantidadUMTConComas": item['cantidadUMT'] as string || "",
            "presentacion": "Frasco x 100 tabletas",
            "registroSanitarioConComas": "COFEPRIS-REG-001-2024-SSA1",
            "nombreCortoPaisOrigen": Array.isArray(item['paisDeOrigen']) ? item['paisDeOrigen'].join(', ') : String(item['paisDeOrigen'] ?? ''),
            "nombreCortoPaisProcedencia": Array.isArray(item['paisDeProcedencia']) ? item['paisDeProcedencia'].join(', ') : String(item['paisDeProcedencia'] ?? ''),
            "tipoProductoDescripcionOtros": "Analgésico",
            "nombreCortoUsoEspecifico": "Uso humano",
            "fechaCaducidadStr": "31/12/2026",
            "numeroLote": "LOT2025001",
            "fechaSalida": "15/01/2025",
            "descripcionManejoEspecial": "Mantener en lugar fresco y seco. Proteger de la luz directa.",
            "importeFacturaUSD": "25000.00"
    }));
  }

  /**
   * Construye el objeto del representante legal a partir de los datos proporcionados.
   * @param data 
   * @returns 
   */
    static buildRepresentanteLegal(data: Record<string, unknown>): Record<string, unknown> {
    return {
      "rfc": data['rfc'] || '',
      "resultadoIDC": "",
      "nombre": data['legalRazonSocial'] || '',
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
  static buildTercerosTablaDatos(data: Record<string, unknown>): Record<string, unknown>[] {
    const FEBRICAT_TABLA = data;
    if (!Array.isArray(FEBRICAT_TABLA)) {
      return [];
    }
    
            return FEBRICAT_TABLA.map(item => {
                return {
                   "idPersonaSolicitud": "1",
            "ideTipoTercero": "TIPERS.FAB",
            "personaMoral": "1",
            "booleanExtranjero": "0",
            "booleanFisicaNoContribuyente": "0",
            "denominacion": item['denominacion'] as string || "",
            "razonSocial": item['razonSocial'] as string || "",
            "rfc": item['rfc'] as string || "",
            "curp": item['curp'] as string || "",
            "nombre": item['nombre'] as string || "",
            "apellidoPaterno": item['apellidoPaterno'] as string || "",
            "apellidoMaterno": item['apellidoMaterno'] as string || "",
            "telefono": item['telefono'] as string || "",
            "correoElectronico": item['correoElectronico'] as string || "",
            "actividadProductiva": "MANUFACTURA",
            "actividadProductivaDesc": "Fabricación de productos farmacéuticos",
            "descripcionGiro": "Laboratorio farmacéutico",
            "numeroRegistro": "REG-001-2024",
            "domicilio": {
                "calle": item['calle'] as string || "",
                "numeroExterior": item['numeroExterior'] as string || "",
                "numeroInterior": item['numeroInterior'] as string || "",
                "pais": {
                    "clave": item['pais'] as string || "",
                    "nombre": ""
                },
                "colonia": {
                    "clave": item['colonia'] as string || "",
                    "nombre": ""
                },
                "delegacionMunicipio": {
                    "clave": item['delegacionMunicipio'] as string || "",
                    "nombre": ""
                },
                "localidad": {
                    "clave": item['localidad'] as string || "",
                    "nombre": ""
                },
                "entidadFederativa": {
                    "clave": item['entidadFederativa'] as string || "",
                    "nombre": ""
                },
                "informacionExtra": "Zona Industrial Norte",
                "codigoPostal": "06400",
                "descripcionColonia": "Industrial Norte"
            },
            "idSolicitud": "12345"
                };
              })  
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
  // static buildPagoDerechos(data: Record<string, unknown>): Record<string, unknown> {
  //   return {
  //     "claveDeReferencia": data['claveDeReferencia'] || "",
  //       "cadenaPagoDependencia": data['cadenadeladependencia'] || "",
  //       "banco": {
  //           "clave": data['banco'],
  //           "descripcion": ""
  //       },
  //       "llaveDePago": data['llaveDePago'] || "",
  //       "fecPago": data['fechaPago'] || "",
  //       "impPago": data['importedepago'] || ""
  //   }
  // }
  static buildPagoDerechos(data: Record<string, unknown>): Record<string, unknown> {
  const PAGO = data['pagoDerechos'] as Record<string, unknown> || {};
  return {
    "claveDeReferencia": PAGO['claveReferencia'] || "",
    "cadenaPagoDependencia": PAGO['cadenaDependencia'] || "",
    "banco": {
      "clave": PAGO['banco'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "descripcion": (PAGO['bancoObject'] && (PAGO['bancoObject'] as any).descripcion) || ""
    },
    "llaveDePago": PAGO['llavePago'] || "",
    "fecPago": PAGO['fechaPago'] || "",
    "impPago": PAGO['importePago'] || ""
  }
}
   /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * @param payload - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @param idTipoTramite - Identificador del tipo de trámite para construir la URL de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  // guardarDatosPost(tramite: string,payload: Record<string, unknown>): Observable<JSONResponse> {
  //   const ENDPOINT = `${this.host}${GUARDAR_SOLICITUD(tramite)}`;
  //   return this.http.post<JSONResponse>(ENDPOINT, payload).pipe(
  //     map((response) => response)
  //   );
  // }
  guardarDatosPost(payload: Record<string, unknown>, idTipoTramite: string): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(GUARDAR_SOLICITUD(idTipoTramite), payload).pipe(
      map((response) => response)
    );
  }

  fetchMostrarApi260301<T>(tramite: number, idSolicitud: number): Observable<BaseResponse<T>> {
  const ENDPOINT = `${this.host}${API_POST_PARCHE_PRELLENADAS(tramite, idSolicitud)}`;
  return this.http.get<BaseResponse<T>>(ENDPOINT);
}

}

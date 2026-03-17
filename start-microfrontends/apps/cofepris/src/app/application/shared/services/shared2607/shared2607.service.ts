import { combineLatest, map, Observable } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Solicitud260702Query } from '../../estados/queries/shared2607/tramites260702.query';

@Injectable({
  providedIn: 'root'
})
export class Shared2607Service {

  constructor(
     private _http: HttpClient,
     private solicitud260702Query: Solicitud260702Query,
  ) {
    // Constructor del servicio
   }

   /**
    * @description
    * Obtiene el estado completo combinando múltiples fuentes de estado.
    * @returns {Observable<Record<string, unknown>>} Observable que emite el estado combinado.
    */
     getAllState(): Observable<Record<string, unknown>> {
       return combineLatest([
         this.solicitud260702Query.allStoreData$,
       ]).pipe(
         map(([solicitud260702Query,]) =>
           Shared2607Service.mergeStates(
              solicitud260702Query as unknown as Record<string, unknown>,
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
 * Construye el payload para la solicitud basado en los datos proporcionados y un valor discriminador.
 * @param data 
 * @param discriminatorValue - El valor discriminador para la solicitud.
 * @returns 
 */
   buildPayload(data: Record<string, unknown>, discriminatorValue: number): Record<string, unknown> {

    const ESTABLECIMIENTO = Shared2607Service.buildEstablecimiento(data);
    const DATOS_SCIAN = Shared2607Service.buildDatosScian(data);
    const MERCANCIAS = Shared2607Service.buildMercancias(data);
    const REPRESENTANTE_LEGAL = Shared2607Service.buildRepresentanteLegal(data);
    const PAGO_DERECHOS = Shared2607Service.buildPagoDerechos(data);
    const FABRICANTES_TABLA = Shared2607Service.buildTercerosTablaDatos(data['FabricantesTabla'] as Record<string, unknown>);
    const DESTINO_TABLA = Shared2607Service.buildTercerosTablaDatos(data['DestinatariosTabla'] as Record<string, unknown>);

    return {
    "idSolicitud":203009930,
    "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "ACEROS ALVARADO S.A. DE C.V.",
        "actividadEconomica": "Fabricación de productos de hierro y acero",
        "correoElectronico": "contacto@acerosalvarada.com",
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
            "lada": "55",
            "telefono": "123456"
        }
    },
     "solicitud": {
        "discriminatorValue": 260701,
        "declaracionesSeleccionadas": true,
        "regimen": "01",
        "aduanaAIFA": "",
        "informacionConfidencial": true
    },
    "establecimiento": ESTABLECIMIENTO,
    "datosSCIAN": DATOS_SCIAN,
    "mercancias": [
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
            "nombreCortoPaisOrigen": [
                "JPN",
                "MEX",
                "DEU"
            ],
            "nombreCortoPaisProcedencia": [
                "JPN",
                "MEX",
                "DEU"
            ],
            "tipoProductoDescripcionOtros": "Analgésico",
            "nombreCortoUsoEspecifico": [
                "98",
                "1"
            ],
            "fechaCaducidadStr": "31/12/2026",
            "numeroLote": "LOT2025001",
            "fechaSalida": "15/01/2025",
            "descripcionManejoEspecial": "Mantener en lugar fresco y seco. Proteger de la luz directa.",
            "importeFacturaUSD": "25000.00"
        }
    ],
    "representanteLegal": REPRESENTANTE_LEGAL,
    "gridTerceros_TIPERS_FAB":FABRICANTES_TABLA,
    "gridTerceros_TIPERS_DES": DESTINO_TABLA,
    "gridTerceros_TIPERS_PVD": [],
    "gridTerceros_TIPERS_FAC": [],
    "pagoDeDerechos": PAGO_DERECHOS
}

  }

  static buildEstablecimiento(data: Record<string, unknown>): Record<string, unknown> {
    return {
      "RFCResponsableSanitario": "XAXX010101000",
      "razonSocial": data['denominacion'] || "",
      "correoElectronico": data['correoElectronico'] || "",
      "domicilio": {
          "codigoPostal": data['codigopostal'] || "",
          "entidadFederativa": {
              "clave": data['estado'] || ""
          },
          "descripcionMunicipio": data['municipoyalcaldia'] || "",
          "informacionExtra": data['localidad'] || "",
          "descripcionColonia": data['colonia'] || "",
          "calle":  data['calle'] || "",
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
      "cveScian": String(item['claveScianG'] ?? ""),
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
  static buildPagoDerechos(data: Record<string, unknown>): Record<string, unknown> {
    return {
      "claveDeReferencia": data['clavedereferencia'] || "",
        "cadenaPagoDependencia": data['cadenadeladependencia'] || "",
        "banco": {
            "clave": data['banco'],
            "descripcion": ""
        },
        "llaveDePago": data['llavedepago'] || "",
        "fecPago": data['fechaPago'] || "",
        "impPago": data['importedepago'] || ""
    }
  }
}

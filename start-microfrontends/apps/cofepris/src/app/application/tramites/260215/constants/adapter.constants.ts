/**
 * @fileoverview
 * Constants used in the adapter for trámite 260215 - Permiso Sanitario de Importación.
 * These constants provide default values for API payloads when data is not available from the store.
 */

/**
 * Default values for numeroFolioTramiteCancelados when no data is available from state.
 * These values serve as fallbacks to ensure the API payload is always complete and valid.
 * 
 * @constant {Object} DEFAULT_NUMERO_FOLIO_TRAMITE_CANCELADO
 * @property {string} idResolucion - Default resolution ID
 * @property {string} numeroResolucion - Default resolution number
 * @property {string} regimen - Default customs regime
 * @property {string} clasificacionRegimen - Default regime classification
 * @property {string} condicionMercancia - Default merchandise condition
 * @property {string} fraccionArancelaria - Default tariff fraction
 * @property {string} unidadMedida - Default unit of measure
 * @property {string} cantidadImportarExportar - Default import/export quantity
 * @property {string} vigenciaResolucion - Default resolution validity date
 * @property {string} valorAutorizado - Default authorized value
 * @property {string} inicioResolucion - Default resolution start date
 * @property {string} numFolioTramite - Default procedure folio number
 * @property {string} valorSolicitado - Default requested value
 * @property {string} cantidadImportarExportarSolicitada - Default requested import/export quantity
 * @property {string} general - Default general indicator
 */
export const DEFAULT_NUMERO_FOLIO_TRAMITE_CANCELADO = {
  idResolucion: "0100001000320221005000001",
  numeroResolucion: "NR",
  regimen: "Importación",
  clasificacionRegimen: "General",
  condicionMercancia: "Nueva",
  fraccionArancelaria: "72069099",
  unidadMedida: "Kilogramo",
  cantidadImportarExportar: "1000000",
  vigenciaResolucion: "2025-12-31",
  valorAutorizado: "100000",
  inicioResolucion: "2025-01-01",
  numFolioTramite: "260215",
  valorSolicitado: "95000",
  cantidadImportarExportarSolicitada: "950000",
  general: "Sí"
} as const;

/**
 * Default trámite ID for procedures of type 260215
 */
export const DEFAULT_TRAMITE_ID = "260215";

/**
 * Default values for solicitud object when no data is available from state.
 * These values serve as fallbacks to ensure the API payload is always complete and valid.
 */
export const DEFAULT_SOLICITUD = {
  idSolicitud: "",
  discriminatorValue: "140105",
  cveRolCapturista: "PersonaMoral",
  cveUsuarioCapturista: "AAL0409235E6",
  solicitante: {
    cveUsuario: "AAL0409235E6",
    rfc: "AAL0409235E6",
    razonSocial: "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
    descripcionGiro: "Siembra, cultivo y cosecha de otros cultivos",
    correoElectronico: "vucem2021@gmail.com",
    telefono: "55-98764532",
    domicilio: {
      pais: {
        clave: "MEX",
        nombre: "ESTADOS UNIDOS MEXICANOS"
      },
      entidadFederativa: {
        clave: "SIN",
        nombre: "SINALOA"
      },
      delegacionMunicipio: {
        clave: "25001",
        nombre: "AHOME"
      },
      colonia: {
        clave: "00181210001",
        nombre: "MIGUEL HIDALGO"
      },
      localidad: {
        clave: "00181210008",
        nombre: "LOS MOCHIS"
      },
      codigoPostal: "81210",
      calle: "CAMINO VIEJO",
      numeroExterior: "1353",
      numeroInterior: ""
    }
  }
} as const;
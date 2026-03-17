/**
 * @interface CatalogoLista
 * @description Representa una lista de elementos de un catálogo.
 * Contiene un arreglo de objetos del tipo `Catalogo`.
 * 
 * @property {Catalogo[]} datos - Lista de elementos del catálogo.
 */
export interface CatalogoLista {
  datos: Catalogo[];
}

/**
 * @interface Catalogo
 * @description Representa un elemento de un catálogo.
 * 
 * @property {number} id - Identificador único del elemento del catálogo.
 * @property {string} descripcion - Descripción del elemento del catálogo.
 */
export interface Catalogo {
  id: number;
  descripcion: string;
}

/**
 * @interface AvisoTablaDatos
 * @description Representa los datos de la tabla de avisos.
 * Contiene una lista de objetos del tipo `ColumnasTabla`.
 * 
 * @property {ColumnasTabla[]} datos - Lista de avisos en la tabla.
 */
export interface AvisoTablaDatos {
  datos: ColumnasTabla[];
}

/**
 * @interface ColumnasTabla
 * @description Representa las columnas de la tabla de avisos.
 * Contiene las propiedades que corresponden a los encabezados de la tabla.
 * 
 * @property {string} headerPropiedad - Propiedad del encabezado.
 * @property {string} headerNombreTitulo - Nombre del título del encabezado.
 * @property {string} headerTipoRegistro - Tipo de registro del encabezado.
 * @property {string} headerNIV - Número de Identificación Vehicular (NIV).
 * @property {string} headerAnioModelo - Año del modelo del vehículo.
 * @property {string} headerMarca - Marca del vehículo.
 * @property {string} headerModelo - Modelo del vehículo.
 * @property {string} headerTVV - Tipo de vehículo.
 * @property {string} headerNoTitulo - Número del título.
 * @property {string} headerPais - País de origen.
 * @property {string} headerEstado - Estado de origen.
 * @property {string} headerPlacas - Placas del vehículo.
 * @property {string} headerAdquisicion - Tipo de adquisición.
 * @property {string} headerTipoRegistro2 - Segundo tipo de registro.
 * @property {string} headerDocumentoExportacion - Documento de exportación.
 * @property {string} headerAduana - Aduana de registro.
 * @property {string} headerFolioCFDI - Folio del CFDI.
 * @property {string} headerPatente - Patente del vehículo.
 * @property {string} headerPedimento - Pedimento de importación.
 * @property {string} headerKilometraje - Kilometraje del vehículo.
 * @property {string} headerValorDolares - Valor en dólares.
 * @property {string} headerValorAduana - Valor en la aduana.
 * @property {string} headerMontoIGI - Monto del IGI.
 * @property {string} headerFormaPago - Forma de pago.
 * @property {string} headerMontoDTA - Monto del DTA.
 */
export interface ColumnasTabla {
  headerPropiedad: string;
  headerNombreTitulo: string;
  headerTipoRegistro: string;
  headerNIV: string;
  headerAnioModelo: string;
  headerMarca: string;
  headerModelo: string;
  headerTVV: string;
  headerNoTitulo: string;
  headerPais: string;
  headerEstado: string;
  headerPlacas: string;
  headerAdquisicion: string;
  headerTipoRegistro2: string;
  headerDocumentoExportacion: string;
  headerAduana: string;
  headerFolioCFDI: string;
  headerPatente: string;
  headerPedimento: string;
  headerKilometraje: string;
  headerValorDolares: string;
  headerValorAduana: string;
  headerMontoIGI: string;
  headerFormaPago: string;
  headerMontoDTA: string;
  headerNoCilindros: string;
  headerNoPuertas: string;
  headerTipoCombustible: string;
  headerMontoIVA: string;
  headerValorVentaSinIVA: string;
}
/**
 * Representa las columnas de la tabla de consulta.
 */
export interface ColumnasTablaConsulta {
  headerPropiedad: string;
  headerNombreTitulo: string;
  headerTipoRegistro: string;
  headerNIV: string;
  headerAnioModelo: string;
  headerMarca: string;
  headerModelo: string;
  headerTVV: string;
  headerCilindros: string;
  headerPuertas: string;
  headerTipoCombustible: string;
  headerNoTitulo: string;
  headerPais: string;
  headerEstado: string;
  headerPlacas: string;
  headerAdquisicion: string;
  headerTipoRegistro2: string;
  headerDocumentoExportacion: string;
  headerAduana: string;
  headerFolioCFDI: string;
  headerPatente: string;
  headerPedimento: string;
  headerKilometraje: string;
  headerValorDolares: string;
  headerValorAduana: string;
  headerMontoIGI: string;
  headerFormaPago: string;
  headerMontoDTA: string;
}

/**
 * Representa los datos generales del solicitante.
 */
export interface DatosSolicitante {
  rfc: string;
  denominacion: string;
  actividadEconomica: string;
  correoElectronico: string;
  pais: string;
  codigoPostal: string;
  entidadFederativa: string;
  municipio: string;
  localidad: string;
  colonia: string;
  calle: string;
  nExt: string;
  nInt: string;
  lada: string;
  telefono: string;
  adace: string;
}

/**
 * @interface RespuestaConsulta
 * @description Representa la respuesta de la API para una consulta.
 * 
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {ConsultaDatos} datos - Datos de la consulta.
 * @property {string} message - Mensaje de la respuesta.
 */
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}

/**
 * @interface RespuestaCatalogos
 *  @description Representa la respuesta de una consulta a un catálogo.
 *  @property {boolean} success - Indica si la consulta fue exitosa.
 *  @property {CatalogoLista} datos - Datos del catálogo consultado.
 *   @property {string} message - Mensaje de la respuesta.
 */ 
export interface ConsultaDatos {
  adace: string;
  pais: string;
  anio: string;

}
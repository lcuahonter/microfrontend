/**
 * @interface AcuseYResolucionesFolioTramite
 * @description
 * Representa los datos relacionados con el acuse y las resoluciones de un trámite.
 *
 * @property {string} folioTramite - Folio único del trámite.
 * @property {string} tipoDeTramite - Tipo de trámite realizado.
 * @property {string} dependencia - Dependencia responsable del trámite.
 * @property {string} fechInicioTramite - Fecha de inicio del trámite.
 */
export interface AcuseYResolucionesFolioTramite {
  folioTramite: string;
  numeroDeProcedimiento: string;
  tipoDeTramite: string;
  dependencia: string;
  fechInicioTramite: string;
  estadoDeTramite:string
}

/**
 * @interface ConstanciaTramiteConfiguracion
 * @description
 * Representa la configuración de una constancia de trámite.
 *
 * @property {string} numeroDeConstancia - Número único de la constancia.
 * @property {string} fraccionArancelaria - Fracción arancelaria asociada.
 * @property {string} clasificacionDelRegimen - Clasificación del régimen (por ejemplo, exportación o importación).
 * @property {string} paisDestino - País de destino de la constancia.
 * @property {string} categoriaTextil - Categoría textil asociada.
 * @property {string} fechaInicioVigencia - Fecha de inicio de vigencia de la constancia.
 * @property {string} fechaFinVigencia - Fecha de fin de vigencia de la constancia.
 * @property {string} estado - Estado asociado a la constancia.
 * @property {string} representacionFederal - Representación federal asociada.
 * @property {string} descripcionProducto - Descripción del producto asociado.
 * @property {string} tratado - Tratado comercial asociado.
 * @property {string} subproducto - Subproducto asociado.
 * @property {string} mecanismo - Mecanismo asociado.
 * @property {string} typoCategoria - Tipo de categoría asociada.
 * @property {string} typoRegimen - Tipo de régimen asociado.
 * @property {string} descripcionCategoriaTextil - Descripción de la categoría textil.
 * @property {string} PaisDestino - País de destino (duplicado, revisar si es necesario).
 * @property {string} unidadMedidaCategoriaTextil - Unidad de medida de la categoría textil.
 * @property {string} factorConversionCategoriaTextil - Factor de conversión de la categoría textil.
 * @property {number} idAsignacion - Identificador único de la asignación (opcional).
 * @property {number} idMecanismoAsignacion - Identificador del mecanismo de asignación (opcional).
 * @property {number} idCategoriaTextil - Identificador de la categoría textil (opcional).
 * @property {string} cvePais - Clave del país asociado (opcional).
 * @property {number} idFraccionHtsUsa - Identificador de la fracción HTS USA (opcional).
*/
export interface ConstanciaTramiteConfiguracion {
  numeroDeConstancia: string;
  fraccionArancelaria: string;
  clasificacionDelRegimen: string;
  paisDestino: string;
  categoriaTextil: string;
  fechaInicioVigencia: string;
  fechaFinVigencia: string;
  estado: string;
  representacionFederal: string;
  descripcionProducto: string;
  tratado: string;
  subproducto: string;
  mecanismo: string;
  typoCategoria: string;
  typoRegimen: string;
  descripcionCategoriaTextil: string;
  PaisDestino: string;
  unidadMedidaCategoriaTextil: string;
  factorConversionCategoriaTextil: string;
  idAsignacion?: number;
  idMecanismoAsignacion?: number;
  idCategoriaTextil?:number;
  cvePais?:string;
  idFraccionHtsUsa?: number;
}

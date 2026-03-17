/**
 * Modelo de datos que representa la solicitud del trámite 32512.
 * Contiene toda la información capturada en el formulario, incluyendo
 * datos del establecimiento y del lugar de destrucción de mercancía.
 */
export interface SolicitudModel {
  /**
   * Nombre comercial del establecimiento o entidad solicitante.
   */
  nombreComercial: string;

  /**
   * Identificador de la entidad federativa seleccionada.
   */
  entidadFederativa: number;

  /**
   * Identificador del municipio o alcaldía seleccionada.
   */
  municipio: number;

  /**
   * Identificador de la colonia seleccionada.
   */
  colonia: number;

  /**
   * Nombre de la calle donde se ubica el establecimiento.
   */
  calle: string;

  /**
   * Número exterior del domicilio.
   */
  numeroExterior: string;

  /**
   * Número interior del domicilio.
   */
  numeroInterior: string;

  /**
   * Código postal correspondiente al domicilio.
   */
  codigoPostal: string;

  /**
   * Identificador de la entidad federativa del lugar de destrucción de mercancía.
   */
  lugarEntidadFederativa: number;

  /**
   * Identificador del municipio o alcaldía del lugar de destrucción.
   */
  lugarMunicipioAlcaldia: number;

  /**
   * Identificador de la colonia del lugar de destrucción.
   */
  lugarColonia: number;

  /**
   * Nombre de la calle del lugar de destrucción.
   */
  lugarCalle: string;

  /**
   * Número exterior del lugar de destrucción.
   */
  lugarNumeroExterior: string;

  /**
   * Número interior del lugar de destrucción.
   */
  lugarNumeroInterior: string;

  /**
   * Código postal del lugar de destrucción.
   */
  lugarCodigoPostal: string;

  /**
   * Campo genérico adicional 1, utilizado según necesidades del formulario.
   */
  generico1: string;

  /**
   * Campo genérico adicional 2, utilizado según necesidades del formulario.
   */
  generico2: string;

  /**
   * Archivo cargado correspondiente a la destrucción de mercancía.
   */
  archivoDestruccion: File | null;
}

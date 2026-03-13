
/**
 * Representa la información de un tercero relacionado.
 *
 * @property rfc - RFC del tercero.
 * @property curp - CURP del tercero.
 * @property nombre - Nombre del tercero.
 * @property apellidoPaterno - Apellido paterno del tercero.
 * @property apellidoMaterno - Apellido materno del tercero.
 * @property domicilio - Domicilio del tercero.
 */
export interface TercerosRelacionados{
  rfc: string,
  curp: string,
  nombre: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  domicilio: string
}

/**
 * Representa los datos relacionados con la fusión o escisión de una entidad.
 *
 * @property certificacionModal - Certificación asociada al proceso de fusión o escisión.
 * @property rfcBusquedaModal - RFC utilizado para la búsqueda de la entidad fusionante.
 * @property razonSocialFusionante - Razón social de la entidad fusionante.
 * @property folioVucemFusionante - Folio VUCEM de la entidad fusionante.
 * @property fechaInicioVigenciaFusionante - Fecha de inicio de vigencia de la fusión.
 * @property fechaFinVigenciaFusionante - Fecha de fin de vigencia de la fusión.
 * @property rfcBusquedaModalSC - RFC utilizado para la búsqueda de la sociedad controladora.
 * @property razonSocialFusionanteSC - Razón social de la sociedad controladora fusionante.
 */
export interface FusionEscision{
  certificacionModal: string,
  rfcBusquedaModal: string,
  razonSocialFusionante: string,
  folioVucemFusionante: string,
  fechaInicioVigenciaFusionante: string,
  fechaFinVigenciaFusionante: string,
  rfcBusquedaModalSC: string,
  razonSocialFusionanteSC: string
}

/**
 * Representa un aviso de modificación relacionado con un agente.
 *
 * @property tipoFigura - Tipo de figura del agente.
 * @property patenteModificada - Patente que ha sido modificada.
 * @property numPatenteModal - Número de patente modal.
 * @property rfcModal - RFC del agente modal.
 * @property obligFisc - Obligaciones fiscales del agente.
 * @property autPantente - Autorización de la patente.
 * @property nombre - Nombre del agente.
 * @property apellidoPaterno - Apellido paterno del agente.
 * @property apellidoMaterno - Apellido materno del agente.
 * @property razonSocial - Razón social del agente.
 * @property patente2 - Segunda patente relacionada.
 * @property razonAgencia - Razón social de la agencia.
 */
export interface AvisoAgente{
      tipoFigura: string,  
      numPatenteModal: string,
      nombre: string,
      apellidoPaterno: string,
      apellidoMaterno:string,
      razonSocial: string,
      tipoMovimiento: string,
}

  
  /**
   * Identificador único de la tabla utilizada para mostrar los datos de fusión o escisión.
   * 
   * @remarks
   * Este identificador se utiliza para referenciar la tabla en componentes y servicios relacionados.
   * 
   * @const
   */
  export const TABLE_ID = "gridFusionEscision";

  /**
   * Representa los datos de una fusión.
   *
   * @property razonSocial - La razón social de la entidad fusionada.
   * @property numFolioTramite - El número de folio del trámite de fusión.
   * @property fechaInicioVigencia - Fecha de inicio de la vigencia de la fusión (formato string).
   * @property fechaFinVigencia - Fecha de fin de la vigencia de la fusión (formato string).
   */
  export interface FusionDatos{
    razonSocial: string,
    numFolioTramite: string,
    fechaInicioVigencia: string,
    fechaFinVigencia: string
  }

 

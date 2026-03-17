import { SeccionSociosIC } from "../models/empresas-comercializadoras.model";

/**
 * Representa una aduana con su descripción y un identificador único.
 *
 * @property descripcion - Descripción de la aduana.
 * @property id - Identificador único de la aduana.
 */
export interface Aduanas {
  descripcion: string;
  id: number;
}

/**
 * Representa la respuesta recibida de la consulta a aduanas.
 *
 * @property code - Código de estado de la respuesta.
 * @property data - Arreglo de objetos de tipo Aduanas que contiene la información de las aduanas.
 * @property message - Mensaje descriptivo de la respuesta.
 */
export interface RespuestaAduanas {
  code: number;
  data: Aduanas[]
  message: string;
}

/**
 * Representa las instalaciones asociadas a una sección de socios.
 * 
 * @extends SeccionSociosIC
 * 
 * @property {number} id - Identificador único de la instalación.
 * @property {string} entidadFederativa - Nombre de la entidad federativa donde se encuentra la instalación.
 * @property {string} municipio - Municipio de la instalación.
 * @property {string} coloniaCalleNumero - Dirección detallada: colonia, calle y número.
 * @property {string} codigoPostal - Código postal de la instalación.
 * @property {string} registroAduana - Registro de la aduana correspondiente.
 * @property {string} instalacionPerfil - Principal de la instalación.
 * @property {string} instalacionPerfilRFE - Recinto Fiscalizado Estratégico.
 * @property {string} instalacionPerfilAuto - Auto Transportista.
 * @property {string} instalacionPerfilFerro - Transportista Ferroviario.
 * @property {string} instalacionPerfilRf - Recinto Fiscalizado.
 * @property {string} instalacionPerfilMensajeria - Mensajería.
 * @property {string} instalacionPerfilAlmacen - Almacén General.
 */
export interface Instalaciones extends SeccionSociosIC {
  id: number;
  entidadFederativa: string;
  municipio: string;
  coloniaCalleNumero: string;
  codigoPostal: string;
  registroAduana: string;
  instalacionPerfil: string;
  instalacionPerfilRFE: string;
  instalacionPerfilAuto: string;
  instalacionPerfilFerro: string;
  instalacionPerfilRf: string;
  instalacionPerfilMensajeria: string;
  instalacionPerfilAlmacen: string;
}
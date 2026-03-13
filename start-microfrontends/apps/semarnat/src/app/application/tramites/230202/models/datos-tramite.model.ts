/**
 * @file datos-tramite.model.ts
 * @description Este archivo contiene las interfaces que definen los modelos de datos utilizados
 * en el trámite 230202. Estas interfaces representan las estructuras de datos que se manejan
 * en las solicitudes, respuestas y metadatos relacionados con el trámite.
 */

/**
 * @interface DatosSolicitud
 * @description Representa los datos de una solicitud en el trámite 230202.
 * 
 * @property {number} id - Identificador único de la solicitud.
 * @property {number} fraccionArancelaria - Fracción arancelaria asociada a la solicitud.
 * @property {number} cantidad - Cantidad solicitada.
 * @property {string} cantidadLetra - Representación en texto de la cantidad solicitada.
 * @property {string} descripcion - Descripción de la solicitud.
 */
export interface DatosSolicitud {
  id: number;
  fraccionArancelaria: number;
  cantidad: number;
  cantidadLetra: string;
  descripcion: string;
}

/**
 * @interface RespuestaSolicitud
 * @description Representa la respuesta de una solicitud en el trámite 230202.
 * 
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {DatosSolicitud} datos - Datos de la solicitud procesada.
 * @property {string} message - Mensaje adicional relacionado con la respuesta.
 */
export interface RespuestaSolicitud {
  success: boolean;
  datos: DatosSolicitud;
  message: string;
}

/**
 * @interface DatosDetalle
 * @description Representa los detalles de un elemento en el trámite 230202.
 * 
 * @property {number} id - Identificador único del detalle.
 * @property {string} nombreCientifico - Nombre científico del elemento.
 * @property {string} nombreComunDetalle - Nombre común del elemento.
 * @property {string} descripcion - Descripción del detalle.
 */
export interface DatosDetalle {
  id: number;
  nombreCientifico: string;
  nombreComunDetalle: string;
  descripcion: string;
}

/**
 * @interface RespuestaDetalle
 * @description Representa la respuesta de un detalle en el trámite 230202.
 * 
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {DatosDetalle} datos - Datos del detalle procesado.
 * @property {string} message - Mensaje adicional relacionado con la respuesta.
 */
export interface RespuestaDetalle {
  success: boolean;
  datos: DatosDetalle;
  message: string;
}

/**
 * @interface MetaInfo
 * @description Representa la información meta asociada a una persona o entidad en el trámite 230202.
 * 
 * @property {string} nacionalidad - Nacionalidad de la persona o entidad.
 * @property {string} tipoPersona - Tipo de persona (física o moral).
 * @property {string} nacional - Información adicional para nacionales.
 * @property {string} extranjero - Información adicional para extranjeros.
 * @property {string} denominacion - Denominación de la entidad (si aplica).
 * @property {string} nombre - Nombre de la persona.
 * @property {string} apellidoPaterno - Apellido paterno de la persona.
 * @property {string} apellidoMaterno - Apellido materno de la persona.
 * @property {string} codigoPostal - Código postal del domicilio.
 * @property {string} pais - País de residencia.
 * @property {string} ciudad - Ciudad de residencia.
 * @property {string} domicilio - Dirección completa del domicilio.
 */
export interface MetaInfo {
  nacionalidad: string;
  tipoPersona: string;
  nacional: string;
  extranjero: string;
  denominacion: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  codigoPostal: string;
  pais: string;
  ciudad: string;
  domicilio: string;
}

/**
 * @interface Respuesta<T>
 * @description Representa una respuesta genérica que puede contener cualquier tipo de datos.
 * 
 * @template T - Tipo de datos que se incluirán en la respuesta.
 * @property {boolean} success - Indica si la operación fue exitosa.
 * @property {T} datos - Datos procesados en la respuesta.
 * @property {string} message - Mensaje adicional relacionado con la respuesta.
 */
export interface Respuesta<T> {
  success: boolean;
  datos: T;
  message: string;
}
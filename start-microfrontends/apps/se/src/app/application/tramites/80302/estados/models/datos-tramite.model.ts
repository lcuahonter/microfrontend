/**
 * @fileoverview Modelos de datos para el trámite 80302 del sistema VUCEM
 * @description Este archivo contiene todas las interfaces y tipos utilizados para manejar
 * la información de aduanas, contenedores, solicitantes y datos de modificación del trámite 80302
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

/**
 * Interfaz para información de aduanas
 * @interface Aduanas
 * @description Define la estructura básica de datos para aduanas del sistema aduanero mexicano
 */
export interface Aduanas {
  /** 
   * Descripción o nombre de la aduana
   * @type {string}
   * @description Nombre completo o descripción de la aduana
   */
  descripcion: string;
  /** 
   * Identificador único de la aduana
   * @type {number}
   * @description ID numérico único asignado a cada aduana en el sistema
   */
  id: number;
}

/**
 * Interfaz para información de contenedores
 * @interface Contenedores
 * @description Define la estructura básica para contenedores de carga utilizados en operaciones aduaneras
 */
export interface Contenedores {
  /** 
   * Tipo de contenedor
   * @type {string}
   * @description Clasificación del tipo de contenedor según especificaciones técnicas
   */
  tipo: string;
  /** 
   * Identificador único del contenedor
   * @type {string}
   * @description ID alfanumérico único del contenedor
   */
  id: string;
}

/**
 * Interfaz para datos detallados del contenedor
 * @interface DatosDelContenedor
 * @description Define la estructura completa de información de un contenedor incluyendo
 * datos técnicos, fechas, estado y referencias del sistema aduanero
 */
export interface DatosDelContenedor {
  /** 
   * Identificador único del contenedor
   * @type {number}
   * @description ID numérico único del contenedor en el sistema
   */
  id: number;
  /** 
   * Iniciales del equipo transportista
   * @type {string}
   * @description Código de iniciales de la empresa propietaria del equipo
   */
  inicialesEquipo: string;
  /** 
   * Número del equipo
   * @type {number}
   * @description Número secuencial asignado al equipo
   */
  numeroEquipo: number;
  /** 
   * Dígito verificador
   * @type {number}
   * @description Dígito de control para validación del número de contenedor
   */
  digitoVerificador: number;
  /** 
   * Tipo de equipo
   * @type {string}
   * @description Clasificación del tipo de equipo de transporte
   */
  tipoEquipo: string;
  /** 
   * Código de la aduana
   * @type {number}
   * @description Código numérico de la aduana donde se registra el contenedor
   */
  aduana: number;
  /** 
   * Fecha de ingreso
   * @type {string}
   * @description Fecha en que el contenedor ingresó al recinto aduanero
   */
  fechaIngreso: string;
  /** 
   * Período de vigencia
   * @type {string}
   * @description Período de tiempo durante el cual es válido el registro
   */
  vigencia: string;
  /** 
   * Estado de la constancia
   * @type {string}
   * @description Estado actual de la constancia emitida para el contenedor
   */
  estadoConstancia: string;
  /** 
   * Existencia en VUCEM
   * @type {string}
   * @description Indicador de si el contenedor existe en el sistema VUCEM
   */
  existeEnVUCEM: string;
  /** 
   * Identificador de la constancia
   * @type {string}
   * @description ID único de la constancia asociada al contenedor
   */
  idConstancia: string;
  /** 
   * Número de manifiesto
   * @type {string}
   * @description Número del manifiesto de carga asociado
   */
  numeroManifiesto: string;
  /** 
   * Identificador de la solicitud
   * @type {string}
   * @description ID de la solicitud relacionada con el contenedor
   */
  idSolicitud: string;
  /** 
   * Fecha de inicio
   * @type {string}
   * @description Fecha de inicio de la operación o registro
   */
  fechaInicio: string;
}
/**
 * Interfaz para respuesta de consulta de contenedor
 * @interface RespuestaContenedor
 * @description Define la estructura de respuesta para operaciones de consulta de contenedores individuales
 */
export interface RespuestaContenedor {
  /** 
   * Indicador de éxito de la operación
   * @type {boolean}
   * @description True si la operación fue exitosa, false en caso contrario
   */
  success: boolean;
  /** 
   * Datos del contenedor consultado
   * @type {DatosDelContenedor}
   * @description Información completa del contenedor solicitado
   */
  datos: DatosDelContenedor;
  /** 
   * Mensaje de respuesta
   * @type {string}
   * @description Mensaje descriptivo del resultado de la operación
   */
  message: string;
}

/**
 * Interfaz para respuesta genérica de API
 * @interface RespuestaApi
 * @description Estructura estándar para respuestas básicas de la API sin datos específicos
 */
export interface RespuestaApi {
  /** 
   * Indicador de éxito de la operación
   * @type {boolean}
   * @description True si la operación fue exitosa, false en caso contrario
   */
  success: boolean;
  /** 
   * Mensaje de respuesta
   * @type {string}
   * @description Mensaje descriptivo del resultado de la operación
   */
  message: string;
}

/**
 * Interfaz para respuesta de consulta de contenedores múltiples
 * @interface RespuestaContenedores
 * @description Define la estructura de respuesta para operaciones que retornan listas de contenedores
 */
export interface RespuestaContenedores {
  /** 
   * Código de respuesta HTTP
   * @type {number}
   * @description Código numérico del estado de la respuesta HTTP
   */
  code: number;
  /** 
   * Lista de contenedores
   * @type {Contenedores[]}
   * @description Array con la información de múltiples contenedores
   */
  data: Contenedores[];
  /** 
   * Mensaje de respuesta
   * @type {string}
   * @description Mensaje descriptivo del resultado de la operación
   */
  message: string;
}

/**
 * Interfaz para respuesta de consulta de aduanas
 * @interface RespuestaAduanas
 * @description Define la estructura de respuesta para operaciones que retornan listas de aduanas
 */
export interface RespuestaAduanas {
  /** 
   * Código de respuesta HTTP
   * @type {number}
   * @description Código numérico del estado de la respuesta HTTP
   */
  code: number;
  /** 
   * Lista de aduanas
   * @type {Aduanas[]}
   * @description Array con la información de múltiples aduanas
   */
  data: Aduanas[];
  /** 
   * Mensaje de respuesta
   * @type {string}
   * @description Mensaje descriptivo del resultado de la operación
   */
  message: string;
}

/**
 * Interfaz para datos del solicitante
 * @interface DatosSolicitante
 * @description Define la estructura de información básica del solicitante del trámite 80302
 */
export interface DatosSolicitante {
  /** 
   * RFC del solicitante
   * @type {string}
   * @description Registro Federal de Contribuyentes del solicitante
   */
  rfc: string;
  /** 
   * Denominación o razón social
   * @type {string}
   * @description Nombre completo o razón social del solicitante
   */
  denominacion: string;
  /** 
   * Actividad económica principal
   * @type {string}
   * @description Descripción de la actividad económica principal del solicitante
   */
  actividadEconomica: string;
  /** 
   * Correo electrónico de contacto
   * @type {string}
   * @description Dirección de correo electrónico del solicitante
   */
  correoElectronico: string;
}

/**
 * Interfaz para datos de modificación de programa
 * @interface DatosModificacion
 * @description Define la estructura de datos para modificaciones de programas IMMEX
 */
export interface DatosModificacion {
  /** 
   * RFC del titular del programa
   * @type {string}
   * @description Registro Federal de Contribuyentes del titular
   */
  rfc: string;
  /** 
   * Código de representación federal
   * @type {string}
   * @description Código de la representación federal correspondiente
   */
  federal: string;
  /** 
   * Tipo de modificación
   * @type {string}
   * @description Clasificación del tipo de modificación solicitada
   */
  tipo: string;
  /** 
   * Identificador del programa
   * @type {string}
   * @description ID o código del programa IMMEX a modificar
   */
  programa: string;
}

/**
 * Interfaz para datos de servicios
 * @interface DatosDelServicios
 * @description Define la estructura de información para servicios relacionados con el trámite
 */
export interface DatosDelServicios {
  /** 
   * Identificador único del servicio
   * @type {number}
   * @description ID numérico único del servicio (puede ser indefinido)
   */
  id?: number;
  /** 
   * Descripción del estatus
   * @type {string}
   * @description Estado actual del servicio (puede ser indefinido)
   */
  desEstatus?: string;
  /** 
   * Descripción del servicio
   * @type {string}
   * @description Descripción detallada del servicio (puede ser indefinido)
   */
  descripcion?: string;
  /** 
   * Tipo de servicio
   * @type {string}
   * @description Clasificación del tipo de servicio ofrecido (puede ser indefinido)
   */
  tipoDeServicio?: string;
  /** 
   * Indicador de testado
   * @type {string}
   * @description Información sobre si el servicio ha sido testado (puede ser indefinido)
   */
  testado?: string;
}

/**
 * Interfaz para datos de modificación de domicilio
 * @interface DatosDelModificacion
 * @description Define la estructura para modificaciones de información de domicilio y contacto
 */
export interface DatosDelModificacion {
  /** 
   * Identificador único
   * @type {number}
   * @description ID numérico único del registro (puede ser indefinido)
   */
  id?: number;
  /** 
   * Nombre de la calle
   * @type {string}
   * @description Nombre de la calle del domicilio (puede ser indefinido)
   */
  calle?: string;
  /** 
   * Número exterior
   * @type {number}
   * @description Número exterior del domicilio (puede ser indefinido)
   */
  numeroExterior?: number;
  /** 
   * Número interior
   * @type {number}
   * @description Número interior del domicilio (puede ser indefinido)
   */
  numeroInterior?: number;
  /** 
   * Código postal
   * @type {number}
   * @description Código postal del domicilio (puede ser indefinido)
   */
  codigoPosta?: number;
  /** 
   * Nombre de la colonia
   * @type {string}
   * @description Nombre de la colonia o fraccionamiento (puede ser indefinido)
   */
  colonia?: string;
  /** 
   * Municipio o alcaldía
   * @type {string}
   * @description Nombre del municipio o alcaldía (puede ser indefinido)
   */
  municipioOAlcaldia?: string;
  /** 
   * Entidad federativa
   * @type {string}
   * @description Estado o entidad federativa (puede ser indefinido)
   */
  entidadFederativa?: string;
  /** 
   * País
   * @type {string}
   * @description Nombre del país (puede ser indefinido)
   */
  pais?: string;
  /** 
   * Número telefónico
   * @type {string}
   * @description Número de teléfono de contacto (puede ser indefinido)
   */
  telefono?: string;
  /** 
   * Descripción del estatus
   * @type {string}
   * @description Estado actual del registro (puede ser indefinido)
   */
  desEstatus?: string;
}

/**
 * Interfaz para datos de modificación secundaria
 * @interface DatosDelModificaciondos
 * @description Define una estructura alternativa para modificaciones con información básica de servicios
 */
export interface DatosDelModificaciondos {
  /** 
   * Identificador único
   * @type {number}
   * @description ID numérico único del registro (puede ser indefinido)
   */
  id?: number;
  /** 
   * Descripción del estatus
   * @type {string}
   * @description Estado actual del registro (puede ser indefinido)
   */
  desEstatus?: string;
  /** 
   * Descripción
   * @type {string}
   * @description Descripción general del registro (puede ser indefinido)
   */
  descripcion?: string;
  /** 
   * Tipo de servicio
   * @type {string}
   * @description Clasificación del tipo de servicio (puede ser indefinido)
   */
  tipoDeServicio?: string;
}
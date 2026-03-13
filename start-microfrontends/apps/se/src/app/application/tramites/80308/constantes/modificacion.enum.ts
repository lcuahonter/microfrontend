/**
 * @fileoverview
 * Archivo de constantes y configuraciones para el módulo de modificaciones del programa IMMEX.
 * Contiene todas las configuraciones de columnas para tablas, pasos del proceso y textos informativos.
 * @version 1.0.0
 * @author Sistema IMMEX
 * @since 2025
 */

import {
  Anexo,
  Bitacora,
  Complimentaria,
  DatosDelModificacion,
  DatosDelServicios,
  DatosImmex,
  DomicilioInfo,
  Federetarios,
  FracciónArancelaria,
  Operacions,
} from '../models/plantas-consulta.model';
import { Plantas } from '../../../shared/models/complementaria.model';

/**
 * @constant PASOS
 * @description Pasos del proceso de solicitud de modificación IMMEX
 * @type {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Requisitos necesarios',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * @constant CONFIGURACION_DOMICILIOS
 * @description Configuración de columnas para la tabla de domicilios
 * @type {Array<{encabezado: string, clave: Function, orden: number}>}
 */
export const CONFIGURACION_DOMICILIOS = [
  {
    encabezado: 'Calle',
    clave: (ele: DomicilioInfo): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: DomicilioInfo): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: DomicilioInfo): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: DomicilioInfo): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: DomicilioInfo): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: DomicilioInfo): string | undefined => ele.localidad,
    orden: 6,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: DomicilioInfo): string | undefined => ele.delegacionMunicipio,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: DomicilioInfo): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: DomicilioInfo): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'RFC',
    clave: (ele: DomicilioInfo): string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Razón Social',
    clave: (ele: DomicilioInfo): string | undefined => ele.razonSocial,
    orden: 13,
  },
];

/**
 * @constant CONFIGURACION_ACCIONISTAS
 * @description Configuración de columnas para mostrar información de accionistas
 * @type {Array<{encabezado: string, clave: (ele: Complimentaria) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_ACCIONISTAS = [
  {
    encabezado: 'Registro Federal de Contribuyente(RFC)',
    clave: (ele: Complimentaria): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Nombre(s)',
    clave: (ele: Complimentaria): string | undefined => ele.nombre,
    orden: 2,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: Complimentaria): string | undefined => ele.apellidoPrimer,
    orden: 3,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: Complimentaria): string | undefined => ele.apellidoSegundo,
    orden: 4,
  },
];

/**
 * @constant CONFIGURACION_FEDERETARIOS
 * @description Configuración para mostrar datos de federatarios
 * @type {Array<{encabezado: string, clave: (ele: Federetarios) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_FEDERETARIOS = [
  {
    encabezado: 'Nombre',
    clave: (ele: Federetarios): string | undefined => ele.nombre,
    orden: 1,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: Federetarios): string | undefined => ele.apellidoPrimer,
    orden: 2,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: Federetarios): string | undefined => ele.apellidoSegundo,
    orden: 3,
  },
  {
    encabezado: 'Número acta',
    clave: (ele: Federetarios): string | undefined => ele.numeroActa,
    orden: 4,
  },
  {
    encabezado: 'Fecha acta',
    clave: (ele: Federetarios): string | undefined => ele.fetchActa,
    orden: 5,
  },
  {
    encabezado: 'Número notaria',
    clave: (ele: Federetarios): string | undefined => ele.numeroNotaria,
    orden: 6,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Federetarios): string | undefined => ele.municipioDelegacion,
    orden: 7,
  },
  {
    encabezado: 'Estado o Distrito Federal',
    clave: (ele: Federetarios): string | undefined => ele.estado,
    orden: 8,
  },
];

/**
 * @constant CONFIGURACION_OPERACIONES
 * @description Configuración de columnas para la tabla de operaciones
 * @type {Array<{encabezado: string, clave: (ele: Operacions) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_OPERACIONES = [
  {
    encabezado: 'Calle',
    clave: (ele: Operacions): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: Operacions): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: Operacions): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: Operacions): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Operacions): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: Operacions): string | undefined => ele.delegacionMunicipio,
    orden: 7,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: Operacions): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: Operacions): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Operacions): string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Operacions): string | undefined => ele.fiscalSolicitante,
    orden: 11,
  },
  {
    encabezado: 'Denominación o razón social',
    clave: (ele: Operacions): string | undefined => ele.razonSocial,
    orden: 12,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Operacions): string | undefined => (ele.estatus ? 'Activada' : 'Baja'),
    orden: 13,
  },
];

/**
 * @constant CONFIGURACION_MANUFACTURERA
 * @description Configuración de columnas para la tabla de plantas manufactureras
 * @type {Array<{encabezado: string, clave: (ele: Plantas) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_MANUFACTURERA = [
  {
    encabezado: 'Calle',
    clave: (ele: Plantas): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: Plantas): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: Plantas): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: Plantas): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Plantas): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: Plantas): string | undefined => ele.municipioDelegacion,
    orden: 7,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: Plantas): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: Plantas): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Plantas): string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Plantas): string | undefined => ele.fiscalSolicitante,
    orden: 11,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Plantas): string | undefined => (ele.estatus ? 'Activada' : 'Baja'),
    orden: 12,
  },
];

/**
 * @constant CONFIGURACION_BITACORA_TABLA
 * @description Configuración para la tabla de bitácora de modificaciones
 * @type {Array<{encabezado: string, clave: (ele: Bitacora) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_BITACORA_TABLA = [
  {
    encabezado: 'Tipo modificación',
    clave: (ele: Bitacora): string | undefined => ele.tipoModificion,
    orden: 1,
  },
  {
    encabezado: 'Fecha modificación',
    clave: (ele: Bitacora): string | undefined => ele.fetchModificion,
    orden: 2,
  },
  {
    encabezado: 'Valores anteriores',
    clave: (ele: Bitacora): string | undefined => ele.valoresAnteriores,
    orden: 3,
  },
  {
    encabezado: 'Valores nuevos',
    clave: (ele: Bitacora): string | undefined => ele.valoresNuevos,
    orden: 4,
  },
];

/**
 * @constant CONFIGURACION_ANEXOS_TABLA
 * @description Configuración para mostrar anexos en formato de tabla
 * @type {Array<{encabezado: string, clave: (ele: Anexo) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_ANEXOS_TABLA = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: Anexo): string | undefined => ele.fraccionArancelariaExportacion,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: Anexo): string | undefined => ele.descripcion,
    orden: 2,
  },
  {
    encabezado: 'Tipo Fracción',
    clave: (ele: Anexo): string | undefined => ele.tipoFraccion,
    orden: 3,
  },
];

/**
 * @constant CONFIGURACION_ANEXOS_IMPORTACION
 * @description Configuración específica para anexos de importación
 * @type {Array<{encabezado: string, clave: (ele: Anexo) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_ANEXOS_IMPORTACION = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: Anexo): string | undefined => ele.fraccionArancelariaExportacion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: Anexo): string | undefined => ele.fraccionArancelariaImportacion,
    orden: 2,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: Anexo): string | undefined => ele.descripcion,
    orden: 3,
  },
  {
    encabezado: 'Tipo Fracción',
    clave: (ele: Anexo): string | undefined => ele.tipoFraccion,
    orden: 4,
  },
];

/**
 * @constant TITULOMENSAJE
 * @description Título principal del proceso de modificación IMMEX
 * @type {string}
 */
export const TITULOMENSAJE =
  'Registro de solicitud de modificación programa IMMEX (Modificación Alta a domicilio de una planta, bodega o almacén)';

/**
 * @constant TEXTOS_REQUISITOS
 * @description Texto informativo que se muestra al usuario después del registro
 * @type {string}
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * @constant CONFIGURACION_ANEXOS_FRACCION
 * @description Configuración para mostrar fracciones arancelarias con detalles de cantidad y valor
 * @type {Array<{encabezado: string, clave: (ele: FracciónArancelaria) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_ANEXOS_FRACCION = [
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: FracciónArancelaria): string | undefined => ele.fraccionArancelariaFraccion,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: FracciónArancelaria): string | undefined => ele.cantidad,
    orden: 2,
  },
  {
    encabezado: 'Valor',
    clave: (ele: FracciónArancelaria): string | undefined => ele.valor,
    orden: 3,
  },
  {
    encabezado: 'Unidad de medida tarifaria',
    clave: (ele: FracciónArancelaria): string | undefined => ele.unidadMedidaTarifaria,
    orden: 4,
  },
];

/**
 * @constant CONFIGURACION_ANEXOS_IMMEX
 * @description Configuración para mostrar datos completos del programa IMMEX
 * @type {Array<{encabezado: string, clave: (ele: DatosImmex) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_ANEXOS_IMMEX = [
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: DatosImmex): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: DatosImmex): string | undefined => ele.domicilioFiscal,
    orden: 2,
  },
  {
    encabezado: 'Calle',
    clave: (ele: DatosImmex): string | undefined => ele.calle,
    orden: 3,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: DatosImmex): string | undefined => ele.numeroInterior,
    orden: 4,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: DatosImmex): string | undefined => ele.numeroExterior,
    orden: 5,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: DatosImmex): string | undefined => ele.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: DatosImmex): string | undefined => ele.colonia,
    orden: 7,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: DatosImmex): string | undefined => ele.localidad,
    orden: 8,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: DatosImmex): string | undefined => ele.entidadFederativa,
    orden: 9,
  },
  {
    encabezado: 'País',
    clave: (ele: DatosImmex): string | undefined => ele.pais,
    orden: 10,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: DatosImmex): string | undefined => ele.telefono,
    orden: 11,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: DatosImmex): string | undefined => ele.desEstatus,
    orden: 12,
  },
];

/**
 * @constant CONFIGURACION_SERVICIOS
 * @description Configuración de columnas para la tabla de servicios
 * @type {Array<{encabezado: string, clave: (ele: DatosDelServicios) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_SERVICIOS = [
  {
    encabezado: 'Estatus',
    clave: (ele: DatosDelServicios): string | undefined => ele.desEstatus,
    orden: 4,
  },
  {
    encabezado: 'Testado',
    clave: (ele: DatosDelServicios): string | undefined => ele.testado,
    orden: 3,
  },
  {
    encabezado: 'Descripción del servicio',
    clave: (ele: DatosDelServicios): string | undefined => ele.descripcion,
    orden: 1,
  },
  {
    encabezado: 'Tipo de servicio',
    clave: (ele: DatosDelServicios): string | undefined => ele.tipoDeServicio,
    orden: 2,
  },
];

/**
 * @constant CONFIGURACION_MODIFICACION
 * @description Configuración de columnas para la tabla de modificaciones
 * @type {Array<{encabezado: string, clave: (ele: DatosDelModificacion) => string | number | undefined, orden: number}>}
 */
export const CONFIGURACION_MODIFICACION = [
  {
    encabezado: 'Id',
    clave: (ele: DatosDelModificacion): number | undefined => ele.id,
    orden: 0,
  },
  {
    encabezado: 'Calle',
    clave: (ele: DatosDelModificacion): string | undefined => ele.calle,
    orden: 2,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: DatosDelModificacion): number | undefined => ele.numeroExterior,
    orden: 3,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: DatosDelModificacion): number | undefined => ele.numeroInterior,
    orden: 4,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: DatosDelModificacion): number | undefined => ele.codigoPosta,
    orden: 5,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: DatosDelModificacion): string | undefined => ele.colonia,
    orden: 6,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: DatosDelModificacion): string | undefined => ele.municipioOAlcaldia,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: DatosDelModificacion): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: DatosDelModificacion): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Telefono',
    clave: (ele: DatosDelModificacion): string | undefined => ele.telefono,
    orden: 10,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: DatosDelModificacion): string | undefined => ele.desEstatus,
    orden: 1,
  },
];
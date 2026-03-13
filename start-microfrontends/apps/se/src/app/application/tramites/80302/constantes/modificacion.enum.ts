import { Anexo, AnexoImportacion, BitacoraModificacion, DatosSocioAccionista, DomicilioInfo, Notario, Operacions, Planta, ProductoExportacion } from "../estados/models/plantas-consulta.model";
import {DatosDelServicios } from "../estados/models/datos-tramite.model";

/**
 * Constantes y configuraciones para el trámite 80302 - Modificación programa IMMEX
 * 
 * Este archivo contiene las configuraciones necesarias para:
 * - Pasos del proceso de solicitud
 * - Configuraciones de tablas para mostrar información de empresas, plantas, servicios, etc.
 * - Títulos y mensajes del sistema
 */

/**
 * PASOS - Define los pasos del proceso de solicitud de modificación
 * Cada paso contiene: índice, título, estado activo y estado completado
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
 * CONFIGURACION_EMPRESAS - Configuración de columnas para la tabla de empresas
 * Define los encabezados, funciones para obtener valores y orden de las columnas
 * que se muestran en la información de empresas del programa IMMEX
 */
export const CONFIGURACION_EMPRESAS = [
  {
    encabezado: 'Registro Federal de Contribuyente',
    clave: (ele: Operacions) : string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: Operacions) : string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Calle',
    clave: (ele: Operacions) : string | undefined => ele.calle,
    orden: 3,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Operacions) : string | undefined => ele.numeroInterior,
    orden: 4,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Operacions) : string | undefined => ele.numeroExterior,
    orden: 5,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Operacions) : string | undefined => ele.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Operacions) : string | undefined => ele.municipioDelegacion,
    orden: 7,
  },
  {
    encabezado: 'Estado o Distrito Federal',
    clave: (ele: Operacions) : string | undefined => ele.estado,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: Operacions) : string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Operacions) : string | undefined => (ele.estatus ? 'Activada' : 'Baja'),
    orden: 13,
  },
];

/**
 * CONFIGURACION_PLANTA - Configuración de columnas para la tabla de plantas
 * Define la estructura de información que se muestra para las plantas, bodegas o almacenes
 * incluyendo datos de ubicación, RFC, razón social y estatus
 */
export const CONFIGURACION_PLANTA = [
  {
    encabezado: 'Calle',
    clave: (ele: Operacions) : string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Operacions) : string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Operacions) : string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Operacions) : string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Operacions) : string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: Operacions) : string | undefined => ele.localidad,
    orden: 6,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Operacions) : string | undefined => ele.municipioDelegacion,
    orden: 7,
  },
  {
    encabezado: 'Estado o Distrito Federal',
    clave: (ele: Operacions) : string | undefined => ele.estado,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: Operacions) : string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Registro Federal de Contribuyente(RFC)',
    clave: (ele: Operacions) : string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Operacions) : string | undefined => ele.fiscalSolicitante,
    orden: 11,
  },
  {
    encabezado: 'Denominación o razón social',
    clave: (ele: Operacions) : string | undefined => ele.razonSocial,
    orden: 12,
  },

  {
    encabezado: 'Estatus',
    clave: (ele: Operacions) : string | undefined => (ele.estatus ? 'Activada' : 'Baja'),
    orden: 13,
  },
];

/**
 * CONFIGURACION_SERVICIOS - Configuración de columnas para la tabla de servicios
 * Muestra información sobre los servicios relacionados con el trámite,
 * incluyendo descripción, tipo, estatus y si está testado
 */
export const CONFIGURACION_SERVICIOS = [
    {
      encabezado: 'Estatus',
      clave: (ele: DatosDelServicios):string | undefined => ele.desEstatus,
      orden: 4,
    },
    {
      encabezado: 'Testado',
      clave: (ele: DatosDelServicios):string | undefined => ele.testado,
      orden: 3,
    },
    {
      encabezado: 'Descripción del servicio',
      clave: (ele: DatosDelServicios):string | undefined => ele.descripcion,
      orden: 1,
    },
    {
      encabezado: 'Tipo de servicio',
      clave: (ele: DatosDelServicios):string | undefined => ele.tipoDeServicio,
      orden: 2,
    }
];

/**
 * CONFIGURACION_MODIFICACION - Configuración de columnas para la tabla de modificaciones
 * Define la estructura para mostrar los datos de modificación de domicilio,
 * incluyendo información completa de la dirección y datos de contacto
 */
export const CONFIGURACION_MODIFICACION = [
    { encabezado: 'Calle', 
      clave: (ele: Planta):string | null => ele.calle, 
      orden: 2 },
    {
      encabezado: 'Número Exterior',
      clave: (ele: Planta):string | null => ele.numeroExterior,
      orden: 3,
    },
    {
      encabezado: 'Número Interior',
      clave: (ele: Planta):string | null => ele.numeroInterior,
      orden: 4,
    },
    {
      encabezado: 'Código Postal',
      clave: (ele: Planta):string | null => ele.codigoPostal,
      orden: 5,
    },
    { encabezado: 'Colonia', 
      clave: (ele: Planta):string | null => ele.colonia,
      orden: 6 },
    {
      encabezado: 'Municipio o alcaldía',
      clave: (ele: Planta):string | null => ele.delegacionMunicipio,
      orden: 7,
    },
    {
      encabezado: 'Entidad Federativa',
      clave: (ele: Planta):string | null => ele.entidadFederativa,
      orden: 8,
    },
    { encabezado: 'País', 
      clave: (ele: Planta):string | null => ele.pais, 
      orden: 9 },
    {
      encabezado: 'Teléfono',
      clave: (ele: Planta):string | null => ele.telefono,
      orden: 10,
    },
    {
      encabezado: 'Estatus',
      clave: (ele: Planta):string | null => ele.desEstatus,
      orden: 1,
    },
];

/**
 * CONFIGURACION_DOMICILIOS - Configuración de columnas para la tabla de domicilios
 * Muestra información detallada de domicilios incluyendo dirección completa,
 * RFC y razón social de la empresa
 */
export const CONFIGURACION_DOMICILIOS = [
  {
    encabezado: 'Calle',
    clave: (ele: DomicilioInfo): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: DomicilioInfo) : string | undefined => ele.numeroExterior,
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
 * CONFIGURACION_ACCIONISTAS - Configuración de columnas para la tabla de accionistas
 * Define la estructura para mostrar información de los accionistas de la empresa,
 * incluyendo RFC, nombre completo (nombres y apellidos)
 */
export const CONFIGURACION_ACCIONISTAS = [
  {
    encabezado: 'Registro Federal de Contribuyente(RFC)',
    clave: (ele: DatosSocioAccionista): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Nombre(s)',
    clave: (ele: DatosSocioAccionista): string | undefined => ele.nombre,
    orden: 2,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: DatosSocioAccionista): string | undefined => ele.apellidoPaterno,
    orden: 3,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: DatosSocioAccionista): string | undefined => ele.apellidoMaterno,
    orden: 4,
  },
];

/**
 * CONFIGURACION_FEDERETARIOS - Configuración de columnas para la tabla de federetarios
 * Muestra información de los representantes legales incluyendo datos personales,
 * información del acta notarial y ubicación de la notaría
 */
export const CONFIGURACION_FEDERETARIOS = [
  {
    encabezado: 'Nombre',
    clave: (ele: Notario): string | null => ele.nombreNotario ?? null,
    orden: 1,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: Notario): string | null => ele.apellidoPaterno ?? null,
    orden: 2,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: Notario): string | null => ele.apellidoMaterno ?? null,
    orden: 3,
  },
  {
    encabezado: 'Número acta',
    clave: (ele: Notario): string | null => ele.numeroActa ?? null,
    orden: 4,
  },
  {
    encabezado: 'Fecha acta',
    clave: (ele: Notario) : string | null => ele.fechaActa ?? null,
    orden: 5,
  },
  {
    encabezado: 'Número notaria',
    clave: (ele: Notario) : string | null => ele.numeroNotaria ?? null,
    orden: 6,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Notario) : string | null => ele.delegacionMunicipio ?? null,
    orden: 7,
  },
  {
    encabezado: 'Estado o Distrito Federal',
    clave: (ele: Notario) : string | null => ele.entidadFederativa ?? null,
    orden: 8,
  },
];

/**
 * CONFIGURACION_OPERACIONES - Configuración de columnas para la tabla de operaciones
 * Define la estructura completa de información de operaciones incluyendo
 * domicilio, RFC, razón social y estatus de la operación
 */
export const CONFIGURACION_OPERACIONES = [
  {
    encabezado: 'Calle',
    clave: (ele: Operacions): string | undefined => ele.calle || undefined,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Operacions): string | undefined => ele.numeroExterior || undefined,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Operacions): string | undefined => ele.numeroInterior || undefined,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Operacions): string | undefined => ele.codigoPostal || undefined,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Operacions): string | undefined => ele.colonia || undefined,
    orden: 5,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: Operacions): string | undefined => ele.localidad || undefined,
    orden: 6,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Operacions): string | undefined => ele.delegacionMunicipio || undefined,
    orden: 7,
  },
  {
    encabezado: 'Estado o Distrito Federal',
    clave: (ele: Operacions): string | undefined => ele.estado || undefined,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: Operacions): string | undefined => ele.pais || undefined,
    orden: 9,
  },
  {
    encabezado: 'Registro Federal de Contribuyente(RFC)',
    clave: (ele: Operacions): string | undefined => ele.rfc || undefined,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Operacions): string | undefined => ele.fiscalSolicitante || undefined,
    orden: 11,
  },
  {
    encabezado: 'Denominación o razón social',
    clave: (ele: Operacions): string | undefined => ele.razonSocial || undefined,
    orden: 12,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Operacions): string => (ele.estatus ? 'Activada' : 'Baja'),
    orden: 13,
  },
];

/**
 * CONFIGURACION_BITACORA_TABLA - Configuración de columnas para la tabla de bitácora
 * Registra el historial de modificaciones mostrando el tipo de modificación,
 * fecha, valores anteriores y nuevos valores
 */
export const CONFIGURACION_BITACORA_TABLA = [
  {
    encabezado: 'Tipo modificación',
    clave: (ele: BitacoraModificacion) : string | null => ele.tipoModificacion,
    orden: 1,
  },
  {
    encabezado: 'Fecha modificación',
    clave: (ele: BitacoraModificacion) : string | null => ele.fechaModificacion,
    orden: 2,
  },
  {
    encabezado: 'Valores anteriores',
    clave: (ele: BitacoraModificacion) : string | null => ele.valoresAnteriores,
    orden: 3,
  },
  {
    encabezado: 'Valores nuevos',
    clave: (ele: BitacoraModificacion) : string | null => ele.valoresNuevos,
    orden: 4,
  },
];

/**
 * CONFIGURACION_ANEXOS_TABLA - Configuración de columnas para la tabla de anexos
 * Muestra información de productos de exportación incluyendo fracción arancelaria,
 * descripción y tipo de fracción
 */
export const CONFIGURACION_ANEXOS_TABLA = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: ProductoExportacion) : string | null => ele.cveFraccion,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: ProductoExportacion): string | null => ele.descripcionTestado,
    orden: 2,
  },
  {
    encabezado: 'Tipo Fracción',
    clave: (ele: ProductoExportacion) : string | null => ele.tipoFraccion,
    orden: 3,
  },
];

/**
 * CONFIGURACION_ANEXOS_IMPORTACION - Configuración de columnas para anexos de importación
 * Incluye tanto fracciones arancelarias de exportación como de importación,
 * junto con descripción y tipo de fracción
 */
export const CONFIGURACION_ANEXOS_IMPORTACION = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoImportacion): string | null => ele.cveFraccion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: AnexoImportacion): string | null => ele.fraccionCompuesta,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: AnexoImportacion) : string | null => ele.descripcionUsuario,
    orden: 2,
  },
  {
    encabezado: 'Tipo Fracción',
    clave: (ele: AnexoImportacion) : string | null => ele.tipoFraccion,
    orden: 3,
  },
];

/**
 * CONFIGURACION_ANEXOS_SENSIBLES - Configuración para anexos de mercancías sensibles
 * Maneja información específica de importación incluyendo cantidades,
 * valores y unidades de medida tarifaria
 */
export const CONFIGURACION_ANEXOS_SENSIBLES = [
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: Anexo): number | undefined => ele.fraccionArancelariaDeLaMercanciaDeImportacion,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: Anexo): number | undefined => ele.cantidad,
    orden: 1,
  },
  {
    encabezado: 'Valor',
    clave: (ele: Anexo): number | undefined => ele.valor,
    orden: 2,
  },
  {
    encabezado: 'Unidad de medida tarifaria',
    clave: (ele: Anexo) : string | undefined => ele.unidadMedida,
    orden: 3,
  },
];


/**
 * TITULOMENSAJE - Título principal del trámite
 * Describe el tipo específico de modificación: Alta a domicilio de planta, bodega o almacén
 */
export const TITULOMENSAJE =
  'Registro de solicitud de modificación programa IMMEX (Modificación Alta a domicilio de una planta, bodega o almacén)';

/**
 * TEXTOS_REQUISITOS - Mensaje informativo sobre el registro de la solicitud
 * Explica al usuario sobre el número temporal asignado y el proceso de foliado oficial
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

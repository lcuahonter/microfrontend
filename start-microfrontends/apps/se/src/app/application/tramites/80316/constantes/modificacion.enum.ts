import {
  Anexo,
  Bitacora,
  Complimentaria,
  DatosDelModificacion,
  Empresas,
  Federetarios,
  FraccionSensible,
  Operacions,
  Plantas,
  Servicios,
} from '../models/datos-tramite.model';

/**
 * Pasos del proceso de modificación.
 * Define los pasos que el usuario debe completar para realizar una modificación.
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
 * Configuración de las columnas de la tabla para la modificación.
 * Define cómo se mostrarán los datos relacionados con la modificación en la tabla.
 */
export const CONFIGURACION_MODIFICACION: {
  encabezado: string;
  clave: (ele: DatosDelModificacion) => unknown;
  orden: number;
}[] = [
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
    clave: (ele: DatosDelModificacion): number | undefined =>
      ele.numeroExterior,
    orden: 3,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: DatosDelModificacion): number | undefined =>
      ele.numeroInterior,
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
    clave: (ele: DatosDelModificacion): string | undefined =>
      ele.municipioOAlcaldia,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: DatosDelModificacion): string | undefined =>
      ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: DatosDelModificacion): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: DatosDelModificacion): string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: DatosDelModificacion): string | undefined =>
      ele.domicilioFiscal,
    orden: 11,
  },
  {
    encabezado: 'Razón Social',
    clave: (ele: DatosDelModificacion): string | undefined => ele.razonSocial,
    orden: 12,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: DatosDelModificacion): string | undefined => ele.desEstatus,
    orden: 1,
  },
];

/**
 * Configuración de las columnas de la tabla para los accionistas.
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
 * Configuración de las columnas de la tabla para los federatarios.
 */
export const CONFIGURACION_FEDERETARIOS = [
  {
    encabezado: 'Nombre',
    clave: (ele: Federetarios): string | undefined => ele.nombreNotario,
    orden: 1,
  },
  {
    encabezado: 'Apellido Paterno',
    clave: (ele: Federetarios): string | undefined => ele.apellidoPaterno,
    orden: 2,
  },
  {
    encabezado: 'Apellido Materno',
    clave: (ele: Federetarios): string | undefined => ele.apellidoMaterno,
    orden: 3,
  },
  {
    encabezado: 'Número acta',
    clave: (ele: Federetarios): string | undefined => ele.numeroActa,
    orden: 4,
  },
  {
    encabezado: 'Fecha acta',
    clave: (ele: Federetarios): string | undefined => ele.fechaActa,
    orden: 5,
  },
  {
    encabezado: 'Número notaría',
    clave: (ele: Federetarios): string | undefined => ele.numeroNotaria,
    orden: 6,
  },
  {
    encabezado: 'Delegación Municipio',
    clave: (ele: Federetarios): string | undefined => ele.delegacionMunicipio,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Federetarios): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
];

/**
 * Configuración de las columnas de la tabla para las operaciones.
 */
export const CONFIGURACION_OPERACIONES = [
  {
    encabezado: 'Calle',
    clave: (ele: Operacions): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Operacions): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Operacions): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Operacions): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Operacions): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: Operacions): string | undefined => ele.localidad,
    orden: 6,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: Operacions): string | undefined => ele.delegacionMunicipio,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Operacions): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: Operacions): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'RFC',
    clave: (ele: Operacions): string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal',
    clave: (ele: Operacions): string | undefined => ele.domicilioFiscal,
    orden: 11,
  },
  {
    encabezado: 'Razón Social',
    clave: (ele: Operacions): string | undefined => ele.razonSocial,
    orden: 12,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Operacions): string | undefined =>ele.estatus,
    orden: 13,
  },
];

/**
 * Configuración de las columnas de la tabla para la bitácora.
 */
export const CONFIGURACION_BITACORA_TABLA = [
  {
    encabezado: 'Tipo modificación',
    clave: (ele: Bitacora): string | undefined => ele.tipoModificacion,
    orden: 1,
  },
  {
    encabezado: 'Fecha modificación',
    clave: (ele: Bitacora): string | undefined => ele.fechaModificacion,
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
 * Configuración de las columnas de la tabla para los anexos.
 */
export const CONFIGURACION_ANEXOS_TABLA = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: Anexo): string | undefined =>
      ele.fraccionArancelariaExportacion,
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

export const CONFIGURACION_ANEXOS_IMPORTACION = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: Anexo): string | undefined =>
      ele.fraccionArancelariaExportacion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: Anexo): string | undefined =>
      ele.fraccionArancelariaImportacion,
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
 * Título del mensaje mostrado al registrar una solicitud de modificación.
 */
export const TITULO_MENSAJE =
  'Registro de solicitud de modificación programa IMMEX (Modificación Alta a domicilio de una planta, bodega o almacén)';

/**
 * Texto mostrado al registrar una solicitud de modificación.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Configuración de las columnas de la tabla para las empresas.
 * Define cómo se mostrarán los datos relacionados con las empresas en la tabla.
 */
export const CONFIGURACION_EMPRESAS = [
  {
    encabezado: 'Registro Federal de Contribuyente (RFC)',
    clave: (ele: Empresas): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Razón Social',
    clave: (ele: Empresas): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Calle',
    clave: (ele: Empresas): string | undefined => ele.calle,
    orden: 3,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Empresas): string | undefined => ele.numeroExterior,
    orden: 4,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Empresas): string | undefined => ele.numeroInterior,
    orden: 5,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Empresas): string | undefined => ele.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Empresas): string | undefined => ele.colonia,
    orden: 7,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Empresas): string | undefined => ele.delegacionMunicipio,
    orden: 8,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Empresas): string | undefined => ele.entidadFederativa,
    orden: 9,
  },
  {
    encabezado: 'País',
    clave: (ele: Empresas): string | undefined => ele.pais,
    orden: 10,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: Empresas): string | undefined => ele.telefono,
    orden: 11,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Empresas): string | undefined =>
      ele.estatus ? 'Activada' : 'Baja',
    orden: 12,
  },
];

/**
 * Configuración de las columnas de la tabla para las plantas.
 * Define cómo se mostrarán los datos relacionados con las plantas en la tabla.
 */
export const CONFIGURACION_PLANTAS = [
  {
    encabezado: 'Calle',
    clave: (ele: Plantas): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Plantas): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Plantas): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Plantas): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Plantas): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Plantas): string | undefined => ele.delegacionMunicipio,
    orden: 6,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Plantas): string | undefined => ele.entidadFederativa,
    orden: 7,
  },
  {
    encabezado: 'País',
    clave: (ele: Plantas): string | undefined => ele.pais,
    orden: 8,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Plantas): string | undefined => ele.rfc,
    orden: 9,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Plantas): string | undefined => ele.domicilioFiscal,
    orden: 10,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Plantas): string | undefined => ele.estatus,
    orden: 11,
  },
];

/**
 * Configuración de las columnas de la tabla para los servicios.
 * Define cómo se mostrarán los datos relacionados con los servicios en la tabla.
 */
export const CONFIGURACION_SERVICIOS = [
  {
    encabezado: 'Descripción del servicio',
    clave: (ele: Servicios): string | undefined => ele.descripcion,
    orden: 1,
  },
  {
    encabezado: 'Tipo de servicio',
    clave: (ele: Servicios): string | undefined => ele.tipoServicio,
    orden: 2,
  },
  {
    encabezado: 'Testado',
    clave: (ele: Servicios): string | undefined => ele.testado,
    orden: 3,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Servicios): string | undefined => ele.estatus,
    orden: 4,
  },
];

/**
 * Configuración de las columnas de la tabla para las fracciones sensibles.
 * Define cómo se mostrarán los datos relacionados con las fracciones sensibles en la tabla.
 */
export const CONFIGURACION_FRACCION_SENSIBLE = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: FraccionSensible): number | undefined =>
      ele.fraccionArancelariaExportacion,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: FraccionSensible): number | undefined => ele.cantidad,
    orden: 2,
  },
  {
    encabezado: 'Valor',
    clave: (ele: FraccionSensible): number | undefined => ele.valor,
    orden: 3,
  },
  {
    encabezado: 'Unidad de medida tarifaria',
    clave: (ele: FraccionSensible): string | undefined =>
      ele.unidadMedidaTarifaria,
    orden: 4,
  },
];

/**
 * Constante que define los tipos de TICPSE disponibles.
 */
export const TICPSE = {
  /**
   * Tipo TICPSE para IMMEX.
   */
  TICPSE_IMMEX: 'TICPSE.IMMEX',

  /**
   * Tipo TICPSE para PROSEC.
   */
  TICPSE_PROSEC: 'TICPSE.PROSEC'
}
/**
 * Constante que define el valor del discriminador para el trámite 80301.
 */
export const DISCRIMINATOR_VALUE = '80316';
/**
 * Expresión regular para validar comas al final de una cadena.
 */
export const REGEX_COMAS_FINALES = /,+$/;

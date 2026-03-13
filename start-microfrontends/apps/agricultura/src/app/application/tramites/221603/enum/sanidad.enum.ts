/**
 * Enumeración que contiene constantes, interfaces y configuraciones relacionadas con la sanidad.
 * Proporciona datos y estructuras para gestionar las solicitudes, mercancías, exportadores y destinatarios.
 */

/**
 * Mensaje que indica que las tablas con asterisco son obligatorias.
 */
export const MENSAJE_TABLA_OBLIGATORIA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * Mensaje que describe el comportamiento al cargar una nueva solicitud.
 */
export const DATOS_SOLICITUD =
  'Al dar clic en el botón "Cargar" se creará una nueva solicitud con los mismos datos de la solicitud 202768246';

/**
 * Configuración de opciones para un radio button relacionado con la exención.
 */
export const EXENTO_DE_RADIO_BOTONS = [
  {
    label: 'Sí',
    value: '1',
  },
];

/**
 * Interfaz que define los datos del formulario relacionados con la solicitud.
 */
export interface FormularioDatos {
  aduana: string;
  oficina: string;
  punto: string;
  transporte: string;
  empresa: string;
  clave: string;
  dependencia: string;
  importe: string;
}

/**
 * Interfaz que define los datos de una mercancía.
 */
export interface Mercancia {
  noPartida: number;
  tipoRequisito: string;
  requisito: string;
  numeroCertificadoInternacional: string;
  fraccionArancelaria: string;
  fraccionArancelariaDescripcion: string;
  nico: string;
  descripcionNico: string;
  descripcion: string;
  unidadMedidaTarifa: string;
  cantidadUmt: number;
  unidadMedidaComercializacion: string;
  cantidadUmc: number;
  uso: string;
  especie: string;
  paisOrigen: string;
  paisProcedencia: string;
  numeroLote: number;
  fasedesarrollo: string;
  certificadoInternacionalElectronico: string;
}

/**
 * Interfaz que define los datos de un exportador.
 */
export interface Exportador {
  nombreDenominacionORazonSocial: string;
  telefono: string;
  correoElectronico: string;
  domicilio: string;
  pais: string;
}

/**
 * Interfaz que define los datos de un destinatario.
 */
export interface Destinatario {
  nombreDenominacionORazonSocial: string;
  telefono: string;
  correoElectronico: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  pais: string;
  colonia: string;
  municipioOAlcaldia: string;
  entidadFederativa: string;
  codigoPostal: string;
}

/**
 * Configuración de las columnas para la tabla de mercancías.
 * Define los encabezados, claves y el orden de las columnas.
 */
export const CONFIGURATION_TABLA_MERCANCIAS = [
  {
    encabezado: 'No.partida',
    clave: (item: Mercancia): number => item.noPartida,
    orden: 1,
  },
  {
    encabezado: 'Tipo de requisito',
    clave: (item: Mercancia): string => item.tipoRequisito,
    orden: 2,
  },
  {
    encabezado: 'Requisito',
    clave: (item: Mercancia): string => item.requisito,
    orden: 3,
  },
  {
    encabezado: 'Número de Certificado Internacional',
    clave: (item: Mercancia): string => item.numeroCertificadoInternacional,
    orden: 4,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (item: Mercancia): string => item.fraccionArancelaria,
    orden: 5,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (item: Mercancia): string => item.fraccionArancelariaDescripcion,
    orden: 6,
  },
  {
    encabezado: 'NICO',
    clave: (item: Mercancia): string => item.nico,
    orden: 7,
  },
  {
    encabezado: 'Descripción NICO',
    clave: (item: Mercancia): string => item.descripcionNico,
    orden: 8,
  },
  {
    encabezado: 'Descripción',
    clave: (item: Mercancia): string => item.descripcion,
    orden: 9,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (item: Mercancia): string => item.unidadMedidaTarifa,
    orden: 10,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (item: Mercancia): number => item.cantidadUmt,
    orden: 11,
  },
  {
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (item: Mercancia): string => item.unidadMedidaComercializacion,
    orden: 12,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (item: Mercancia): number => item.cantidadUmc,
    orden: 13,
  },
  {
    encabezado: 'Uso:',
    clave: (item: Mercancia): string => item.uso,
    orden: 14,
  },
  {
    encabezado: 'Especie',
    clave: (item: Mercancia): string => item.especie,
    orden: 15,
  },
  {
    encabezado: 'País de origen',
    clave: (item: Mercancia): string => item.paisOrigen,
    orden: 16,
  },
  {
    encabezado: 'País de procedencia',
    clave: (item: Mercancia): string => item.paisProcedencia,
    orden: 17,
  },
  {
    encabezado: 'Número de lote',
    clave: (item: Mercancia): number => item.numeroLote,
    orden: 18,
  },
  {
    encabezado: 'Fase de desarrollo',
    clave: (item: Mercancia): string => item.fasedesarrollo,
    orden: 19,
  },
  {
    encabezado: 'Certificado Internacional Electrónico',
    clave: (item: Mercancia): string =>
      item.certificadoInternacionalElectronico,
    orden: 20,
  },
];

/**
 * Configuración de las columnas para la tabla de exportadores.
 * Define los encabezados, claves y el orden de las columnas.
 */
export const CONFIGURATION_TABLA_EXPORTADOR = [
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (item: Exportador): string => item.nombreDenominacionORazonSocial,
    orden: 1,
  },
  {
    encabezado: 'Teléfono',
    clave: (item: Exportador): string => item.telefono,
    orden: 2,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (item: Exportador): string => item.correoElectronico,
    orden: 3,
  },
  {
    encabezado: 'Domicilio',
    clave: (item: Exportador): string => item.domicilio,
    orden: 4,
  },
  {
    encabezado: 'País',
    clave: (item: Exportador): string => item.pais,
    orden: 5,
  },
];

/**
 * Configuración de las columnas para la tabla de destinatarios.
 * Define los encabezados, claves y el orden de las columnas.
 */
export const CONFIGURATION_TABLA_DESTINATARIO = [
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (item: Destinatario): string => item.nombreDenominacionORazonSocial,
    orden: 1,
  },
  {
    encabezado: 'Teléfono',
    clave: (item: Destinatario): string => item.telefono,
    orden: 2,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (item: Destinatario): string => item.correoElectronico,
    orden: 3,
  },
  {
    encabezado: 'Calle',
    clave: (item: Destinatario): string => item.calle,
    orden: 4,
  },
  {
    encabezado: 'Número exterior',
    clave: (item: Destinatario): string => item.numeroExterior,
    orden: 5,
  },
  {
    encabezado: 'Número interior',
    clave: (item: Destinatario): string => item.numeroInterior,
    orden: 6,
  },
  {
    encabezado: 'País',
    clave: (item: Destinatario): string => item.pais,
    orden: 7,
  },
  {
    encabezado: 'Colonia',
    clave: (item: Destinatario): string => item.colonia,
    orden: 8,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (item: Destinatario): string => item.municipioOAlcaldia,
    orden: 9,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (item: Destinatario): string => item.entidadFederativa,
    orden: 10,
  },
  {
    encabezado: 'Código postal',
    clave: (item: Destinatario): string => item.codigoPostal,
    orden: 11,
  },
];

/**
 * Constante INPUT_FECHA_CONFIG
 * Descripción: Configuración utilizada para el campo de entrada de fecha en el formulario.
 */
export const INPUT_FECHA_CONFIG = {
  /**
   * Propiedad labelNombre
   * Descripción: Etiqueta que se muestra como nombre del campo.
   */
  labelNombre: 'Fecha de pago:',

  /**
   * Propiedad required
   * Descripción: Indica si el campo es obligatorio.
   */
  required: true,

  /**
   * Propiedad habilitado
   * Descripción: Indica si el campo está habilitado para su edición.
   */
  habilitado: true,
};